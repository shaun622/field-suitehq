"use client";

import { useEffect, useState, useCallback } from "react";
import { PRODUCTS } from "@/lib/products";

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
    staff_seat_override: number | null;
  };
  staff: { id: string; name: string; role: string; email: string | null; user_id: string | null; is_active: boolean }[];
  recent_jobs: { id: string; title: string; status: string; scheduled_date: string | null; created_at: string }[];
  recent_clients: { id: string; name: string; email: string | null; created_at: string }[];
};

// Tiny embedded plan→max_staff map for Phase 1. Phase 2 swaps this for
// a DB-loaded plans catalog so editing a plan in the admin propagates
// to this UI automatically.
const PLAN_DEFAULT_SEATS: Record<string, number> = {
  trial: 1,
  starter: 2,
  pro: 10,
};
function effectiveSeatLimit(plan: string | null, override: number | null): number {
  if (override != null) return override;
  if (plan && PLAN_DEFAULT_SEATS[plan] != null) return PLAN_DEFAULT_SEATS[plan];
  return 1;
}

// Drive the app picker from the marketing site's product registry, so
// adding a product anywhere in PRODUCTS (lib/products.ts) automatically
// makes it available here. The Pages Function will return a clean error
// if the corresponding *_SUPABASE_URL / *_SUPABASE_SERVICE_KEY env vars
// aren't configured yet.
const APPS = PRODUCTS.map((p) => ({ slug: p.slug, label: p.name }));

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
  // Widen to plain string so picking a different app from the dropdown
  // doesn't fight the literal union from PRODUCTS.
  const [activeApp, setActiveApp] = useState<string>(APPS[0].slug);
  const [view, setView] = useState<"businesses" | "plans">("businesses");
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
          {/* View toggle: businesses (default) vs plans catalog */}
          <div style={{ display: "flex", gap: 4, padding: 2, background: "#f3f4f6", borderRadius: 8 }}>
            <button
              onClick={() => setView("businesses")}
              style={{
                padding: "6px 12px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer",
                background: view === "businesses" ? "white" : "transparent",
                color: view === "businesses" ? "#0f1218" : "#6b7280",
                boxShadow: view === "businesses" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              }}
            >Businesses</button>
            <button
              onClick={() => setView("plans")}
              style={{
                padding: "6px 12px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer",
                background: view === "plans" ? "white" : "transparent",
                color: view === "plans" ? "#0f1218" : "#6b7280",
                boxShadow: view === "plans" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              }}
            >Plans</button>
          </div>
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
        {view === "plans" ? (
          <PlansPanel app={activeApp} passcode={passcode} />
        ) : (<>
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
                <span style={{ width: 70, textAlign: "right" }}>Staff</span>
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
                          <span style={{ width: 70, textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 13 }}>{b.active_staff_count}</span>
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
                <DetailPanel
                  passcode={passcode}
                  app={activeApp}
                  businessId={selected.id}
                  onActionComplete={loadList}
                  key={selected.id}
                />
              ) : (
                <div style={{ ...cardStyle2, padding: 24, color: "#6b7280", fontSize: 14 }}>
                  Select a business to see detail
                </div>
              )}
            </div>
          </div>
        )}
        </>)}
      </main>
    </div>
  );
}

function DetailPanel({
  passcode,
  app,
  businessId,
  onActionComplete,
}: {
  passcode: string;
  app: string;
  businessId: string;
  onActionComplete: () => void;
}) {
  const [data, setData] = useState<DetailResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    setLoading(true);
    setError("");
    api<DetailResponse>(`/api/admin/business?app=${app}&id=${businessId}`, passcode)
      .then(setData)
      .catch(err => setError(err instanceof Error ? err.message : "Failed"))
      .finally(() => setLoading(false));
  }, [passcode, app, businessId]);

  useEffect(() => { refetch(); }, [refetch]);

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
        <MiniStat
          label="Plan"
          value={
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <PlanBadge plan={business.plan} trialEndsAt={business.trial_ends_at} />
              <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>
                × {effectiveSeatLimit(business.plan, business.staff_seat_override)} seats
              </span>
              {business.staff_seat_override != null && (
                <span style={{ fontSize: 9, fontWeight: 700, color: "#7c2d12", background: "#ffedd5", padding: "2px 5px", borderRadius: 999, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  override
                </span>
              )}
            </span>
          }
        />
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
              <li key={s.id} style={{ ...miniRowStyle, alignItems: "flex-start", padding: "8px 0" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0f1218", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {s.name}
                    </span>
                    {!s.is_active && <span style={{ fontSize: 10, color: "#9ca3af", fontStyle: "italic" }}>inactive</span>}
                    {s.user_id && <span style={pillStyle}>login</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.email || <span style={{ color: "#d1d5db" }}>no email</span>}
                  </div>
                </div>
                <span style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600, marginTop: 2 }}>
                  {s.role}
                </span>
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

      <OperatorActions
        passcode={passcode}
        app={app}
        businessId={businessId}
        businessName={business.name}
        currentPlan={business.plan}
        currentSeatOverride={business.staff_seat_override}
        ownerEmail={business.owner_email}
        onActionComplete={() => { refetch(); onActionComplete(); }}
        onDeleted={onActionComplete}
      />
    </div>
  );
}

// ─── Operator actions panel ─────────────────────────────────────
function OperatorActions({
  passcode,
  app,
  businessId,
  businessName,
  currentPlan,
  currentSeatOverride,
  ownerEmail,
  onActionComplete,
  onDeleted,
}: {
  passcode: string;
  app: string;
  businessId: string;
  businessName: string;
  currentPlan: string | null;
  currentSeatOverride: number | null;
  ownerEmail: string | null;
  onActionComplete: () => void;
  onDeleted: () => void;
}) {
  type ModalKind = null | "reset" | "set" | "impersonate" | "plan" | "delete" | "seats";
  const [modal, setModal] = useState<ModalKind>(null);

  // Inline busy state for the trial-extension pills (no modal — one-click action)
  const [extendBusy, setExtendBusy] = useState<number | null>(null);
  const [extendError, setExtendError] = useState("");

  async function postAction(path: string, body: object) {
    const res = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: `Bearer ${passcode}` },
      body: JSON.stringify({ app, business_id: businessId, ...body }),
    });
    const data = await res.json().catch(() => ({})) as Record<string, unknown>;
    if (!res.ok) throw new Error((data?.error as string) || `Request failed: ${res.status}`);
    return data;
  }

  async function extendTrial(days: 7 | 14 | 30) {
    setExtendBusy(days);
    setExtendError("");
    try {
      await postAction("/api/admin/business/extend-trial", { days });
      onActionComplete();
    } catch (err) {
      setExtendError(err instanceof Error ? err.message : "Failed");
    } finally {
      setExtendBusy(null);
    }
  }

  return (
    <Section title="Operator actions">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Reset password */}
        <ActionRow
          label="Reset password"
          hint={`Send recovery link to ${ownerEmail || "owner"}`}
          buttonLabel="Reset"
          onClick={() => setModal("reset")}
        />

        {/* Set new password directly */}
        <ActionRow
          label="Set new password"
          hint="Operator types it, owner uses immediately"
          buttonLabel="Set"
          onClick={() => setModal("set")}
        />

        {/* Impersonate */}
        <ActionRow
          label="Impersonate owner"
          hint="Magic-link URL to open in incognito"
          buttonLabel="Generate"
          onClick={() => setModal("impersonate")}
        />

        {/* Extend trial — three pill buttons inline */}
        <div style={{ ...actionRowStyle, alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={actionLabelStyle}>Extend trial</p>
            <p style={actionHintStyle}>Bumps trial_ends_at forward</p>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[7, 14, 30].map(d => (
              <button
                key={d}
                onClick={() => extendTrial(d as 7 | 14 | 30)}
                disabled={extendBusy !== null}
                style={{
                  ...pillButtonStyle,
                  opacity: extendBusy !== null && extendBusy !== d ? 0.4 : 1,
                }}
              >
                {extendBusy === d ? "…" : `+${d}d`}
              </button>
            ))}
          </div>
        </div>
        {extendError && (
          <p style={{ fontSize: 11, color: "#b91c1c", margin: "0 0 0 0" }}>{extendError}</p>
        )}

        {/* Change plan */}
        <ActionRow
          label="Change plan"
          hint={`Currently: ${currentPlan || "trial"}`}
          buttonLabel="Change"
          onClick={() => setModal("plan")}
        />

        {/* Staff seat override — per-business hand-tune of the plan default */}
        <ActionRow
          label="Staff seat override"
          hint={
            currentSeatOverride != null
              ? `Currently: ${currentSeatOverride} seats (override)`
              : `Currently: plan default (${effectiveSeatLimit(currentPlan, null)} seats)`
          }
          buttonLabel={currentSeatOverride != null ? "Change" : "Set"}
          onClick={() => setModal("seats")}
        />

        {/* Delete business — destructive, visually separated and red-tinted */}
        <div style={{ marginTop: 6, paddingTop: 10, borderTop: "1px dashed #fecaca" }}>
          <div style={actionRowStyle}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ ...actionLabelStyle, color: "#b91c1c" }}>Delete business</p>
              <p style={actionHintStyle}>Permanently removes the tenant and all its data</p>
            </div>
            <button
              onClick={() => setModal("delete")}
              style={{ ...pillButtonStyle, color: "#b91c1c", borderColor: "#fecaca", background: "#fef2f2" }}
            >
              Delete…
            </button>
          </div>
        </div>
      </div>

      {modal === "reset" && (
        <ResetPasswordModal
          onClose={() => setModal(null)}
          onSubmit={() => postAction("/api/admin/business/reset-password", {})}
          onComplete={onActionComplete}
        />
      )}
      {modal === "set" && (
        <SetPasswordModal
          onClose={() => setModal(null)}
          onSubmit={(pw) => postAction("/api/admin/business/set-password", { new_password: pw })}
          onComplete={onActionComplete}
        />
      )}
      {modal === "impersonate" && (
        <ImpersonateModal
          onClose={() => setModal(null)}
          onSubmit={() => postAction("/api/admin/business/impersonate", {})}
          onComplete={onActionComplete}
        />
      )}
      {modal === "plan" && (
        <ChangePlanModal
          currentPlan={currentPlan}
          passcode={passcode}
          app={app}
          onClose={() => setModal(null)}
          onSubmit={(plan) => postAction("/api/admin/business/change-plan", { new_plan: plan })}
          onComplete={onActionComplete}
        />
      )}
      {modal === "seats" && (
        <StaffOverrideModal
          currentPlan={currentPlan}
          currentOverride={currentSeatOverride}
          onClose={() => setModal(null)}
          onSubmit={(override) => postAction("/api/admin/business/set-staff-override", { override })}
          onComplete={onActionComplete}
        />
      )}
      {modal === "delete" && (
        <DeleteBusinessModal
          businessName={businessName}
          onClose={() => setModal(null)}
          onSubmit={(confirmName) => postAction("/api/admin/business/delete", { confirm_name: confirmName })}
          onComplete={onDeleted}
        />
      )}
    </Section>
  );
}

function ActionRow({ label, hint, buttonLabel, onClick }: { label: string; hint: string; buttonLabel: string; onClick: () => void }) {
  return (
    <div style={actionRowStyle}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={actionLabelStyle}>{label}</p>
        <p style={actionHintStyle}>{hint}</p>
      </div>
      <button onClick={onClick} style={pillButtonStyle}>{buttonLabel}</button>
    </div>
  );
}

// ─── Modal shell ─────────────────────────────────────────────
function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={modalBackdropStyle} onClick={onClose}>
      <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={modalCloseStyle} aria-label="Close">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Reset password modal ────────────────────────────────────
function ResetPasswordModal({ onClose, onSubmit, onComplete }: {
  onClose: () => void;
  onSubmit: () => Promise<Record<string, unknown>>;
  onComplete: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ link?: string; email?: string; emailSent?: boolean } | null>(null);

  async function go() {
    setBusy(true);
    setError("");
    try {
      const r = await onSubmit();
      setResult({
        link: r.recovery_link as string | undefined,
        email: r.owner_email as string | undefined,
        emailSent: r.email_sent as boolean | undefined,
      });
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalShell title="Reset password" onClose={onClose}>
      {!result ? (
        <>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 12px" }}>
            Sends a recovery email to the owner AND returns a one-time recovery link you can share directly.
          </p>
          {error && <p style={modalErrorStyle}>{error}</p>}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={onClose} style={modalGhostStyle}>Cancel</button>
            <button onClick={go} disabled={busy} style={modalPrimaryStyle}>
              {busy ? "Sending…" : "Send reset"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={modalSuccessBoxStyle}>
            <p style={{ margin: 0, fontSize: 13, color: "#15803d", fontWeight: 600 }}>
              ✓ Reset triggered for {result.email || "owner"}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#15803d" }}>
              Email {result.emailSent ? "sent" : "FAILED — use the link below"}
            </p>
          </div>
          {result.link && (
            <>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "#6b7280", margin: "0 0 6px" }}>
                One-time recovery link
              </p>
              <CopyField value={result.link} />
            </>
          )}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 14 }}>
            <button onClick={onClose} style={modalPrimaryStyle}>Done</button>
          </div>
        </>
      )}
    </ModalShell>
  );
}

// ─── Set password modal ───────────────────────────────────────
function SetPasswordModal({ onClose, onSubmit, onComplete }: {
  onClose: () => void;
  onSubmit: (pw: string) => Promise<Record<string, unknown>>;
  onComplete: () => void;
}) {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function go(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (pw.length < 6) return setError("Password must be at least 6 characters");
    if (pw !== confirm) return setError("Passwords do not match");
    setBusy(true);
    try {
      await onSubmit(pw);
      setDone(true);
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalShell title="Set new password" onClose={onClose}>
      {done ? (
        <>
          <div style={modalSuccessBoxStyle}>
            <p style={{ margin: 0, fontSize: 13, color: "#15803d", fontWeight: 600 }}>
              ✓ Password updated
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#15803d" }}>
              Owner can sign in immediately. Communicate the new password out-of-band.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
            <button onClick={onClose} style={modalPrimaryStyle}>Done</button>
          </div>
        </>
      ) : (
        <form onSubmit={go} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
            Sets the owner's password. They can log in immediately. You'll need to tell them the new password yourself.
          </p>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="New password (min 6 chars)"
            autoFocus
            autoComplete="new-password"
            style={inputStyle}
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm password"
            autoComplete="new-password"
            style={inputStyle}
          />
          {error && <p style={modalErrorStyle}>{error}</p>}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} style={modalGhostStyle}>Cancel</button>
            <button type="submit" disabled={busy || pw.length < 6} style={modalPrimaryStyle}>
              {busy ? "Updating…" : "Update password"}
            </button>
          </div>
        </form>
      )}
    </ModalShell>
  );
}

// ─── Impersonate modal ────────────────────────────────────────
function ImpersonateModal({ onClose, onSubmit, onComplete }: {
  onClose: () => void;
  onSubmit: () => Promise<Record<string, unknown>>;
  onComplete: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  async function go() {
    setBusy(true);
    setError("");
    try {
      const r = await onSubmit();
      setLink((r.link as string) || null);
      setEmail((r.owner_email as string) || null);
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalShell title="Impersonate owner" onClose={onClose}>
      {!link ? (
        <>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 12px" }}>
            Generates a one-time magic-link URL. Open it in an <strong>incognito window</strong> for proper session isolation — clicking in your normal window will replace your operator session with the owner's.
          </p>
          {error && <p style={modalErrorStyle}>{error}</p>}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={onClose} style={modalGhostStyle}>Cancel</button>
            <button onClick={go} disabled={busy} style={modalPrimaryStyle}>
              {busy ? "Generating…" : "Generate link"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={modalSuccessBoxStyle}>
            <p style={{ margin: 0, fontSize: 13, color: "#15803d", fontWeight: 600 }}>
              ✓ Magic link ready for {email || "owner"}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#15803d" }}>
              Single-use. Open in an incognito window.
            </p>
          </div>
          <CopyField value={link} />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 14 }}>
            <button onClick={() => window.open(link, "_blank")} style={modalGhostStyle}>
              Open in new tab
            </button>
            <button onClick={onClose} style={modalPrimaryStyle}>Done</button>
          </div>
        </>
      )}
    </ModalShell>
  );
}

// ─── Change plan modal ────────────────────────────────────────
function ChangePlanModal({ currentPlan, passcode, app, onClose, onSubmit, onComplete }: {
  currentPlan: string | null;
  passcode: string;
  app: string;
  onClose: () => void;
  onSubmit: (plan: string) => Promise<Record<string, unknown>>;
  onComplete: () => void;
}) {
  const [plan, setPlan] = useState(currentPlan || "trial");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // Plan options come from /api/admin/plans which reads the live plans
  // table for this app — no more hardcoded list. Inactive plans are
  // hidden so operators can't move tenants onto a discontinued tier.
  const [planOptions, setPlanOptions] = useState<{ slug: string; name: string; max_staff: number }[] | null>(null);

  useEffect(() => {
    api<{ plans: { slug: string; name: string; max_staff: number; is_active: boolean }[] }>(
      `/api/admin/plans?app=${app}`,
      passcode,
    )
      .then(r => setPlanOptions(r.plans.filter(p => p.is_active)))
      .catch(err => setError(err instanceof Error ? err.message : "Failed to load plans"));
  }, [app, passcode]);

  async function go(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onSubmit(plan);
      onComplete();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setBusy(false);
    }
  }

  return (
    <ModalShell title="Change plan" onClose={onClose}>
      <form onSubmit={go} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
          Sets the plan field directly. Use for manual subscription handling pre-Stripe, or to reset a tenant for testing.
        </p>
        {planOptions === null ? (
          <p style={{ fontSize: 12, color: "#9ca3af" }}>Loading plans…</p>
        ) : (
          <select value={plan} onChange={(e) => setPlan(e.target.value)} style={selectStyle}>
            {planOptions.map(p => (
              <option key={p.slug} value={p.slug}>{p.name} ({p.slug}) · {p.max_staff} seats</option>
            ))}
          </select>
        )}
        {error && <p style={modalErrorStyle}>{error}</p>}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button type="button" onClick={onClose} style={modalGhostStyle}>Cancel</button>
          <button type="submit" disabled={busy || plan === currentPlan || planOptions === null} style={modalPrimaryStyle}>
            {busy ? "Saving…" : "Apply"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ─── Staff seat override modal ────────────────────────────────
function StaffOverrideModal({ currentPlan, currentOverride, onClose, onSubmit, onComplete }: {
  currentPlan: string | null;
  currentOverride: number | null;
  onClose: () => void;
  onSubmit: (override: number | null) => Promise<Record<string, unknown>>;
  onComplete: () => void;
}) {
  // Initial value: if an override is set, show it; otherwise pre-fill with the plan default.
  const planDefault = effectiveSeatLimit(currentPlan, null);
  const [value, setValue] = useState<string>(
    currentOverride != null ? String(currentOverride) : String(planDefault),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function parsed(): number | null {
    const t = value.trim();
    if (t === "") return NaN;
    const n = Number(t);
    if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0 || n > 1000) return NaN;
    return n;
  }

  async function setOverride(e: React.FormEvent) {
    e.preventDefault();
    const n = parsed();
    if (typeof n !== "number" || Number.isNaN(n)) {
      setError("Enter a non-negative integer up to 1000");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await onSubmit(n);
      onComplete();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setBusy(false);
    }
  }

  async function clearOverride() {
    setBusy(true);
    setError("");
    try {
      await onSubmit(null);
      onComplete();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setBusy(false);
    }
  }

  return (
    <ModalShell title="Staff seat override" onClose={onClose}>
      <form onSubmit={setOverride} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
          Plan default for <strong>{currentPlan || "trial"}</strong> is <strong>{planDefault}</strong>{" "}
          {planDefault === 1 ? "seat" : "seats"}. Overriding affects only this business.
        </p>
        <label style={{ fontSize: 12, color: "#374151" }}>
          Override seat limit
          <span style={{ display: "block", fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
            0 means no staff allowed. 1000 max.
          </span>
        </label>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={1000}
          step={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          style={inputStyle}
        />
        {error && <p style={modalErrorStyle}>{error}</p>}
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
          {currentOverride != null ? (
            <button
              type="button"
              onClick={clearOverride}
              disabled={busy}
              style={{ ...modalGhostStyle, color: "#b91c1c", borderColor: "#fecaca" }}
            >
              Clear override
            </button>
          ) : (
            <span />
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={onClose} style={modalGhostStyle}>Cancel</button>
            <button type="submit" disabled={busy} style={modalPrimaryStyle}>
              {busy ? "Saving…" : "Set override"}
            </button>
          </div>
        </div>
      </form>
    </ModalShell>
  );
}

// ─── Delete business modal ────────────────────────────────────
function DeleteBusinessModal({ businessName, onClose, onSubmit, onComplete }: {
  businessName: string;
  onClose: () => void;
  onSubmit: (confirmName: string) => Promise<Record<string, unknown>>;
  onComplete: () => void;
}) {
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ authDeleted: boolean; reason: string | null } | null>(null);

  // Case-insensitive trimmed compare so the operator doesn't have to
  // match capitalisation perfectly. Server enforces the same check.
  const matches = confirmText.trim().toLowerCase() === (businessName || "").trim().toLowerCase();

  async function go(e: React.FormEvent) {
    e.preventDefault();
    if (!matches) return;
    setBusy(true);
    setError("");
    try {
      const r = await onSubmit(confirmText.trim());
      setResult({
        authDeleted: !!r.auth_user_deleted,
        reason: (r.auth_not_deleted_reason as string | null) || null,
      });
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setBusy(false);
    }
  }

  // Result screen — show after the cascade succeeds, before the modal closes.
  if (result) {
    return (
      <ModalShell title="Business deleted" onClose={onClose}>
        <div style={modalSuccessBoxStyle}>
          <p style={{ margin: 0, fontSize: 13, color: "#15803d", fontWeight: 600 }}>
            ✓ {businessName} and all its data removed
          </p>
        </div>
        <div style={{ marginTop: 10, padding: "10px 12px", background: result.authDeleted ? "#f0fdf4" : "#fefce8", border: `1px solid ${result.authDeleted ? "#bbf7d0" : "#fde68a"}`, borderRadius: 10 }}>
          {result.authDeleted ? (
            <>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#15803d" }}>
                ✓ Owner auth account deleted
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "#166534" }}>
                The email is now free to be reused for a new signup or staff login.
              </p>
            </>
          ) : (
            <>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#854d0e" }}>
                ⚠ Owner auth account kept
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "#713f12" }}>
                {result.reason || "auth user retained"}. The email cannot be reused until the auth user is removed manually.
              </p>
            </>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
          <button onClick={onClose} style={modalPrimaryStyle}>Done</button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell title="Delete business" onClose={onClose}>
      <div style={modalDangerBoxStyle}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#991b1b" }}>This cannot be undone.</p>
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "#7f1d1d", lineHeight: 1.5 }}>
          Permanently deletes <strong>{businessName}</strong> and every row that references it: clients, pools, jobs, recurring profiles, quotes, invoices, service records (chemicals, photos, tasks), staff, automations, surveys, documents, templates. The owner&apos;s auth account is also removed so the email can be reused — unless they own another business or are a staff member elsewhere, in which case the auth user is preserved.
        </p>
      </div>
      <form onSubmit={go} style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
        <label style={{ fontSize: 12, color: "#374151" }}>
          To confirm, type the business name exactly:
          <span style={{ display: "block", fontSize: 11, color: "#6b7280", marginTop: 2, fontFamily: "monospace" }}>{businessName}</span>
        </label>
        <input
          autoFocus
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="Type the business name"
          style={inputStyle}
          autoComplete="off"
        />
        {error && <p style={modalErrorStyle}>{error}</p>}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button type="button" onClick={onClose} style={modalGhostStyle}>Cancel</button>
          <button
            type="submit"
            disabled={!matches || busy}
            style={{
              ...modalPrimaryStyle,
              background: !matches || busy ? "#fca5a5" : "#dc2626",
              cursor: !matches || busy ? "not-allowed" : "pointer",
            }}
          >
            {busy ? "Deleting…" : "Delete forever"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ─── Copy-to-clipboard field ──────────────────────────────────
function CopyField({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <div style={{ display: "flex", gap: 6 }}>
      <input value={value} readOnly style={{ ...inputStyle, fontSize: 11, fontFamily: "monospace" }} />
      <button onClick={copy} style={{ ...modalGhostStyle, minWidth: 70 }}>
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

// ─── Plans panel (per-app plan catalog editor) ──────────────────
type PlanRow = {
  slug: string;
  name: string;
  price_cents: number;
  period: string;
  max_staff: number;
  features: Record<string, unknown>;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
};

function PlansPanel({ app, passcode }: { app: string; passcode: string }) {
  const [plans, setPlans] = useState<PlanRow[] | null>(null);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setPlans(null);
    setError("");
    api<{ plans: PlanRow[] }>(`/api/admin/plans?app=${app}`, passcode)
      .then(r => setPlans(r.plans))
      .catch(err => setError(err instanceof Error ? err.message : "Failed"));
  }, [app, passcode, reloadKey]);

  if (error) {
    return (
      <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "12px 16px", borderRadius: 12, fontSize: 14 }}>
        {error}
      </div>
    );
  }
  if (plans === null) return <Loading />;

  if (plans.length === 0) {
    return (
      <div style={{ ...cardStyle2, padding: 24, color: "#6b7280", fontSize: 14 }}>
        No plans seeded for <strong>{app}</strong>. Apply the <code>plans</code> migration on this app&apos;s Supabase first.
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <p style={{ ...eyebrowStyle, margin: 0 }}>Plans · {app}</p>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0", lineHeight: 1.5 }}>
          Edits apply to every business currently on each plan. Slug is the primary key — it cannot be changed. To retire a plan, toggle <strong>Active</strong> off (existing assignments keep working, but operators and customers can&apos;t pick it).
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 16 }}>
        {plans.map(p => (
          <PlanCard
            key={p.slug}
            initial={p}
            app={app}
            passcode={passcode}
            onSaved={() => setReloadKey(k => k + 1)}
          />
        ))}
      </div>
    </div>
  );
}

function PlanCard({ initial, app, passcode, onSaved }: {
  initial: PlanRow;
  app: string;
  passcode: string;
  onSaved: () => void;
}) {
  // Local draft that the operator edits — only POSTs the diff on save.
  const [draft, setDraft] = useState<PlanRow>(initial);
  const [featuresText, setFeaturesText] = useState<string>(JSON.stringify(initial.features, null, 2));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  // Detect changes between draft and initial server state for the
  // Save / Reset buttons. Features text compares post-parse so
  // formatting whitespace doesn't count as a change.
  const featuresParsed = (() => {
    try { return JSON.parse(featuresText); } catch { return null; }
  })();
  const featuresDirty = featuresParsed !== null && JSON.stringify(featuresParsed) !== JSON.stringify(initial.features);
  const dirty = (
    draft.name !== initial.name ||
    draft.price_cents !== initial.price_cents ||
    draft.period !== initial.period ||
    draft.max_staff !== initial.max_staff ||
    draft.sort_order !== initial.sort_order ||
    draft.is_active !== initial.is_active ||
    featuresDirty
  );

  function reset() {
    setDraft(initial);
    setFeaturesText(JSON.stringify(initial.features, null, 2));
    setError("");
    setSaved(false);
  }

  function formatJson() {
    try {
      const parsed = JSON.parse(featuresText);
      setFeaturesText(JSON.stringify(parsed, null, 2));
      setError("");
    } catch {
      setError("Features is not valid JSON");
    }
  }

  async function save() {
    setBusy(true);
    setError("");
    if (featuresParsed === null) {
      setError("Features is not valid JSON");
      setBusy(false);
      return;
    }
    const patch: Record<string, unknown> = {};
    if (draft.name !== initial.name) patch.name = draft.name;
    if (draft.price_cents !== initial.price_cents) patch.price_cents = draft.price_cents;
    if (draft.period !== initial.period) patch.period = draft.period;
    if (draft.max_staff !== initial.max_staff) patch.max_staff = draft.max_staff;
    if (draft.sort_order !== initial.sort_order) patch.sort_order = draft.sort_order;
    if (draft.is_active !== initial.is_active) patch.is_active = draft.is_active;
    if (featuresDirty) patch.features = featuresParsed;

    try {
      const res = await fetch("/api/admin/plans/update", {
        method: "POST",
        headers: { "content-type": "application/json", Authorization: `Bearer ${passcode}` },
        body: JSON.stringify({ app, slug: draft.slug, patch }),
      });
      const data = await res.json().catch(() => ({})) as Record<string, unknown>;
      if (!res.ok) throw new Error((data?.error as string) || `Failed: ${res.status}`);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ ...cardStyle2, padding: 16, opacity: draft.is_active ? 1 : 0.6 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, fontFamily: "monospace", padding: "2px 8px", background: "#f3f4f6", borderRadius: 4 }}>
          {draft.slug}
        </span>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: draft.is_active ? "#15803d" : "#6b7280" }}>
          <input
            type="checkbox"
            checked={draft.is_active}
            onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
          />
          Active
        </label>
      </div>

      <PlanField label="Name" value={draft.name} onChange={v => setDraft({ ...draft, name: v })} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <PlanField
          label="Price (cents)"
          type="number"
          value={String(draft.price_cents)}
          onChange={v => setDraft({ ...draft, price_cents: Math.max(0, parseInt(v) || 0) })}
          hint={`= ${formatPriceDisplay(draft.price_cents)}`}
        />
        <PlanField
          label="Period"
          value={draft.period}
          onChange={v => setDraft({ ...draft, period: v })}
          hint="month | year | once | 14 days"
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <PlanField
          label="Max staff"
          type="number"
          value={String(draft.max_staff)}
          onChange={v => setDraft({ ...draft, max_staff: Math.max(0, parseInt(v) || 0) })}
        />
        <PlanField
          label="Sort order"
          type="number"
          value={String(draft.sort_order)}
          onChange={v => setDraft({ ...draft, sort_order: Math.max(0, parseInt(v) || 0) })}
        />
      </div>

      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginTop: 10, marginBottom: 4 }}>
        Features (JSON)
      </label>
      <textarea
        value={featuresText}
        onChange={(e) => setFeaturesText(e.target.value)}
        rows={Math.min(12, Math.max(4, featuresText.split("\n").length))}
        style={{ width: "100%", padding: "8px 10px", fontSize: 11, fontFamily: "monospace", border: "1px solid #d1d5db", borderRadius: 8, resize: "vertical", boxSizing: "border-box" }}
      />
      <button
        type="button"
        onClick={formatJson}
        style={{ marginTop: 4, padding: "4px 10px", fontSize: 11, fontWeight: 600, color: "#374151", background: "white", border: "1px solid #e5e7eb", borderRadius: 6, cursor: "pointer" }}
      >
        Format JSON
      </button>

      {error && <p style={{ ...modalErrorStyle, marginTop: 10 }}>{error}</p>}

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 14 }}>
        <button onClick={reset} disabled={!dirty || busy} style={{ ...modalGhostStyle, opacity: !dirty || busy ? 0.5 : 1 }}>
          Reset
        </button>
        <button onClick={save} disabled={!dirty || busy} style={{ ...modalPrimaryStyle, opacity: !dirty || busy ? 0.5 : 1 }}>
          {busy ? "Saving…" : saved ? "Saved ✓" : "Save"}
        </button>
      </div>
    </div>
  );
}

function PlanField({ label, value, onChange, type = "text", hint }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  hint?: string;
}) {
  return (
    <div style={{ marginBottom: 8 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "6px 10px", fontSize: 13, border: "1px solid #d1d5db", borderRadius: 8, boxSizing: "border-box" }}
      />
      {hint && <p style={{ fontSize: 10, color: "#9ca3af", margin: "2px 0 0" }}>{hint}</p>}
    </div>
  );
}

function formatPriceDisplay(cents: number): string {
  if (!cents) return "Free";
  const d = cents / 100;
  return Number.isInteger(d) ? `$${d}` : `$${d.toFixed(2)}`;
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
// ─── Operator actions styles ─────────────────────────────────
const actionRowStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 12, padding: "8px 0" };
const actionLabelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#0f1218", margin: 0 };
const actionHintStyle: React.CSSProperties = { fontSize: 11, color: "#6b7280", margin: "2px 0 0" };
const pillButtonStyle: React.CSSProperties = { padding: "5px 12px", fontSize: 11, fontWeight: 600, color: "#374151", background: "white", border: "1px solid #e5e7eb", borderRadius: 999, cursor: "pointer", whiteSpace: "nowrap" };
// Modal
const modalBackdropStyle: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(15, 18, 24, 0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 100 };
const modalCardStyle: React.CSSProperties = { width: "100%", maxWidth: 440, background: "white", borderRadius: 14, padding: 20, boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)" };
const modalCloseStyle: React.CSSProperties = { background: "transparent", border: "none", fontSize: 22, color: "#9ca3af", cursor: "pointer", lineHeight: 1, padding: "0 4px" };
const modalPrimaryStyle: React.CSSProperties = { padding: "8px 16px", fontSize: 13, fontWeight: 600, color: "white", background: "#15803d", border: "none", borderRadius: 8, cursor: "pointer" };
const modalGhostStyle: React.CSSProperties = { padding: "8px 14px", fontSize: 13, fontWeight: 600, color: "#374151", background: "white", border: "1px solid #e5e7eb", borderRadius: 8, cursor: "pointer" };
const modalErrorStyle: React.CSSProperties = { fontSize: 12, color: "#b91c1c", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "6px 10px", margin: 0 };
const modalSuccessBoxStyle: React.CSSProperties = { background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 12px", marginBottom: 12 };
const modalDangerBoxStyle: React.CSSProperties = { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 14px" };
