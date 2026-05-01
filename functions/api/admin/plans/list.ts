// GET /api/admin/plans?app=<slug>
//
// Returns every plan tier for the requested app, including inactive
// ones (so the operator can see what's been hidden and re-enable it).
// Used by the HQ Plans panel.
//
// Customer-facing apps fetch their own plans table directly via the
// anon key — they don't go through this Pages Function.

import {
  checkPasscode,
  jsonResponse,
  pgrest,
  resolveApp,
  unauthorized,
  type AdminEnv,
} from "../_shared";

interface PlanRow {
  slug: string;
  name: string;
  price_cents: number;
  period: string;
  max_staff: number;
  features: Record<string, unknown>;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const onRequestGet: PagesFunction<AdminEnv> = async ({ request, env }) => {
  if (!(await checkPasscode(request, env))) return unauthorized();

  const url = new URL(request.url);
  const appSlug = url.searchParams.get("app") || "poolmate";
  const app = resolveApp(appSlug, env);
  if (!app) return jsonResponse(400, { error: `App '${appSlug}' not configured` });

  try {
    const plans = await pgrest<PlanRow[]>(
      app,
      "plans?select=slug,name,price_cents,period,max_staff,features,sort_order,is_active,created_at,updated_at&order=sort_order.asc",
    );
    return jsonResponse(200, { app: app.slug, plans });
  } catch (err) {
    return jsonResponse(500, { error: (err as Error).message });
  }
};

export const onRequest: PagesFunction<AdminEnv> = async ({ request }) => {
  return jsonResponse(405, { error: `Method ${request.method} not allowed` });
};
