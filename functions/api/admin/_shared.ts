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
