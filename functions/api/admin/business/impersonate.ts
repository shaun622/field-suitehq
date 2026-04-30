// POST /api/admin/business/impersonate
// Body: { app: string, business_id: uuid }
//
// Generates a one-time magic-link URL that, when opened, signs the
// caller in as the business owner. Operator copies the URL into an
// incognito window for proper session isolation. Useful for debugging
// "I can't see X" support tickets — see exactly what the customer sees.
//
// Requires <SLUG>_APP_URL env var to know where to redirect after the
// magic link consumes its token.

import {
  appUrl,
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

  const target = appUrl(body.app, env);
  if (!target) {
    return jsonResponse(400, {
      error: `${body.app.toUpperCase()}_APP_URL env var not configured. Set it to the customer-facing URL of this app (e.g. https://poolmate.fieldsuite.com) so impersonation knows where to land.`,
    });
  }

  const owner = await getOwner(app, body.business_id);
  if (!owner) return jsonResponse(404, { error: "Owner not found for this business" });

  // POST /auth/v1/admin/generate_link returns { action_link, ... }
  const linkRes = await fetch(`${app.url}/auth/v1/admin/generate_link`, {
    method: "POST",
    headers: {
      apikey: app.key,
      authorization: `Bearer ${app.key}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      type: "magiclink",
      email: owner.email,
      options: { redirect_to: target },
    }),
  });
  if (!linkRes.ok) {
    const detail = await linkRes.text().catch(() => "");
    return jsonResponse(500, { error: `Failed to generate magic link: ${detail}` });
  }
  const linkBody = await linkRes.json() as { action_link?: string; properties?: { action_link?: string } };
  const link = linkBody.action_link || linkBody.properties?.action_link || null;
  if (!link) {
    return jsonResponse(500, { error: "Magic link API returned no action_link" });
  }

  await logAction(app, {
    operator: operatorIdentity(request, env),
    business_id: body.business_id,
    action: "impersonate",
    payload: { owner_email: owner.email, redirect_to: target },
    ip: callerIp(request),
  });

  return jsonResponse(200, { ok: true, link, owner_email: owner.email, redirect_to: target });
};

export const onRequest: PagesFunction<AdminEnv> = async ({ request }) => {
  return jsonResponse(405, { error: `Method ${request.method} not allowed` });
};
