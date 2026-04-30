// POST /api/admin/business/reset-password
// Body: { app: string, business_id: uuid }
//
// Two-channel reset for the business owner:
//   1. Returns a one-time recovery URL the operator can copy and share
//      directly (e.g. read it over the phone, paste into SMS).
//   2. Triggers Supabase's built-in reset email so the owner also gets
//      it in their inbox.
// Operator picks whichever channel works for the customer.

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
}

export const onRequestPost: PagesFunction<AdminEnv> = async ({ request, env }) => {
  if (!(await checkPasscode(request, env))) return unauthorized();

  const body = await request.json().catch(() => null) as Body | null;
  if (!body?.app || !body?.business_id) {
    return jsonResponse(400, { error: "app and business_id required" });
  }
  if (!UUID_RE.test(body.business_id)) {
    return jsonResponse(400, { error: "Invalid business_id" });
  }

  const app = resolveApp(body.app, env);
  if (!app) return jsonResponse(400, { error: `App '${body.app}' not configured` });

  const owner = await getOwner(app, body.business_id);
  if (!owner) return jsonResponse(404, { error: "Owner not found for this business" });

  // 1. Generate a one-time recovery link (returns { properties: { action_link } })
  let recoveryLink: string | null = null;
  try {
    const linkRes = await fetch(`${app.url}/auth/v1/admin/generate_link`, {
      method: "POST",
      headers: {
        apikey: app.key,
        authorization: `Bearer ${app.key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ type: "recovery", email: owner.email }),
    });
    if (linkRes.ok) {
      const linkBody = await linkRes.json() as { action_link?: string; properties?: { action_link?: string } };
      recoveryLink = linkBody.action_link || linkBody.properties?.action_link || null;
    }
  } catch (err) {
    console.warn("[reset-password] generate_link failed:", (err as Error).message);
  }

  // 2. Trigger Supabase's reset email (uses the configured email template)
  let emailSent = false;
  try {
    const emailRes = await fetch(`${app.url}/auth/v1/recover`, {
      method: "POST",
      headers: {
        apikey: app.key,
        authorization: `Bearer ${app.key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: owner.email }),
    });
    emailSent = emailRes.ok;
  } catch (err) {
    console.warn("[reset-password] /auth/recover failed:", (err as Error).message);
  }

  await logAction(app, {
    operator: operatorIdentity(request, env),
    business_id: body.business_id,
    action: "reset_password",
    payload: { owner_email: owner.email, email_sent: emailSent, link_generated: !!recoveryLink },
    ip: callerIp(request),
  });

  return jsonResponse(200, {
    ok: true,
    owner_email: owner.email,
    recovery_link: recoveryLink,
    email_sent: emailSent,
  });
};

export const onRequest: PagesFunction<AdminEnv> = async ({ request }) => {
  return jsonResponse(405, { error: `Method ${request.method} not allowed` });
};
