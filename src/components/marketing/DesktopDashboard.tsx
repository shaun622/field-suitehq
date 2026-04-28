/**
 * DesktopDashboard — dashboard preview used inside the marketing pages.
 *
 * If `product.screenshots.desktop` is provided, renders the real product
 * screenshot with the top tenant-bar cropped (so AWC Group branding from
 * the source image isn't visible on the marketing site). Light + dark
 * source images are both rendered into the DOM and toggled via Tailwind
 * dark: utilities so SSR + theme toggle stay in sync without JS.
 *
 * If no screenshot is provided, falls back to the synthetic dashboard
 * markup (used by TreeMate which is AU/AUD and has no real shot yet).
 *
 * Themable per product via the .theme-<slug> CSS-var swap.
 */
import Image from "next/image";
import { Product } from "@/lib/products";
import { cn } from "@/lib/cn";

interface Props {
  product: Product;
  /** Default copy varies per product. Override with `stats` to pin numbers. */
  stats?: Partial<Record<"jobsThisWeek" | "activeJobs" | "pendingQuotes" | "overdue", string>>;
  className?: string;
}

/** Render real product screenshot with tenant-chrome cropped off the top. */
function RealDashboard({ product, className }: { product: Product; className?: string }) {
  const shot = product.screenshots?.desktop;
  if (!shot) return null;

  const aspectAfterCrop = (shot.height - (shot.cropTopPx ?? 0)) / shot.width;

  return (
    <div
      className={cn(`theme-${product.slug}`, "dash-frame select-none w-full", className)}
      style={{
        // Reserve layout space for the cropped image (preserves aspect ratio).
        // Use padding-bottom percentage hack so it works without JS.
        position: "relative",
        paddingBottom: `${aspectAfterCrop * 100}%`,
        overflow: "hidden",
      }}
    >
      {/* LIGHT — visible by default, hidden when <html class="dark"> */}
      <Image
        src={shot.light}
        alt={`${product.name} dashboard preview (light)`}
        width={shot.width}
        height={shot.height}
        priority={false}
        className="absolute inset-x-0 top-0 w-full h-auto select-none pointer-events-none block dark:hidden"
        style={{ marginTop: `-${(shot.cropTopPx ?? 0) / shot.width * 100}%` }}
      />
      {/* DARK — falls back to light if no dark variant is available */}
      <Image
        src={shot.dark ?? shot.light}
        alt={`${product.name} dashboard preview (dark)`}
        width={shot.width}
        height={shot.height}
        priority={false}
        className="absolute inset-x-0 top-0 w-full h-auto select-none pointer-events-none hidden dark:block"
        style={{ marginTop: `-${(shot.cropTopPx ?? 0) / shot.width * 100}%` }}
      />
    </div>
  );
}

const TAB_ICON: Record<string, React.ReactNode> = {
  home: <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/>,
  cal: <g><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></g>,
  users: <g><circle cx="9" cy="9" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><circle cx="17" cy="7" r="2.5"/></g>,
  briefcase: <g><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></g>,
  doc: <g><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h6"/></g>,
  invoice: <g><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 9h6M9 13h6"/></g>,
  chart: <path d="M3 21h18M6 17V10M11 17V6M16 17v-9"/>,
  gear: <g><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.3l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2.2-1.3L14 3h-4l-.4 2.4a7 7 0 0 0-2.2 1.3l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .9.1 1.3l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2.2 1.3L10 21h4l.4-2.4a7 7 0 0 0 2.2-1.3l2.3.9 2-3.4-2-1.5c.1-.4.1-.9.1-1.3z"/></g>,
  search: <g><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></g>,
};

function TabIcon({ kind, className }: { kind: keyof typeof TAB_ICON; className?: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {TAB_ICON[kind]}
    </svg>
  );
}

export function DesktopDashboard({ product, stats, className }: Props) {
  // Real screenshot path takes precedence when available
  if (product.screenshots?.desktop) {
    return <RealDashboard product={product} className={className} />;
  }

  const s = {
    jobsThisWeek: "6",
    activeJobs: "4",
    pendingQuotes: "0",
    overdue: "0",
    ...stats,
  };

  const ACCENT = product.brandHex;
  const ACCENT_DEEP = product.brandHexDeep;
  const initial = product.name[0];
  const currency = product.tone === "AU" ? "$" : "£";

  // Sample activity items — customise minimally per product
  const activity: { title: string; sub: string; tag: string }[] =
    product.slug === "treemate"
      ? [
          { title: "Job completed", sub: "Heritage Eucalypt removal · 14 Beach Rd", tag: "Job" },
          { title: "Photo added",   sub: "Tree #2 · before/after",                tag: "Photo" },
          { title: "Quote sent",    sub: "Glen W. · Spotted Gum removal",         tag: "Quote" },
        ]
      : product.slug === "firemate"
      ? [
          { title: "Door surveyed",  sub: "Door #18 · Riverside HMO",          tag: "Door" },
          { title: "PDF sent",       sub: "Albion Academy · 42 doors",         tag: "Report" },
          { title: "Re-inspection",  sub: "Park Lodge · scheduled May",        tag: "Schedule" },
        ]
      : product.slug === "locksmithmate"
      ? [
          { title: "Job completed",  sub: "BS 3621 swap · 12 Park Rd",           tag: "Job" },
          { title: "Invoice paid",   sub: "Card-on-file · £180",                 tag: "Paid" },
          { title: "ETA sent",       sub: "Tech 4 min away · 9 Rose Ave",        tag: "ETA" },
        ]
      : [
          { title: "Job completed",  sub: "Annual service · 12 Park Rd",         tag: "Job Completed" },
          { title: "Photo added",    sub: "Bait point #4",                       tag: "Photo" },
          { title: "Client added",   sub: "Crown Estates",                       tag: "Client" },
        ];

  return (
    <div
      className={cn(
        `theme-${product.slug}`,
        "dash-frame select-none w-full overflow-hidden",
        className
      )}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgb(var(--line))] dark:border-white/[.06] bg-[rgb(var(--surface))] dark:bg-[#0a0e14]">
        <div className="flex items-center gap-2.5">
          <span
            className="w-[22px] h-[22px] rounded-md grid place-items-center text-white text-[11px] font-bold flex-shrink-0"
            style={{ background: ACCENT }}
            aria-hidden
          >
            {initial}
          </span>
          <span className="text-[13px] font-semibold tracking-tight text-[rgb(var(--ink))]">{product.name}</span>
          <span className="font-mono text-[9px] tracking-[.12em] uppercase text-[rgb(var(--ink-3))] ml-1">by FieldSuite</span>
        </div>
        <div
          className="px-2.5 py-1 rounded-full text-[11px] font-medium text-white inline-flex items-center gap-1.5"
          style={{ background: ACCENT }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white" aria-hidden/>
          {product.name}
        </div>
        <div className="flex items-center gap-2.5 text-[rgb(var(--ink-3))]">
          <TabIcon kind="search"/>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="hidden sm:block"><path d="M21 13a8 8 0 1 1-9-11 6 6 0 0 0 9 11z"/></svg>
          <span className="w-[18px] h-[18px] rounded-full bg-pink-200/70 dark:bg-pink-500/40" aria-hidden/>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex items-center gap-5 px-4 py-2.5 border-b border-[rgb(var(--line-2))] dark:border-white/[.06] text-[11px] text-[rgb(var(--ink-3))] overflow-x-auto whitespace-nowrap">
        {[
          { k: "home", l: "Home", g: "home", on: true },
          { k: "sched", l: "Schedule", g: "cal" },
          { k: "clients", l: "Clients", g: "users" },
          { k: "jobs", l: "Jobs", g: "briefcase" },
          { k: "quotes", l: "Quotes", g: "doc" },
          { k: "invoices", l: "Invoices", g: "invoice" },
          { k: "analytics", l: "Analytics", g: "chart" },
          { k: "settings", l: "Settings", g: "gear" },
        ].map((t) => (
          <div
            key={t.k}
            className={cn(
              "relative flex items-center gap-1.5 transition",
              t.on ? "text-[rgb(var(--ink))] font-medium" : ""
            )}
          >
            <TabIcon kind={t.g as keyof typeof TAB_ICON}/>
            <span>{t.l}</span>
            {t.on && (
              <span
                className="absolute -bottom-[10px] left-0 right-0 h-[2px] rounded"
                style={{ background: ACCENT }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Greeting */}
      <div className="flex items-start justify-between px-4 pt-3.5 pb-1.5">
        <div>
          <div className="font-mono text-[9px] tracking-[.12em] uppercase" style={{ color: ACCENT }}>✦ Good morning</div>
          <div className="text-[20px] font-bold mt-1.5 tracking-tight text-[rgb(var(--ink))]">{product.name}</div>
          <div className="text-[11px] text-[rgb(var(--ink-3))] mt-0.5">{product.subtitle}</div>
        </div>
        <div
          className="px-2.5 py-1 rounded-full text-[10px] font-medium text-white inline-flex items-center gap-1.5"
          style={{ background: ACCENT }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white" aria-hidden/>
          {product.name}
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 px-4 py-3">
        {[
          { k: "Jobs this week", v: s.jobsThisWeek, g: "cal" as const },
          { k: "Active jobs", v: s.activeJobs, g: "briefcase" as const },
          { k: "Pending quotes", v: s.pendingQuotes, g: "doc" as const },
          { k: "Overdue", v: s.overdue, g: "chart" as const, empty: s.overdue === "0" },
        ].map((kpi) => (
          <div
            key={kpi.k}
            className="p-3 rounded-xl bg-[rgb(var(--surface-card))] dark:bg-[#0e131c] border border-[rgb(var(--line))] dark:border-white/[.08]"
          >
            <div className="flex items-start justify-between">
              <div className="font-mono text-[9px] tracking-[.1em] uppercase text-[rgb(var(--ink-3))]">{kpi.k}</div>
              <div
                className="w-[18px] h-[18px] rounded-md grid place-items-center"
                style={{ background: `${ACCENT}1f` }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  {TAB_ICON[kpi.g]}
                </svg>
              </div>
            </div>
            <div className="text-[20px] font-semibold mt-1.5 text-[rgb(var(--ink))]">{kpi.v}</div>
            {kpi.empty && (
              <div className="text-[9.5px] text-[rgb(var(--ink-3))] mt-1">— All caught up</div>
            )}
          </div>
        ))}
      </div>

      {/* Revenue + clients row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 px-4">
        <div
          className="p-3.5 rounded-xl border"
          style={{
            background: `linear-gradient(135deg, ${ACCENT}1a, ${ACCENT}10)`,
            borderColor: `${ACCENT}33`,
          }}
        >
          <div className="font-mono text-[9px] tracking-[.1em] uppercase font-semibold" style={{ color: ACCENT_DEEP }}>
            Revenue (month to date)
          </div>
          <div className="text-[22px] font-bold mt-1 tracking-tight text-[rgb(var(--ink))]">
            {currency}12,840
          </div>
          <div className="text-[10px] text-[rgb(var(--ink-3))] mt-1">From completed jobs this month</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[rgb(var(--surface-card))] dark:bg-[#0e131c] border border-[rgb(var(--line))] dark:border-white/[.08]">
          <div className="flex items-start justify-between">
            <div className="font-mono text-[9px] tracking-[.1em] uppercase text-[rgb(var(--ink-3))]">Clients</div>
            <TabIcon kind="users" className="text-[rgb(var(--ink-3))]"/>
          </div>
          <div className="text-[22px] font-bold mt-1 tracking-tight text-[rgb(var(--ink))]">34</div>
          <div className="text-[10px] text-[rgb(var(--ink-3))] mt-1">Across divisions</div>
          <div className="text-[10px] mt-2 font-medium" style={{ color: ACCENT_DEEP }}>Open CRM →</div>
        </div>
      </div>

      {/* Today + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-[.75fr_1.25fr] gap-2 px-4 pt-3 pb-4">
        <div className="p-3 rounded-xl bg-[rgb(var(--surface-card))] dark:bg-[#0e131c] border border-[rgb(var(--line))] dark:border-white/[.08]">
          <div className="font-mono text-[9px] tracking-[.1em] uppercase text-[rgb(var(--ink-3))]">Today</div>
          <div className="mt-2 text-[11px] flex flex-col gap-1.5">
            {[["Scheduled", "3"], ["Completed", "2"], ["Overdue", "0"]].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center">
                <span className="text-[rgb(var(--ink-2))]">{k}</span>
                <span className="px-2 py-[2px] rounded-full text-[10px] font-semibold bg-[rgb(var(--surface-2))] dark:bg-white/[.06] text-[rgb(var(--ink-2))]">
                  {v}
                </span>
              </div>
            ))}
            <div className="text-[10px] mt-1 font-medium" style={{ color: ACCENT_DEEP }}>Open schedule →</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[rgb(var(--surface-card))] dark:bg-[#0e131c] border border-[rgb(var(--line))] dark:border-white/[.08]">
          <div className="flex items-center justify-between">
            <div className="font-mono text-[9px] tracking-[.1em] uppercase text-[rgb(var(--ink-3))]">Recent activity</div>
            <span className="text-[9.5px] text-[rgb(var(--ink-3))]">10</span>
          </div>
          <div className="mt-2 flex flex-col gap-1.5 text-[10.5px]">
            {activity.map((a, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-start gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-[6px] flex-shrink-0"
                    style={{ background: ACCENT }}
                    aria-hidden
                  />
                  <div>
                    <div className="text-[rgb(var(--ink))]">{a.title}: {a.sub}</div>
                    <div className="text-[rgb(var(--ink-3))] text-[9px] mt-0.5">about {i * 4 + 2} hours ago</div>
                  </div>
                </div>
                <span
                  className="px-2 py-[3px] rounded-full text-[9px] font-medium ml-2 flex-shrink-0"
                  style={{
                    background: `${ACCENT}1f`,
                    color: ACCENT_DEEP,
                  }}
                >
                  {a.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
