// POST /api/admin/business/change-plan
// Body: { app: string, business_id: uuid, new_plan: string }
//
// Updates businesses.plan. The whitelist of valid plan slugs is read
// PER REQUEST from the target app's plans table — no static list. So
// a plan added/deactivated in the HQ Plans panel takes effect on the
// next change-plan call, no redeploy needed. Hidden plans
// (is_active=false) cannot be assigned, but legacy businesses still
// on a deactivated slug keep working until they're moved off.

import {
  callerIp,
  checkPasscode,
  jsonResponse,
  logAction,
  operatorIdentity,
  pgrest,
  resolveApp,
  unauthorized,
  UUID_RE,
  type AdminEnv,
} from "../_shared";

interface Body {
  app?: string;
  business_id?: string;
  new_plan?: string;
}

export const onRequestPost: PagesFunction<AdminEnv> = async ({ request, env }) => {
  if (!(await checkPasscode(request, env))) return unauthorized();

  const body = await request.json().catch(() => null) as Body | null;
  if (!body?.app || !body?.business_id || !body?.new_plan) {
    return jsonResponse(400, { error: "app, business_id, new_plan required" });
  }
  if (!UUID_RE.test(body.business_id)) {
    return jsonResponse(400, { error: "Invalid business_id" });
  }

  const app = resolveApp(body.app, env);
  if (!app) return jsonResponse(400, { error: `App '${body.app}' not configured` });

  // Whitelist comes from the live plans table for this app — only
  // active slugs are assignable.
  const activePlans = await pgrest<{ slug: string }[]>(
    app,
    "plans?select=slug&is_active=eq.true&order=sort_order.asc",
  );
  const allowed = new Set(activePlans.map(p => p.slug));
  if (!allowed.has(body.new_plan)) {
    return jsonResponse(400, {
      error: allowed.size === 0
        ? `App '${body.app}' has no active plans defined. Seed the plans table first.`
        : `new_plan must be one of: ${[...allowed].join(", ")}`,
    });
  }

  // Read current plan first so we can record the transition in the log
  const before = await pgrest<{ id: string; plan: string | null }[]>(
    app,
    `businesses?select=id,plan&id=eq.${body.business_id}`,
  );
  if (before.length === 0) return jsonResponse(404, { error: "Business not found" });

  const updated = await pgrest<{ id: string; plan: string }[]>(
    app,
    `businesses?id=eq.${body.business_id}&select=id,plan`,
    {
      method: "PATCH",
      body: JSON.stringify({ plan: body.new_plan }),
      headers: { prefer: "return=representation" },
    },
  );

  await logAction(app, {
    operator: operatorIdentity(request, env),
    business_id: body.business_id,
    action: "change_plan",
    payload: {
      previous_plan: before[0].plan,
      new_plan: body.new_plan,
    },
    ip: callerIp(request),
  });

  return jsonResponse(200, { ok: true, plan: updated[0]?.plan });
};

export const onRequest: PagesFunction<AdminEnv> = async ({ request }) => {
  return jsonResponse(405, { error: `Method ${request.method} not allowed` });
};
