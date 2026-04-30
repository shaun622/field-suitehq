// GET /api/admin/business?app=poolmate&id=<uuid>
//
// Drill-down for one tenant: full business row + staff list + recent
// jobs + recent clients. Service-role bypasses RLS.

import {
  checkPasscode,
  fetchAuthEmails,
  jsonResponse,
  pgrest,
  resolveApp,
  unauthorized,
  type AdminEnv,
} from "./_shared";

interface FullBusiness {
  id: string;
  owner_id: string;
  name: string;
  email: string | null;
  plan: string | null;
  created_at: string | null;
  trial_ends_at: string | null;
  abn: string | null;
  phone: string | null;
  logo_url: string | null;
  brand_colour: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

export const onRequestGet: PagesFunction<AdminEnv> = async ({ request, env }) => {
  if (!(await checkPasscode(request, env))) return unauthorized();

  const url = new URL(request.url);
  const appSlug = url.searchParams.get("app") || "poolmate";
  const businessId = url.searchParams.get("id");
  if (!businessId) return jsonResponse(400, { error: "id query param required" });

  const app = resolveApp(appSlug, env);
  if (!app) {
    return jsonResponse(400, { error: `App '${appSlug}' not configured` });
  }

  // Reject anything that doesn't look like a UUID — defends against
  // funky values being interpolated into the PostgREST query string.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(businessId)) {
    return jsonResponse(400, { error: "Invalid business id" });
  }

  try {
    const [bizRows, clients, staff, jobs] = await Promise.all([
      pgrest<FullBusiness[]>(
        app,
        `businesses?select=id,owner_id,name,email,plan,created_at,trial_ends_at,abn,phone,logo_url,brand_colour,stripe_customer_id,stripe_subscription_id&id=eq.${businessId}`,
      ),
      pgrest<{ id: string; name: string; email: string | null; created_at: string }[]>(
        app,
        `clients?select=id,name,email,created_at&business_id=eq.${businessId}&order=created_at.desc&limit=10`,
      ),
      pgrest<{ id: string; name: string; role: string; email: string | null; user_id: string | null; is_active: boolean }[]>(
        app,
        `staff_members?select=id,name,role,email,user_id,is_active&business_id=eq.${businessId}&order=is_active.desc,name.asc`,
      ),
      pgrest<{ id: string; title: string; status: string; scheduled_date: string | null; created_at: string }[]>(
        app,
        `jobs?select=id,title,status,scheduled_date,created_at&business_id=eq.${businessId}&order=created_at.desc&limit=10`,
      ),
    ]);

    if (bizRows.length === 0) {
      return jsonResponse(404, { error: "Business not found" });
    }
    const biz = bizRows[0];

    // Aggregate counts via separate count queries. PostgREST returns
    // exact counts in the Content-Range header when prefer=count=exact,
    // but our wrapper currently just returns JSON. For drill-down, we
    // can do a cheaper full fetch since the per-business volumes are
    // bounded — but for jobs/clients we already requested limit=10, so
    // pull totals from a HEAD-style request via the listings endpoint
    // (we already have them from /api/admin/businesses if the operator
    // arrived from there). Fetch separately so this endpoint is
    // self-contained.
    const [allClients, allJobs, activeStaff] = await Promise.all([
      pgrest<{ id: string }[]>(app, `clients?select=id&business_id=eq.${businessId}`),
      pgrest<{ id: string; created_at: string }[]>(app, `jobs?select=id,created_at&business_id=eq.${businessId}&order=created_at.desc`),
      pgrest<{ id: string }[]>(app, `staff_members?select=id&business_id=eq.${businessId}&is_active=eq.true`),
    ]);

    const ownerEmails = await fetchAuthEmails(app, [biz.owner_id]);

    return jsonResponse(200, {
      business: {
        ...biz,
        owner_email: ownerEmails[biz.owner_id] ?? null,
        client_count: allClients.length,
        active_staff_count: activeStaff.length,
        job_count: allJobs.length,
        last_job_at: allJobs[0]?.created_at ?? null,
      },
      staff,
      recent_jobs: jobs,
      recent_clients: clients,
    });
  } catch (err) {
    const m = err instanceof Error ? err.message : "unknown";
    return jsonResponse(500, { error: m });
  }
};

export const onRequest: PagesFunction<AdminEnv> = async ({ request }) => {
  return jsonResponse(405, { error: `Method ${request.method} not allowed` });
};
