"use client";

/**
 * AppDashboardLive — interactive 8-tab marketing preview of the FieldSuite
 * *Mate dashboard. Ported from the FieldSuite dashboard handoff (Apr 2026).
 *
 * Theme-aware: surfaces follow the page-level light/dark via globals.css
 * surface tokens; brand accent comes from the wrapping `.theme-<slug>`.
 *
 * Tabs: Home · Schedule · Clients · Jobs · Quotes · Invoices · Analytics · Settings
 *
 * State: active tab, selected client (Clients tab). Click handlers wired
 * for tab switching and client/quote master/detail.
 *
 * Sized to fit ~700-1100px container width × ~620px tall. Internal layouts
 * collapse gracefully on narrower containers.
 */
import { useState, type ReactNode } from "react";
import { Product } from "@/lib/products";
import {
  TREE_DATA, dataFor,
  type ClientRow, type DashboardData,
  type QuoteDetail, type QuoteDetailLabels,
} from "@/lib/dashboard-data";

/** Sum a list of $-prefixed money strings ("$1,840") to a number. */
function sumMoney(rows: { value: string }[]): number {
  return rows.reduce((sum, r) => sum + parseFloat(r.value.replace(/[$,]/g, "")), 0);
}

interface Props {
  product: Product;
  /** Pin a starting tab. Default "home". */
  defaultTab?: TabKey;
  className?: string;
}

type TabKey = "home" | "sched" | "clients" | "jobs" | "quotes" | "invoices" | "analytics" | "settings";

const TABS: { k: TabKey; l: string; g: GlyphKind }[] = [
  { k: "home",      l: "Home",      g: "home" },
  { k: "sched",     l: "Schedule",  g: "cal" },
  { k: "clients",   l: "Clients",   g: "users" },
  { k: "jobs",      l: "Jobs",      g: "briefcase" },
  { k: "quotes",    l: "Quotes",    g: "doc" },
  { k: "invoices",  l: "Invoices",  g: "invoice" },
  { k: "analytics", l: "Analytics", g: "chart" },
  { k: "settings",  l: "Settings",  g: "gear" },
];

export function AppDashboardLive({ product, defaultTab = "home", className }: Props) {
  const [tab, setTab] = useState<TabKey>(defaultTab);
  const data = dataFor(product.slug);

  const accent = product.brandHex;
  const accentDeep = product.brandHexDeep;

  return (
    <div
      className={`app-mock theme-${product.slug} ${className ?? ""}`}
      style={{ minHeight: 620 }}
    >
      <AppTopBar product={product} />

      {/* Tab nav row */}
      <div className="app-row-tabs" style={{ position: "relative" }}>
        {TABS.map((t) => {
          const on = t.k === tab;
          return (
            <button
              key={t.k}
              type="button"
              onClick={() => setTab(t.k)}
              aria-pressed={on}
              style={{
                all: "unset",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontWeight: on ? 600 : 500,
                color: on ? "rgb(var(--ink))" : "inherit",
                position: "relative",
                padding: "4px 0",
              }}
            >
              <Glyph kind={t.g} size={11} />
              <span>{t.l}</span>
              {on && (
                <span
                  style={{
                    position: "absolute",
                    left: 0, right: 0, bottom: -9,
                    height: 2,
                    background: accent,
                    borderRadius: 2,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {tab === "home"      && <HomeView      product={product} accent={accent} accentDeep={accentDeep} data={data} />}
      {tab === "sched"     && <ScheduleView  data={data.schedule} accent={accent} />}
      {tab === "clients"   && <ClientsView   data={data.clients} accent={accent} />}
      {tab === "jobs"      && <JobsView      data={data.jobs} accent={accent} />}
      {tab === "quotes"    && <QuotesView    rows={data.quotes} detail={data.quoteDetail} labels={data.quoteDetailLabels} accent={accent} />}
      {tab === "invoices"  && <InvoicesView  data={data.invoices} accent={accent} />}
      {tab === "analytics" && <AnalyticsView data={data.analytics} accent={accent} />}
      {tab === "settings"  && <SettingsView  product={product} accent={accent} />}
    </div>
  );
}

/* ---------- Top bar ---------- */

function AppTopBar({ product }: { product: Product }) {
  return (
    <div className="app-topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 22, height: 22, borderRadius: 6,
            background: product.brandHex,
            color: "#fff",
            display: "grid", placeItems: "center",
            fontSize: 11, fontWeight: 700,
          }}
        >
          {product.name[0]}
        </div>
        <span style={{ fontWeight: 600, fontSize: 13, letterSpacing: "-0.01em" }}>{product.name}</span>
        <span
          className="font-mono"
          style={{ fontSize: 10, color: "rgb(var(--ink-3))", letterSpacing: ".08em", textTransform: "uppercase", marginLeft: 6 }}
        >
          by FieldSuite
        </span>
      </div>
      <div className="app-tabs">
        <div className="app-pill active" style={{ background: product.brandHex }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", opacity: 0.8 }} />
          {product.name}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Glyph kind="search" size={14} />
        <Glyph kind="moon" size={14} />
        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "oklch(0.85 0.08 320)" }} />
      </div>
    </div>
  );
}

/* ---------- Shared bits ---------- */

function Eyebrow({ children, accent }: { children: ReactNode; accent: string }) {
  return (
    <div
      className="font-mono"
      style={{
        fontSize: 9.5, letterSpacing: ".14em",
        textTransform: "uppercase", color: accent,
      }}
    >
      {children}
    </div>
  );
}

function TabFrame({
  title, eyebrow, accent, right, children,
}: {
  title: ReactNode; eyebrow?: ReactNode; accent: string;
  right?: ReactNode; children: ReactNode;
}) {
  return (
    <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
        <div>
          {eyebrow && <Eyebrow accent={accent}>{eyebrow}</Eyebrow>}
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 5, letterSpacing: "-0.015em", color: "rgb(var(--ink))" }}>
            {title}
          </div>
        </div>
        {right}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
}

interface CardProps { style?: React.CSSProperties; children: ReactNode; padded?: boolean; }
function Card({ style, children, padded = true }: CardProps) {
  return (
    <div
      className="app-card"
      style={{ padding: padded ? 12 : 0, ...style }}
    >
      {children}
    </div>
  );
}

type PillTone = "default" | "accent" | "good" | "warn" | "bad";
function Pill({ children, tone = "default", accent }: { children: ReactNode; tone?: PillTone; accent: string }) {
  const styles: Record<PillTone, React.CSSProperties> = {
    default: { background: "rgb(var(--surface-3))", color: "rgb(var(--ink-2))" },
    accent:  { background: `color-mix(in oklch, ${accent} 14%, transparent)`, color: accent },
    good:    { background: "oklch(0.94 0.07 145)", color: "#15803d" },
    warn:    { background: "oklch(0.95 0.09 70)",  color: "#b45309" },
    bad:     { background: "oklch(0.95 0.06 25)",  color: "#b91c1c" },
  };
  return (
    <span
      className="font-mono"
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "2px 8px", borderRadius: 999,
        fontSize: 9.5, fontWeight: 500, letterSpacing: ".04em",
        whiteSpace: "nowrap",
        ...styles[tone],
      }}
    >
      {children}
    </span>
  );
}

/* ---------- HOME ---------- */

function HomeView({ product, accent, accentDeep, data }: { product: Product; accent: string; accentDeep: string; data: DashboardData }) {
  const tintBg = `linear-gradient(135deg, ${accent}1a, ${accent}0a)`;
  const revenueMTD = data.analytics.revenueMonths[data.analytics.revenueMonths.length - 1];
  const revenueMTDFmt = `$${revenueMTD.toLocaleString()}`;
  const clientCount = data.clients.length;

  return (
    <>
      <div style={{ padding: "14px 16px 6px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="font-mono" style={{ fontSize: 9, letterSpacing: ".12em", color: accent, textTransform: "uppercase" }}>
            ✦ Good morning
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6, letterSpacing: "-0.015em" }}>{product.name}</div>
          <div style={{ fontSize: 11, color: "rgb(var(--ink-3))", marginTop: 2 }}>{product.subtitle}</div>
        </div>
        <div className="app-pill active" style={{ background: accent }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />
          {product.name}
        </div>
      </div>

      <div className="app-stat-grid">
        {([
          ["jobs this week", "6",  "cal" as GlyphKind],
          ["active jobs",    "4",  "briefcase" as GlyphKind],
          ["pending quotes", "0",  "doc" as GlyphKind],
          ["overdue",        "0",  "alert" as GlyphKind],
        ]).map(([k, v, g]) => (
          <div key={k} className="app-stat">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div className="lbl">{k}</div>
              <div style={{
                width: 18, height: 18, borderRadius: 5,
                background: `${accent}1f`, display: "grid", placeItems: "center",
              }}>
                <Glyph kind={g as GlyphKind} size={10} color={accent} />
              </div>
            </div>
            <div className="num">{v}</div>
            {k === "overdue" && v === "0" && (
              <div style={{ fontSize: 9.5, color: "rgb(var(--ink-3))", marginTop: 6 }}>— All caught up</div>
            )}
          </div>
        ))}
      </div>

      <div className="app-row">
        <div className="app-card" style={{ background: tintBg, borderColor: `${accent}33` }}>
          <div className="font-mono" style={{ fontSize: 9, letterSpacing: ".1em", color: accentDeep, textTransform: "uppercase", fontWeight: 600 }}>
            Revenue (month to date)
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 6, letterSpacing: "-0.015em" }}>{revenueMTDFmt}</div>
          <div style={{ fontSize: 10, color: "rgb(var(--ink-3))", marginTop: 4 }}>From completed jobs this month</div>
        </div>
        <div className="app-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div className="lbl font-mono" style={{ fontSize: 9, letterSpacing: ".1em", color: "rgb(var(--ink-3))", textTransform: "uppercase" }}>
              Clients
            </div>
            <Glyph kind="users" size={11} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 6 }}>{clientCount}</div>
          <div style={{ fontSize: 10, color: "rgb(var(--ink-3))", marginTop: 4 }}>Across divisions</div>
          <div style={{ fontSize: 10, color: accent, marginTop: 8, fontWeight: 500 }}>Open CRM →</div>
        </div>
      </div>

      <div style={{ padding: "10px 16px 14px", flex: 1, display: "grid", gridTemplateColumns: ".75fr 1.25fr", gap: 10 }}>
        <div className="app-card">
          <div className="font-mono" style={{ fontSize: 9, letterSpacing: ".1em", color: "rgb(var(--ink-3))", textTransform: "uppercase" }}>Today</div>
          <div style={{ marginTop: 8, fontSize: 11, display: "flex", flexDirection: "column", gap: 6 }}>
            {[["Scheduled", "3"], ["Completed", "2"], ["Overdue", "0"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{k}</span>
                <span style={{ padding: "2px 8px", borderRadius: 999, background: "rgb(var(--surface-3))", fontSize: 10, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ color: accent, fontWeight: 500, marginTop: 4, fontSize: 10 }}>Open schedule →</div>
          </div>
        </div>
        <div className="app-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="font-mono" style={{ fontSize: 9, letterSpacing: ".1em", color: "rgb(var(--ink-3))", textTransform: "uppercase" }}>Recent activity</div>
            <span style={{ fontSize: 9.5, color: "rgb(var(--ink-3))" }}>10</span>
          </div>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 7, fontSize: 10.5 }}>
            {[
              ["Job completed", "Heritage Eucalypt removal · 14 Beech Rd", "Job"],
              ["Photo added",   "Tree #2 · before/after",                  "Photo"],
              ["Quote sent",    "Glen W. · Spotted Gum removal",          "Quote"],
            ].map(([t, sub, tag], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: accent, marginTop: 5 }} />
                  <div>
                    <div>{t}: {sub}</div>
                    <div style={{ color: "rgb(var(--ink-3))", fontSize: 9 }}>about {i * 4 + 2} hours ago</div>
                  </div>
                </div>
                <Pill tone="accent" accent={accent}>{tag}</Pill>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- SCHEDULE ---------- */

function ScheduleView({ data, accent }: { data: DashboardData["schedule"]; accent: string }) {
  return (
    <TabFrame
      eyebrow="Week view"
      title={data.weekLabel}
      accent={accent}
      right={
        <div style={{ display: "flex", gap: 6 }}>
          <Pill tone="default" accent={accent}>‹ Prev</Pill>
          <Pill tone="accent" accent={accent}>This week</Pill>
          <Pill tone="default" accent={accent}>Next ›</Pill>
        </div>
      }
    >
      {/* week grid */}
      <Card padded={false}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid rgb(var(--line))" }}>
          {data.days.map((d) => (
            <div key={d.d} style={{ padding: "10px 10px 8px", borderRight: "1px solid rgb(var(--line))", fontSize: 10 }}>
              <div className="font-mono" style={{ letterSpacing: ".1em", textTransform: "uppercase", color: "rgb(var(--ink-3))" }}>{d.d}</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{d.n}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", minHeight: 160 }}>
          {data.days.map((d) => (
            <div key={d.d} style={{ padding: "8px 7px", borderRight: "1px solid rgb(var(--line))", display: "flex", flexDirection: "column", gap: 5 }}>
              {d.jobs.length === 0 && <div style={{ fontSize: 9, color: "rgb(var(--ink-3))", fontStyle: "italic" }}>—</div>}
              {d.jobs.map((j, i) => (
                <div
                  key={i}
                  style={{
                    background: `${accent}1a`,
                    borderLeft: `2px solid ${accent}`,
                    padding: "5px 7px", borderRadius: 4,
                  }}
                >
                  <div className="font-mono" style={{ fontSize: 8.5, color: accent, fontWeight: 500 }}>{j.t}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, marginTop: 1, lineHeight: 1.25 }}>{j.c}</div>
                  <div style={{ fontSize: 8.5, color: "rgb(var(--ink-3))", marginTop: 2 }}>{j.crew}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>

      {/* today list */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <Eyebrow accent={accent}>Today · Tue 28 Apr</Eyebrow>
          <span style={{ fontSize: 9.5, color: "rgb(var(--ink-3))" }}>{data.today.length} jobs · 1 in progress</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {data.today.map((j, i) => (
            <div
              key={i}
              style={{
                display: "grid", gridTemplateColumns: "52px 1fr auto", gap: 10, alignItems: "center",
                padding: "8px 0", borderTop: i ? "1px dashed rgb(var(--line))" : "none",
              }}
            >
              <div className="font-mono" style={{ fontSize: 11, fontWeight: 600, color: accent }}>{j.t}</div>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 600 }}>{j.c}</div>
                <div style={{ fontSize: 9.5, color: "rgb(var(--ink-3))", marginTop: 2 }}>{j.loc}</div>
              </div>
              <Pill tone={j.state === "In progress" ? "accent" : "default"} accent={accent}>{j.state}</Pill>
            </div>
          ))}
        </div>
      </Card>
    </TabFrame>
  );
}

/* ---------- CLIENTS ---------- */

function ClientsView({ data, accent }: { data: ClientRow[]; accent: string }) {
  const [sel, setSel] = useState(0);
  const c = data[sel];

  return (
    <TabFrame
      eyebrow="CRM"
      title={`${data.length} clients · 6 active recurring`}
      accent={accent}
      right={
        <div style={{ display: "flex", gap: 6 }}>
          <Pill tone="default" accent={accent}>Filter</Pill>
          <Pill tone="accent" accent={accent}>+ New client</Pill>
        </div>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 10, flex: 1, minHeight: 0 }}>
        {/* table */}
        <Card padded={false} style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div
            className="font-mono"
            style={{
              padding: "9px 12px", borderBottom: "1px solid rgb(var(--line))",
              display: "grid", gridTemplateColumns: "1.4fr 1fr .6fr .8fr",
              gap: 8, fontSize: 8.5, letterSpacing: ".1em",
              textTransform: "uppercase", color: "rgb(var(--ink-3))",
            }}
          >
            <span>Client</span><span>Type</span><span>Sites</span><span>YTD spend</span>
          </div>
          <div style={{ overflow: "auto" }}>
            {data.map((row, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSel(i)}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  padding: "10px 12px",
                  display: "grid",
                  gridTemplateColumns: "1.4fr 1fr .6fr .8fr",
                  gap: 8, alignItems: "center",
                  borderTop: i ? "1px solid rgb(var(--line))" : "none",
                  background: i === sel ? `${accent}10` : "transparent",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    {row.name}
                    {row.hot && <span style={{ width: 5, height: 5, borderRadius: "50%", background: accent }} />}
                  </div>
                  <div className="font-mono" style={{ fontSize: 9, color: "rgb(var(--ink-3))", marginTop: 2 }}>{row.last}</div>
                </div>
                <div style={{ fontSize: 10.5, color: "rgb(var(--ink-2))" }}>{row.type}</div>
                <div style={{ fontSize: 11, fontWeight: 500 }}>{row.sites}</div>
                <div className="font-mono" style={{ fontSize: 11, fontWeight: 600 }}>{row.spend}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* detail */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <Eyebrow accent={accent}>Client detail</Eyebrow>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>{c.name}</div>
              <div style={{ fontSize: 10.5, color: "rgb(var(--ink-3))", marginTop: 2 }}>{c.type}</div>
            </div>
            <Pill tone="accent" accent={accent}>Open</Pill>
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 10 }}>
            {c.tags.map((t) => <Pill key={t} tone="default" accent={accent}>{t}</Pill>)}
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              ["Sites", c.sites],
              ["YTD", c.spend],
              ["Open jobs", "2"],
              ["Open invoices", "1"],
            ].map(([k, v]) => (
              <div key={String(k)}>
                <div className="font-mono" style={{ fontSize: 8.5, letterSpacing: ".1em", color: "rgb(var(--ink-3))", textTransform: "uppercase" }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 3 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid rgb(var(--line))" }}>
            <div className="font-mono" style={{ fontSize: 8.5, letterSpacing: ".1em", color: "rgb(var(--ink-3))", textTransform: "uppercase" }}>Recent</div>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 5, fontSize: 10 }}>
              {[
                [c.last, "Job"],
                ["Quote sent · TM-2041", "Quote"],
                ["Photos uploaded · 4", "Photo"],
              ].map(([k, tag], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "rgb(var(--ink-2))" }}>{k}</span>
                  <Pill tone="accent" accent={accent}>{tag}</Pill>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </TabFrame>
  );
}

/* ---------- JOBS ---------- */

function JobsView({ data, accent }: { data: DashboardData["jobs"]; accent: string }) {
  return (
    <TabFrame
      eyebrow="Jobs board"
      title="11 active across 7 clients"
      accent={accent}
      right={
        <div style={{ display: "flex", gap: 6 }}>
          <Pill tone="default" accent={accent}>All crews ▾</Pill>
          <Pill tone="accent" accent={accent}>+ New job</Pill>
        </div>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, flex: 1, minHeight: 0 }}>
        {data.cols.map((col) => (
          <Card key={col.k} padded={false} style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{
              padding: "10px 12px", borderBottom: "1px solid rgb(var(--line))",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div className="font-mono" style={{ fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 600 }}>{col.l}</div>
              <Pill tone="accent" accent={accent}>{col.count}</Pill>
            </div>
            <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 7, flex: 1, overflow: "auto" }}>
              {col.items.map((it) => (
                <div
                  key={it.ref}
                  style={{
                    background: "rgb(var(--surface-3))",
                    border: "1px solid rgb(var(--line))",
                    borderRadius: 8, padding: 9,
                  }}
                >
                  <div className="font-mono" style={{ fontSize: 8.5, color: accent, fontWeight: 500 }}>{it.ref}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, marginTop: 3, lineHeight: 1.3 }}>{it.t}</div>
                  <div style={{ fontSize: 9.5, color: "rgb(var(--ink-3))", marginTop: 3 }}>{it.c}</div>
                  <div className="font-mono" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 7, fontSize: 9, color: "rgb(var(--ink-3))" }}>
                    <span>{it.v ?? it.d ?? it.hours ?? ""}</span>
                    <span>{it.crew ?? it.age ?? ""}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </TabFrame>
  );
}

/* ---------- QUOTES ---------- */

function QuotesView({ rows, detail, labels, accent }: {
  rows: DashboardData["quotes"];
  detail: QuoteDetail;
  labels: QuoteDetailLabels;
  accent: string;
}) {
  const [selRef, setSelRef] = useState(detail.ref);
  // Detail panel always shows the canonical detail for now (only one is fully
  // fleshed per fixture). selRef just toggles the row highlight.
  const stateTone = (s: "sent" | "won" | "lost"): PillTone =>
    s === "won" ? "good" : s === "lost" ? "bad" : "accent";

  const pipelineTotal = sumMoney(rows.filter((r) => r.accent !== "lost"));
  const pipelineTotalFmt = `$${pipelineTotal.toLocaleString()}`;

  return (
    <TabFrame
      eyebrow="Pipeline"
      title={`${rows.length} quotes · ${pipelineTotalFmt} in pipeline`}
      accent={accent}
      right={<Pill tone="accent" accent={accent}>+ New quote</Pill>}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 10, flex: 1, minHeight: 0 }}>
        <Card padded={false} style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div
            className="font-mono"
            style={{
              padding: "9px 12px", borderBottom: "1px solid rgb(var(--line))",
              display: "grid", gridTemplateColumns: ".6fr 1.2fr .6fr .6fr", gap: 8,
              fontSize: 8.5, letterSpacing: ".1em",
              textTransform: "uppercase", color: "rgb(var(--ink-3))",
            }}
          >
            <span>Ref</span><span>Client / work</span><span>State</span><span>Value</span>
          </div>
          <div style={{ overflow: "auto" }}>
            {rows.map((q, i) => (
              <button
                key={q.ref}
                type="button"
                onClick={() => setSelRef(q.ref)}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  padding: "10px 12px",
                  display: "grid",
                  gridTemplateColumns: ".6fr 1.2fr .6fr .6fr",
                  gap: 8, alignItems: "center",
                  borderTop: i ? "1px solid rgb(var(--line))" : "none",
                  background: q.ref === selRef ? `${accent}10` : "transparent",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div className="font-mono" style={{ fontSize: 10.5, color: accent, fontWeight: 500 }}>{q.ref}</div>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 600 }}>{q.client}</div>
                  <div style={{ fontSize: 9.5, color: "rgb(var(--ink-3))", marginTop: 2 }}>{q.work}</div>
                </div>
                <div><Pill tone={stateTone(q.accent)} accent={accent}>{q.state}</Pill></div>
                <div className="font-mono" style={{ fontSize: 11, fontWeight: 600 }}>{q.value}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* detail */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <Eyebrow accent={accent}>{detail.ref}</Eyebrow>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{detail.client}</div>
              <div style={{ fontSize: 10.5, color: "rgb(var(--ink-3))", marginTop: 2 }}>{detail.site}</div>
            </div>
            <Pill tone="accent" accent={accent}>Sent</Pill>
          </div>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 10 }}>
            {[
              [labels.species,   detail.species],
              [labels.dbhHeight, `${detail.dbh} · ${detail.height}`],
              [labels.spread,    detail.spread],
              [labels.pruneCode, detail.pruneCode],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="font-mono" style={{ fontSize: 8.5, letterSpacing: ".1em", color: "rgb(var(--ink-3))", textTransform: "uppercase" }}>{k}</div>
                <div style={{ fontSize: 10.5, marginTop: 3 }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, padding: "8px 0", borderTop: "1px solid rgb(var(--line))" }}>
            <div className="font-mono" style={{ fontSize: 8.5, letterSpacing: ".1em", color: "rgb(var(--ink-3))", textTransform: "uppercase", marginBottom: 6 }}>{labels.hazards}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {detail.hazards.map((h) => <Pill key={h} tone="warn" accent={accent}>{h}</Pill>)}
            </div>
          </div>

          <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgb(var(--line))" }}>
            <div className="font-mono" style={{ fontSize: 8.5, letterSpacing: ".1em", color: "rgb(var(--ink-3))", textTransform: "uppercase", marginBottom: 6 }}>Line items</div>
            {detail.lineItems.map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, padding: "4px 0", borderBottom: "1px dashed rgb(var(--line))" }}>
                <span style={{ color: "rgb(var(--ink-2))" }}>{k}</span>
                <span className="font-mono">{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 6 }}>
              <span className="font-mono" style={{ fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: "rgb(var(--ink-3))" }}>Total</span>
              <span className="font-mono" style={{ fontSize: 18, fontWeight: 700, color: accent }}>{detail.total}</span>
            </div>
          </div>
        </Card>
      </div>
    </TabFrame>
  );
}

/* ---------- INVOICES ---------- */

function InvoicesView({ data, accent }: { data: DashboardData["invoices"]; accent: string }) {
  const stateTone = (s: string): PillTone =>
    s.startsWith("Paid") ? "good" : s.startsWith("Overdue") ? "bad" : "accent";

  const sumWhere = (pred: (s: string) => boolean) =>
    data
      .filter((i) => pred(i.state))
      .reduce((sum, i) => sum + parseFloat(i.value.replace(/[$,]/g, "")), 0);

  const totals = {
    paid: sumWhere((s) => s.startsWith("Paid")),
    out:  sumWhere((s) => !s.startsWith("Paid")),
    over: sumWhere((s) => s.startsWith("Overdue")),
  };

  return (
    <TabFrame
      eyebrow="Invoices"
      title={`${data.length} invoices · April`}
      accent={accent}
      right={<Pill tone="accent" accent={accent}>+ New invoice</Pill>}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {([
          ["Paid this month", `$${totals.paid.toLocaleString()}`, "good"],
          ["Outstanding",      `$${totals.out.toLocaleString()}`,  "accent"],
          ["Overdue",          `$${totals.over.toLocaleString()}`, totals.over ? "bad" : "good"],
        ] as [string, string, PillTone][]).map(([k, v, tone]) => (
          <Card key={k}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="font-mono" style={{ fontSize: 8.5, letterSpacing: ".1em", color: "rgb(var(--ink-3))", textTransform: "uppercase" }}>{k}</div>
              <Pill tone={tone} accent={accent}>
                {tone === "good" ? "Healthy" : tone === "bad" ? "Action" : "Pending"}
              </Pill>
            </div>
            <div className="font-mono" style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{v}</div>
          </Card>
        ))}
      </div>

      <Card padded={false} style={{ overflow: "hidden", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        <div className="font-mono" style={{
          padding: "9px 12px", borderBottom: "1px solid rgb(var(--line))",
          display: "grid", gridTemplateColumns: ".7fr 1.2fr .8fr .9fr .6fr",
          gap: 8, fontSize: 8.5, letterSpacing: ".1em",
          textTransform: "uppercase", color: "rgb(var(--ink-3))",
        }}>
          <span>Ref</span><span>Client</span><span>Value</span><span>State</span><span>Paid</span>
        </div>
        <div style={{ overflow: "auto" }}>
          {data.map((inv, i) => (
            <div
              key={inv.ref}
              style={{
                padding: "10px 12px", display: "grid",
                gridTemplateColumns: ".7fr 1.2fr .8fr .9fr .6fr",
                gap: 8, alignItems: "center",
                borderTop: i ? "1px solid rgb(var(--line))" : "none",
              }}
            >
              <div className="font-mono" style={{ fontSize: 10.5, color: accent, fontWeight: 500 }}>{inv.ref}</div>
              <div style={{ fontSize: 11.5, fontWeight: 600 }}>{inv.client}</div>
              <div className="font-mono" style={{ fontSize: 11, fontWeight: 600 }}>{inv.value}</div>
              <div><Pill tone={stateTone(inv.state)} accent={accent}>{inv.state}</Pill></div>
              <div className="font-mono" style={{ fontSize: 10, color: "rgb(var(--ink-3))" }}>{inv.paid}</div>
            </div>
          ))}
        </div>
      </Card>
    </TabFrame>
  );
}

/* ---------- ANALYTICS ---------- */

function AnalyticsView({ data, accent }: { data: DashboardData["analytics"]; accent: string }) {
  const max = Math.max(...data.revenueMonths);
  const last = data.revenueMonths[data.revenueMonths.length - 1];
  const prev = data.revenueMonths[data.revenueMonths.length - 2] ?? last;
  const deltaPct = prev > 0 ? Math.round(((last - prev) / prev) * 100) : 0;
  const deltaSign = deltaPct >= 0 ? "+" : "";

  return (
    <TabFrame
      eyebrow="Last 6 months"
      title="Revenue · jobs · crew utilisation"
      accent={accent}
      right={<Pill tone="default" accent={accent}>Export CSV</Pill>}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {data.kpis.map(([k, v, delta]) => (
          <Card key={k}>
            <div className="font-mono" style={{ fontSize: 8.5, letterSpacing: ".1em", color: "rgb(var(--ink-3))", textTransform: "uppercase" }}>{k}</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{v}</div>
            <div className="font-mono" style={{
              fontSize: 9.5,
              color: delta.startsWith("+") ? "#15803d" : "rgb(var(--ink-3))",
              marginTop: 3,
            }}>{delta}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 10, flex: 1, minHeight: 0 }}>
        <Card style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Eyebrow accent={accent}>Revenue · 6mo</Eyebrow>
            <span className="font-mono" style={{ fontSize: 11, fontWeight: 600 }}>
              ${last.toLocaleString()}{" "}
              <span style={{ color: deltaPct >= 0 ? "#15803d" : "#b91c1c", fontSize: 9 }}>{deltaSign}{deltaPct}%</span>
            </span>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 10, marginTop: 14, padding: "0 4px", minHeight: 120 }}>
            {data.revenueMonths.map((v, i) => {
              const h = (v / max) * 100;
              const isLast = i === data.revenueMonths.length - 1;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: "100%",
                    height: `${h}%`,
                    background: isLast ? accent : `${accent}33`,
                    borderRadius: "4px 4px 0 0",
                    minHeight: 8,
                    position: "relative",
                  }}>
                    {isLast && (
                      <div className="font-mono" style={{
                        position: "absolute",
                        top: -18,
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: 9, fontWeight: 600, color: accent, whiteSpace: "nowrap",
                      }}>${(v / 1000).toFixed(1)}k</div>
                    )}
                  </div>
                  <div className="font-mono" style={{ fontSize: 9, color: "rgb(var(--ink-3))", letterSpacing: ".05em" }}>{data.revenueLabels[i]}</div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <Eyebrow accent={accent}>Revenue mix</Eyebrow>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 9 }}>
            {data.breakdown.map(([k, pct, col]) => (
              <div key={k}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5 }}>
                  <span>{k}</span>
                  <span className="font-mono" style={{ color: "rgb(var(--ink-3))" }}>{pct}%</span>
                </div>
                <div style={{ height: 5, background: "rgb(var(--surface-3))", borderRadius: 99, marginTop: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct * 1.6}%`, background: col, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card padded={false}>
        <div style={{ padding: "10px 12px", borderBottom: "1px solid rgb(var(--line))", display: "flex", justifyContent: "space-between" }}>
          <Eyebrow accent={accent}>Crew leaderboard · April</Eyebrow>
          <span style={{ fontSize: 9.5, color: "rgb(var(--ink-3))" }}>4 active</span>
        </div>
        <div>
          {data.leaderboard.map(([n, r, j, rev], i) => (
            <div
              key={n}
              style={{
                padding: "9px 12px",
                display: "grid",
                gridTemplateColumns: "24px 1.4fr .8fr .6fr .8fr",
                gap: 8, alignItems: "center",
                borderTop: i ? "1px dashed rgb(var(--line))" : "none",
              }}
            >
              <div className="font-mono" style={{ fontSize: 10, color: accent, fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ fontSize: 11.5, fontWeight: 600 }}>{n}</div>
              <div style={{ fontSize: 10.5, color: "rgb(var(--ink-3))" }}>{r}</div>
              <div className="font-mono" style={{ fontSize: 11 }}>{j} jobs</div>
              <div className="font-mono" style={{ fontSize: 11, fontWeight: 600, textAlign: "right" }}>{rev}</div>
            </div>
          ))}
        </div>
      </Card>
    </TabFrame>
  );
}

/* ---------- SETTINGS ---------- */

function SettingsView({ product, accent }: { product: Product; accent: string }) {
  const navItems: [string, boolean][] = [
    ["Organisation", true],
    ["Branding", false],
    ["Team & roles", false],
    ["Service catalogue", false],
    ["Templates", false],
    ["Integrations", false],
    ["Billing", false],
    ["Compliance", false],
  ];

  return (
    <TabFrame
      eyebrow="Settings"
      title="Organisation"
      accent={accent}
      right={<Pill tone="accent" accent={accent}>Save changes</Pill>}
    >
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 10, flex: 1, minHeight: 0 }}>
        <Card padded={false}>
          <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 2 }}>
            {navItems.map(([k, on]) => (
              <div
                key={k}
                style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: on ? 600 : 500,
                  color: on ? "rgb(var(--ink))" : "rgb(var(--ink-3))",
                  background: on ? `${accent}1a` : "transparent",
                  cursor: "pointer",
                }}
              >
                {k}
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ overflow: "auto" }}>
          <Eyebrow accent={accent}>Branding · what your customers see</Eyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
            {[
              ["Trading name", "Northwood Tree Services Ltd"],
              ["Domain", "northwoodtree.co.uk"],
              ["Cert / membership", "Arboricultural Assoc · #4471"],
              ["Public email", "jobs@northwoodtree.co.uk"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="font-mono" style={{ fontSize: 8.5, letterSpacing: ".1em", color: "rgb(var(--ink-3))", textTransform: "uppercase" }}>{k}</div>
                <div style={{
                  marginTop: 5, padding: "8px 10px",
                  border: "1px solid rgb(var(--line))",
                  borderRadius: 6, fontSize: 11,
                  background: "rgb(var(--surface-3))",
                }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgb(var(--line))" }}>
            <Eyebrow accent={accent}>Brand colour · used on PDFs, the customer portal, your invoices</Eyebrow>
            <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}>
              {["#22c55e", "#16a34a", "#0891b2", "#0CA5EB", "#d97706", "#dc2626", "#0a0a0a"].map((c) => (
                <div
                  key={c}
                  style={{
                    width: 32, height: 32, borderRadius: 8, background: c,
                    border: c === accent ? "2px solid rgb(var(--ink))" : "1px solid rgb(var(--line))",
                    position: "relative",
                  }}
                >
                  {c === accent && (
                    <div style={{ position: "absolute", inset: -4, borderRadius: 10, border: `1px solid ${accent}` }} />
                  )}
                </div>
              ))}
              <div className="font-mono" style={{ fontSize: 10.5, color: "rgb(var(--ink-3))", marginLeft: 6 }}>Selected · {accent}</div>
            </div>
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgb(var(--line))" }}>
            <Eyebrow accent={accent}>Sample report preview</Eyebrow>
            <div style={{
              marginTop: 10, padding: 14,
              background: `${accent}12`,
              borderRadius: 8, display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 10,
                background: accent, color: "#fff",
                display: "grid", placeItems: "center",
                fontWeight: 700, fontSize: 20,
              }}>{product.name[0]}</div>
              <div style={{ flex: 1 }}>
                <div className="font-mono" style={{ fontSize: 9, letterSpacing: ".12em", color: accent, textTransform: "uppercase" }}>
                  {product.certs[0]?.toUpperCase() ?? ""} CERTIFIED
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>Northwood Tree Services Ltd</div>
                <div style={{ fontSize: 10, color: "rgb(var(--ink-3))", marginTop: 2 }}>Site visit report · 26 Apr 2026 · REF TM-2041</div>
              </div>
              <Pill tone="accent" accent={accent}>Open PDF</Pill>
            </div>
          </div>
        </Card>
      </div>
    </TabFrame>
  );
}

/* ---------- Glyphs ---------- */

type GlyphKind =
  | "home" | "cal" | "users" | "briefcase" | "doc" | "invoice"
  | "chart" | "gear" | "search" | "moon" | "alert";

function Glyph({ kind, size = 14, color }: { kind: GlyphKind; size?: number; color?: string }) {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none",
    stroke: color ?? "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (kind) {
    case "home":      return <svg {...props}><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/></svg>;
    case "cal":       return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>;
    case "users":     return <svg {...props}><circle cx="9" cy="9" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><circle cx="17" cy="7" r="2.5"/></svg>;
    case "briefcase": return <svg {...props}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>;
    case "doc":       return <svg {...props}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h6"/></svg>;
    case "invoice":   return <svg {...props}><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 9h6M9 13h6"/></svg>;
    case "chart":     return <svg {...props}><path d="M3 21h18M6 17V10M11 17V6M16 17v-9"/></svg>;
    case "gear":      return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.3l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2.2-1.3L14 3h-4l-.4 2.4a7 7 0 0 0-2.2 1.3l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .9.1 1.3l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2.2 1.3L10 21h4l.4-2.4a7 7 0 0 0 2.2-1.3l2.3.9 2-3.4-2-1.5c.1-.4.1-.9.1-1.3z"/></svg>;
    case "search":    return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>;
    case "moon":      return <svg {...props}><path d="M21 13a8 8 0 1 1-9-11 6 6 0 0 0 9 11z"/></svg>;
    case "alert":     return <svg {...props}><path d="M12 3l10 18H2z"/><path d="M12 10v4M12 18v.5"/></svg>;
  }
}

// Re-export so consumers can pass `defaultTab` typed
export type { TabKey };
// Needed so the unused-export stripper keeps the data referenced — not a runtime use
void TREE_DATA;
