// POST /api/admin/plans/update
// Body: { app, slug, patch: { name?, price_cents?, period?, max_staff?, features?, sort_order?, is_active? } }
//
// Updates one plan in the requested app's plans table. The `slug` is
// the immutable PK that businesses.plan references — IT CANNOT BE
// CHANGED here. Renaming a slug would orphan every business currently
// on that plan. Mark the row inactive instead and seed a new row with
// the new slug.
//
// Audit row records before/after for every editable field that
// changed. Service-role bypasses RLS to write.

import {
  callerIp,
  checkPasscode,
  jsonResponse,
  logAction,
  operatorIdentity,
  pgrest,
  resolveApp,
  unauthorized,
  type AdminEnv,
} from "../_shared";

interface Patch {
  name?: string;
  price_cents?: number;
  period?: string;
  max_staff?: number;
  features?: Record<string, unknown>;
  sort_order?: number;
  is_active?: boolean;
}

interface Body {
  app?: string;
  slug?: string;
  patch?: Patch;
}

const ALLOWED_PERIODS = new Set(["month", "year", "once", "14 days"]);
const SLUG_RE = /^[a-z0-9_-]+$/i;

// Sanitise the incoming patch — drop unknown keys, validate types and
// ranges, return a clean object plus an error message if anything's
// off. We never trust the operator to send a well-formed patch.
function validatePatch(p: Patch | undefined): { clean: Patch | null; error: string | null } {
  if (!p || typeof p !== "object") return { clean: null, error: "patch must be an object" };
  const out: Patch = {};

  if (p.name !== undefined) {
    if (typeof p.name !== "string" || p.name.trim().length === 0 || p.name.length > 200) {
      return { clean: null, error: "name must be a non-empty string ≤ 200 chars" };
    }
    out.name = p.name.trim();
  }
  if (p.price_cents !== undefined) {
    if (!Number.isInteger(p.price_cents) || p.price_cents < 0 || p.price_cents > 1_000_000_00) {
      return { clean: null, error: "price_cents must be a non-negative integer (max $1,000,000)" };
    }
    out.price_cents = p.price_cents;
  }
  if (p.period !== undefined) {
    if (typeof p.period !== "string" || !ALLOWED_PERIODS.has(p.period)) {
      return { clean: null, error: `period must be one of: ${[...ALLOWED_PERIODS].join(", ")}` };
    }
    out.period = p.period;
  }
  if (p.max_staff !== undefined) {
    if (!Number.isInteger(p.max_staff) || p.max_staff < 0 || p.max_staff > 1000) {
      return { clean: null, error: "max_staff must be an integer between 0 and 1000" };
    }
    out.max_staff = p.max_staff;
  }
  if (p.features !== undefined) {
    // Accept any JSON object. We don't enforce schema on features —
    // each app may have its own keys (PoolPro uses pools/staff/etc.).
    if (typeof p.features !== "object" || p.features === null || Array.isArray(p.features)) {
      return { clean: null, error: "features must be a JSON object" };
    }
    out.features = p.features;
  }
  if (p.sort_order !== undefined) {
    if (!Number.isInteger(p.sort_order) || p.sort_order < 0 || p.sort_order > 1000) {
      return { clean: null, error: "sort_order must be an integer between 0 and 1000" };
    }
    out.sort_order = p.sort_order;
  }
  if (p.is_active !== undefined) {
    if (typeof p.is_active !== "boolean") {
      return { clean: null, error: "is_active must be a boolean" };
    }
    out.is_active = p.is_active;
  }
  if (Object.keys(out).length === 0) {
    return { clean: null, error: "patch is empty — nothing to update" };
  }
  return { clean: out, error: null };
}

export const onRequestPost: PagesFunction<AdminEnv> = async ({ request, env }) => {
  if (!(await checkPasscode(request, env))) return unauthorized();

  const body = await request.json().catch(() => null) as Body | null;
  if (!body?.app || !body?.slug) {
    return jsonResponse(400, { error: "app and slug required" });
  }
  if (!SLUG_RE.test(body.slug) || body.slug.length > 64) {
    return jsonResponse(400, { error: "Invalid slug" });
  }

  const { clean, error: vErr } = validatePatch(body.patch);
  if (!clean) return jsonResponse(400, { error: vErr || "Invalid patch" });

  const app = resolveApp(body.app, env);
  if (!app) return jsonResponse(400, { error: `App '${body.app}' not configured` });

  // Read current row so the audit log captures before/after.
  const before = await pgrest<Record<string, unknown>[]>(
    app,
    `plans?select=slug,name,price_cents,period,max_staff,features,sort_order,is_active&slug=eq.${body.slug}`,
  );
  if (before.length === 0) return jsonResponse(404, { error: `Plan '${body.slug}' not found` });

  const updated = await pgrest<Record<string, unknown>[]>(
    app,
    `plans?slug=eq.${body.slug}&select=slug,name,price_cents,period,max_staff,features,sort_order,is_active,updated_at`,
    {
      method: "PATCH",
      body: JSON.stringify(clean),
      headers: { prefer: "return=representation" },
    },
  );

  // Diff for the audit row — only the fields that actually changed.
  const diff: Record<string, { from: unknown; to: unknown }> = {};
  for (const key of Object.keys(clean)) {
    const prev = before[0][key];
    const next = (clean as Record<string, unknown>)[key];
    if (JSON.stringify(prev) !== JSON.stringify(next)) {
      diff[key] = { from: prev, to: next };
    }
  }

  await logAction(app, {
    operator: operatorIdentity(request, env),
    business_id: null, // plan-scoped, not business-scoped
    action: "update_plan",
    payload: { slug: body.slug, diff },
    ip: callerIp(request),
  });

  return jsonResponse(200, { ok: true, plan: updated[0] });
};

export const onRequest: PagesFunction<AdminEnv> = async ({ request }) => {
  return jsonResponse(405, { error: `Method ${request.method} not allowed` });
};
