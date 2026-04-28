/**
 * Cloudflare Pages Function — POST /api/lead
 *
 * Receives a JSON lead from the LeadForm component, sends two emails via
 * Resend: one to the team, one auto-reply to the lead. Honeypot, basic
 * validation, generous rate-limiting via Cloudflare's edge cache.
 *
 * Required env (set in Cloudflare Pages → Settings → Environment variables):
 *   RESEND_API_KEY        re_xxx
 *   LEAD_TO_EMAIL         hello@fieldsuite.app
 *   LEAD_FROM_EMAIL       FieldSuite <noreply@fieldsuite.app>
 * Optional:
 *   TURNSTILE_SECRET      Cloudflare Turnstile secret (if you bolt a widget on)
 */

interface Env {
  RESEND_API_KEY: string;
  LEAD_TO_EMAIL: string;
  LEAD_FROM_EMAIL: string;
  TURNSTILE_SECRET?: string;
}

interface LeadPayload {
  name?: string;
  email?: string;
  business?: string;
  phone?: string;
  interest?: string;
  message?: string;
  source?: string;
  /** Honeypot — should always be empty */
  company?: string;
  /** Turnstile token if widget present */
  cfTurnstile?: string;
}

const PRODUCTS: Record<string, string> = {
  treemate:      "TreeMate · Tree services",
  poolmate:      "PoolMate · Pool service",
  firemate:      "FireMate · Fire safety",
  pestmate:      "PestMate · Pest control",
  hygienemate:   "HygieneMate · Hygiene services",
  locksmithmate: "LocksmithMate · Locksmiths",
  // Legacy *Pro slugs from v1 — gracefully accept if a stale link comes in
  treepro:    "TreeMate · Tree services",
  poolpro:    "PoolMate · Pool service",
  firepro:    "FireMate · Fire safety",
  pestpro:    "PestMate · Pest control",
  hygienepro: "HygieneMate · Hygiene services",
  lockpro:    "LocksmithMate · Locksmiths",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

async function verifyTurnstile(token: string, secret: string, ip: string): Promise<boolean> {
  if (!token) return false;
  const fd = new FormData();
  fd.append("secret", secret);
  fd.append("response", token);
  if (ip) fd.append("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST", body: fd,
  });
  if (!res.ok) return false;
  const data = await res.json() as { success?: boolean };
  return Boolean(data.success);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { error: "Invalid JSON body." });
  }

  // Honeypot — silently 200 so bots don't notice
  if (body.company && body.company.length > 0) {
    return jsonResponse(200, { ok: true });
  }

  const email = String(body.email || "").trim();
  const name = String(body.name || "").trim() || "(no name)";
  const business = String(body.business || "").trim();
  const phone = String(body.phone || "").trim();
  const interest = String(body.interest || "").trim();
  const message = String(body.message || "").trim();
  const source = String(body.source || "").trim();

  if (!email || !email.includes("@") || email.length > 200) {
    return jsonResponse(400, { error: "Provide a valid email address." });
  }
  if (name.length > 200 || business.length > 200 || phone.length > 60 || message.length > 4000) {
    return jsonResponse(400, { error: "One of the fields is too long." });
  }

  // Optional Turnstile
  if (env.TURNSTILE_SECRET) {
    const ip = request.headers.get("CF-Connecting-IP") || "";
    const ok = await verifyTurnstile(body.cfTurnstile || "", env.TURNSTILE_SECRET, ip);
    if (!ok) return jsonResponse(400, { error: "Bot check failed. Refresh and try again." });
  }

  if (!env.RESEND_API_KEY || !env.LEAD_TO_EMAIL || !env.LEAD_FROM_EMAIL) {
    // Local dev / not configured yet — log to response so the form still gives feedback
    console.warn("[lead] missing env — Resend not configured");
    return jsonResponse(500, { error: "Email is not configured yet. Email hello@fieldsuite.app direct." });
  }

  const productLabel = interest && PRODUCTS[interest] ? PRODUCTS[interest] : "(not specified)";
  const subjectInternal = `New lead · ${productLabel} · ${name}`;
  const subjectReply = `Got your FieldSuite enquiry — talk soon`;

  const internalHtml = `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0c1812">
      <div style="font:600 11px/1 'JetBrains Mono',monospace;letter-spacing:.22em;color:#15803d;text-transform:uppercase">New lead</div>
      <h1 style="font:800 24px/1.2 Inter;letter-spacing:-.02em;margin:8px 0 18px">${escapeHtml(productLabel)}</h1>
      <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.55">
        <tbody>
          <tr><td style="padding:8px 0;color:#6b7c70;width:120px">Name</td><td style="padding:8px 0"><strong>${escapeHtml(name)}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#6b7c70">Email</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(email)}" style="color:#15803d">${escapeHtml(email)}</a></td></tr>
          ${business ? `<tr><td style="padding:8px 0;color:#6b7c70">Business</td><td style="padding:8px 0">${escapeHtml(business)}</td></tr>` : ""}
          ${phone ? `<tr><td style="padding:8px 0;color:#6b7c70">Phone</td><td style="padding:8px 0">${escapeHtml(phone)}</td></tr>` : ""}
          ${interest ? `<tr><td style="padding:8px 0;color:#6b7c70">Interest</td><td style="padding:8px 0">${escapeHtml(interest)}</td></tr>` : ""}
          ${source ? `<tr><td style="padding:8px 0;color:#6b7c70">Source</td><td style="padding:8px 0;font:500 12px monospace">${escapeHtml(source)}</td></tr>` : ""}
        </tbody>
      </table>
      ${message ? `
        <div style="margin-top:18px;padding:14px 16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px">
          <div style="font:600 11px/1 'JetBrains Mono',monospace;letter-spacing:.18em;color:#15803d;text-transform:uppercase;margin-bottom:8px">Message</div>
          <div style="white-space:pre-wrap;color:#0c1812;font-size:14px;line-height:1.55">${escapeHtml(message)}</div>
        </div>` : ""}
      <div style="margin-top:24px;padding-top:16px;border-top:1px dashed #d4d4d4;font-size:11px;color:#9ca3af;font-family:'JetBrains Mono',monospace">
        FieldSuite · auto-generated · reply directly to this email to land in ${escapeHtml(email)}
      </div>
    </div>`;

  const replyHtml = `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0c1812">
      <div style="font:600 11px/1 'JetBrains Mono',monospace;letter-spacing:.22em;color:#15803d;text-transform:uppercase">G'day, ${escapeHtml(name.split(" ")[0])}</div>
      <h1 style="font:800 28px/1.15 Inter;letter-spacing:-.025em;margin:10px 0 16px">Got your details. Talk soon.</h1>
      <p style="font-size:15px;line-height:1.6;color:#374151">
        Thanks for reaching out about <strong>${escapeHtml(productLabel)}</strong>. We'll be in touch within one business day with next steps and a sandbox to play in.
      </p>
      <p style="font-size:15px;line-height:1.6;color:#374151">
        If you need a same-day reply, just hit reply on this email — it lands straight in our inbox.
      </p>
      <div style="margin-top:24px;padding:14px 16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;font-size:13px;color:#166534;line-height:1.55">
        Cheers,<br/>The FieldSuite team<br/>
        <a href="mailto:hello@fieldsuite.app" style="color:#15803d">hello@fieldsuite.app</a>
      </div>
      <div style="margin-top:24px;font-size:11px;color:#9ca3af;font-family:'JetBrains Mono',monospace;letter-spacing:.04em">
        FieldSuite · simple CRM + job management for the trades
      </div>
    </div>`;

  // Two parallel sends
  const sendOne = (payload: Record<string, unknown>) =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "authorization": `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

  try {
    const [internalRes, replyRes] = await Promise.all([
      sendOne({
        from: env.LEAD_FROM_EMAIL,
        to: [env.LEAD_TO_EMAIL],
        reply_to: email,
        subject: subjectInternal,
        html: internalHtml,
      }),
      sendOne({
        from: env.LEAD_FROM_EMAIL,
        to: [email],
        subject: subjectReply,
        html: replyHtml,
      }),
    ]);

    if (!internalRes.ok) {
      const detail = await internalRes.text();
      console.error("[lead] internal send failed:", internalRes.status, detail);
      return jsonResponse(502, { error: "Couldn't deliver lead. Email hello@fieldsuite.app direct." });
    }
    if (!replyRes.ok) {
      // Internal already landed; auto-reply failure is non-fatal — log only
      const detail = await replyRes.text();
      console.warn("[lead] reply send failed (non-fatal):", replyRes.status, detail);
    }

    return jsonResponse(200, { ok: true });
  } catch (err: unknown) {
    const m = err instanceof Error ? err.message : "unknown";
    console.error("[lead] exception:", m);
    return jsonResponse(500, { error: "Couldn't reach our email gateway. Try again in a minute." });
  }
};

// Reject everything else
export const onRequest: PagesFunction<Env> = async ({ request }) => {
  return jsonResponse(405, { error: `Method ${request.method} not allowed.` });
};
