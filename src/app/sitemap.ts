import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";

// Required for `output: "export"` so Next renders the sitemap at build time
// instead of trying to serve it dynamically.
export const dynamic = "force-static";
export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://fieldmate.app";
  const now = new Date();

  return [
    { url: `${base}/`,                lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/legal/privacy/`,  lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/legal/terms/`,    lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ...PRODUCTS.map((p) => ({
      url: `${base}/products/${p.slug}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p.status === "live" ? 0.9 : 0.7,
    })),
  ];
}
