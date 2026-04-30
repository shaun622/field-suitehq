// Shared helpers for /api/admin/* Pages Functions.
//
// All endpoints in this folder share the same shape:
//   1. Verify the operator passcode (Bearer header against ADMIN_PASSCODE env)
//   2. Resolve the requested app slug → that app's Supabase URL + service key
//   3. Return JSON with no-store cache
//
// Env var convention (set in Cloudflare Pages → Settings → Environment
// variables): ADMIN_PASSCODE plus a pair per product, derived from slug:
//
//   ADMIN_PASSCODE                              shared operator secret
//   <SLUG>_SUPABASE_URL                         https://<project>.supabase.co
//   <SLUG>_SUPABASE_SERVICE_KEY                 service_role key (NOT anon!)
//
// e.g. POOLMATE_SUPABASE_URL, TREEMATE_SUPABASE_URL, FIREMATE_SUPABASE_URL,
// PESTMATE_SUPABASE_URL, HYGIENEMATE_SUPABASE_URL, LOCKSMITHMATE_SUPABASE_URL.
// Adding a new product requires no code change here — just add the two env
// vars in Pages settings and add the slug to APPS in src/app/admin/page.tsx
// (or import directly from src/lib/products).

// Index signature so any <SLUG>_SUPABASE_* lookup type-checks. We only
// surface the operator passcode explicitly because it's used by name.
export interface AdminEnv {
  ADMIN_PASSCODE?: string;
  [key: string]: string | undefined;
}

export type AppSlug = string;

export function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

export function unauthorized(): Response {
  return jsonResponse(401, { error: "Unauthorized" });
}

/**
 * Pulls the passcode from the Authorization: Bearer <passcode> header
 * and constant-time-compares it against env.ADMIN_PASSCODE. If the env
 * is unset (e.g. local dev with no .env) we reject everything — never
 * default to "open".
 */
export async function checkPasscode(req: Request, env: AdminEnv): Promise<boolean> {
  const expected = env.ADMIN_PASSCODE;
  if (!expected) return false; // env not configured → always reject
  const auth = req.headers.get("authorization") || "";
  const match = auth.match(/^Bearer\s+(.+)$/i);
  if (!match) return false;
  const got = match[1].trim();
  // Constant-time compare to slow down timing attacks
  if (got.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < got.length; i++) diff |= got.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

// Constrains the slug to letters/digits/hyphens so we can safely build
// the env var name. Anything else returns null (rejected by callers).
const SLUG_RE = /^[a-z0-9-]+$/;

/**
 * Resolves an app slug to its Supabase URL + service key. Looks up env
 * vars by deriving them from the slug:
 *   poolmate → POOLMATE_SUPABASE_URL, POOLMATE_SUPABASE_SERVICE_KEY
 * Returns null if the env vars for that app aren't configured (so the
 * admin UI shows a clean "app not configured" error rather than hanging).
 */
export function resolveApp(slug: string, env: AdminEnv): { url: string; key: string; slug: AppSlug } | null {
  if (!slug || !SLUG_RE.test(slug)) return null;
  // Slugs in env are upper-case with hyphens replaced by underscores so
  // they're valid env identifiers (e.g. "loc-test" → "LOC_TEST_*").
  const upper = slug.toUpperCase().replace(/-/g, "_");
  const url = env[`${upper}_SUPABASE_URL`];
  const key = env[`${upper}_SUPABASE_SERVICE_KEY`];
  if (!url || !key) return null;
  return { url, key, slug };
}

/**
 * Thin wrapper around the Supabase REST API. We talk PostgREST directly
 * rather than pulling the @supabase/supabase-js client into the Pages
 * Function — it works fine, ships zero JS to the runtime, and avoids
 * Node-API compatibility quirks at the edge.
 *
 * NOTE: passing the service_role key as both apikey + Bearer means the
 * request bypasses RLS entirely. That's the whole point of this layer.
 */
export async function pgrest<T = unknown>(
  app: { url: string; key: string },
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${app.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: app.key,
      authorization: `Bearer ${app.key}`,
      "content-type": "application/json",
      prefer: "count=exact",
      ...init.headers,
    },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Supabase ${res.status}: ${detail || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Fetches auth.users via the Admin API (also accepts the service key as
 * Bearer). Used to map businesses.owner_id → email without joining
 * tables across schemas. Filters down to the IDs we care about.
 */
export async function fetchAuthEmails(
  app: { url: string; key: string },
  userIds: string[],
): Promise<Record<string, string>> {
  if (userIds.length === 0) return {};
  // The admin endpoint paginates; we'll request a generous page size and
  // filter client-side. Most tenants will have well under 1000 users.
  // If we exceed that, switch to per-id GETs.
  const res = await fetch(`${app.url}/auth/v1/admin/users?page=1&per_page=1000`, {
    headers: {
      apikey: app.key,
      authorization: `Bearer ${app.key}`,
    },
  });
  if (!res.ok) return {};
  const body = await res.json() as { users?: { id: string; email: string }[] };
  const out: Record<string, string> = {};
  const wanted = new Set(userIds);
  for (const u of body.users || []) {
    if (wanted.has(u.id) && u.email) out[u.id] = u.email;
  }
  return out;
}

// ─── UUID validator (used by every business action endpoint) ──────────
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ─── Per-app product URL (for impersonation redirect target) ──────────
/**
 * Reads <SLUG>_APP_URL from env (e.g. POOLMATE_APP_URL). This is the
 * URL that magic-link impersonation should redirect to. Returns null
 * if not configured — endpoints that need it (impersonate) surface a
 * clean error so the operator knows to add the env var.
 */
export function appUrl(slug: string, env: AdminEnv): string | null {
  if (!slug || !SLUG_RE.test(slug)) return null;
  const upper = slug.toUpperCase().replace(/-/g, "_");
  return env[`${upper}_APP_URL`] || null;
}

// ─── Owner lookup ─────────────────────────────────────────────────────
/**
 * Resolves a business_id to its owner's auth user id + email. Returns
 * null if the business doesn't exist or the owner_id has no auth user
 * (orphan record).
 */
export async function getOwner(
  app: { url: string; key: string },
  businessId: string,
): Promise<{ id: string; email: string } | null> {
  if (!UUID_RE.test(businessId)) return null;
  const rows = await pgrest<{ owner_id: string }[]>(
    app,
    `businesses?select=owner_id&id=eq.${businessId}`,
  );
  if (rows.length === 0) return null;
  const ownerId = rows[0].owner_id;
  if (!ownerId) return null;
  // GET /auth/v1/admin/users/<id> returns the user directly
  const res = await fetch(`${app.url}/auth/v1/admin/users/${ownerId}`, {
    headers: { apikey: app.key, authorization: `Bearer ${app.key}` },
  });
  if (!res.ok) return null;
  const body = await res.json() as { id?: string; email?: string };
  if (!body.id || !body.email) return null;
  return { id: body.id, email: body.email };
}

// ─── Operator identity (for audit log) ────────────────────────────────
/**
 * Identifies the operator who triggered the action. For now: a fixed
 * placeholder string ("operator-passcode"), since the only auth in
 * front of /admin is a shared passcode.
 *
 * When Cloudflare Access is wired in front of /admin, swap the body of
 * this function to:
 *   return req.headers.get("cf-access-authenticated-user-email") || "unknown";
 * and the audit log will record the actual operator's email per request.
 */
export function operatorIdentity(_req: Request, _env: AdminEnv): string {
  // TODO(cf-access): swap to cf-access-authenticated-user-email header
  return "operator-passcode";
}

// ─── Audit log ────────────────────────────────────────────────────────
interface LogActionArgs {
  operator: string;
  business_id: string | null;
  action: string;
  payload?: Record<string, unknown>;
  ip?: string;
}

/**
 * Writes one row to operator_actions. Best-effort — if logging fails
 * (e.g. table missing on the target app, network blip), we log to
 * console and do NOT throw. Audit-log unavailability shouldn't block
 * legitimate operator work.
 */
export async function logAction(
  app: { url: string; key: string },
  args: LogActionArgs,
): Promise<void> {
  try {
    await pgrest(app, "operator_actions", {
      method: "POST",
      body: JSON.stringify({
        operator_email: args.operator,
        business_id: args.business_id,
        action: args.action,
        payload: args.payload || {},
        ip: args.ip || null,
      }),
      headers: { prefer: "return=minimal" },
    });
  } catch (err) {
    console.warn("[admin] audit log write failed:", (err as Error).message);
  }
}

/**
 * Convenience: extract the caller's IP (set by Cloudflare on every
 * request via the CF-Connecting-IP header).
 */
export function callerIp(req: Request): string {
  return req.headers.get("cf-connecting-ip") || "";
}
