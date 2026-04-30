// GET /api/admin/auth — passcode check ping. Returns { ok: true } on
// success, 401 otherwise. The /admin gate calls this on submit to
// validate the operator passcode before storing it.

import { checkPasscode, jsonResponse, unauthorized, type AdminEnv } from "./_shared";

export const onRequestGet: PagesFunction<AdminEnv> = async ({ request, env }) => {
  if (!(await checkPasscode(request, env))) return unauthorized();
  return jsonResponse(200, { ok: true });
};

export const onRequest: PagesFunction<AdminEnv> = async ({ request }) => {
  return jsonResponse(405, { error: `Method ${request.method} not allowed` });
};
