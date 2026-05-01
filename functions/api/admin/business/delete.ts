// POST /api/admin/business/delete
// Body: { app: string, business_id: uuid, confirm_name: string }
//
// Hard-deletes a business AND every row that references it. Cascade
// logic lives in the admin_delete_business(uuid) SQL function on each
// app's Supabase — added by migration 20260430150505_admin_delete_business
// for PoolMate. New apps need the same migration before this works.
//
// Confirmation: caller MUST submit confirm_name matching the business's
// current name (case-insensitive, whitespace-trimmed). Stops a
// fat-finger click from nuking the wrong tenant.
//
// Audit log row is written BEFORE the delete completes — even if the
// delete itself fails halfway through, we have a record that it was
// attempted, and (since operator_actions.business_id has ON DELETE
// SET NULL) the row survives the cascade and is still queryable
// afterwards.

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
  confirm_name?: string;
}

export const onRequestPost: PagesFunction<AdminEnv> = async ({ request, env }) => {
  if (!(await checkPasscode(request, env))) return unauthorized();

  const body = await request.json().catch(() => null) as Body | null;
  if (!body?.app || !body?.business_id || !body?.confirm_name) {
    return jsonResponse(400, { error: "app, business_id, confirm_name required" });
  }
  if (!UUID_RE.test(body.business_id)) {
    return jsonResponse(400, { error: "Invalid business_id" });
  }

  const app = resolveApp(body.app, env);
  if (!app) return jsonResponse(400, { error: `App '${body.app}' not configured` });

  // Fetch the business name and verify the operator typed it correctly.
  // We do a case-insensitive trimmed comparison — operators don't need
  // to match capitalization perfectly, but the name has to be right.
  const rows = await pgrest<{ id: string; name: string }[]>(
    app,
    `businesses?select=id,name&id=eq.${body.business_id}`,
  );
  if (rows.length === 0) return jsonResponse(404, { error: "Business not found" });
  const biz = rows[0];

  const norm = (s: string) => s.trim().toLowerCase();
  if (norm(body.confirm_name) !== norm(biz.name || "")) {
    return jsonResponse(400, {
      error: `Confirmation does not match. Expected "${biz.name}", got "${body.confirm_name.trim()}".`,
    });
  }

  // Pre-write the audit row so we know an attempt was made even if the
  // RPC fails halfway. The operator_actions table has ON DELETE SET NULL
  // on business_id, so the row stays queryable after the business is
  // gone.
  await logAction(app, {
    operator: operatorIdentity(request, env),
    business_id: body.business_id,
    action: "delete_business",
    payload: { business_name: biz.name },
    ip: callerIp(request),
  });

  // Call the SQL function via PostgREST RPC. Returns one row with
  // deleted_business_id + deleted_at on success.
  //
  // The RPC runs inside an implicit PL/pgSQL transaction, so if any
  // DELETE inside the function raises, the whole thing rolls back and
  // no rows are actually removed. We can therefore tell the operator
  // their data is intact and they should retry.
  let result;
  try {
    result = await pgrest<{ deleted_business_id: string; deleted_at: string }[]>(
      app,
      "rpc/admin_delete_business",
      {
        method: "POST",
        body: JSON.stringify({ p_business_id: body.business_id }),
      },
    );
  } catch (err) {
    return jsonResponse(500, {
      error: `Delete failed: ${(err as Error).message}. The cascade ran in a transaction and rolled back — no rows were removed. Fix the underlying issue and retry.`,
    });
  }

  return jsonResponse(200, {
    ok: true,
    deleted_business_id: result[0]?.deleted_business_id,
    deleted_at: result[0]?.deleted_at,
  });
};

export const onRequest: PagesFunction<AdminEnv> = async ({ request }) => {
  return jsonResponse(405, { error: `Method ${request.method} not allowed` });
};
