/**
 * Fixture data for the interactive AppDashboardLive component.
 *
 * Per the design handoff (Apr 2026): TreeMate is the canonical fully-fleshed
 * dataset. The other 5 *Mate apps currently re-skin this data and will get
 * bespoke `PEST_DATA`, `FIRE_DATA`, etc. in follow-up handoffs — drop them
 * straight into the `dataFor()` switch when delivered.
 *
 * Currency on TreeMate is £ here (per source handoff). The marketing site
 * positions TreeMate as AU/AUD elsewhere — that's a deliberate marketing-vs-
 * product split for now and may need reconciling once TreeMate has UK + AU
 * tenants live.
 */
import type { ProductSlug } from "./products";

export interface ScheduleJob { t: string; c: string; client: string; crew: string; tag: string; }
export interface ScheduleDay { d: string; n: number; jobs: ScheduleJob[]; }
export interface TodayItem { t: string; c: string; loc: string; state: string; }
export interface ScheduleData { weekLabel: string; days: ScheduleDay[]; today: TodayItem[]; }

export interface ClientRow {
  name: string; type: string; sites: string | number; spend: string;
  last: string; tags: string[]; hot: boolean;
}

export interface JobItem {
  ref: string; t: string; c: string;
  v?: string; d?: string; hours?: string; crew?: string; age?: string;
}
export interface JobCol { k: string; l: string; count: number; items: JobItem[]; }
export interface JobsData { cols: JobCol[]; }

export interface QuoteRow {
  ref: string; client: string; addr: string; work: string;
  value: string; state: string; age: string;
  /** Tone used on the state pill: "sent" | "won" | "lost" */
  accent: "sent" | "won" | "lost";
}
export interface QuoteDetail {
  ref: string; client: string; site: string;
  species: string; dbh: string; height: string; spread: string;
  hazards: string[]; pruneCode: string;
  lineItems: [string, string][]; total: string;
}

export interface InvoiceRow { ref: string; client: string; value: string; state: string; daysOpen: number; paid: string; }

export interface AnalyticsData {
  revenueMonths: number[];
  revenueLabels: string[];
  breakdown: [string, number, string][];
  kpis: [string, string, string][];
  leaderboard: [string, string, number, string][];
}

export interface DashboardData {
  schedule: ScheduleData;
  clients: ClientRow[];
  jobs: JobsData;
  quotes: QuoteRow[];
  quoteDetail: QuoteDetail;
  invoices: InvoiceRow[];
  analytics: AnalyticsData;
}

export const TREE_DATA: DashboardData = {
  schedule: {
    weekLabel: "Mon 27 Apr — Sun 03 May 2026",
    days: [
      { d: "Mon", n: 27, jobs: [
        { t: "08:00", c: "Birch reduction · 14 Beech Rd",   client: "M. Whitaker", crew: "A · Jamie + Tom", tag: "Confirmed" },
        { t: "11:30", c: "Storm damage callout · Glen W.",   client: "Glen Wright", crew: "A",              tag: "Emergency" },
      ]},
      { d: "Tue", n: 28, jobs: [
        { t: "07:30", c: "Heritage Eucalypt removal · 14 Beech Rd", client: "M. Whitaker", crew: "A · full crew", tag: "Confirmed" },
        { t: "14:00", c: "Hedge trim · Crown Estates",              client: "Crown Estates", crew: "B · Pete",     tag: "Recurring" },
      ]},
      { d: "Wed", n: 29, jobs: [
        { t: "09:00", c: "Spotted Gum prune · Glen W.", client: "Glen Wright", crew: "A", tag: "Quoted · accepted" },
      ]},
      { d: "Thu", n: 30, jobs: [
        { t: "08:00", c: "Stump grinding · Heritage Park", client: "Heritage Park HOA", crew: "B",    tag: "Confirmed" },
        { t: "12:00", c: "Site assessment · 7 Maple Cl",   client: "D. Reyes",          crew: "Self", tag: "Quote visit" },
        { t: "15:30", c: "EWP day · Council",              client: "Westbury Council",  crew: "A",    tag: "Day rate" },
      ]},
      { d: "Fri", n: 1, jobs: [
        { t: "07:00", c: "Crown lift × 4 · Birchwood Estate", client: "Birchwood Mgmt", crew: "A+B", tag: "Confirmed" },
      ]},
      { d: "Sat", n: 2, jobs: [] },
      { d: "Sun", n: 3, jobs: [] },
    ],
    today: [
      { t: "08:00", c: "Heritage Eucalypt removal", loc: "14 Beech Rd · M. Whitaker",       state: "In progress" },
      { t: "14:00", c: "Hedge trim",                loc: "Crown Estates · 8 sites",          state: "Scheduled" },
      { t: "16:30", c: "Site visit · quote",         loc: "Glen Wright · Spotted Gum",        state: "Scheduled" },
    ],
  },

  clients: [
    { name: "Crown Estates",         type: "Commercial · grounds",      sites: 8,  spend: "£14,200", last: "Hedge trim · 14 Apr",      tags: ["Recurring", "Net 30"], hot: true  },
    { name: "Glen Wright",           type: "Residential",                sites: 1,  spend: "£3,840",  last: "Storm callout · 12 Apr",   tags: ["Card on file"],         hot: true  },
    { name: "M. Whitaker",           type: "Residential · heritage",     sites: 1,  spend: "£8,400",  last: "Site assessment · 10 Apr", tags: ["Heritage permit"],     hot: false },
    { name: "Heritage Park HOA",     type: "HOA · 42 trees",             sites: 1,  spend: "£11,600", last: "Stump grinding · 4 Apr",   tags: ["Annual contract"],      hot: false },
    { name: "Westbury Council",      type: "Local authority",             sites: 14, spend: "£28,400", last: "EWP day · 2 Apr",          tags: ["Net 60", "Tender"],     hot: false },
    { name: "Birchwood Estate Mgmt", type: "Strata · 96 units",          sites: 1,  spend: "£6,200",  last: "Crown lift · 28 Mar",      tags: ["Recurring"],            hot: false },
    { name: "D. Reyes",              type: "Residential",                sites: 1,  spend: "£0",      last: "Quote sent · 22 Apr",      tags: ["New"],                  hot: false },
    { name: "Forrest & Co. Cafés",   type: "Multi-site",                 sites: 5,  spend: "£4,100",  last: "Hedge trim · 18 Mar",      tags: ["Recurring"],            hot: false },
  ],

  jobs: {
    cols: [
      { k: "quoted", l: "Quoted", count: 3, items: [
        { ref: "TM-2041", t: "Spotted Gum prune",            c: "Glen Wright",     v: "£1,840", age: "2d" },
        { ref: "TM-2039", t: "Hedge trim · 5-site annual",   c: "Forrest & Co.",   v: "£4,200", age: "4d" },
        { ref: "TM-2037", t: "Heritage prune (AS 4373 7.2)", c: "M. Whitaker",     v: "£3,640", age: "5d" },
      ]},
      { k: "sched", l: "Scheduled", count: 5, items: [
        { ref: "TM-2042", t: "Birch reduction",          c: "M. Whitaker",       d: "Mon 08:00", crew: "A" },
        { ref: "TM-2040", t: "Heritage Eucalypt removal", c: "M. Whitaker",       d: "Tue 07:30", crew: "A · full" },
        { ref: "TM-2038", t: "Stump grinding",            c: "Heritage Park HOA", d: "Thu 08:00", crew: "B" },
        { ref: "TM-2036", t: "EWP day",                   c: "Westbury Council",  d: "Thu 15:30", crew: "A" },
        { ref: "TM-2035", t: "Crown lift × 4",            c: "Birchwood Mgmt",    d: "Fri 07:00", crew: "A+B" },
      ]},
      { k: "progress", l: "In progress", count: 1, items: [
        { ref: "TM-2034", t: "Heritage Eucalypt removal", c: "M. Whitaker", hours: "3.4h logged", crew: "A · 4 on-site" },
      ]},
      { k: "done", l: "Done · awaiting invoice", count: 2, items: [
        { ref: "TM-2032", t: "Storm callout · branch failure", c: "Glen Wright",   v: "£980",   d: "Mon" },
        { ref: "TM-2031", t: "Hedge trim · annual",            c: "Crown Estates", v: "£1,420", d: "Last Fri" },
      ]},
    ],
  },

  quotes: [
    { ref: "TM-2041", client: "Glen Wright",          addr: "12 Riverbank Way",  work: "Spotted Gum · selective prune (AS 4373 7.2)",   value: "£1,840",  state: "Sent",                age: "2d",  accent: "sent" },
    { ref: "TM-2039", client: "Forrest & Co. Cafés",  addr: "5 sites · annual",   work: "Hedge trim contract · quarterly",               value: "£4,200",  state: "Sent",                age: "4d",  accent: "sent" },
    { ref: "TM-2037", client: "M. Whitaker",          addr: "14 Beech Rd",        work: "Heritage Eucalypt — prune (7.2) + crown lift",  value: "£3,640",  state: "Accepted",            age: "5d",  accent: "won"  },
    { ref: "TM-2033", client: "D. Reyes",             addr: "7 Maple Close",      work: "Site visit · two trees · removal quote",        value: "£2,200",  state: "Sent",                age: "6d",  accent: "sent" },
    { ref: "TM-2029", client: "Westbury Council",     addr: "Tender · 14 sites",  work: "Annual maintenance · EWP day rate",             value: "£28,400", state: "Tender · awaiting",   age: "12d", accent: "sent" },
    { ref: "TM-2024", client: "B. Holloway",          addr: "4 Oak Mews",         work: "Pollard · 2 limes",                              value: "£860",    state: "Declined",            age: "15d", accent: "lost" },
  ],
  quoteDetail: {
    ref: "TM-2041",
    client: "Glen Wright",
    site: "12 Riverbank Way · access via rear lane",
    species: "Spotted Gum (Corymbia maculata)",
    dbh: "72 cm", height: "24 m", spread: "14 m",
    hazards: ["Power lines (0.8m)", "Heritage status: no"],
    pruneCode: "AS 4373 · Type 2 (Selective prune)",
    lineItems: [
      ["Crew · 2 climbers · 5h", "£820"],
      ["EWP · 4h",                "£480"],
      ["Chipper hire · day",      "£220"],
      ["Tip + greenwaste",        "£120"],
      ["Permit liaison · council","£200"],
    ],
    total: "£1,840",
  },

  invoices: [
    { ref: "INV-1188", client: "Crown Estates",     value: "£1,420", state: "Paid",          daysOpen: 0,  paid: "14 Apr" },
    { ref: "INV-1187", client: "Glen Wright",        value: "£980",   state: "Paid",          daysOpen: 1,  paid: "13 Apr" },
    { ref: "INV-1186", client: "Heritage Park HOA",  value: "£3,200", state: "Sent",          daysOpen: 9,  paid: "—" },
    { ref: "INV-1185", client: "Westbury Council",   value: "£8,400", state: "Sent · Net 60", daysOpen: 18, paid: "—" },
    { ref: "INV-1184", client: "B. Holloway",        value: "£440",   state: "Overdue · 12d", daysOpen: 42, paid: "—" },
    { ref: "INV-1183", client: "Forrest & Co.",      value: "£980",   state: "Paid",          daysOpen: 2,  paid: "8 Apr" },
    { ref: "INV-1182", client: "Birchwood Mgmt",     value: "£2,640", state: "Paid",          daysOpen: 5,  paid: "4 Apr" },
  ],

  analytics: {
    revenueMonths: [5800, 7200, 6400, 9100, 11400, 12840],
    revenueLabels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
    breakdown: [
      ["Removal",          38, "#22c55e"],
      ["Prune (AS 4373)",  28, "#16a34a"],
      ["Hedge trim",       14, "#65a30d"],
      ["Stump grinding",   10, "#84cc16"],
      ["Storm callout",     6, "#a3e635"],
      ["Other",             4, "#bef264"],
    ],
    kpis: [
      ["Avg job value",     "£1,840", "+12% vs Mar"],
      ["Quote → won",       "64%",    "+8%"],
      ["On-time arrival",   "94%",    "+2%"],
      ["Equipment hrs/job", "7.2",    "—"],
    ],
    leaderboard: [
      ["Jamie K.",        "Climber",    18, "£21,400"],
      ["Tom B.",          "Groundie",   22, "£18,800"],
      ["Pete R.",         "Hedge crew", 14, "£11,600"],
      ["Self · quoting",  "—",           9, "£14,200"],
    ],
  },
};

/** Return the dashboard fixture for a product. Until bespoke per-app data
 * lands, every product uses TREE_DATA — the accent + tint come from the
 * product's CSS theme so visually it's already differentiated. */
export function dataFor(_slug: ProductSlug): DashboardData {
  return TREE_DATA;
}
