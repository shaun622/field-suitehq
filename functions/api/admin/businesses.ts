// GET /api/admin/businesses?app=poolmate
//
// Returns a flat list of every business (tenant) in the requested app's
// Supabase, with a few aggregate counts attached. Bypasses RLS via the
// service_role key. Auth: ADMIN_PASSCODE in Authorization Bearer.

import {
  checkPasscode,
  fetchAuthEmails,
  jsonResponse,
  pgrest,
  resolveApp,
  unauthorized,
  type AdminEnv,
} from "./_shared";

interface BusinessRow {
  id: string;
  owner_id: string;
  name: string;
  email: string | null;
  plan: string | null;
  created_at: string | null;
  trial_ends_at: string | null;
}

interface AggregateRow {
  business_id: string;
  count: number;
  last?: string | null;
}

export const onRequestGet: PagesFunction<AdminEnv> = async ({ request, env }) => {
  if (!(await checkPasscode(request, env))) return unauthorized();

  const url = new URL(request.url);
  const appSlug = url.searchParams.get("app") || "poolmate";
  const app = resolveApp(appSlug, env);
  if (!app) {
    return jsonResponse(400, { error: `App '${appSlug}' not configured. Add ${appSlug.toUpperCase()}_SUPABASE_URL and _SERVICE_KEY env vars.` });
  }

  try {
    // 1. All businesses
    const businesses = await pgrest<BusinessRow[]>(
      app,
      `businesses?select=id,owner_id,name,email,plan,created_at,trial_ends_at&order=created_at.desc`,
    );

    if (businesses.length === 0) {
      return jsonResponse(200, {
        app: app.slug,
        businesses: [],
        totals: { business_count: 0, on_trial: 0, paying: 0, clients_total: 0, jobs_total: 0 },
      });
    }

    // 2. Aggregates per business — done in parallel as separate queries.
    //    PostgREST doesn't expose group-by for arbitrary tables via the
    //    REST API, so we either need an RPC or per-business counts. For
    //    the small numbers we expect (dozens of businesses, not thousands)
    //    a single fetch-all + JS aggregation is fine and avoids needing
    //    a custom DB function.
    const ids = businesses.map(b => b.id);
    const inFilter = `business_id=in.(${ids.map(id => `"${id}"`).join(",")})`;

    const [clients, staff, jobs, ownerEmails] = await Promise.all([
      pgrest<{ business_id: string }[]>(app, `clients?select=business_id&${inFilter}`),
      pgrest<{ business_id: string; is_active: boolean }[]>(app, `staff_members?select=business_id,is_active&${inFilter}`),
      pgrest<{ business_id: string; created_at: string }[]>(app, `jobs?select=business_id,created_at&${inFilter}&order=created_at.desc`),
      fetchAuthEmails(app, businesses.map(b => b.owner_id)),
    ]);

    // Bucket
    const clientCount = new Map<string, number>();
    for (const c of clients) clientCount.set(c.business_id, (clientCount.get(c.business_id) || 0) + 1);

    const activeStaffCount = new Map<string, number>();
    for (const s of staff) {
      if (s.is_active) activeStaffCount.set(s.business_id, (activeStaffCount.get(s.business_id) || 0) + 1);
    }

    const jobCount = new Map<string, number>();
    const lastJobAt = new Map<string, string>();
    for (const j of jobs) {
      jobCount.set(j.business_id, (jobCount.get(j.business_id) || 0) + 1);
      // jobs is sorted desc → first occurrence per business is the latest
      if (!lastJobAt.has(j.business_id)) lastJobAt.set(j.business_id, j.created_at);
    }

    const enriched = businesses.map(b => ({
      id: b.id,
      name: b.name,
      email: b.email,
      plan: b.plan,
      created_at: b.created_at,
      trial_ends_at: b.trial_ends_at,
      owner_email: ownerEmails[b.owner_id] ?? null,
      client_count: clientCount.get(b.id) || 0,
      active_staff_count: activeStaffCount.get(b.id) || 0,
      job_count: jobCount.get(b.id) || 0,
      last_job_at: lastJobAt.get(b.id) || null,
    }));

    const now = new Date();
    const totals = {
      business_count: enriched.length,
      on_trial: enriched.filter(b => (b.plan || "trial") === "trial" && (!b.trial_ends_at || new Date(b.trial_ends_at) > now)).length,
      paying: enriched.filter(b => b.plan && b.plan !== "trial").length,
      clients_total: enriched.reduce((s, b) => s + b.client_count, 0),
      jobs_total: enriched.reduce((s, b) => s + b.job_count, 0),
    };

    return jsonResponse(200, { app: app.slug, businesses: enriched, totals });
  } catch (err) {
    const m = err instanceof Error ? err.message : "unknown";
    return jsonResponse(500, { error: m });
  }
};

export const onRequest: PagesFunction<AdminEnv> = async ({ request }) => {
  return jsonResponse(405, { error: `Method ${request.method} not allowed` });
};
