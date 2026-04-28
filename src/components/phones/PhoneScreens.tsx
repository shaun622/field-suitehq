/**
 * Themable phone screens — variant lets us flip copy per product without
 * blowing the design out. Brand colors come from --brand-* CSS vars on a
 * parent .theme-<slug> wrapper.
 */
import { cn } from "@/lib/cn";
import { StatusBar, TabBar, Fab } from "./Phone";

type Light = { light?: boolean };

interface DashboardCopy {
  greet: string;
  date: string;
  initials: string;
  kpis: { label: string; value: string; delta: string; warn?: boolean }[];
  jobsLabel: string;
  jobs: { title: string; sub: string; amt: string; warn?: boolean }[];
  tabs: { label: string; active?: boolean }[];
}

const TREEMATE_DASH: DashboardCopy = {
  greet: "G'day, Shaun",
  date: "Tuesday, 14 May",
  initials: "SR",
  kpis: [
    { label: "This week", value: "$14,820", delta: "+18% wow" },
    { label: "Open quotes", value: "7", delta: "3 sent today" },
    { label: "Unpaid", value: "$3,640", delta: "2 overdue", warn: true },
  ],
  jobsLabel: "Today's jobs",
  jobs: [
    { title: "Heritage Eucalypt removal", sub: "14 Beach Rd, Byron Bay · 8:00 AM", amt: "$2,450" },
    { title: "Stump grind × 4 · power line nearby", sub: "22 Acacia St, Newcastle · 11:30 AM", amt: "$890", warn: true },
    { title: "Crown lift × 2 (AS4373)", sub: "8 Coolibah Cl, Tweed Heads · 2:00 PM", amt: "$1,180" },
  ],
  tabs: [
    { label: "Home", active: true }, { label: "Jobs" }, { label: "Quote" }, { label: "Money" }, { label: "Crew" },
  ],
};

export function PhoneDashboard({ light = false, copy = TREEMATE_DASH }: Light & { copy?: DashboardCopy }) {
  return (
    <div className={cn("phone-inner", light && "light")}>
      <StatusBar light={light} />
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b"
           style={{ borderColor: light ? "rgba(7,16,10,.06)" : "rgba(255,255,255,.05)" }}>
        <div>
          <div className="text-[13px]" style={{ color: light ? "rgba(7,16,10,.55)" : "rgba(255,255,255,.55)" }}>
            {copy.greet}
          </div>
          <div className="text-[17px] font-bold tracking-tight" style={{ color: light ? "#0c1812" : "#fff" }}>
            {copy.date}
          </div>
        </div>
        <div
          className="w-9 h-9 rounded-xl grid place-items-center text-white font-extrabold text-[13px]"
          style={{
            background: "linear-gradient(135deg, rgb(var(--brand-400)), rgb(var(--brand-700)))",
            boxShadow: "0 8px 28px rgb(var(--brand-500) / .35)",
          }}
        >{copy.initials}</div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 py-4">
        {copy.kpis.map((k) => (
          <div key={k.label}
               className={cn("p-3 rounded-2xl border", light ? "bg-white border-black/5" : "bg-white/[.04] border-white/[.06]")}>
            <div className="text-[10px] uppercase tracking-[.14em] font-medium" style={{ color: light ? "rgba(7,16,10,.55)" : "rgba(255,255,255,.5)" }}>
              {k.label}
            </div>
            <div className="text-[22px] font-extrabold tracking-tight mt-1 tnum" style={{ color: light ? "#0c1812" : "#fff" }}>
              {k.value}
            </div>
            <div
              className="text-[11px] font-semibold mt-0.5"
              style={{ color: k.warn ? "#ff7849" : (light ? "rgb(var(--brand-700))" : "rgb(var(--brand-400))") }}
            >{k.delta}</div>
          </div>
        ))}
      </div>

      <div className="px-5 pt-4 pb-2 flex justify-between items-center">
        <span className="text-[11px] uppercase tracking-[.16em]" style={{ color: light ? "rgba(7,16,10,.55)" : "rgba(255,255,255,.5)" }}>
          {copy.jobsLabel}
        </span>
        <span className="text-[11px] font-bold" style={{ color: light ? "rgb(var(--brand-700))" : "rgb(var(--brand-400))" }}>{copy.jobs.length}</span>
      </div>

      {copy.jobs.map((j) => (
        <div
          key={j.title}
          className={cn("mx-4 mb-2 p-3 rounded-2xl flex items-center gap-3 border",
            light ? "bg-white border-black/5" : "bg-white/[.04] border-white/[.06]")}
        >
          <div
            className="w-11 h-11 rounded-[10px] border flex-shrink-0"
            style={{
              background: j.warn
                ? "repeating-linear-gradient(135deg, rgba(246,255,59,.2) 0 6px, rgba(246,255,59,.35) 6px 12px)"
                : "repeating-linear-gradient(135deg, rgb(var(--brand-500) / .18) 0 6px, rgb(var(--brand-500) / .32) 6px 12px)",
              borderColor: j.warn ? "rgba(246,255,59,.3)" : "rgb(var(--brand-500) / .25)",
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-bold tracking-tight truncate" style={{ color: light ? "#0c1812" : "#fff" }}>
              {j.title}
            </div>
            <div className="text-[11px] font-mono mt-0.5" style={{ color: light ? "rgba(7,16,10,.55)" : "rgba(255,255,255,.55)" }}>
              {j.sub}
            </div>
          </div>
          <div className="text-[14px] font-bold tnum" style={{ color: light ? "#0c1812" : "#fff" }}>
            {j.amt}
          </div>
        </div>
      ))}

      <Fab />
      <TabBar tabs={copy.tabs} light={light} />
    </div>
  );
}

/* -------- QUOTE SCREEN -------- */

interface QuoteCopy {
  reference: string;
  address: string;
  hazardLine: string;
  lines: { title: string; sub: string; amt: string }[];
  total: string;
  deposit: string;
  recipient: string;
  photoCaptions: [string, string, string];
}

const TREEPRO_QUOTE: QuoteCopy = {
  reference: "← NEW QUOTE · #Q-2419",
  address: "14 Beach Rd, Byron Bay",
  hazardLine: "Power lines within 3m · Cat 2 trained crew required",
  lines: [
    { title: "Removal · 30m Spotted Gum", sub: "AS4373 · 6 hrs · 3 crew", amt: "$1,950" },
    { title: "EWP hire (24m boom)", sub: "$250/hr × 4 hrs", amt: "$1,000" },
    { title: "Stump grind", sub: "Below grade 300mm", amt: "$250" },
  ],
  total: "$3,200",
  deposit: "30% DEPOSIT · $960",
  recipient: "GLEN",
  photoCaptions: ["Tree #1\n30m gum", "Access\nnarrow drive", "Hazard\npowerline"],
};

export function PhoneQuote({ light = false, copy = TREEPRO_QUOTE }: Light & { copy?: QuoteCopy }) {
  return (
    <div className={cn("phone-inner", light && "light")}>
      <StatusBar light={light} />
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b"
           style={{ borderColor: light ? "rgba(7,16,10,.06)" : "rgba(255,255,255,.05)" }}>
        <div className="font-mono text-[11px] tracking-[.18em]" style={{ color: light ? "rgba(7,16,10,.55)" : "rgba(255,255,255,.6)" }}>
          {copy.reference}
        </div>
        <span className="aus-badge">DRAFT</span>
      </div>

      <div className="px-4 pb-20 pt-2 overflow-hidden">
        <div className="text-[22px] font-extrabold tracking-tight px-1 pb-3" style={{ color: light ? "#0c1812" : "#fff" }}>
          {copy.address}
        </div>
        <div className="font-mono text-[10px] tracking-[.18em] mb-2" style={{ color: light ? "rgba(7,16,10,.45)" : "rgba(255,255,255,.4)" }}>
          SITE PHOTOS · 3
        </div>
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {copy.photoCaptions.map((c) => (
            <div key={c} className="photo-slot rounded-xl aspect-square">
              <span className="leading-snug whitespace-pre-line">{c}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 py-2.5 rounded-[10px] mb-2.5 text-[11px] font-semibold"
             style={{
               background: "rgba(246,255,59,.1)",
               border: "1px solid rgba(246,255,59,.25)",
               color: "#f6ff3b",
             }}>
          <span className="w-2 h-2 rounded-full bg-hivis flex-shrink-0" />
          {copy.hazardLine}
        </div>

        {copy.lines.map((l) => (
          <div
            key={l.title}
            className={cn("flex justify-between items-center px-3.5 py-3 rounded-xl mb-1.5 text-[12px] border",
              light ? "bg-white border-black/5" : "bg-white/[.04] border-white/[.06]")}
          >
            <div>
              <div className="font-bold" style={{ color: light ? "#0c1812" : "#fff" }}>{l.title}</div>
              <div className="text-[10px] font-mono mt-0.5" style={{ color: light ? "rgba(7,16,10,.5)" : "rgba(255,255,255,.5)" }}>
                {l.sub}
              </div>
            </div>
            <div className="font-extrabold tnum text-[14px]" style={{ color: light ? "#0c1812" : "#fff" }}>{l.amt}</div>
          </div>
        ))}

        <div
          className="mt-2.5 p-3.5 rounded-2xl flex items-center justify-between text-white font-extrabold tnum"
          style={{ background: "linear-gradient(135deg, rgb(var(--brand-400)), rgb(var(--brand-700)))" }}
        >
          <div>
            <div className="text-[11px] uppercase tracking-[.16em] opacity-85 font-semibold">Total inc. GST</div>
            <div className="text-[9px] tracking-[.16em] opacity-85 mt-0.5">{copy.deposit}</div>
          </div>
          <div className="text-[24px] tracking-tight">{copy.total}</div>
        </div>

        <div
          className={cn("mt-3 p-3.5 rounded-2xl text-[12px] font-semibold text-center tracking-[.04em] border",
            light ? "bg-white border-black/5" : "bg-white/[.06] border-white/[.08]")}
          style={{ color: light ? "#0c1812" : "#fff" }}
        >
          SEND TO {copy.recipient} ↗
        </div>
      </div>
    </div>
  );
}

/* -------- PORTAL (always light) -------- */

interface PortalCopy {
  ref: string;
  greeting: string;
  lines: { title: string; amt: string }[];
  total: string;
  brandName: string;
}

const TREEMATE_PORTAL: PortalCopy = {
  ref: "#Q-2419",
  greeting: "Hi Glen — your tree quote is ready.",
  lines: [
    { title: "Removal · 30m Spotted Gum", amt: "$1,950" },
    { title: "EWP hire (24m boom)", amt: "$1,000" },
    { title: "Stump grind", amt: "$250" },
  ],
  total: "$3,200",
  brandName: "TreeMate",
};

export function PhonePortal({ copy = TREEMATE_PORTAL }: { copy?: PortalCopy }) {
  return (
    <div className="phone-inner light">
      <StatusBar light />
      <div className="flex flex-col h-full bg-white" style={{ color: "#0c1812" }}>
        <div className="px-5 pt-4 pb-3.5"
             style={{ background: "linear-gradient(160deg, rgb(var(--brand-900)) 0%, #07100a 100%)", color: "#fff" }}>
          <div className="text-[11px] tracking-[.14em] uppercase text-white/55">QUOTE FROM</div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="inline-flex items-center gap-2" style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
              <span className="fm-mark" style={{ width: 22, height: 22 }} aria-hidden />
              {copy.brandName}
            </span>
            <span className="font-mono text-[10px] tracking-[.14em] text-white/55 ml-auto">{copy.ref}</span>
          </div>
          <div className="mt-2 text-[18px] font-bold tracking-tight">{copy.greeting}</div>
        </div>

        <div className="grid grid-cols-2 gap-1 p-1">
          <div className="photo-slot rounded-none min-h-[90px] text-[9px]" style={{ background: "repeating-linear-gradient(135deg, rgb(var(--brand-900) / .06) 0 12px, rgb(var(--brand-900) / .12) 12px 24px)", color: "rgb(var(--brand-900) / .7)", borderColor: "rgb(var(--brand-900) / .12)" }}>
            <span>Tree #1<br/>30m gum</span>
          </div>
          <div className="photo-slot rounded-none min-h-[90px] text-[9px]" style={{ background: "repeating-linear-gradient(135deg, rgb(var(--brand-900) / .06) 0 12px, rgb(var(--brand-900) / .12) 12px 24px)", color: "rgb(var(--brand-900) / .7)", borderColor: "rgb(var(--brand-900) / .12)" }}>
            <span>Access</span>
          </div>
        </div>

        <div className="px-5 py-3 flex-1">
          {copy.lines.map((l) => (
            <div key={l.title} className="flex justify-between text-[13px] py-2 border-b border-black/5 tnum">
              <span>{l.title}</span><span>{l.amt}</span>
            </div>
          ))}
          <div className="flex justify-between text-[11px] py-2 text-black/50 tnum">
            <span>GST</span><span>incl.</span>
          </div>
        </div>

        <div className="flex justify-between items-center px-5 py-3 text-[17px] font-extrabold tnum tracking-tight"
             style={{ background: "rgb(var(--brand-50))" }}>
          <span>Total</span><span>{copy.total}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 px-5 py-4">
          <div className="py-3.5 rounded-2xl text-center font-bold text-sm border border-black/10 text-black/70 bg-white">Decline</div>
          <div
            className="py-3.5 rounded-2xl text-center font-bold text-sm text-white"
            style={{
              background: "linear-gradient(135deg, rgb(var(--brand-400)), rgb(var(--brand-700)))",
              boxShadow: "0 8px 28px rgb(var(--brand-500) / .35)",
            }}
          >
            Accept ↗
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------- JOBS LIST + chips -------- */

interface JobsCopy {
  title: string;
  countLabel: string;
  chips: { label: string; count: string; active?: boolean }[];
  rows: { tag: string; tagColor: string; title: string; sub: string; amt: string }[];
}

const TREEPRO_JOBS: JobsCopy = {
  title: "Jobs",
  countLabel: "34 active",
  chips: [
    { label: "All", count: "34" },
    { label: "Quoted", count: "12", active: true },
    { label: "Sched", count: "8" },
    { label: "Invoice", count: "9" },
    { label: "Done", count: "5" },
  ],
  rows: [
    { tag: "QUOTED", tagColor: "#60a5fa", title: "Removal · 30m Spotted Gum", sub: "GLEN W. · Byron Bay", amt: "$3,200" },
    { tag: "QUOTED", tagColor: "#60a5fa", title: "Crown reduction · Jacaranda", sub: "T. KAUR · Lismore", amt: "$680" },
    { tag: "SCHEDULED", tagColor: "rgb(var(--brand-400))", title: "Stump grind × 6", sub: "M. NGUYEN · Suffolk Park", amt: "$1,450" },
    { tag: "SCHEDULED", tagColor: "rgb(var(--brand-400))", title: "Hazard removal · EWP", sub: "BYRON SHIRE COUNCIL", amt: "$5,800" },
    { tag: "INVOICE", tagColor: "#ff7849", title: "Lopping × 3 + chipper", sub: "P. O'BRIEN · Mullum", amt: "$1,180" },
  ],
};

export function PhoneJobs({ light = false, copy = TREEPRO_JOBS }: Light & { copy?: JobsCopy }) {
  return (
    <div className={cn("phone-inner", light && "light")}>
      <StatusBar light={light} />
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b"
           style={{ borderColor: light ? "rgba(7,16,10,.06)" : "rgba(255,255,255,.05)" }}>
        <div className="text-[22px] font-bold tracking-tight" style={{ color: light ? "#0c1812" : "#fff" }}>
          {copy.title}
        </div>
        <div className="font-mono text-[11px] tracking-[.08em]" style={{ color: light ? "rgba(7,16,10,.55)" : "rgba(255,255,255,.55)" }}>
          {copy.countLabel}
        </div>
      </div>

      <div className="flex gap-1.5 px-4 py-2.5 overflow-hidden flex-nowrap">
        {copy.chips.map((c) => (
          <div
            key={c.label}
            className={cn("px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap border",
              c.active ? "text-white border-transparent" : light ? "bg-white text-black/70 border-black/10" : "bg-white/[.06] text-white/80 border-white/[.08]")}
            style={c.active ? {
              background: "linear-gradient(135deg, rgb(var(--brand-400)), rgb(var(--brand-700)))",
              boxShadow: "0 6px 16px rgb(var(--brand-500) / .35)",
            } : undefined}
          >
            {c.label}<span className="opacity-85 ml-1 tnum">{c.count}</span>
          </div>
        ))}
      </div>

      <div className="px-4 pb-2 font-mono text-[10px] tracking-[.18em]"
           style={{ color: light ? "rgba(7,16,10,.45)" : "rgba(255,255,255,.4)" }}>
        SHOWING 12 QUOTED JOBS
      </div>

      {copy.rows.map((j, i) => (
        <div
          key={i}
          className={cn("mx-4 mb-2 p-3 rounded-2xl flex items-center gap-3 border",
            light ? "bg-white border-black/5" : "bg-white/[.04] border-white/[.06]")}
        >
          <div
            className="w-11 h-11 rounded-[10px] flex-shrink-0 border"
            style={{
              background: `repeating-linear-gradient(135deg, ${j.tagColor}33 0 6px, ${j.tagColor}55 6px 12px)`,
              borderColor: `${j.tagColor}44`,
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-[9px] tracking-[.18em] font-bold uppercase mb-0.5" style={{ color: j.tagColor }}>
              {j.tag}
            </div>
            <div className="text-[14px] font-bold tracking-tight truncate" style={{ color: light ? "#0c1812" : "#fff" }}>
              {j.title}
            </div>
            <div className="text-[11px] font-mono mt-0.5" style={{ color: light ? "rgba(7,16,10,.55)" : "rgba(255,255,255,.55)" }}>
              {j.sub}
            </div>
          </div>
          <div className="text-[14px] font-bold tnum" style={{ color: light ? "#0c1812" : "#fff" }}>
            {j.amt}
          </div>
        </div>
      ))}

      <Fab />
      <TabBar
        tabs={[{ label: "Home" }, { label: "Jobs", active: true }, { label: "Quote" }, { label: "Money" }, { label: "Crew" }]}
        light={light}
      />
    </div>
  );
}

/* -------- PIPELINE -------- */

export function PhonePipeline({ light = false }: Light) {
  const cols = [
    { title: "Quoted", count: "12", cards: ["Spotted Gum · $3,200", "Jacaranda · $680", "Hedge · $440", "Heritage assessment"] },
    { title: "Sched.",  count: "8",  cards: ["Stump × 6 · Tue", "EWP job · Wed", "Council · Thu"] },
    { title: "Invoice", count: "9",  cards: ["P. O'Brien · $1,180", "M. Chen · $420", "Strata 14 · $2,800"] },
    { title: "Paid",    count: "5",  cards: ["Davis · $890", "Wong · $1,450"] },
  ];
  return (
    <div className={cn("phone-inner", light && "light")}>
      <StatusBar light={light} />
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b"
           style={{ borderColor: light ? "rgba(7,16,10,.06)" : "rgba(255,255,255,.05)" }}>
        <div className="text-[22px] font-bold tracking-tight" style={{ color: light ? "#0c1812" : "#fff" }}>Pipeline</div>
        <div className="font-mono text-[11px] tracking-[.08em] tnum" style={{ color: light ? "rgba(7,16,10,.55)" : "rgba(255,255,255,.55)" }}>
          $48,920
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1.5 px-4 py-3">
        {cols.map((c) => (
          <div key={c.title} className={cn("p-2 rounded-xl border",
            light ? "bg-black/[.02] border-black/[.05]" : "bg-white/[.03] border-white/[.05]")}>
            <div className="flex justify-between text-[9px] uppercase tracking-[.14em] mb-2"
                 style={{ color: light ? "rgba(7,16,10,.55)" : "rgba(255,255,255,.55)" }}>
              <span>{c.title}</span><span style={{ color: light ? "rgb(var(--brand-700))" : "rgb(var(--brand-400))" }}>{c.count}</span>
            </div>
            {c.cards.map((card) => (
              <div
                key={card}
                className={cn("p-1.5 mb-1 text-[10px] font-semibold rounded border-l-2",
                  light ? "bg-white text-black/85" : "bg-white/[.05] text-white")}
                style={{ borderColor: "rgb(var(--brand-500))" }}
              >
                {card}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="px-5 py-2 text-[11px] uppercase tracking-[.16em]"
           style={{ color: light ? "rgba(7,16,10,.55)" : "rgba(255,255,255,.5)" }}>
        This week's automations
      </div>
      <div className="px-4 space-y-2">
        {[
          { title: "3 review requests sent", sub: "After job completion · auto" },
          { title: "2 quote reminders queued", sub: "3 days after send · auto" },
        ].map((a) => (
          <div key={a.title}
               className={cn("p-3 rounded-2xl flex items-center gap-3 border",
                 light ? "bg-white border-black/5" : "bg-white/[.04] border-white/[.06]")}>
            <div
              className="w-8 h-8 rounded-[10px] grid place-items-center text-white text-sm font-extrabold"
              style={{ background: "linear-gradient(135deg, rgb(var(--brand-400)), rgb(var(--brand-700)))" }}
            >↻</div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold tracking-tight" style={{ color: light ? "#0c1812" : "#fff" }}>
                {a.title}
              </div>
              <div className="text-[11px] font-mono mt-0.5" style={{ color: light ? "rgba(7,16,10,.55)" : "rgba(255,255,255,.55)" }}>
                {a.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      <TabBar
        tabs={[{ label: "Home" }, { label: "Jobs" }, { label: "Quote" }, { label: "Pipeline", active: true }, { label: "Crew" }]}
        light={light}
      />
    </div>
  );
}

/* -------- Per-product copy presets -------- */

export const POOLMATE_DASH: DashboardCopy = {
  greet: "G'day, Mick",
  date: "Wednesday, 15 May",
  initials: "MV",
  kpis: [
    { label: "Stops today", value: "12", delta: "Route 9km" },
    { label: "Open quotes", value: "4", delta: "1 sent today" },
    { label: "Low chem", value: "3 sites", delta: "Restock", warn: true },
  ],
  jobsLabel: "Today's route",
  jobs: [
    { title: "5 Banksia Ave · Salt", sub: "pH 7.4 · Cl 1.2 · 8:00 AM", amt: "$78" },
    { title: "12 Coast Rd · Mineral", sub: "Vac & service · 9:30 AM", amt: "$95" },
    { title: "1 Headland Cl · Chlorine", sub: "Acid wash · 12:00 PM", amt: "$220", warn: true },
  ],
  tabs: [{ label: "Home", active: true }, { label: "Route" }, { label: "Pools" }, { label: "Money" }, { label: "More" }],
};

export const FIREMATE_DASH: DashboardCopy = {
  greet: "Morning, Tom",
  date: "Thursday, 16 May",
  initials: "TW",
  kpis: [
    { label: "Doors logged", value: "1,420", delta: "+71 today" },
    { label: "Compliance", value: "94%", delta: "↑ from 91%" },
    { label: "Overdue", value: "12 doors", delta: "Re-inspect", warn: true },
  ],
  jobsLabel: "Sites today",
  jobs: [
    { title: "Riverside HMO · 18 doors", sub: "BAFE · annual re-inspect · 9 AM", amt: "94%" },
    { title: "Albion Academy · 42 doors", sub: "BS 8214 full survey · 11 AM", amt: "—" },
    { title: "Park Lodge Care Home", sub: "Sleeping risk · sign-off due", amt: "Urgent", warn: true },
  ],
  tabs: [{ label: "Home", active: true }, { label: "Sites" }, { label: "Doors" }, { label: "Reports" }, { label: "Crew" }],
};
