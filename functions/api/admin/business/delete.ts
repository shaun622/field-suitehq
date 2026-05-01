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

  // Fetch the business name + owner_id, verify the operator typed the
  // name correctly. Case-insensitive trimmed compare so capitalisation
  // doesn't matter. Owner_id is captured here so we can attempt to free
  // the email after the cascade deletes the business row.
  const rows = await pgrest<{ id: string; name: string; owner_id: string }[]>(
    app,
    `businesses?select=id,name,owner_id&id=eq.${body.business_id}`,
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

  // Now try to free up the owner's email. We only delete the auth user
  // if they are not referenced anywhere else — i.e. they don't own a
  // different business and aren't a staff member of one. If they are,
  // we leave the auth user alone and report it back so the operator
  // knows.
  let authUserDeleted = false;
  let authNotDeletedReason: string | null = null;
  if (biz.owner_id) {
    try {
      const [otherBiz, staffElsewhere] = await Promise.all([
        pgrest<{ id: string }[]>(app, `businesses?select=id&owner_id=eq.${biz.owner_id}`),
        pgrest<{ id: string }[]>(app, `staff_members?select=id&user_id=eq.${biz.owner_id}`),
      ]);
      if (otherBiz.length > 0) {
        authNotDeletedReason = `still owns ${otherBiz.length} other business(es)`;
      } else if (staffElsewhere.length > 0) {
        authNotDeletedReason = `still a staff member of ${staffElsewhere.length} other business(es)`;
      } else {
        // Safe to delete the auth user
        const delRes = await fetch(`${app.url}/auth/v1/admin/users/${biz.owner_id}`, {
          method: "DELETE",
          headers: { apikey: app.key, authorization: `Bearer ${app.key}` },
        });
        if (delRes.ok) {
          authUserDeleted = true;
        } else {
          const detail = await delRes.text().catch(() => "");
          authNotDeletedReason = `auth.admin.deleteUser failed: ${detail || delRes.statusText}`;
        }
      }
    } catch (err) {
      authNotDeletedReason = `error: ${(err as Error).message}`;
    }
  }

  // Update the audit log payload with the auth-user outcome. We can't
  // edit the row in place easily without knowing its id, so we just
  // append a follow-up audit entry tagged 'delete_business_followup'.
  await logAction(app, {
    operator: operatorIdentity(request, env),
    business_id: null, // business is gone
    action: "delete_business_followup",
    payload: {
      business_name: biz.name,
      auth_user_deleted: authUserDeleted,
      auth_not_deleted_reason: authNotDeletedReason,
    },
    ip: callerIp(request),
  });

  return jsonResponse(200, {
    ok: true,
    deleted_business_id: result[0]?.deleted_business_id,
    deleted_at: result[0]?.deleted_at,
    auth_user_deleted: authUserDeleted,
    auth_not_deleted_reason: authNotDeletedReason,
  });
};

export const onRequest: PagesFunction<AdminEnv> = async ({ request }) => {
  return jsonResponse(405, { error: `Method ${request.method} not allowed` });
};
