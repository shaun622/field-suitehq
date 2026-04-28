/**
 * Fixture data for the interactive AppDashboardLive component.
 *
 * Six bespoke datasets — one per *Mate vertical — ported from the
 * FieldSuite Interactive Dashboard handoff (Apr 2026, Remaining bundle).
 * Each follows the same schema (`schedule / clients / jobs / quotes /
 * quoteDetail / invoices / analytics`) so all eight tab views render
 * off any of them with no per-view branching.
 *
 * Currency: `$` throughout. The marketing site is multi-region (AU + UK);
 * we use a generic dollar sign so a single string set works for both. The
 * real product is locale-aware at render time.
 *
 * `quoteDetailLabels` lives alongside each dataset because the schema
 * is shared but the field meanings vary per trade — e.g. `dbh` is
 * "Diameter at breast height" for TreeMate but "Droppings/m²" for
 * PestMate. The QuotesView reads labels from the dataset, so the same
 * detail card renders correctly for every app.
 */
import type { ProductSlug } from "./products";

/* ------------------- shared types ------------------- */

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
  /** Tone used on the state pill */
  accent: "sent" | "won" | "lost";
}
export interface QuoteDetail {
  ref: string; client: string; site: string;
  /** Generic field names; the meaning is mapped via `quoteDetailLabels` */
  species: string; dbh: string; height: string; spread: string;
  hazards: string[]; pruneCode: string;
  lineItems: [string, string][]; total: string;
}

/** Per-app labels for the QuotesView meta-grid + hazard pill heading.
 * The dataset is the source of truth — `species` for trees, `cylinder type`
 * for locks, etc. */
export interface QuoteDetailLabels {
  species: string;
  dbhHeight: string;
  spread: string;
  pruneCode: string;
  hazards: string;
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
  quoteDetailLabels: QuoteDetailLabels;
  invoices: InvoiceRow[];
  analytics: AnalyticsData;
}

/* ------------------- TREEMATE — arborists (AS 4373) ------------------- */
export const TREE_DATA: DashboardData = {
  schedule: {
    weekLabel: "Mon 27 Apr — Sun 03 May 2026",
    days: [
      { d: "Mon", n: 27, jobs: [
        { t: "08:00", c: "Birch reduction · 14 Beech Rd",          client: "M. Whitaker",   crew: "A · Jamie + Tom", tag: "Confirmed" },
        { t: "11:30", c: "Storm damage callout · Glen W.",          client: "Glen Wright",   crew: "A",               tag: "Emergency" },
      ]},
      { d: "Tue", n: 28, jobs: [
        { t: "07:30", c: "Heritage Eucalypt removal · 14 Beech Rd", client: "M. Whitaker",   crew: "A · full crew",   tag: "Confirmed" },
        { t: "14:00", c: "Hedge trim · Crown Estates",              client: "Crown Estates", crew: "B · Pete",        tag: "Recurring" },
      ]},
      { d: "Wed", n: 29, jobs: [
        { t: "09:00", c: "Spotted Gum prune · Glen W.",             client: "Glen Wright",   crew: "A",               tag: "Quoted · accepted" },
      ]},
      { d: "Thu", n: 30, jobs: [
        { t: "08:00", c: "Stump grinding · Heritage Park",          client: "Heritage Park HOA", crew: "B",            tag: "Confirmed" },
        { t: "12:00", c: "Site assessment · 7 Maple Cl",            client: "D. Reyes",          crew: "Self",         tag: "Quote visit" },
        { t: "15:30", c: "EWP day · Council",                       client: "Westbury Council",  crew: "A",            tag: "Day rate" },
      ]},
      { d: "Fri", n: 1, jobs: [
        { t: "07:00", c: "Crown lift × 4 · Birchwood Estate",       client: "Birchwood Mgmt", crew: "A+B",            tag: "Confirmed" },
      ]},
      { d: "Sat", n: 2, jobs: [] },
      { d: "Sun", n: 3, jobs: [] },
    ],
    today: [
      { t: "08:00", c: "Heritage Eucalypt removal", loc: "14 Beech Rd · M. Whitaker",  state: "In progress" },
      { t: "14:00", c: "Hedge trim",                loc: "Crown Estates · 8 sites",     state: "Scheduled" },
      { t: "16:30", c: "Site visit · quote",         loc: "Glen Wright · Spotted Gum",   state: "Scheduled" },
    ],
  },
  clients: [
    { name: "Crown Estates",         type: "Commercial · grounds",      sites: 8,  spend: "$14,200", last: "Hedge trim · 14 Apr",      tags: ["Recurring", "Net 30"], hot: true  },
    { name: "Glen Wright",           type: "Residential",                sites: 1,  spend: "$3,840",  last: "Storm callout · 12 Apr",   tags: ["Card on file"],         hot: true  },
    { name: "M. Whitaker",           type: "Residential · heritage",     sites: 1,  spend: "$8,400",  last: "Site assessment · 10 Apr", tags: ["Heritage permit"],     hot: false },
    { name: "Heritage Park HOA",     type: "HOA · 42 trees",             sites: 1,  spend: "$11,600", last: "Stump grinding · 4 Apr",   tags: ["Annual contract"],      hot: false },
    { name: "Westbury Council",      type: "Local authority",             sites: 14, spend: "$28,400", last: "EWP day · 2 Apr",          tags: ["Net 60", "Tender"],     hot: false },
    { name: "Birchwood Estate Mgmt", type: "Strata · 96 units",          sites: 1,  spend: "$6,200",  last: "Crown lift · 28 Mar",      tags: ["Recurring"],            hot: false },
    { name: "D. Reyes",              type: "Residential",                sites: 1,  spend: "$0",      last: "Quote sent · 22 Apr",      tags: ["New"],                  hot: false },
    { name: "Forrest & Co. Cafés",   type: "Multi-site",                 sites: 5,  spend: "$4,100",  last: "Hedge trim · 18 Mar",      tags: ["Recurring"],            hot: false },
  ],
  jobs: {
    cols: [
      { k: "quoted", l: "Quoted", count: 3, items: [
        { ref: "TM-2041", t: "Spotted Gum prune",            c: "Glen Wright",     v: "$1,840", age: "2d" },
        { ref: "TM-2039", t: "Hedge trim · 5-site annual",   c: "Forrest & Co.",   v: "$4,200", age: "4d" },
        { ref: "TM-2037", t: "Heritage prune (AS 4373 7.2)", c: "M. Whitaker",     v: "$3,640", age: "5d" },
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
        { ref: "TM-2032", t: "Storm callout · branch failure", c: "Glen Wright",   v: "$980",   d: "Mon" },
        { ref: "TM-2031", t: "Hedge trim · annual",            c: "Crown Estates", v: "$1,420", d: "Last Fri" },
      ]},
    ],
  },
  quotes: [
    { ref: "TM-2041", client: "Glen Wright",          addr: "12 Riverbank Way",  work: "Spotted Gum · selective prune (AS 4373 7.2)",   value: "$1,840",  state: "Sent",                age: "2d",  accent: "sent" },
    { ref: "TM-2039", client: "Forrest & Co. Cafés",  addr: "5 sites · annual",   work: "Hedge trim contract · quarterly",               value: "$4,200",  state: "Sent",                age: "4d",  accent: "sent" },
    { ref: "TM-2037", client: "M. Whitaker",          addr: "14 Beech Rd",        work: "Heritage Eucalypt — prune (7.2) + crown lift",  value: "$3,640",  state: "Accepted",            age: "5d",  accent: "won"  },
    { ref: "TM-2033", client: "D. Reyes",             addr: "7 Maple Close",      work: "Site visit · two trees · removal quote",        value: "$2,200",  state: "Sent",                age: "6d",  accent: "sent" },
    { ref: "TM-2029", client: "Westbury Council",     addr: "Tender · 14 sites",  work: "Annual maintenance · EWP day rate",             value: "$28,400", state: "Tender · awaiting",   age: "12d", accent: "sent" },
    { ref: "TM-2024", client: "B. Holloway",          addr: "4 Oak Mews",         work: "Pollard · 2 limes",                              value: "$860",    state: "Declined",            age: "15d", accent: "lost" },
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
      ["Crew · 2 climbers · 5h", "$820"],
      ["EWP · 4h",                "$480"],
      ["Chipper hire · day",      "$220"],
      ["Tip + greenwaste",        "$120"],
      ["Permit liaison · council","$200"],
    ],
    total: "$1,840",
  },
  quoteDetailLabels: {
    species: "Species",
    dbhHeight: "DBH / Height",
    spread: "Spread",
    pruneCode: "AS 4373",
    hazards: "Hazards",
  },
  invoices: [
    { ref: "INV-1188", client: "Crown Estates",     value: "$1,420", state: "Paid",          daysOpen: 0,  paid: "14 Apr" },
    { ref: "INV-1187", client: "Glen Wright",        value: "$980",   state: "Paid",          daysOpen: 1,  paid: "13 Apr" },
    { ref: "INV-1186", client: "Heritage Park HOA",  value: "$3,200", state: "Sent",          daysOpen: 9,  paid: "—" },
    { ref: "INV-1185", client: "Westbury Council",   value: "$8,400", state: "Sent · Net 60", daysOpen: 18, paid: "—" },
    { ref: "INV-1184", client: "B. Holloway",        value: "$440",   state: "Overdue · 12d", daysOpen: 42, paid: "—" },
    { ref: "INV-1183", client: "Forrest & Co.",      value: "$980",   state: "Paid",          daysOpen: 2,  paid: "8 Apr" },
    { ref: "INV-1182", client: "Birchwood Mgmt",     value: "$2,640", state: "Paid",          daysOpen: 5,  paid: "4 Apr" },
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
      ["Avg job value",     "$1,840", "+12% vs Mar"],
      ["Quote → won",       "64%",    "+8%"],
      ["On-time arrival",   "94%",    "+2%"],
      ["Equipment hrs/job", "7.2",    "—"],
    ],
    leaderboard: [
      ["Jamie K.",        "Climber",    18, "$21,400"],
      ["Tom B.",          "Groundie",   22, "$18,800"],
      ["Pete R.",         "Hedge crew", 14, "$11,600"],
      ["Self · quoting",  "—",           9, "$14,200"],
    ],
  },
};

/* ------------------- PESTMATE — pest control (BPCA-aware) ------------------- */
export const PEST_DATA: DashboardData = {
  schedule: {
    weekLabel: "Mon 27 Apr — Sun 03 May 2026",
    days: [
      { d: "Mon", n: 27, jobs: [
        { t: "08:30", c: "Quarterly · Crown Bakery",       client: "Crown Foods Ltd",    crew: "Tech 1 · Sam", tag: "Recurring" },
        { t: "11:00", c: "Bait point check · 14 sites",    client: "Westside Estates",   crew: "Tech 1",       tag: "Recurring" },
        { t: "14:30", c: "Wasp nest treatment",             client: "M. Patel",           crew: "Tech 2 · Dean",tag: "Callout" },
      ]},
      { d: "Tue", n: 28, jobs: [
        { t: "07:00", c: "Pre-open inspection · Forrest Café", client: "Forrest & Co.",  crew: "Tech 1",       tag: "Confirmed" },
        { t: "10:00", c: "Rodent infestation · warehouse",     client: "Halton Logistics",crew: "Tech 2",       tag: "Initial" },
      ]},
      { d: "Wed", n: 29, jobs: [
        { t: "09:00", c: "Annual service · Birchwood Estate", client: "Birchwood Mgmt", crew: "Tech 1+2", tag: "Recurring" },
        { t: "15:00", c: "Bird-proofing survey",              client: "Westbury Council", crew: "Self",   tag: "Quote visit" },
      ]},
      { d: "Thu", n: 30, jobs: [
        { t: "08:00", c: "Bait refresh · 22 stations", client: "Crown Foods Ltd", crew: "Tech 1", tag: "Recurring" },
      ]},
      { d: "Fri", n: 1, jobs: [
        { t: "07:30", c: "Cockroach treatment · kitchen", client: "The Old Ship Inn", crew: "Tech 2", tag: "Follow-up" },
        { t: "13:00", c: "Quarterly · 8 office blocks",    client: "Crown Estates",    crew: "Tech 1", tag: "Recurring" },
      ]},
      { d: "Sat", n: 2, jobs: [
        { t: "09:00", c: "Emergency · wasps in roof", client: "L. Khan", crew: "Tech 1", tag: "Emergency" },
      ]},
      { d: "Sun", n: 3, jobs: [] },
    ],
    today: [
      { t: "07:00", c: "Pre-open inspection",     loc: "Forrest Café · Tech 1",            state: "In progress" },
      { t: "10:00", c: "Rodent infestation initial", loc: "Halton Logistics · warehouse",  state: "Scheduled" },
      { t: "15:30", c: "Bait point follow-up",    loc: "Crown Foods · Bay 4",              state: "Scheduled" },
    ],
  },
  clients: [
    { name: "Crown Foods Ltd",       type: "Food production · 4 sites",     sites: 4,  spend: "$18,400", last: "Bait check · 22 Apr",   tags: ["BRCGS", "Recurring"],     hot: true  },
    { name: "Westside Estates",      type: "Property mgmt · 14 buildings",  sites: 14, spend: "$11,200", last: "Quarterly · 18 Apr",    tags: ["Net 30", "Recurring"],    hot: true  },
    { name: "Halton Logistics",      type: "Warehouse · pallet store",      sites: 1,  spend: "$4,200",  last: "Initial visit · 14 Apr",tags: ["New", "Initial"],          hot: true  },
    { name: "Forrest & Co. Cafés",   type: "Hospitality · 5 cafés",         sites: 5,  spend: "$3,600",  last: "Pre-open · 12 Apr",     tags: ["Food Safety Act", "Recurring"], hot: false },
    { name: "The Old Ship Inn",      type: "Hospitality",                    sites: 1,  spend: "$2,840",  last: "Cockroach Tx · 10 Apr", tags: ["Follow-up"],               hot: false },
    { name: "Westbury Council",      type: "Local authority",                sites: 12, spend: "$14,200", last: "Bird survey · 8 Apr",   tags: ["Net 60", "Tender"],        hot: false },
    { name: "Birchwood Estate Mgmt", type: "Strata · 96 units",             sites: 1,  spend: "$3,200",  last: "Annual · 4 Apr",        tags: ["Recurring"],               hot: false },
    { name: "M. Patel",              type: "Residential",                    sites: 1,  spend: "$180",    last: "Wasp Tx · today",       tags: ["Card on file"],            hot: false },
  ],
  jobs: {
    cols: [
      { k: "quoted", l: "Quoted", count: 3, items: [
        { ref: "PM-3041", t: "Bird-proofing · 4 buildings", c: "Westbury Council", v: "$8,400",  age: "2d" },
        { ref: "PM-3039", t: "Annual contract · 8 sites",   c: "Crown Estates",    v: "$11,200", age: "4d" },
        { ref: "PM-3037", t: "Initial rodent treatment",    c: "Halton Logistics", v: "$840",    age: "5d" },
      ]},
      { k: "sched", l: "Scheduled", count: 6, items: [
        { ref: "PM-3042", t: "Quarterly visit",                c: "Crown Bakery",        d: "Mon 08:30", crew: "Tech 1" },
        { ref: "PM-3040", t: "Bait point check · 14 sites",    c: "Westside Estates",    d: "Mon 11:00", crew: "Tech 1" },
        { ref: "PM-3038", t: "Pre-open inspection",            c: "Forrest Café",        d: "Tue 07:00", crew: "Tech 1" },
        { ref: "PM-3036", t: "Annual service",                  c: "Birchwood Mgmt",      d: "Wed 09:00", crew: "Tech 1+2" },
        { ref: "PM-3035", t: "Bait refresh · 22 stations",      c: "Crown Foods",         d: "Thu 08:00", crew: "Tech 1" },
        { ref: "PM-3034", t: "Quarterly · 8 office blocks",     c: "Crown Estates",       d: "Fri 13:00", crew: "Tech 1" },
      ]},
      { k: "progress", l: "In progress", count: 1, items: [
        { ref: "PM-3033", t: "Pre-open inspection", c: "Forrest Café", hours: "1.2h on-site", crew: "Tech 1 · Sam" },
      ]},
      { k: "done", l: "Done · awaiting invoice", count: 2, items: [
        { ref: "PM-3031", t: "Wasp nest treatment",  c: "M. Patel",         v: "$180", d: "Today" },
        { ref: "PM-3030", t: "Cockroach Tx · kitchen", c: "The Old Ship Inn", v: "$420", d: "Last Fri" },
      ]},
    ],
  },
  quotes: [
    { ref: "PM-3041", client: "Westbury Council",  addr: "Tender · 4 buildings", work: "Pigeon-proofing · netting + spike installation", value: "$8,400",  state: "Tender · awaiting", age: "2d",  accent: "sent" },
    { ref: "PM-3039", client: "Crown Estates",     addr: "8 office blocks",       work: "Annual pest contract · quarterly visits",         value: "$11,200", state: "Sent",              age: "4d",  accent: "sent" },
    { ref: "PM-3037", client: "Halton Logistics",  addr: "Pallet store · Bay 4",  work: "Initial rodent treatment · 12 stations + monitoring", value: "$840", state: "Accepted",      age: "5d",  accent: "won"  },
    { ref: "PM-3033", client: "Forrest & Co.",     addr: "5 cafés · annual",      work: "Pre-open inspections · monthly visits per café",  value: "$4,800",  state: "Sent",              age: "6d",  accent: "sent" },
    { ref: "PM-3029", client: "Birchwood Mgmt",    addr: "96 units · communal",   work: "Annual rodent + insect contract",                  value: "$3,400",  state: "Sent",              age: "12d", accent: "sent" },
    { ref: "PM-3024", client: "B. Holloway",       addr: "4 Oak Mews",            work: "One-off wasp nest",                                value: "$180",    state: "Declined",          age: "15d", accent: "lost" },
  ],
  quoteDetail: {
    ref: "PM-3037", client: "Halton Logistics",
    site: "Pallet store · Bay 4 · access via Goods-In",
    species: "Rattus norvegicus (Brown rat)",
    dbh: "12 droppings/m²", height: "Wall-base activity", spread: "Bays 3–5",
    hazards: ["Live forklift route", "Food-handling adjacent", "BRCGS audit due"],
    pruneCode: "CRRU UK · permanent baiting refused (food site) — monitor + trap",
    lineItems: [
      ["Initial site survey · 1.5h",                    "$140"],
      ["12 tamper-resistant stations + GPS map",        "$280"],
      ["Snap-trap deployment · non-tox",                "$160"],
      ["HSE-numbered rodenticide (perimeter)",          "$140"],
      ["Follow-up visit · 2 weeks",                     "$120"],
    ],
    total: "$840",
  },
  quoteDetailLabels: {
    species:  "Target species",
    dbhHeight:"Activity · Location",
    spread:   "Coverage",
    pruneCode:"CRRU code",
    hazards:  "Hazards",
  },
  invoices: [
    { ref: "INV-1188", client: "Crown Foods Ltd",     value: "$1,840", state: "Paid",          daysOpen: 0,  paid: "14 Apr" },
    { ref: "INV-1187", client: "Westside Estates",     value: "$980",   state: "Paid",          daysOpen: 1,  paid: "13 Apr" },
    { ref: "INV-1186", client: "Forrest & Co.",        value: "$420",   state: "Sent",          daysOpen: 9,  paid: "—" },
    { ref: "INV-1185", client: "Westbury Council",     value: "$3,200", state: "Sent · Net 60", daysOpen: 18, paid: "—" },
    { ref: "INV-1184", client: "B. Holloway",          value: "$180",   state: "Overdue · 12d", daysOpen: 42, paid: "—" },
    { ref: "INV-1183", client: "The Old Ship Inn",     value: "$420",   state: "Paid",          daysOpen: 2,  paid: "8 Apr" },
    { ref: "INV-1182", client: "Birchwood Mgmt",       value: "$1,840", state: "Paid",          daysOpen: 5,  paid: "4 Apr" },
  ],
  analytics: {
    revenueMonths: [6200, 7800, 7400, 9400, 11200, 12640],
    revenueLabels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
    breakdown: [
      ["Recurring contracts", 48, "#16a34a"],
      ["Initial treatments",  18, "#22c55e"],
      ["Bait point service",  14, "#65a30d"],
      ["Bird-proofing",       10, "#84cc16"],
      ["Wasp / hornets",       6, "#a3e635"],
      ["Other",                4, "#bef264"],
    ],
    kpis: [
      ["Avg job value",       "$420", "+8% vs Mar"],
      ["Quote → won",         "71%",  "+6%"],
      ["On-time arrival",     "96%",  "+1%"],
      ["Bait stations live",  "284",  "+12"],
    ],
    leaderboard: [
      ["Sam K.",         "Tech 1 · BPCA", 38, "$18,400"],
      ["Dean B.",         "Tech 2 · BPCA", 34, "$14,200"],
      ["Pete R.",         "Tech 3 · trainee", 22, "$6,800"],
      ["Self · quoting",  "—",             14, "$11,200"],
    ],
  },
};

/* ------------------- FIREMATE — fire-door surveys (BS 8214 ready) ------------------- */
export const FIRE_DATA: DashboardData = {
  schedule: {
    weekLabel: "Mon 27 Apr — Sun 03 May 2026",
    days: [
      { d: "Mon", n: 27, jobs: [
        { t: "09:00", c: "Cromwell House · 84 doors", client: "Cromwell HA", crew: "Self · A. Reid", tag: "Survey day" },
      ]},
      { d: "Tue", n: 28, jobs: [
        { t: "08:00", c: "Cromwell House · day 2 (cont.)", client: "Cromwell HA", crew: "Self", tag: "Survey day" },
        { t: "14:30", c: "Sign-off mtg · RP",               client: "Cromwell HA", crew: "Self", tag: "Sign-off" },
      ]},
      { d: "Wed", n: 29, jobs: [
        { t: "09:00", c: "St Anne's Primary · 32 doors", client: "Westbury Schools", crew: "Self", tag: "Survey day" },
        { t: "14:00", c: "Re-inspection · 6 fails",      client: "The Manse Tower",  crew: "Self", tag: "Re-inspect" },
      ]},
      { d: "Thu", n: 30, jobs: [
        { t: "08:30", c: "Aldermarsh House · 122 doors (day 1/2)", client: "LB Hartcliffe", crew: "Self + Mate", tag: "Survey day" },
      ]},
      { d: "Fri", n: 1, jobs: [
        { t: "08:30", c: "Aldermarsh House · day 2/2",     client: "LB Hartcliffe", crew: "Self + Mate", tag: "Survey day" },
        { t: "15:30", c: "Tribunal-pack delivery · RP",     client: "LB Hartcliffe", crew: "Self",       tag: "Handover" },
      ]},
      { d: "Sat", n: 2, jobs: [] },
      { d: "Sun", n: 3, jobs: [] },
    ],
    today: [
      { t: "08:00", c: "Cromwell House · day 2", loc: "84 doors total · 41 done",         state: "In progress" },
      { t: "14:30", c: "Sign-off meeting",        loc: "RP · M. Carter · on-site",         state: "Scheduled" },
      { t: "17:00", c: "Email PDF · register-of-record", loc: "M. Carter + Cromwell HA admin", state: "Scheduled" },
    ],
  },
  clients: [
    { name: "Cromwell HA",            type: "Housing assoc · 412 doors",   sites: 5,  spend: "$18,400", last: "Survey · today",       tags: ["RRO 2005", "Annual"],  hot: true  },
    { name: "LB Hartcliffe",          type: "Local authority · 1,240 doors", sites: 14, spend: "$28,800", last: "Tribunal pack · 22 Apr", tags: ["Net 60", "Tender"],  hot: true  },
    { name: "The Manse Tower",        type: "Residential block · 24 storey", sites: 1,  spend: "$11,400", last: "Re-inspection · today", tags: ["Post-Grenfell", "Annual"], hot: true },
    { name: "Westbury Schools Trust", type: "Multi-academy · 8 schools",   sites: 8,  spend: "$14,200", last: "Survey · 18 Apr",      tags: ["DfE", "Recurring"],   hot: false },
    { name: "Crown Estates",          type: "Commercial · 8 office blocks", sites: 8,  spend: "$9,600",  last: "Survey · 14 Apr",      tags: ["Net 30"],              hot: false },
    { name: "Heritage Park HOA",      type: "Strata · 96 units",            sites: 1,  spend: "$4,800",  last: "Annual · 4 Apr",       tags: ["Annual"],              hot: false },
    { name: "Birchwood Estate Mgmt",  type: "Strata · 240 units",            sites: 1,  spend: "$6,200",  last: "Survey · 28 Mar",      tags: ["Recurring"],           hot: false },
    { name: "D. Reyes (RP)",          type: "Single building · 18 doors",   sites: 1,  spend: "$480",    last: "Quote sent · 22 Apr",  tags: ["New"],                  hot: false },
  ],
  jobs: {
    cols: [
      { k: "quoted", l: "Quoted", count: 3, items: [
        { ref: "FM-4041", t: "Annual survey · 96 units",  c: "Heritage Park HOA", v: "$4,800",  age: "2d" },
        { ref: "FM-4039", t: "Re-inspection programme",   c: "Cromwell HA",       v: "$8,400",  age: "4d" },
        { ref: "FM-4037", t: "Initial register · 18 doors", c: "D. Reyes",        v: "$480",    age: "5d" },
      ]},
      { k: "sched", l: "Scheduled", count: 5, items: [
        { ref: "FM-4042", t: "Cromwell House · 84 doors",      c: "Cromwell HA",         d: "Mon 09:00", crew: "Self" },
        { ref: "FM-4040", t: "St Anne's Primary · 32 doors",    c: "Westbury Schools",    d: "Wed 09:00", crew: "Self" },
        { ref: "FM-4038", t: "Re-inspection · 6 fails",         c: "The Manse Tower",     d: "Wed 14:00", crew: "Self" },
        { ref: "FM-4036", t: "Aldermarsh House · 122 doors",    c: "LB Hartcliffe",       d: "Thu–Fri",   crew: "Self+Mate" },
        { ref: "FM-4035", t: "Tribunal-pack delivery",          c: "LB Hartcliffe",       d: "Fri 15:30", crew: "Self" },
      ]},
      { k: "progress", l: "In progress", count: 1, items: [
        { ref: "FM-4034", t: "Cromwell House · 84 doors", c: "Cromwell HA", hours: "41 / 84 doors", crew: "Self · day 2" },
      ]},
      { k: "done", l: "Done · awaiting invoice", count: 2, items: [
        { ref: "FM-4032", t: "8 office blocks · annual", c: "Crown Estates",   v: "$9,600", d: "Last week" },
        { ref: "FM-4031", t: "Birchwood · 240 units",     c: "Birchwood Mgmt", v: "$6,200", d: "2 weeks" },
      ]},
    ],
  },
  quotes: [
    { ref: "FM-4041", client: "Heritage Park HOA",      addr: "96 units · communal doors", work: "Annual register-of-record + 71-pt survey", value: "$4,800",  state: "Sent",              age: "2d",  accent: "sent" },
    { ref: "FM-4039", client: "Cromwell HA",             addr: "5 buildings · 412 doors",   work: "Re-inspection programme · 6-month cycle",   value: "$8,400",  state: "Sent",              age: "4d",  accent: "sent" },
    { ref: "FM-4037", client: "D. Reyes (RP)",           addr: "7 Maple Close · 18 doors",  work: "Initial register + 71-pt survey",            value: "$480",    state: "Accepted",          age: "5d",  accent: "won"  },
    { ref: "FM-4033", client: "Westbury Schools Trust",  addr: "8 schools · 380 doors",     work: "Annual contract · all premises",             value: "$14,200", state: "Sent",              age: "6d",  accent: "sent" },
    { ref: "FM-4029", client: "LB Hartcliffe",           addr: "Tender · 14 buildings",     work: "Annual programme · 1,240 doors",             value: "$28,800", state: "Tender · awaiting", age: "12d", accent: "sent" },
    { ref: "FM-4024", client: "B. Holloway",             addr: "4 Oak Mews · 6 doors",      work: "One-off survey",                              value: "$240",    state: "Declined",          age: "15d", accent: "lost" },
  ],
  quoteDetail: {
    ref: "FM-4037", client: "D. Reyes (RP)",
    site: "7 Maple Close · 18 doors · 4 storeys",
    species: "FD30 / FD60 mixed · timber + steel",
    dbh: "18 doors", height: "4 storeys", spread: "Communal corridors",
    hazards: ["Pre-1990 hardware on 4 doors", "Closer modifications visible", "Two doors painted shut"],
    pruneCode: "BS 8214:2016 · 71-point per door · dual sign-off required",
    lineItems: [
      ["Initial site visit · register build",       "$80"],
      ["71-pt inspection · 18 doors @ $20",          "$360"],
      ["Photo evidence · all fails",                  "—"],
      ["Branded register-of-record PDF",              "—"],
      ["5-year tribunal-ready audit retention",       "—"],
    ],
    total: "$480",
  },
  quoteDetailLabels: {
    species:  "Door type",
    dbhHeight:"Doors / Storeys",
    spread:   "Coverage",
    pruneCode:"BS 8214 spec",
    hazards:  "Defects flagged",
  },
  invoices: [
    { ref: "INV-2188", client: "Crown Estates",       value: "$9,600",  state: "Paid",          daysOpen: 0,  paid: "14 Apr" },
    { ref: "INV-2187", client: "Heritage Park HOA",    value: "$4,800",  state: "Paid",          daysOpen: 1,  paid: "13 Apr" },
    { ref: "INV-2186", client: "Westbury Schools",     value: "$3,200",  state: "Sent",          daysOpen: 9,  paid: "—" },
    { ref: "INV-2185", client: "LB Hartcliffe",        value: "$14,400", state: "Sent · Net 60", daysOpen: 18, paid: "—" },
    { ref: "INV-2184", client: "B. Holloway",          value: "$240",    state: "Overdue · 12d", daysOpen: 42, paid: "—" },
    { ref: "INV-2183", client: "Birchwood Mgmt",       value: "$6,200",  state: "Paid",          daysOpen: 2,  paid: "8 Apr" },
    { ref: "INV-2182", client: "D. Reyes",              value: "$480",    state: "Paid",          daysOpen: 5,  paid: "4 Apr" },
  ],
  analytics: {
    revenueMonths: [8400, 11200, 9800, 14200, 16800, 19400],
    revenueLabels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
    breakdown: [
      ["Annual surveys",     52, "#dc2626"],
      ["Re-inspections",     18, "#ef4444"],
      ["Initial registers",  14, "#f87171"],
      ["Tribunal packs",      8, "#fca5a5"],
      ["Consultancy",         5, "#fecaca"],
      ["Other",               3, "#fee2e2"],
    ],
    kpis: [
      ["Doors surveyed (Apr)", "684", "+12% vs Mar"],
      ["Avg compliance %",     "89%", "+3pp"],
      ["Quote → won",          "58%", "+4%"],
      ["Re-inspect rate",      "11%", "-2pp"],
    ],
    leaderboard: [
      ["Self · A. Reid",  "Lead assessor",  412, "$18,400"],
      ["Mate · J. Doyle", "Assistant",      184, "$6,200"],
      ["Sub · Hartfield Co", "Subcontract",  88, "$3,400"],
    ],
  },
};

/* ------------------- HYGIENEMATE — deep-clean (BICSc-aware) ------------------- */
export const HYG_DATA: DashboardData = {
  schedule: {
    weekLabel: "Mon 27 Apr — Sun 03 May 2026",
    days: [
      { d: "Mon", n: 27, jobs: [
        { t: "22:00", c: "Kitchen extraction · The Old Ship", client: "The Old Ship Inn", crew: "Crew A · 3 BICSc", tag: "Overnight" },
      ]},
      { d: "Tue", n: 28, jobs: [
        { t: "06:00", c: "Washroom service · 8 sites", client: "Crown Estates",       crew: "Crew B · Pete", tag: "Recurring" },
        { t: "14:00", c: "Fogging · post-outbreak",      client: "St Anne's Primary",   crew: "Crew A · Mia", tag: "Reactive" },
      ]},
      { d: "Wed", n: 29, jobs: [
        { t: "07:00", c: "Quarterly deep-clean · café", client: "Forrest & Co.",      crew: "Crew A · 2", tag: "Recurring" },
        { t: "13:00", c: "Carpet shampoo · office",      client: "Halton Logistics",   crew: "Crew B",     tag: "One-off" },
      ]},
      { d: "Thu", n: 30, jobs: [
        { t: "22:00", c: "Kitchen extraction · 2nd cafe", client: "Forrest & Co.", crew: "Crew A · 3", tag: "Overnight" },
      ]},
      { d: "Fri", n: 1, jobs: [
        { t: "06:00", c: "Washroom service · 8 sites", client: "Crown Estates",   crew: "Crew B", tag: "Recurring" },
        { t: "09:00", c: "BICSc audit walk-through",    client: "Crown Foods Ltd", crew: "Self",   tag: "Audit prep" },
      ]},
      { d: "Sat", n: 2, jobs: [] },
      { d: "Sun", n: 3, jobs: [] },
    ],
    today: [
      { t: "06:00", c: "Washroom service round",  loc: "8 office blocks · Crown Estates",      state: "In progress" },
      { t: "14:00", c: "Fogging · post-outbreak", loc: "St Anne's Primary · 4 classrooms",     state: "Scheduled" },
      { t: "19:00", c: "Send PDFs · same-day",     loc: "4 reports queued",                     state: "Scheduled" },
    ],
  },
  clients: [
    { name: "Forrest & Co. Cafés",  type: "Hospitality · 5 cafés",          sites: 5, spend: "$18,400", last: "Quarterly · 22 Apr", tags: ["FSA", "Recurring"],     hot: true  },
    { name: "Crown Estates",         type: "Commercial · 8 office blocks",   sites: 8, spend: "$24,200", last: "Washroom · today",   tags: ["Recurring", "Net 30"],   hot: true  },
    { name: "The Old Ship Inn",      type: "Pub · kitchen + bar",            sites: 1, spend: "$3,400",  last: "Extraction · today",  tags: ["TR/19", "Quarterly"],    hot: false },
    { name: "St Anne's Primary",     type: "School",                          sites: 1, spend: "$2,840",  last: "Fogging · today",     tags: ["DfE", "Reactive"],       hot: true  },
    { name: "Crown Foods Ltd",       type: "Food production · 4 sites",      sites: 4, spend: "$14,200", last: "Audit prep · today",  tags: ["BRCGS", "Recurring"],    hot: false },
    { name: "Halton Logistics",      type: "Warehouse",                       sites: 1, spend: "$1,200",  last: "Carpets · today",     tags: ["One-off"],               hot: false },
    { name: "Westbury Council",      type: "Local authority",                 sites: 12, spend: "$11,200", last: "Toilets · 4 Apr",     tags: ["Net 60", "Tender"],      hot: false },
    { name: "Birchwood Estate Mgmt", type: "Strata · 96 units",              sites: 1, spend: "$3,800",  last: "Communal · 28 Mar",   tags: ["Recurring"],             hot: false },
  ],
  jobs: {
    cols: [
      { k: "quoted", l: "Quoted", count: 3, items: [
        { ref: "HM-5041", t: "Carpet shampoo · 4 floors",         c: "Halton Logistics", v: "$1,200", age: "2d" },
        { ref: "HM-5039", t: "BRCGS audit-prep deep-clean",        c: "Crown Foods Ltd",  v: "$3,400", age: "4d" },
        { ref: "HM-5037", t: "Reactive fogging · classrooms",      c: "St Anne's Primary", v: "$840",  age: "5d" },
      ]},
      { k: "sched", l: "Scheduled", count: 5, items: [
        { ref: "HM-5042", t: "Kitchen extraction · TR/19",   c: "The Old Ship Inn", d: "Mon 22:00", crew: "Crew A · 3" },
        { ref: "HM-5040", t: "Washroom service · 8 sites",    c: "Crown Estates",     d: "Tue 06:00", crew: "Crew B" },
        { ref: "HM-5038", t: "Fogging post-outbreak",          c: "St Anne's Primary", d: "Tue 14:00", crew: "Crew A" },
        { ref: "HM-5036", t: "Quarterly deep-clean",           c: "Forrest Café",      d: "Wed 07:00", crew: "Crew A · 2" },
        { ref: "HM-5035", t: "Kitchen extraction · 2nd café",  c: "Forrest & Co.",     d: "Thu 22:00", crew: "Crew A · 3" },
      ]},
      { k: "progress", l: "In progress", count: 1, items: [
        { ref: "HM-5034", t: "Washroom service round", c: "Crown Estates", hours: "5 / 8 sites", crew: "Crew B · Pete" },
      ]},
      { k: "done", l: "Done · awaiting invoice", count: 2, items: [
        { ref: "HM-5032", t: "Carpet shampoo · office", c: "Halton Logistics",   v: "$1,200", d: "Today" },
        { ref: "HM-5031", t: "Communal · 96 units",     c: "Birchwood Mgmt",     v: "$3,800", d: "2 weeks" },
      ]},
    ],
  },
  quotes: [
    { ref: "HM-5041", client: "Halton Logistics",     addr: "Pallet store · 4 floors", work: "Carpet shampoo + sanitisation · post-renovation", value: "$1,200",  state: "Sent",              age: "2d",  accent: "sent" },
    { ref: "HM-5039", client: "Crown Foods Ltd",      addr: "4 sites · BRCGS audit",   work: "Pre-audit deep-clean · 4 production lines",       value: "$3,400",  state: "Accepted",          age: "4d",  accent: "won"  },
    { ref: "HM-5037", client: "St Anne's Primary",    addr: "4 classrooms",            work: "Reactive fogging · norovirus protocol",            value: "$840",    state: "Sent",              age: "5d",  accent: "sent" },
    { ref: "HM-5033", client: "Forrest & Co.",        addr: "5 cafés · annual",         work: "Quarterly deep-clean + extraction",                value: "$14,200", state: "Sent",              age: "6d",  accent: "sent" },
    { ref: "HM-5029", client: "Westbury Council",     addr: "Tender · 12 buildings",   work: "Annual washroom contract",                          value: "$28,800", state: "Tender · awaiting", age: "12d", accent: "sent" },
    { ref: "HM-5024", client: "B. Holloway",          addr: "4 Oak Mews",              work: "One-off oven clean",                                value: "$140",    state: "Declined",          age: "15d", accent: "lost" },
  ],
  quoteDetail: {
    ref: "HM-5039", client: "Crown Foods Ltd",
    site: "4 production sites · pre-BRCGS audit",
    species: "Food-safe sanitisation · CIP + ATP swab",
    dbh: "4 sites", height: "24h turnaround", spread: "Production lines + ancillary",
    hazards: ["Allergen control on Lines 2 & 3", "BRCGS audit · 12 May", "Out-of-hours only"],
    pruneCode: "BICSc-aligned · ATP < 30 RLU per swab post-clean",
    lineItems: [
      ["Crew · 4 BICSc · 8h × 4 sites",                "$2,200"],
      ["Food-safe sanitiser (HSE batch logged)",       "$420"],
      ["ATP swab kits · 80 swabs",                     "$280"],
      ["Photo evidence + chemical log PDF",            "—"],
      ["Same-day branded report to QA",                "—"],
    ],
    total: "$3,400",
  },
  quoteDetailLabels: {
    species:  "Service type",
    dbhHeight:"Sites / Turnaround",
    spread:   "Coverage",
    pruneCode:"BICSc spec",
    hazards:  "Constraints",
  },
  invoices: [
    { ref: "INV-3188", client: "Forrest & Co.",      value: "$3,400", state: "Paid",          daysOpen: 0,  paid: "14 Apr" },
    { ref: "INV-3187", client: "Crown Estates",       value: "$2,200", state: "Paid",          daysOpen: 1,  paid: "13 Apr" },
    { ref: "INV-3186", client: "Crown Foods Ltd",     value: "$3,400", state: "Sent",          daysOpen: 9,  paid: "—" },
    { ref: "INV-3185", client: "Westbury Council",    value: "$4,200", state: "Sent · Net 60", daysOpen: 18, paid: "—" },
    { ref: "INV-3184", client: "B. Holloway",         value: "$140",   state: "Overdue · 12d", daysOpen: 42, paid: "—" },
    { ref: "INV-3183", client: "The Old Ship Inn",    value: "$840",   state: "Paid",          daysOpen: 2,  paid: "8 Apr" },
    { ref: "INV-3182", client: "Birchwood Mgmt",      value: "$3,800", state: "Paid",          daysOpen: 5,  paid: "4 Apr" },
  ],
  analytics: {
    revenueMonths: [7800, 9200, 8400, 11400, 13800, 15240],
    revenueLabels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
    breakdown: [
      ["Washroom service",     32, "#0891b2"],
      ["Kitchen extraction",   24, "#06b6d4"],
      ["Deep-clean recurring", 22, "#22d3ee"],
      ["Reactive / fogging",   12, "#67e8f9"],
      ["Carpets / one-off",     6, "#a5f3fc"],
      ["Other",                 4, "#cffafe"],
    ],
    kpis: [
      ["Avg job value",       "$420", "+6% vs Mar"],
      ["Quote → won",         "62%",  "+4%"],
      ["Same-day PDF rate",   "98%",  "+2pp"],
      ["Chemicals logged",    "384",  "+22"],
    ],
    leaderboard: [
      ["Mia C.",         "Crew A · BICSc", 28, "$14,200"],
      ["Pete R.",         "Crew B · BICSc", 32, "$11,800"],
      ["Liam D.",         "Crew A trainee", 18, "$4,200"],
      ["Self · quoting",  "—",              11, "$8,400"],
    ],
  },
};

/* ------------------- LOCKSMITHMATE — mobile locksmiths (MLA-aware) ------------------- */
export const LOCK_DATA: DashboardData = {
  schedule: {
    weekLabel: "Mon 27 Apr — Sun 03 May 2026",
    days: [
      { d: "Mon", n: 27, jobs: [
        { t: "07:30", c: "Lockout · 12 Birch Rd",       client: "M. Chen",         crew: "Self · van 1", tag: "Emergency" },
        { t: "09:30", c: "BS 3621 swap × 4",             client: "Birchwood Mgmt", crew: "Self",          tag: "Bulk" },
        { t: "14:00", c: "Smart-lock fit",                client: "D. Reyes",       crew: "Self",          tag: "Booked" },
      ]},
      { d: "Tue", n: 28, jobs: [
        { t: "08:00", c: "UPVC re-key · 6 doors",        client: "Crown Estates",   crew: "Self",         tag: "Bulk" },
        { t: "11:30", c: "Lockout · office",              client: "Halton Logistics", crew: "Self",       tag: "Emergency" },
        { t: "15:00", c: "Anti-snap upgrade × 3",         client: "L. Khan",          crew: "Self",       tag: "Booked" },
      ]},
      { d: "Wed", n: 29, jobs: [
        { t: "09:00", c: "Tenancy turnover · 8 doors", client: "Westside Estates", crew: "Self", tag: "Landlord pkg" },
      ]},
      { d: "Thu", n: 30, jobs: [
        { t: "08:00", c: "Master key system · office", client: "Crown Estates", crew: "Self", tag: "Booked" },
        { t: "13:00", c: "Lockout · 7 Maple Cl",       client: "New caller",    crew: "Self", tag: "Emergency" },
      ]},
      { d: "Fri", n: 1, jobs: [
        { t: "07:00", c: "Bulk re-key · 22 doors", client: "Cromwell HA", crew: "Self+Mate", tag: "Bulk" },
      ]},
      { d: "Sat", n: 2, jobs: [
        { t: "10:00", c: "On-call · emergency only", client: "—", crew: "Self", tag: "On-call" },
      ]},
      { d: "Sun", n: 3, jobs: [] },
    ],
    today: [
      { t: "08:00", c: "UPVC re-key · 6 doors",       loc: "Crown Estates · Block C",          state: "In progress" },
      { t: "11:30", c: "Lockout · office",             loc: "Halton Logistics · main door",     state: "Scheduled · ETA 22min" },
      { t: "15:00", c: "Anti-snap upgrade × 3",        loc: "L. Khan · 14 Beech Rd",            state: "Scheduled" },
    ],
  },
  clients: [
    { name: "Crown Estates",         type: "Commercial · 8 buildings",   sites: 8, spend: "$12,400", last: "Master key · 22 Apr", tags: ["Net 30", "Recurring"],   hot: true  },
    { name: "Westside Estates",       type: "Letting agent · 240 units", sites: 1, spend: "$18,800", last: "Turnover · today",     tags: ["Landlord pkg", "Bulk"], hot: true  },
    { name: "Cromwell HA",            type: "Housing assoc · 412 doors", sites: 5, spend: "$8,400",  last: "Bulk re-key · today",   tags: ["Bulk", "Net 30"],       hot: true  },
    { name: "Birchwood Estate Mgmt",  type: "Strata · 96 units",          sites: 1, spend: "$3,200",  last: "Communal · today",      tags: ["Recurring"],            hot: false },
    { name: "Halton Logistics",       type: "Warehouse",                   sites: 1, spend: "$1,400",  last: "Lockout · today",       tags: ["Card on file"],         hot: false },
    { name: "D. Reyes",               type: "Residential",                 sites: 1, spend: "$280",    last: "Smart-lock · today",    tags: ["Card on file", "New"], hot: false },
    { name: "M. Chen",                type: "Residential",                 sites: 1, spend: "$180",    last: "Lockout · today",       tags: ["New"],                  hot: false },
    { name: "L. Khan",                type: "Residential",                 sites: 1, spend: "$420",    last: "Anti-snap · today",     tags: ["Card on file"],         hot: false },
  ],
  jobs: {
    cols: [
      { k: "quoted", l: "Quoted", count: 3, items: [
        { ref: "LM-6041", t: "Master key system · office",  c: "Crown Estates",     v: "$840",     age: "1d" },
        { ref: "LM-6039", t: "Tenancy turnover annual",      c: "Westside Estates",  v: "$18,800",  age: "3d" },
        { ref: "LM-6037", t: "Anti-snap × 3 + cylinders",     c: "L. Khan",           v: "$420",     age: "today" },
      ]},
      { k: "sched", l: "Scheduled", count: 6, items: [
        { ref: "LM-6042", t: "Lockout · 12 Birch Rd",       c: "M. Chen",         d: "Mon 07:30", crew: "Van 1" },
        { ref: "LM-6040", t: "BS 3621 swap × 4",              c: "Birchwood Mgmt", d: "Mon 09:30", crew: "Self" },
        { ref: "LM-6038", t: "Smart-lock fit",                  c: "D. Reyes",       d: "Mon 14:00", crew: "Self" },
        { ref: "LM-6036", t: "UPVC re-key × 6",                  c: "Crown Estates",  d: "Tue 08:00", crew: "Self" },
        { ref: "LM-6035", t: "Tenancy turnover · 8 doors",       c: "Westside Estates", d: "Wed 09:00", crew: "Self" },
        { ref: "LM-6034", t: "Bulk re-key · 22 doors",            c: "Cromwell HA",    d: "Fri 07:00", crew: "Self+Mate" },
      ]},
      { k: "progress", l: "In progress", count: 1, items: [
        { ref: "LM-6033", t: "UPVC re-key · 6 doors", c: "Crown Estates", hours: "4 / 6 done", crew: "Van 1 · ETA 1h" },
      ]},
      { k: "done", l: "Done · awaiting invoice", count: 2, items: [
        { ref: "LM-6031", t: "Lockout · 12 Birch Rd", c: "M. Chen",          v: "$180", d: "Today · paid" },
        { ref: "LM-6030", t: "BS 3621 swap × 4",       c: "Birchwood Mgmt",  v: "$640", d: "Today" },
      ]},
    ],
  },
  quotes: [
    { ref: "LM-6041", client: "Crown Estates",     addr: "Office HQ · 28 doors", work: "Master key suite · BS 3621 + restricted profile", value: "$840",    state: "Sent",              age: "1d",    accent: "sent" },
    { ref: "LM-6039", client: "Westside Estates",   addr: "240 units · annual",   work: "Tenancy turnover contract · 24h SLA",             value: "$18,800", state: "Accepted",          age: "3d",    accent: "won"  },
    { ref: "LM-6037", client: "L. Khan",            addr: "14 Beech Rd",           work: "Anti-snap upgrade · 3 cylinders",                 value: "$420",    state: "Sent",              age: "today", accent: "sent" },
    { ref: "LM-6033", client: "Cromwell HA",        addr: "5 buildings · 412 doors", work: "Annual lock maintenance contract",              value: "$8,400",  state: "Sent",              age: "6d",    accent: "sent" },
    { ref: "LM-6029", client: "LB Hartcliffe",      addr: "Tender · 14 buildings", work: "Annual access-control contract",                  value: "$24,200", state: "Tender · awaiting", age: "12d",   accent: "sent" },
    { ref: "LM-6024", client: "B. Holloway",        addr: "4 Oak Mews",             work: "Lockout (declined - DIY)",                       value: "$120",    state: "Declined",          age: "4d",    accent: "lost" },
  ],
  quoteDetail: {
    ref: "LM-6037", client: "L. Khan",
    site: "14 Beech Rd · 3 entry doors",
    species: "Euro-cylinder · BS 3621 / TS 007 3-star",
    dbh: "3 cylinders", height: "Insurance-grade", spread: "Front + back + side",
    hazards: ["Existing keys not all accounted for", "One door painted-shut hinge"],
    pruneCode: "BS 3621 + BS 8621 (escape) + TS 007 3* anti-snap",
    lineItems: [
      ["Site visit + measure · 30min",                "$40"],
      ["3× anti-snap cylinders (TS 007 3*)",           "$240"],
      ["Fitting · 3 cylinders · 1h",                    "$90"],
      ["New keys × 6",                                  "$30"],
      ["Pre-arrival photo + DBS card",                  "—"],
    ],
    total: "$420",
  },
  quoteDetailLabels: {
    species:  "Lock type",
    dbhHeight:"Count / Grade",
    spread:   "Coverage",
    pruneCode:"Standard",
    hazards:  "Site notes",
  },
  invoices: [
    { ref: "INV-4188", client: "Crown Estates",     value: "$840",   state: "Paid",          daysOpen: 0,  paid: "14 Apr" },
    { ref: "INV-4187", client: "Westside Estates",   value: "$2,400", state: "Paid",          daysOpen: 1,  paid: "13 Apr" },
    { ref: "INV-4186", client: "Cromwell HA",        value: "$1,840", state: "Sent",          daysOpen: 9,  paid: "—" },
    { ref: "INV-4185", client: "LB Hartcliffe",      value: "$3,200", state: "Sent · Net 60", daysOpen: 18, paid: "—" },
    { ref: "INV-4184", client: "B. Holloway",        value: "$120",   state: "Overdue · 12d", daysOpen: 42, paid: "—" },
    { ref: "INV-4183", client: "M. Chen",            value: "$180",   state: "Paid",          daysOpen: 0,  paid: "Today · card" },
    { ref: "INV-4182", client: "Birchwood Mgmt",     value: "$640",   state: "Paid",          daysOpen: 1,  paid: "Today" },
  ],
  analytics: {
    revenueMonths: [5800, 7400, 6800, 8400, 10800, 12440],
    revenueLabels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
    breakdown: [
      ["Tenancy turnover (bulk)", 38, "#d97706"],
      ["Lockouts (emergency)",    22, "#f59e0b"],
      ["Cylinder upgrades",        16, "#fbbf24"],
      ["Smart-lock installs",     10, "#fcd34d"],
      ["Master key suites",         8, "#fde68a"],
      ["Other",                     6, "#fef3c7"],
    ],
    kpis: [
      ["Avg job value",          "$280",  "+8% vs Mar"],
      ["Quote → won",            "78%",   "+6%"],
      ["Avg ETA · emergency",     "24min", "-3min"],
      ["Card-on-arrival rate",    "94%",   "+4pp"],
    ],
    leaderboard: [
      ["Self · A. Doyle", "Owner · MLA", 84, "$12,400"],
      ["Mate · J. Foster", "Subcontract", 28, "$3,800"],
    ],
  },
};

/* ------------------- POOLMATE — pool service (PWTAG-aware) ------------------- */
export const POOL_DATA: DashboardData = {
  schedule: {
    weekLabel: "Mon 27 Apr — Sun 03 May 2026",
    days: [
      { d: "Mon", n: 27, jobs: [
        { t: "08:00", c: "Weekly round · 6 pools", client: "WS1 · postcode round", crew: "Self · van", tag: "Recurring" },
        { t: "14:00", c: "Equipment swap · pump",   client: "Manor House Hotel",   crew: "Self",       tag: "Booked" },
      ]},
      { d: "Tue", n: 28, jobs: [
        { t: "07:30", c: "Weekly round · 8 pools", client: "WS2 · postcode round", crew: "Self", tag: "Recurring" },
      ]},
      { d: "Wed", n: 29, jobs: [
        { t: "09:00", c: "Green water recovery", client: "D. Reyes",         crew: "Self", tag: "Reactive" },
        { t: "14:00", c: "Quarterly · commercial", client: "Cromwell Leisure", crew: "Self", tag: "Recurring" },
      ]},
      { d: "Thu", n: 30, jobs: [
        { t: "07:30", c: "Weekly round · 7 pools", client: "WS3 · postcode round", crew: "Self", tag: "Recurring" },
      ]},
      { d: "Fri", n: 1, jobs: [
        { t: "08:00", c: "Heat-pump install",      client: "L. Khan",            crew: "Self+Sub", tag: "Booked" },
        { t: "14:00", c: "PWTAG audit support",    client: "Manor House Hotel", crew: "Self",     tag: "Audit prep" },
      ]},
      { d: "Sat", n: 2, jobs: [
        { t: "09:00", c: "Saturday round · 4 pools", client: "WS4 · weekend", crew: "Self", tag: "Recurring" },
      ]},
      { d: "Sun", n: 3, jobs: [] },
    ],
    today: [
      { t: "08:00", c: "Weekly round (6 of 6)",  loc: "WS1 postcode · van 1",       state: "In progress" },
      { t: "14:00", c: "Pump swap · Manor House", loc: "Hotel · plant room",         state: "Scheduled" },
      { t: "17:30", c: "Send PDFs · same-day",     loc: "6 service reports queued",   state: "Scheduled" },
    ],
  },
  clients: [
    { name: "Manor House Hotel",     type: "Commercial · 25m + spa",    sites: 2, spend: "$11,400", last: "Weekly · today",       tags: ["PWTAG", "HSG282"],     hot: true  },
    { name: "Cromwell Leisure",      type: "Leisure centre · 25m",       sites: 1, spend: "$8,800",  last: "Quarterly · today",   tags: ["PWTAG", "Recurring"], hot: true  },
    { name: "WS1 · postcode round",  type: "Residential · 6 pools",      sites: 6, spend: "$14,200", last: "Weekly · today",       tags: ["Recurring"],          hot: false },
    { name: "WS2 · postcode round",  type: "Residential · 8 pools",      sites: 8, spend: "$18,600", last: "Weekly · today",       tags: ["Recurring"],          hot: false },
    { name: "WS3 · postcode round",  type: "Residential · 7 pools",      sites: 7, spend: "$15,400", last: "Weekly · today",       tags: ["Recurring"],          hot: false },
    { name: "D. Reyes",              type: "Residential · 1 pool",        sites: 1, spend: "$420",    last: "Green water · today", tags: ["Reactive"],            hot: true  },
    { name: "L. Khan",               type: "Residential · 1 pool",        sites: 1, spend: "$3,400",  last: "Heat-pump · today",   tags: ["Booked"],              hot: false },
    { name: "Birchwood Estate Mgmt", type: "Strata · communal pool",     sites: 1, spend: "$4,200",  last: "Quarterly · 28 Mar",  tags: ["Recurring"],           hot: false },
  ],
  jobs: {
    cols: [
      { k: "quoted", l: "Quoted", count: 3, items: [
        { ref: "PoM-7041", t: "Heat-pump install",                c: "L. Khan",          v: "$3,400", age: "2d" },
        { ref: "PoM-7039", t: "Annual contract · 96 units pool",  c: "Birchwood Mgmt",  v: "$4,200", age: "4d" },
        { ref: "PoM-7037", t: "Green water recovery",              c: "D. Reyes",         v: "$420",   age: "today" },
      ]},
      { k: "sched", l: "Scheduled", count: 6, items: [
        { ref: "PoM-7042", t: "Weekly round · WS1 (6 pools)",  c: "Postcode round",      d: "Mon 08:00", crew: "Self" },
        { ref: "PoM-7040", t: "Pump swap",                      c: "Manor House Hotel",  d: "Mon 14:00", crew: "Self" },
        { ref: "PoM-7038", t: "Weekly round · WS2 (8 pools)",  c: "Postcode round",      d: "Tue 07:30", crew: "Self" },
        { ref: "PoM-7036", t: "Quarterly commercial",            c: "Cromwell Leisure",  d: "Wed 14:00", crew: "Self" },
        { ref: "PoM-7035", t: "Weekly round · WS3 (7 pools)",  c: "Postcode round",      d: "Thu 07:30", crew: "Self" },
        { ref: "PoM-7034", t: "PWTAG audit support",             c: "Manor House Hotel", d: "Fri 14:00", crew: "Self" },
      ]},
      { k: "progress", l: "In progress", count: 1, items: [
        { ref: "PoM-7033", t: "Weekly round · WS1", c: "Postcode round", hours: "5 / 6 pools", crew: "Self · van" },
      ]},
      { k: "done", l: "Done · awaiting invoice", count: 2, items: [
        { ref: "PoM-7031", t: "Green water recovery",   c: "D. Reyes",         v: "$420", d: "Today" },
        { ref: "PoM-7030", t: "Quarterly · communal", c: "Birchwood Mgmt",  v: "$820", d: "Last Fri" },
      ]},
    ],
  },
  quotes: [
    { ref: "PoM-7041", client: "L. Khan",            addr: "14 Beech Rd",           work: "Heat-pump install · 11kW · existing plumbing",  value: "$3,400",  state: "Sent",              age: "2d",    accent: "sent" },
    { ref: "PoM-7039", client: "Birchwood Mgmt",      addr: "Communal pool · 96 units", work: "Annual contract · weekly + chemicals",        value: "$4,200",  state: "Sent",              age: "4d",    accent: "sent" },
    { ref: "PoM-7037", client: "D. Reyes",            addr: "7 Maple Cl",             work: "Green water recovery · floc + super-chlor",     value: "$420",    state: "Accepted",          age: "today", accent: "won"  },
    { ref: "PoM-7033", client: "Manor House Hotel",   addr: "Hotel + spa",            work: "PWTAG audit support · annual contract",         value: "$11,400", state: "Sent",              age: "6d",    accent: "sent" },
    { ref: "PoM-7029", client: "Cromwell Leisure",    addr: "25m public pool",        work: "HSG282-aligned annual maintenance",             value: "$14,200", state: "Tender · awaiting", age: "12d",   accent: "sent" },
    { ref: "PoM-7024", client: "B. Holloway",         addr: "4 Oak Mews",             work: "One-off chemistry balance",                     value: "$140",    state: "Declined",          age: "15d",   accent: "lost" },
  ],
  quoteDetail: {
    ref: "PoM-7037", client: "D. Reyes",
    site: "7 Maple Cl · 6m × 3m residential pool",
    species: "Algae bloom · post-rain · pH 8.4 / FC 0.2 ppm",
    dbh: "~28,000 L", height: "Domestic outdoor", spread: "Whole pool",
    hazards: ["Children using pool weekend", "Heat-pump still running", "Existing dose was over-stabilised"],
    pruneCode: "PWTAG-aligned · floc → super-chlor → balance · 48h",
    lineItems: [
      ["Site visit + chemistry test",                  "$40"],
      ["Floc + clarifier (granular, batch logged)",    "$60"],
      ["Super-chlorination dose · 80g/m³",             "$80"],
      ["Filter media flush + backwash",                 "$40"],
      ["Follow-up balance visit · 48h",                "$100"],
      ["Same-day branded service report",               "—"],
      ["New chemistry targets in app",                  "—"],
    ],
    total: "$420",
  },
  quoteDetailLabels: {
    species:  "Diagnosis",
    dbhHeight:"Volume / Type",
    spread:   "Coverage",
    pruneCode:"PWTAG protocol",
    hazards:  "Site constraints",
  },
  invoices: [
    { ref: "INV-5188", client: "Manor House Hotel",     value: "$820",   state: "Paid",          daysOpen: 0,  paid: "14 Apr" },
    { ref: "INV-5187", client: "Cromwell Leisure",       value: "$1,840", state: "Paid",          daysOpen: 1,  paid: "13 Apr" },
    { ref: "INV-5186", client: "WS2 round (consolidated)", value: "$1,200", state: "Sent",        daysOpen: 9,  paid: "—" },
    { ref: "INV-5185", client: "Birchwood Mgmt",         value: "$820",   state: "Sent · Net 30", daysOpen: 18, paid: "—" },
    { ref: "INV-5184", client: "B. Holloway",            value: "$140",   state: "Overdue · 12d", daysOpen: 42, paid: "—" },
    { ref: "INV-5183", client: "D. Reyes",               value: "$420",   state: "Paid",          daysOpen: 0,  paid: "Today" },
    { ref: "INV-5182", client: "WS1 round (consolidated)", value: "$1,400", state: "Paid",        daysOpen: 2,  paid: "8 Apr" },
  ],
  analytics: {
    revenueMonths: [3400, 4200, 4800, 7800, 10400, 12480],
    revenueLabels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
    breakdown: [
      ["Weekly residential rounds", 48, "#0CA5EB"],
      ["Commercial / hotel",        22, "#0ea5e9"],
      ["Equipment install",         14, "#38bdf8"],
      ["Reactive / green water",     8, "#7dd3fc"],
      ["Annual contracts",           6, "#bae6fd"],
      ["Other",                      2, "#e0f2fe"],
    ],
    kpis: [
      ["Pools serviced (Apr)", "148", "+24 vs Mar"],
      ["Avg readings/pool",    "12.4", "+1.8"],
      ["Out-of-range alerts",  "7",   "-3"],
      ["Same-day PDF rate",    "97%", "+1pp"],
    ],
    leaderboard: [
      ["Self · J. Park",   "Owner · PWTAG",       148, "$12,480"],
      ["Sub · J. Foster",   "Heat-pump installs", 4,   "$3,200"],
    ],
  },
};

/* ------------------- routing ------------------- */

export function dataFor(slug: ProductSlug): DashboardData {
  switch (slug) {
    case "treemate":      return TREE_DATA;
    case "pestmate":      return PEST_DATA;
    case "firemate":      return FIRE_DATA;
    case "hygienemate":   return HYG_DATA;
    case "locksmithmate": return LOCK_DATA;
    case "poolmate":      return POOL_DATA;
  }
}
