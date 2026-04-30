// POST /api/admin/business/set-password
// Body: { app: string, business_id: uuid, new_password: string }
//
// Operator sets a new password directly for the business owner. Owner
// can log in immediately with this password — operator typically
// communicates it out-of-band (phone call, SMS).

import {
  callerIp,
  checkPasscode,
  getOwner,
  jsonResponse,
  logAction,
  operatorIdentity,
  resolveApp,
  unauthorized,
  UUID_RE,
  type AdminEnv,
} from "../_shared";

interface Body {
  app?: string;
  business_id?: string;
  new_password?: string;
}

export const onRequestPost: PagesFunction<AdminEnv> = async ({ request, env }) => {
  if (!(await checkPasscode(request, env))) return unauthorized();

  const body = await request.json().catch(() => null) as Body | null;
  if (!body?.app || !body?.business_id || !body?.new_password) {
    return jsonResponse(400, { error: "app, business_id, new_password required" });
  }
  if (!UUID_RE.test(body.business_id)) {
    return jsonResponse(400, { error: "Invalid business_id" });
  }
  if (body.new_password.length < 6) {
    return jsonResponse(400, { error: "Password must be at least 6 characters" });
  }

  const app = resolveApp(body.app, env);
  if (!app) return jsonResponse(400, { error: `App '${body.app}' not configured` });

  const owner = await getOwner(app, body.business_id);
  if (!owner) return jsonResponse(404, { error: "Owner not found for this business" });

  // PUT /auth/v1/admin/users/<id> with { password } updates the password
  const updRes = await fetch(`${app.url}/auth/v1/admin/users/${owner.id}`, {
    method: "PUT",
    headers: {
      apikey: app.key,
      authorization: `Bearer ${app.key}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ password: body.new_password }),
  });
  if (!updRes.ok) {
    const detail = await updRes.text().catch(() => "");
    return jsonResponse(500, { error: `Failed to update password: ${detail}` });
  }

  await logAction(app, {
    operator: operatorIdentity(request, env),
    business_id: body.business_id,
    action: "set_password",
    // Never log the actual password — just record that it was changed
    payload: { owner_email: owner.email },
    ip: callerIp(request),
  });

  return jsonResponse(200, { ok: true, owner_email: owner.email });
};

export const onRequest: PagesFunction<AdminEnv> = async ({ request }) => {
  return jsonResponse(405, { error: `Method ${request.method} not allowed` });
};
