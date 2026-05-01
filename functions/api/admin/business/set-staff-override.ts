// POST /api/admin/business/set-staff-override
// Body: { app: string, business_id: uuid, override: number | null }
//
// Sets businesses.staff_seat_override for one tenant. Pass null to
// clear the override and fall back to the plan default. Pass 0 to
// lock to zero seats (legal — "no staff allowed").
//
// Customer's useStaff hook resolves the effective limit on next
// reload via:
//   business.staff_seat_override ?? PLAN_STAFF_LIMITS[plan] ?? 1

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
  // Allow null explicitly so the operator can clear an existing override.
  override?: number | null;
}

// Sanity ceiling on overrides. We never expect a single tenant with
// more than this many seats; rejecting at the edge prevents an
// errant 1e9 from being saved by a fat-fingered operator.
const MAX_OVERRIDE = 1000;

export const onRequestPost: PagesFunction<AdminEnv> = async ({ request, env }) => {
  if (!(await checkPasscode(request, env))) return unauthorized();

  const body = await request.json().catch(() => null) as Body | null;
  if (!body?.app || !body?.business_id) {
    return jsonResponse(400, { error: "app and business_id required" });
  }
  if (!UUID_RE.test(body.business_id)) {
    return jsonResponse(400, { error: "Invalid business_id" });
  }
  // Validate override: null OR a non-negative integer ≤ MAX_OVERRIDE.
  // Note: explicit `body.override === null` is allowed; `undefined` is not
  // (operators must opt-in to clearing).
  const override = body.override;
  if (override !== null) {
    if (typeof override !== "number" || !Number.isInteger(override) || override < 0 || override > MAX_OVERRIDE) {
      return jsonResponse(400, { error: `override must be null or an integer between 0 and ${MAX_OVERRIDE}` });
    }
  }

  const app = resolveApp(body.app, env);
  if (!app) return jsonResponse(400, { error: `App '${body.app}' not configured` });

  // Read previous override so we can record the transition in the audit log.
  const before = await pgrest<{ id: string; staff_seat_override: number | null }[]>(
    app,
    `businesses?select=id,staff_seat_override&id=eq.${body.business_id}`,
  );
  if (before.length === 0) return jsonResponse(404, { error: "Business not found" });

  // PATCH the row. PostgREST honours { staff_seat_override: null } to
  // clear the column.
  const updated = await pgrest<{ id: string; staff_seat_override: number | null }[]>(
    app,
    `businesses?id=eq.${body.business_id}&select=id,staff_seat_override`,
    {
      method: "PATCH",
      body: JSON.stringify({ staff_seat_override: override }),
      headers: { prefer: "return=representation" },
    },
  );

  await logAction(app, {
    operator: operatorIdentity(request, env),
    business_id: body.business_id,
    action: "set_staff_override",
    payload: {
      previous: before[0].staff_seat_override,
      new: override,
    },
    ip: callerIp(request),
  });

  return jsonResponse(200, { ok: true, staff_seat_override: updated[0]?.staff_seat_override });
};

export const onRequest: PagesFunction<AdminEnv> = async ({ request }) => {
  return jsonResponse(405, { error: `Method ${request.method} not allowed` });
};
