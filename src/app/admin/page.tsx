"use client";

import { useEffect, useState, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────
type BusinessRow = {
  id: string;
  name: string;
  email: string | null;
  plan: string | null;
  created_at: string | null;
  trial_ends_at: string | null;
  owner_email: string | null;
  client_count: number;
  active_staff_count: number;
  job_count: number;
  last_job_at: string | null;
};

type BusinessesResponse = {
  app: string;
  businesses: BusinessRow[];
  totals: {
    business_count: number;
    on_trial: number;
    paying: number;
    clients_total: number;
    jobs_total: number;
  };
};

type DetailResponse = {
  business: BusinessRow & {
    abn: string | null;
    phone: string | null;
    logo_url: string | null;
    brand_colour: string | null;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
  };
  staff: { id: string; name: string; role: string; email: string | null; user_id: string | null; is_active: boolean }[];
  recent_jobs: { id: string; title: string; status: string; scheduled_date: string | null; created_at: string }[];
  recent_clients: { id: string; name: string; email: string | null; created_at: string }[];
};

const APPS = [
  { slug: "poolmate", label: "PoolMate" },
  // Add more here as they come online: treemate, awc, etc.
];

const PASSCODE_KEY = "fs-admin-passcode";

// ─── API helpers ─────────────────────────────────────────
async function api<T>(path: string, passcode: string): Promise<T> {
  const res = await fetch(path, {
    headers: { Authorization: `Bearer ${passcode}` },
    cache: "no-store",
  });
  if (res.status === 401) throw new Error("Bad passcode");
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(detail || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ─── Top-level page ──────────────────────────────────────
export default function AdminPage() {
  const [passcode, setPasscode] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Load any stored passcode
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PASSCODE_KEY);
      if (stored) setPasscode(stored);
    } catch {}
    setAuthChecked(true);
  }, []);

  if (!authChecked) {
    return <Loading />;
  }

  if (!passcode) {
    return <Gate onAuthed={(pc) => {
      try { localStorage.setItem(PASSCODE_KEY, pc); } catch {}
      setPasscode(pc);
    }} />;
  }

  return <Dashboard
    passcode={passcode}
    onSignOut={() => {
      try { localStorage.removeItem(PASSCODE_KEY); } catch {}
      setPasscode(null);
    }}
  />;
}

// ─── Passcode gate ───────────────────────────────────────
function Gate({ onAuthed }: { onAuthed: (passcode: string) => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      // Validate by hitting a cheap endpoint
      await api<{ ok: boolean }>("/api/admin/auth", input);
      onAuthed(input);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ marginBottom: 24 }}>
          <p style={eyebrowStyle}>FieldSuite</p>
          <h1 style={titleStyle}>Operator console</h1>
          <p style={subtitleStyle}>
            This area is for internal use. Cloudflare Access protection is pending — for now, enter the operator passcode.
          </p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Passcode"
            autoFocus
            style={inputStyle}
            autoComplete="off"
          />
          {error && <p style={{ color: "#dc2626", fontSize: 13, margin: 0 }}>{error}</p>}
          <button type="submit" disabled={busy || !input} style={buttonPrimaryStyle}>
            {busy ? "Verifying…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main dashboard ──────────────────────────────────────
function Dashboard({ passcode, onSignOut }: { passcode: string; onSignOut: () => void }) {
  const [activeApp, setActiveApp] = useState(APPS[0].slug);
  const [data, setData] = useState<BusinessesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    setLoading(true);
    setError("");
    setData(null);
    try {
      const result = await api<BusinessesResponse>(`/api/admin/businesses?app=${activeApp}`, passcode);
      setData(result);
      // Auto-select first business so the detail panel shows something
      if (result.businesses.length > 0) {
        setSelectedId(prev => prev && result.businesses.some(b => b.id === prev) ? prev : result.businesses[0].id);
      } else {
        setSelectedId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
      // Bad passcode → bounce back to gate
      if (err instanceof Error && err.message === "Bad passcode") {
        onSignOut();
      }
    } finally {
      setLoading(false);
    }
  }, [activeApp, passcode, onSignOut]);

  useEffect(() => { loadList(); }, [loadList]);

  const filtered = data?.businesses.filter(b => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      b.name?.toLowerCase().includes(q) ||
      b.owner_email?.toLowerCase().includes(q) ||
      b.email?.toLowerCase().includes(q)
    );
  }) || [];

  const selected = filtered.find(b => b.id === selectedId) || filtered[0] || null;

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", color: "#0f1218" }}>
      {/* Top bar */}
      <header style={topBarStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <p style={{ ...eyebrowStyle, margin: 0 }}>FieldSuite Operator</p>
          <span style={{ color: "#9ca3af", fontSize: 13 }}>·</span>
          <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{activeApp.toUpperCase()}</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <select
            value={activeApp}
            onChange={(e) => setActiveApp(e.target.value)}
            style={selectStyle}
          >
            {APPS.map(a => <option key={a.slug} value={a.slug}>{a.label}</option>)}
          </select>
          <button onClick={onSignOut} style={buttonGhostStyle}>Sign out</button>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 48px" }}>
        {/* KPIs */}
        {data && (
          <div style={kpiGridStyle}>
            <Kpi label="Businesses" value={data.totals.business_count} />
            <Kpi label="On trial" value={data.totals.on_trial} />
            <Kpi label="Paying" value={data.totals.paying} accent="#15803d" />
            <Kpi label="Total clients" value={data.totals.clients_total} />
            <Kpi label="Total jobs" value={data.totals.jobs_total} />
          </div>
        )}

        {/* Search */}
        <div style={{ marginTop: 24, marginBottom: 12 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or owner email…"
            style={{ ...inputStyle, maxWidth: 320 }}
          />
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "12px 16px", borderRadius: 12, fontSize: 14 }}>
            {error}
          </div>
        )}

        {loading && <Loading />}

        {!loading && data && (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,7fr) minmax(0,5fr)", gap: 16 }}>
            {/* List */}
            <div style={cardStyle2}>
              <div style={listHeaderStyle}>
                <span style={{ flex: 1 }}>Business / Owner</span>
                <span style={{ width: 90 }}>Plan</span>
                <span style={{ width: 70, textAlign: "right" }}>Clients</span>
                <span style={{ width: 70, textAlign: "right" }}>Jobs</span>
                <span style={{ width: 110, textAlign: "right" }}>Last job</span>
              </div>
              {filtered.length === 0 ? (
                <p style={{ padding: 24, color: "#6b7280", margin: 0, textAlign: "center", fontSize: 14 }}>
                  No businesses match.
                </p>
              ) : (
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {filtered.map(b => {
                    const isSelected = b.id === selected?.id;
                    return (
                      <li key={b.id}>
                        <button
                          onClick={() => setSelectedId(b.id)}
                          style={{
                            ...listRowStyle,
                            background: isSelected ? "#eff6ff" : "transparent",
                          }}
                        >
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ display: "block", fontWeight: 600, color: isSelected ? "#1d4ed8" : "#0f1218", fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {b.name || "(unnamed)"}
                            </span>
                            <span style={{ display: "block", color: "#6b7280", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {b.owner_email || "—"}
                            </span>
                          </span>
                          <span style={{ width: 90 }}>
                            <PlanBadge plan={b.plan} trialEndsAt={b.trial_ends_at} />
                          </span>
                          <span style={{ width: 70, textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 13 }}>{b.client_count}</span>
                          <span style={{ width: 70, textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 13 }}>{b.job_count}</span>
                          <span style={{ width: 110, textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 12, color: "#6b7280" }}>
                            {b.last_job_at ? new Date(b.last_job_at).toLocaleDateString("en-AU", { day: "numeric", month: "short" }) : "—"}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Detail panel */}
            <div>
              {selected ? (
                <DetailPanel passcode={passcode} app={activeApp} businessId={selected.id} key={selected.id} />
              ) : (
                <div style={{ ...cardStyle2, padding: 24, color: "#6b7280", fontSize: 14 }}>
                  Select a business to see detail
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function DetailPanel({ passcode, app, businessId }: { passcode: string; app: string; businessId: string }) {
  const [data, setData] = useState<DetailResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError("");
    api<DetailResponse>(`/api/admin/business?app=${app}&id=${businessId}`, passcode)
      .then(setData)
      .catch(err => setError(err instanceof Error ? err.message : "Failed"))
      .finally(() => setLoading(false));
  }, [passcode, app, businessId]);

  if (loading) return <div style={{ ...cardStyle2, padding: 24 }}><Loading /></div>;
  if (error) return <div style={{ ...cardStyle2, padding: 24, color: "#b91c1c", fontSize: 14 }}>{error}</div>;
  if (!data) return null;

  const { business, staff, recent_jobs, recent_clients } = data;

  return (
    <div style={{ ...cardStyle2, padding: 20, position: "sticky", top: 24 }}>
      <p style={eyebrowStyle}>Business detail</p>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "4px 0 4px" }}>{business.name}</h2>
      <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{business.owner_email || "—"}</p>

      <div style={miniGridStyle}>
        <MiniStat label="Plan" value={<PlanBadge plan={business.plan} trialEndsAt={business.trial_ends_at} />} />
        <MiniStat label="Created" value={fmtDate(business.created_at)} />
        <MiniStat label="Clients" value={business.client_count} />
        <MiniStat label="Jobs" value={business.job_count} />
        <MiniStat label="Active staff" value={business.active_staff_count} />
        <MiniStat label="Last job" value={fmtDate(business.last_job_at)} />
      </div>

      {business.stripe_subscription_id && (
        <div style={{ marginTop: 12, fontSize: 11, color: "#6b7280", fontFamily: "var(--font-mono), monospace" }}>
          Stripe sub: {business.stripe_subscription_id}
        </div>
      )}

      <Section title={`Staff (${staff.length})`}>
        {staff.length === 0 ? <Empty /> : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {staff.map(s => (
              <li key={s.id} style={miniRowStyle}>
                <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>
                  {s.name}
                  {!s.is_active && <span style={{ color: "#9ca3af", marginLeft: 6 }}>(inactive)</span>}
                </span>
                <span style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>{s.role}</span>
                {s.user_id && <span style={pillStyle}>login</span>}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={`Recent jobs (${recent_jobs.length})`}>
        {recent_jobs.length === 0 ? <Empty /> : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {recent_jobs.map(j => (
              <li key={j.id} style={miniRowStyle}>
                <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>{j.title}</span>
                <span style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase" }}>{j.status}</span>
                <span style={{ fontSize: 11, color: "#9ca3af", fontVariantNumeric: "tabular-nums" }}>{fmtDate(j.scheduled_date || j.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={`Recent clients (${recent_clients.length})`}>
        {recent_clients.length === 0 ? <Empty /> : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {recent_clients.map(c => (
              <li key={c.id} style={miniRowStyle}>
                <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>{c.name}</span>
                <span style={{ fontSize: 11, color: "#9ca3af", fontVariantNumeric: "tabular-nums" }}>{fmtDate(c.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

// ─── Tiny pieces ─────────────────────────────────────────
function Kpi({ label, value, accent }: { label: string; value: number | string; accent?: string }) {
  return (
    <div style={cardStyle2}>
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: "#6b7280", margin: 0 }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 800, color: accent || "#0f1218", margin: "8px 0 0", fontVariantNumeric: "tabular-nums", letterSpacing: -0.5 }}>{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "#6b7280", margin: 0 }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 600, margin: "4px 0 0", fontVariantNumeric: "tabular-nums" }}>{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid #f3f4f6" }}>
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "#6b7280", margin: "0 0 8px" }}>{title}</p>
      {children}
    </div>
  );
}

function Empty() {
  return <p style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic", margin: 0 }}>None yet</p>;
}

function PlanBadge({ plan, trialEndsAt }: { plan: string | null; trialEndsAt: string | null }) {
  const p = plan || "trial";
  const isTrial = p === "trial";
  const expired = isTrial && trialEndsAt && new Date(trialEndsAt) < new Date();
  const bg = expired ? "#fef2f2" : isTrial ? "#fefce8" : "#dcfce7";
  const fg = expired ? "#b91c1c" : isTrial ? "#854d0e" : "#15803d";
  return (
    <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 999, background: bg, color: fg, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
      {expired ? "expired" : p}
    </span>
  );
}

function Loading() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
      <div style={{ width: 24, height: 24, border: "2px solid #e5e7eb", borderTopColor: "#15803d", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function fmtDate(s: string | null): string {
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "2-digit" });
}

// ─── Inline styles (kept self-contained so admin doesn't depend on
//     marketing site CSS or Tailwind config) ─────────────────────
const containerStyle: React.CSSProperties = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb", padding: 24 };
const cardStyle: React.CSSProperties = { width: "100%", maxWidth: 380, background: "white", borderRadius: 16, padding: 28, boxShadow: "0 10px 40px rgba(0,0,0,0.08), 0 1px 0 rgba(0,0,0,0.04)" };
const cardStyle2: React.CSSProperties = { background: "white", border: "1px solid #f3f4f6", borderRadius: 14, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" };
const eyebrowStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#15803d", margin: 0 };
const titleStyle: React.CSSProperties = { fontSize: 22, fontWeight: 800, margin: "8px 0 8px", letterSpacing: -0.5 };
const subtitleStyle: React.CSSProperties = { fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.5 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", fontSize: 14, border: "1px solid #d1d5db", borderRadius: 10, outline: "none", background: "white", boxSizing: "border-box" };
const buttonPrimaryStyle: React.CSSProperties = { width: "100%", padding: "10px 16px", fontSize: 14, fontWeight: 600, color: "white", background: "#15803d", border: "none", borderRadius: 10, cursor: "pointer" };
const buttonGhostStyle: React.CSSProperties = { padding: "8px 14px", fontSize: 13, fontWeight: 600, color: "#374151", background: "white", border: "1px solid #e5e7eb", borderRadius: 8, cursor: "pointer" };
const selectStyle: React.CSSProperties = { padding: "8px 12px", fontSize: 13, fontWeight: 600, border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer" };
const topBarStyle: React.CSSProperties = { background: "white", borderBottom: "1px solid #f3f4f6", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "100%" };
const kpiGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 };
const listHeaderStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: "1px solid #f3f4f6", background: "#fafbfc", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "#6b7280" };
const listRowStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", width: "100%", border: "none", borderBottom: "1px solid #f3f4f6", textAlign: "left", cursor: "pointer", fontFamily: "inherit", color: "inherit" };
const miniGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 };
const miniRowStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, padding: "6px 0" };
const pillStyle: React.CSSProperties = { fontSize: 9, fontWeight: 700, color: "#15803d", background: "#dcfce7", padding: "2px 6px", borderRadius: 999, textTransform: "uppercase", letterSpacing: 0.5 };
