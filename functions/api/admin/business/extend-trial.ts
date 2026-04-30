// POST /api/admin/business/extend-trial
// Body: { app: string, business_id: uuid, days: 7|14|30 }
//
// Extends the business's trial_ends_at by the requested number of
// days. If the trial has already expired (or trial_ends_at is null),
// extends from now() rather than from the past, so the customer
// actually gets the days you said.

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
  days?: number;
}

const ALLOWED_DAYS = new Set([7, 14, 30]);

export const onRequestPost: PagesFunction<AdminEnv> = async ({ request, env }) => {
  if (!(await checkPasscode(request, env))) return unauthorized();

  const body = await request.json().catch(() => null) as Body | null;
  if (!body?.app || !body?.business_id || typeof body?.days !== "number") {
    return jsonResponse(400, { error: "app, business_id, days required" });
  }
  if (!UUID_RE.test(body.business_id)) {
    return jsonResponse(400, { error: "Invalid business_id" });
  }
  if (!ALLOWED_DAYS.has(body.days)) {
    return jsonResponse(400, { error: "days must be 7, 14, or 30" });
  }

  const app = resolveApp(body.app, env);
  if (!app) return jsonResponse(400, { error: `App '${body.app}' not configured` });

  // Read current trial_ends_at, compute new value JS-side. Avoids
  // smuggling values into a SQL fragment via PostgREST.
  const rows = await pgrest<{ id: string; trial_ends_at: string | null }[]>(
    app,
    `businesses?select=id,trial_ends_at&id=eq.${body.business_id}`,
  );
  if (rows.length === 0) return jsonResponse(404, { error: "Business not found" });

  const now = Date.now();
  const current = rows[0].trial_ends_at ? new Date(rows[0].trial_ends_at).getTime() : 0;
  const base = Math.max(now, current);
  const newEnd = new Date(base + body.days * 86400_000).toISOString();

  const updated = await pgrest<{ id: string; trial_ends_at: string }[]>(
    app,
    `businesses?id=eq.${body.business_id}&select=id,trial_ends_at`,
    {
      method: "PATCH",
      body: JSON.stringify({ trial_ends_at: newEnd }),
      headers: { prefer: "return=representation" },
    },
  );

  await logAction(app, {
    operator: operatorIdentity(request, env),
    business_id: body.business_id,
    action: "extend_trial",
    payload: {
      days: body.days,
      previous_trial_ends_at: rows[0].trial_ends_at,
      new_trial_ends_at: updated[0]?.trial_ends_at,
    },
    ip: callerIp(request),
  });

  return jsonResponse(200, { ok: true, trial_ends_at: updated[0]?.trial_ends_at });
};

export const onRequest: PagesFunction<AdminEnv> = async ({ request }) => {
  return jsonResponse(405, { error: `Method ${request.method} not allowed` });
};
