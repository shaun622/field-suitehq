export type ProductStatus = "live" | "beta" | "soon";
export type ProductSlug =
  | "treepro" | "poolpro" | "firepro" | "pestpro" | "hygienepro" | "lockpro";

export interface Product {
  slug: ProductSlug;
  name: string;
  industry: string;
  industryShort: string;
  tagline: string;
  pitch: string;
  status: ProductStatus;
  market: "AU" | "UK" | "Both";
  // Tailwind-friendly hex for icon backgrounds (rendered server-side, not a class)
  brandHex: string;
  brandHexDeep: string;
  // Optional shape-glyph hint for the wordmark mark
  glyph: "leaf" | "droplet" | "flame" | "bug" | "spray" | "key";
  // Compliance / certifications shown in product chrome
  certs: string[];
  // Three-bullet pitch — kept short for cards
  bullets: [string, string, string];
}

export const PRODUCTS: Product[] = [
  {
    slug: "treepro",
    name: "TreePro",
    industry: "Tree services & arborists",
    industryShort: "Tree services",
    tagline: "Quote it before the kettle cools.",
    pitch: "Quote, schedule, invoice and get paid from the cab of the ute. AS4373 baked in, hazard tags first-class, made in Australia.",
    status: "live",
    market: "AU",
    brandHex: "#22c55e",
    brandHexDeep: "#15803d",
    glyph: "leaf",
    certs: ["AS4373", "AUD/GST", "AU made"],
    bullets: [
      "Pre-loaded prune codes & hazard tags",
      "Site photos → branded customer portal",
      "Stops the 9pm admin shift",
    ],
  },
  {
    slug: "poolpro",
    name: "PoolPro",
    industry: "Pool maintenance & service",
    industryShort: "Pool care",
    tagline: "The chemicals job, sorted.",
    pitch: "Recurring service routes, chemical logs, photo-stamped reports — built for techs in the truck and pool shops at the counter.",
    status: "live",
    market: "AU",
    brandHex: "#0ea5e9",
    brandHexDeep: "#0369a1",
    glyph: "droplet",
    certs: ["pH/Cl logs", "AUD/GST", "AU made"],
    bullets: [
      "Daily route + drag-to-reorder stops",
      "Chemical library with target ranges",
      "Customer portal with service history",
    ],
  },
  {
    slug: "firepro",
    name: "FirePro",
    industry: "Fire-door & life-safety inspection",
    industryShort: "Fire safety",
    tagline: "RRO 2005 — done properly.",
    pitch: "71-point BS 8214 fire-door checklist per door, dual sign-off, branded compliance PDF. The audit trail your insurer wants on file.",
    status: "beta",
    market: "UK",
    brandHex: "#ef4444",
    brandHexDeep: "#b91c1c",
    glyph: "flame",
    certs: ["BAFE", "RRO 2005", "BS 8214"],
    bullets: [
      "71-point per-door inspection",
      "Assessor + Responsible Person sign-off",
      "Insurer-ready compliance PDF",
    ],
  },
  {
    slug: "pestpro",
    name: "PestPro",
    industry: "Pest management & control",
    industryShort: "Pest control",
    tagline: "Pest management, on the record.",
    pitch: "BPCA-style digital service reports, bait-point mapping, COSHH-traceable products. Hand the EHO a PDF, not a clipboard.",
    status: "beta",
    market: "Both",
    brandHex: "#16a34a",
    brandHexDeep: "#166534",
    glyph: "bug",
    certs: ["BPCA-ready", "COSHH", "HSE"],
    bullets: [
      "Hot-spot bait-point mapping",
      "Recurring contracts auto-projected",
      "Branded report emailed same day",
    ],
  },
  {
    slug: "hygienepro",
    name: "HygienePro",
    industry: "Hygiene & deep-clean services",
    industryShort: "Hygiene services",
    tagline: "Clean enough to inspect.",
    pitch: "BICSc-style techs, before/after photo evidence, chemical traceability, branded report. The audit log your FSA inspector will thank you for.",
    status: "beta",
    market: "Both",
    brandHex: "#06b6d4",
    brandHexDeep: "#0e7490",
    glyph: "spray",
    certs: ["BICSc-ready", "ISO 9001", "COSHH"],
    bullets: [
      "Before/after photos auto-stamped",
      "Chemicals logged with batch numbers",
      "Recurring kitchen/washroom schedule",
    ],
  },
  {
    slug: "lockpro",
    name: "LockPro",
    industry: "Locksmiths & access control",
    industryShort: "Locksmiths",
    tagline: "Phone-bookable, MLA-tidy.",
    pitch: "Live ETA, fixed price on the phone, BS 3621 lock fitted, photo + invoice before the van leaves. No 'cash only on the doorstep' nonsense.",
    status: "beta",
    market: "Both",
    brandHex: "#f59e0b",
    brandHexDeep: "#b45309",
    glyph: "key",
    certs: ["MLA-style", "DBS-checked", "BS 3621"],
    bullets: [
      "24/7 emergency call-out with live ETA",
      "BS 3621 / 8621 stock list",
      "Photo + invoice before leaving site",
    ],
  },
];

export const productBySlug = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug);

export const liveProducts = PRODUCTS.filter((p) => p.status === "live");
export const betaProducts = PRODUCTS.filter((p) => p.status === "beta");
