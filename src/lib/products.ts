export type ProductStatus = "live" | "beta" | "soon";
export type ProductSlug =
  | "treemate" | "poolmate" | "firemate" | "pestmate" | "hygienemate" | "locksmithmate";

export type Tone = "AU" | "UK";

export interface Feat {
  /** "01" .. "06" */
  n: string;
  title: string;
  body: string;
}

export interface ChecklistStep {
  title: string;
  body: string;
}

export interface PricingTier {
  name: string;
  /** Already includes currency symbol */
  price: string;
  per: string;
  blurb: string;
  features: string[];
  popular?: boolean;
}

export interface Product {
  slug: ProductSlug;
  name: string;
  /** "FIELDSUITE" kicker is constant; this is the wordmark line */
  industry: string;
  industryShort: string;
  /** Domain pre-launch we use for display only */
  domain: string;
  subtitle: string;
  /** Hero one-liner (without italic accent — that's added in JSX) */
  tagline: string;
  /** First-paragraph elevator pitch */
  pitch: string;
  status: ProductStatus;
  tone: Tone;
  /** Strict hex (used for runtime style attrs) */
  brandHex: string;
  brandHexDeep: string;
  glyph: "leaf" | "droplet" | "flame" | "bug" | "spray" | "key";
  /** Compliance / certification chips */
  certs: string[];
  /** 4 fact-style cards above features */
  strip: [string, string][];
  /** 6 numbered feature cards (01..06) */
  feats: Feat[];
  /** 4-step "how it runs" checklist for the dashboard preview section */
  checklist: ChecklistStep[];
  /** Pricing for this product (£ or $ already baked in via tone) */
  pricing: PricingTier[];
  /** Concise FAQ */
  faq: { q: string; a: string }[];
  /** 3-bullet pitch for the parent-page card */
  bullets: [string, string, string];
}

const tier = (pop: boolean | undefined, name: string, price: string, per: string, blurb: string, features: string[]): PricingTier => ({
  name, price, per, blurb, features, popular: pop,
});

/* -------- per-product pricing ----------- */
const POUND_PRICING_29 = (extra: string[] = []): PricingTier[] => [
  tier(false, "Solo",    "£29",  "/mo + VAT", "For one tech with a phone.",
    ["1 user", "Unlimited jobs", "Branded PDFs", "Customer portal", "Email support"]),
  tier(true,  "Crew",    "£79",  "/mo + VAT", "For a small team.",
    ["Up to 5 users", "Everything in Solo", "Recurring contracts", "Route planning", "Priority support", ...extra]),
  tier(false, "Business","£199", "/mo + VAT", "For a multi-van operation.",
    ["Up to 25 users", "Everything in Crew", "API access", "Custom branding", "Onboarding included"]),
];

const POUND_PRICING_49 = (extra: string[] = []): PricingTier[] => [
  tier(false, "Solo",     "£49",  "/mo + VAT", "For one assessor with a tablet.",
    ["1 user", "Unlimited buildings", "BS 8214 checklist", "Dual sign-off", "Branded PDFs"]),
  tier(true,  "Practice", "£129", "/mo + VAT", "For an FRA practice.",
    ["Up to 5 assessors", "Everything in Solo", "Portfolio view", "Re-inspection scheduling", "Priority support", ...extra]),
  tier(false, "Enterprise","£299","/mo + VAT", "For multi-site / managing agents.",
    ["Up to 25 users", "Everything in Practice", "API access", "White-label PDF", "5-year audit retention SLA"]),
];

const AUD_PRICING: PricingTier[] = [
  tier(false, "Solo",   "$49",  "/mo + GST", "Owner-operator. One user, full app.",
    ["1 user", "Unlimited jobs & quotes", "Customer portal", "Branded reports", "Email + SMS"]),
  tier(true,  "Crew",   "$99",  "/mo + GST", "Up to 5 users. Scheduling + dispatch.",
    ["Up to 5 users", "Route view & dispatch", "Recurring contracts", "Automations", "Stripe + Xero sync"]),
  tier(false, "Pro",    "$199", "/mo + GST", "Up to 10 users. RBAC + API.",
    ["Up to 10 users", "Role-based access", "API + webhooks", "White-label portal", "Priority support"]),
];

export const PRODUCTS: Product[] = [
  /* ------------------- TREEMATE — AU ------------------- */
  {
    slug: "treemate",
    name: "TreeMate",
    industry: "Tree services & arborists",
    industryShort: "Tree services",
    domain: "treemate.app",
    subtitle: "For arborists who'd rather be in the bucket than at a laptop",
    tagline: "Quote on-site. Win on-site.",
    pitch: "Standing under the tree, phone in one hand. Tag the species, log the DBH, snap the hazards, send the quote. Customer accepts before you've packed the bucket. Built by an arborist for arborists.",
    status: "live",
    tone: "AU",
    brandHex: "#22c55e",
    brandHexDeep: "#15803d",
    glyph: "leaf",
    certs: ["AS 4373 ready", "LANTRA-aware", "AUD/GST", "Offline-first PWA"],
    strip: [
      ["Built for", "Tree & stump removal crews"],
      ["Pricing", "From $49/mo · 14-day trial"],
      ["Site assessment", "Species + DBH + hazards"],
      ["Equipment", "Pre-loaded hourly rates"],
    ],
    feats: [
      { n: "01", title: "Site assessment, on the phone",
        body: "Species, DBH, height, canopy spread, lean, condition. Hazards: power lines, structures, slope, heritage. Tap, tap, done." },
      { n: "02", title: "Quote from the bucket",
        body: "AS 4373 prune codes, equipment library priced in $/hr (chainsaw, grinder, EWP, crane). Tap what's there. Quote out before you leave." },
      { n: "03", title: "Live ETA, branded SMS",
        body: "Customer gets your photo, the crew, the ETA. No 'where are they?' calls." },
      { n: "04", title: "Before / after photos",
        body: "Mandatory. Per tree. Sells the next job before the chips have settled." },
      { n: "05", title: "Equipment hours, automatic",
        body: "Chainsaw on the job, hours logged. Crane day rate. Bobcat. The job report builds your invoice." },
      { n: "06", title: "Storm-damage mode",
        body: "Emergency call-outs. Hazards-first checklist. Photo + insurance referral letter, ready to forward." },
    ],
    checklist: [
      { title: "Customer rings",        body: "Open the app on-site. Quote in 60 seconds." },
      { title: "Crew runs the job",     body: "Hazards in. Equipment hours auto-logged. Before/during/after photos enforced." },
      { title: "Branded PDF + invoice", body: "Same day. Photo of the trunk-rounds, the chipped pile, the cleaned site." },
      { title: "Maintenance contract", body: "Hedge trim, regular pruning — schedule itself. Quarterly cheque, monthly cheque, your call." },
    ],
    pricing: AUD_PRICING,
    faq: [
      { q: "Will it work in the bush with no signal?",
        a: "Yes. Quotes, photos, job reports queue offline and push when you're back in range. Photos compress on-device — they don't tank your data plan." },
      { q: "Does it integrate with Xero / MYOB?",
        a: "Xero invoice sync ships with Crew and Pro. MYOB AccountRight is on the roadmap. Stripe for card payments works on every plan." },
      { q: "Can my customer accept and pay from one link?",
        a: "Yep. Customer portal link → review line items + photos → tap ACCEPT → deposit captured via Stripe → job scheduled. No PDF download required." },
      { q: "What about AS 4373? Do I have to set it up?",
        a: "No — prune codes (formative, crown lift, crown reduction, deadwooding etc.) and hazard tags ship pre-loaded. Edit or hide what you don't use." },
      { q: "How does the trial work?",
        a: "Sign up, you're in. 14 days, full access, no credit card. We'll seed your trade's templates so you can run a real quote on day one." },
      { q: "Is my data mine?",
        a: "Yes. CSV export of every entity (clients, jobs, quotes, invoices, reports, photos) is one click. Cancel and you take it with you." },
    ],
    bullets: [
      "Pre-loaded prune codes & hazard tags",
      "Site photos → branded customer portal",
      "Stops the 9pm admin shift",
    ],
  },

  /* ------------------- POOLMATE — UK ------------------- */
  {
    slug: "poolmate",
    name: "PoolMate",
    industry: "Pool service & maintenance",
    industryShort: "Pool service",
    domain: "poolmate.app",
    subtitle: "For pool techs who don't want to be in front of a laptop at 9pm",
    tagline: "Pool service rounds, on autopilot.",
    pitch: "Chemical readings, dosing log, before/after photos. The whole round on your phone. Recurring contracts schedule themselves; clients get a branded PDF after every visit.",
    status: "live",
    tone: "UK",
    brandHex: "#0CA5EB",
    brandHexDeep: "#0369a1",
    glyph: "droplet",
    certs: ["PWTAG-aware", "HSG282 ready", "COSHH", "Offline-first PWA"],
    strip: [
      ["Built for",   "Pool service & maintenance"],
      ["Pricing",     "From £29/mo · 14-day trial"],
      ["Chemicals",   "Targets + alerts per pool"],
      ["Schedule",    "Auto-routes by postcode"],
    ],
    feats: [
      { n: "01", title: "Chemical readings + targets",
        body: "pH, free chlorine, total chlorine, alkalinity, calcium hardness. Targets per pool. Out-of-range readings flagged on the spot." },
      { n: "02", title: "Dosing calculator + log",
        body: "Type the reading. App suggests the dose. Tech logs what was actually added. Audit trail per pool, per visit, per product." },
      { n: "03", title: "Recurring routes",
        body: "Weekly, fortnightly, monthly. The app builds tomorrow morning's route by postcode, automatically." },
      { n: "04", title: "Per-pool history",
        body: "Every reading, every dose, every photo. Plot pH over the season. Catch trends before the customer complains." },
      { n: "05", title: "Customer portal",
        body: "Pool owners log in, see history, download service reports, request extra visits." },
      { n: "06", title: "Same-day branded PDF",
        body: "Date-stamped. Photo of the pool. Chemicals + dose. Tech signed. In their inbox before tea." },
    ],
    checklist: [
      { title: "Add the pool",          body: "Volume, chemistry type, equipment, access notes. Targets default sensibly." },
      { title: "Tech does the round",   body: "Reading, dose, photo, sign. Tomorrow's pools auto-routed by postcode." },
      { title: "Customer gets the PDF", body: "Branded. With trends. With photos. Same day." },
      { title: "Trends over the season",body: "One chart per chemical, per pool. Catch the green water before it happens." },
    ],
    pricing: POUND_PRICING_29(["Xero / QuickBooks sync"]),
    faq: [
      { q: "Does it handle one-off jobs and recurring service together?",
        a: "Yes. Recurring weekly/fortnightly contracts and one-off acid washes / pump rebuilds run through the same job pipeline." },
      { q: "Will it work on patchy reception in the van?",
        a: "Yes. Service reports, photos and chemical logs queue offline and push when you're back in range." },
      { q: "How does the trial work?",
        a: "14 days, full app, no card. We'll seed a sample route and chemical library so you can run a real service on day one." },
    ],
    bullets: [
      "Daily route auto-built by postcode",
      "Chemical library with target ranges",
      "Customer portal with service history",
    ],
  },

  /* ------------------- FIREMATE — UK ------------------- */
  {
    slug: "firemate",
    name: "FireMate",
    industry: "Fire-door surveying & life-safety",
    industryShort: "Fire safety",
    domain: "firemate.app",
    subtitle: "For fire-door surveyors and risk assessors",
    tagline: "Fire-door inspections your assessor will sign.",
    pitch: "Run BS 8214-aligned fire-door surveys from a tablet. 71 inspection points per door, photo evidence on every fail, dual digital sign-off, branded PDF in the responsible person's inbox before you leave the building.",
    status: "beta",
    tone: "UK",
    brandHex: "#dc2626",
    brandHexDeep: "#b91c1c",
    glyph: "flame",
    certs: ["BS 8214:2016", "BS 5839", "RRO 2005 ready", "5-yr audit retention"],
    strip: [
      ["Built for",       "Independent FRA assessors"],
      ["Per door",        "71-item BS 8214 checklist"],
      ["Pricing",         "From £49/mo · 14-day trial"],
      ["Audit retention", "5 years, immutable"],
    ],
    feats: [
      { n: "01", title: "71-item BS 8214:2016 checklist",
        body: "Every door registered, surveyed on schedule, with photo evidence on every fail. Built into the app — not bolted on." },
      { n: "02", title: "Dual digital sign-off",
        body: "You (with your cert number) and the responsible person both sign on the device. Both signatures land on the PDF, both timestamped to the second." },
      { n: "03", title: "Branded compliance PDF",
        body: "Cover with compliance %, register index, per-door chapter, photos. Your logo on the cover. Sent the moment you sign." },
      { n: "04", title: "Auto re-inspection schedule",
        body: "One cadence per building, override per door. Next visit projects itself onto your calendar — no spreadsheet, no Outlook reminder." },
      { n: "05", title: "Tribunal-ready audit trail",
        body: "Door metadata snapshotted at survey time. Five-year retention by default. Every signature timestamped. Immutable." },
      { n: "06", title: "Multi-building portfolio",
        body: "Manage 1 building or 1,000. Group by client, postcode, RP. Drill from portfolio → building → door → check." },
    ],
    checklist: [
      { title: "Register the building", body: "Walk the floors, tap to add doors. The register builds itself as you go." },
      { title: "71 checks per door",    body: "Pass / fail / N-A. Photo on every fail. Sticky progress bar tells you when the door is done." },
      { title: "Both sign on the device", body: "You with your cert number. The responsible person with theirs. Both on the PDF." },
      { title: "PDF in the inbox",      body: "Branded register-of-record. Compliance %. Five-year retention. Done." },
    ],
    pricing: POUND_PRICING_49(["Building portfolio view"]),
    faq: [
      { q: "Does it cover RRO 2005 and Building Safety Act?",
        a: "Yes. The checklist is mapped to BS 8214:2016 and the report layout is built for the evidence requirements under the Regulatory Reform (Fire Safety) Order 2005 and the Building Safety Act regime." },
      { q: "Can we set re-inspection cadence per door?",
        a: "Yes. One cadence per building by default, with optional per-door override. The next visit projects itself onto the calendar." },
      { q: "How does the beta work?",
        a: "Private beta currently. Drop your details and we'll port your existing register from Excel for free if you sign up before the end of the month." },
    ],
    bullets: [
      "71-point per-door inspection",
      "Assessor + RP dual sign-off",
      "Insurer-ready compliance PDF",
    ],
  },

  /* ------------------- PESTMATE — UK ------------------- */
  {
    slug: "pestmate",
    name: "PestMate",
    industry: "Pest management & control",
    industryShort: "Pest control",
    domain: "pestmate.app",
    subtitle: "For pest controllers who hate the paperwork",
    tagline: "The pest control app that does the paperwork.",
    pitch: "Run your pest round from your phone. Bait points, HSE numbers, photo evidence, technician sign-off — every visit becomes a branded PDF before the van leaves the property. Built for BPCA-registered techs and the businesses they run.",
    status: "beta",
    tone: "UK",
    brandHex: "#16a34a",
    brandHexDeep: "#166534",
    glyph: "bug",
    certs: ["BPCA-aware", "HSE compatible", "COSHH 2002", "Offline-first PWA"],
    strip: [
      ["Built for",   "BPCA-registered techs"],
      ["Audit-ready", "Branded PDF per visit"],
      ["Pricing",     "From £29/mo · 14-day trial"],
      ["Works",       "Offline-first PWA"],
    ],
    feats: [
      { n: "01", title: "Visit reports your inspector wants",
        body: "Task checklist, products used (HSE numbers), batch + quantity, technician signature. Out the door before the van leaves site." },
      { n: "02", title: "Bait-point library, mapped",
        body: "Every bait station logged with location, last-checked date, hot-spot photos. Find them again next month — even if the regular tech is off." },
      { n: "03", title: "Recurring contracts on autopilot",
        body: "Monthly, quarterly, biannual. Routes auto-build from your live calendar. No more spreadsheet of 'when was last visit?'." },
      { n: "04", title: "COSHH, by default",
        body: "Every chemical used is logged with batch and quantity. Your COSHH file builds itself. Export to PDF anytime." },
      { n: "05", title: "Branded for your business",
        body: "Your logo, your colours, your cert numbers on every report. Customers see your brand, not ours." },
      { n: "06", title: "Customer portal, included",
        body: "Clients log in, see their history, download their reports. One less email you have to dig out." },
    ],
    checklist: [
      { title: "Sign up",                  body: "14-day free trial. No card. Onboard your business + bait library in under 10 minutes." },
      { title: "Run a visit on the phone", body: "Open the app on-site. Tick tasks. Snap photos. Pick the products. Sign and send." },
      { title: "Branded PDF lands",        body: "In your customer's inbox. With your cert numbers, your colours, your logo." },
      { title: "Compounding records",      body: "Every visit builds your audit trail. Inspector turns up? Forward the file." },
    ],
    pricing: POUND_PRICING_29(),
    faq: [
      { q: "Does it handle CRRU and COSHH compliance?",
        a: "Yes. Products are logged with batch and quantity. The CRRU UK Code stewardship language is on the report by default." },
      { q: "What about hospitality contracts (FSA, EHO)?",
        a: "PestMate reports are designed for FSA / EHO inspections. The visit log, products used, technician sign-off and photos are all in one PDF you can hand over on the spot." },
      { q: "Can it work alongside fire and hygiene?",
        a: "Yes — FieldSuite ships dedicated apps per division. One supplier, one invoice, one phone number across compliance." },
    ],
    bullets: [
      "Hot-spot bait-point mapping",
      "Recurring contracts auto-projected",
      "Branded report emailed same day",
    ],
  },

  /* ------------------- HYGIENEMATE — UK ------------------- */
  {
    slug: "hygienemate",
    name: "HygieneMate",
    industry: "Hygiene & deep-clean services",
    industryShort: "Hygiene services",
    domain: "hygienemate.app",
    subtitle: "For deep-clean and sanitisation crews",
    tagline: "The deep-clean app your customers actually open.",
    pitch: "Photo-stamped before/after, technician signature, every chemical logged with batch and quantity. Built for kitchen extraction, washroom service, and the audit trail your customers' food-safety officers ask for.",
    status: "beta",
    tone: "UK",
    brandHex: "#0891b2",
    brandHexDeep: "#0e7490",
    glyph: "spray",
    certs: ["BICSc-aware", "COSHH", "Food Safety Act 1990", "Same-day PDF"],
    strip: [
      ["Built for",     "Kitchen extraction & sanitisation"],
      ["Photo evidence","Before / after, every visit"],
      ["Pricing",       "From £29/mo · 14-day trial"],
      ["Chemicals",     "Logged with batch + quantity"],
    ],
    feats: [
      { n: "01", title: "Before / after photos, mandatory",
        body: "Force the tech to take both. Date-stamped, GPS-tagged, attached to the visit. The kind of evidence that closes a contract." },
      { n: "02", title: "Crew on the report by name",
        body: "BICSc-trained tech? Their cert appears on the PDF. No anonymous 'operative #4' — your trained staff are part of the pitch." },
      { n: "03", title: "Chemical traceability",
        body: "Every product used, logged with batch and quantity. COSHH-compliant by default. Export the chemical log on demand." },
      { n: "04", title: "Recurring contracts",
        body: "Kitchen extraction every 6 months, washroom weekly, fogging quarterly. The schedule lives in the app, not someone's head." },
      { n: "05", title: "Branded same-day PDF",
        body: "In the customer's inbox the afternoon of the visit. Your logo, your colours, your cert. Not 'noreply@'." },
      { n: "06", title: "Customer portal",
        body: "Clients see history, download reports, raise issues. Saves your inbox from 'can you send me last quarter's clean?'." },
    ],
    checklist: [
      { title: "Book the visit",         body: "Pick the property, the service type, the crew. Recurring contracts auto-book themselves." },
      { title: "Crew runs the work",     body: "Tick zones. Snap before/after. Pick chemicals from your library. Sign." },
      { title: "Customer gets the PDF",  body: "Same day. Branded. With every photo, every chemical, every signature." },
      { title: "Audit lands",            body: "Customer's FSA inspector turns up. They forward your PDF. Job done." },
    ],
    pricing: POUND_PRICING_29(),
    faq: [
      { q: "Does it work for healthcare IPC contracts?",
        a: "Yes. Care home / clinical-area schedules with IPC-specific checklists are templated. Sign-off captured per area." },
      { q: "Can we bundle with PestMate and FireMate?",
        a: "Yes. Customers on multiple FieldSuite apps can roll into a single invoice. One supplier across compliance." },
      { q: "How do we get started?",
        a: "Drop your details. Private beta access — we'll seed your sites and recurring schedules from your existing contracts." },
    ],
    bullets: [
      "Before/after photos auto-stamped",
      "Chemicals logged with batch numbers",
      "Recurring kitchen / washroom schedule",
    ],
  },

  /* ------------------- LOCKSMITHMATE — UK ------------------- */
  {
    slug: "locksmithmate",
    name: "LocksmithMate",
    industry: "Mobile locksmiths & access control",
    industryShort: "Locksmiths",
    domain: "locksmithmate.app",
    subtitle: "For mobile locksmiths working out of a van",
    tagline: "Run your locksmith round from the van.",
    pitch: "Quote on the phone. Send the customer your photo and DBS card before you arrive. Photo of the work, digital invoice, card-on-file before the van leaves the kerb. Built for mobile locksmiths who hate 'I'll send the invoice later'.",
    status: "beta",
    tone: "UK",
    brandHex: "#d97706",
    brandHexDeep: "#b45309",
    glyph: "key",
    certs: ["MLA-aware", "DBS-ready", "BS 3621", "BS 8621"],
    strip: [
      ["Built for",    "Mobile / emergency locksmiths"],
      ["Pricing",      "From £29/mo · 14-day trial"],
      ["Pre-arrival",  "Photo + DBS card auto-sent"],
      ["Get paid",     "Card or BACS, before you leave"],
    ],
    feats: [
      { n: "01", title: "Phone-first job dispatch",
        body: "Calls in, locked-out customer on the line. Quote, ETA, address — all in 30 seconds. Job goes straight to the assigned tech." },
      { n: "02", title: "Pre-arrival trust pack",
        body: "Customer gets your photo, your MLA badge image, your DBS card, and a live ETA — automatically — before you knock." },
      { n: "03", title: "Photo + digital invoice",
        body: "Picture of the work done. Card-on-file or BACS. Invoice sent before the van leaves. No 'I'll send it tonight'. No cash on the doorstep." },
      { n: "04", title: "Pricing by job type",
        body: "BS 3621 swap. Smart-lock fit. UPVC re-key. Pre-loaded job templates with parts and labour. Quote in seconds." },
      { n: "05", title: "Landlord package",
        body: "Bulk re-keys priced per door. 24h turnaround between tenancies. Lock + key handover photo'd into the job." },
      { n: "06", title: "Live van status",
        body: "Customer sees 'tech 4 minutes away' in real time. Fewer 'where are you?' calls. Better Google reviews." },
    ],
    checklist: [
      { title: "Call comes in",            body: "30 seconds: quote, address, ETA. SMS confirmation goes out automatically." },
      { title: "Customer sees who's coming", body: "Photo of the tech, MLA badge, DBS card, live ETA. Trust before knock." },
      { title: "Lock fitted, photo'd",     body: "Picture goes into the job sheet. Job sheet becomes the invoice." },
      { title: "Paid before you leave",    body: "Card-on-file or tap-to-pay. Digital invoice. Clean exit." },
    ],
    pricing: POUND_PRICING_29(["Stripe + GoCardless built in"]),
    faq: [
      { q: "Does it handle landlord / lettings packages?",
        a: "Yes. Between-tenancy bulk lock changes, master keying schedules, and key-handover sign-off are all templated for letting agents." },
      { q: "What about insurance compliance (BS 3621)?",
        a: "Stock library defaults to BS 3621 deadlocks for insurance compliance. Pre-fill the certificate on the report, ready for the customer's insurer." },
      { q: "Can dispatchers see all jobs in real time?",
        a: "Yes. Live map of techs, jobs in progress, ETAs, and pending bookings. Drag to reassign. Customer SMS auto-fires on assignment." },
    ],
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

/** Currency symbol for the active product. Used by the lead form etc. */
export const currencyFor = (p: Product): "$" | "£" => (p.tone === "AU" ? "$" : "£");

/** Legacy slug map — used by _redirects + lead Function. */
export const LEGACY_SLUGS: Record<string, ProductSlug> = {
  treepro: "treemate",
  poolpro: "poolmate",
  firepro: "firemate",
  pestpro: "pestmate",
  hygienepro: "hygienemate",
  lockpro: "locksmithmate",
};
