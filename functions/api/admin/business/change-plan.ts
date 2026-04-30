// POST /api/admin/business/change-plan
// Body: { app: string, business_id: uuid, new_plan: string }
//
// Updates businesses.plan to the requested value. Used pre-Stripe to
// move a tenant onto a paid tier manually, or reset back to trial for
// testing. Plan whitelist matches the pricing tiers in lib/products.

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

const ALLOWED_PLANS = new Set(["trial", "starter", "crew", "pro", "business"]);

export const onRequestPost: PagesFunction<AdminEnv> = async ({ request, env }) => {
  if (!(await checkPasscode(request, env))) return unauthorized();

  const body = await request.json().catch(() => null) as Body | null;
  if (!body?.app || !body?.business_id || !body?.new_plan) {
    return jsonResponse(400, { error: "app, business_id, new_plan required" });
  }
  if (!UUID_RE.test(body.business_id)) {
    return jsonResponse(400, { error: "Invalid business_id" });
  }
  if (!ALLOWED_PLANS.has(body.new_plan)) {
    return jsonResponse(400, { error: `new_plan must be one of: ${[...ALLOWED_PLANS].join(", ")}` });
  }

  const app = resolveApp(body.app, env);
  if (!app) return jsonResponse(400, { error: `App '${body.app}' not configured` });

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
