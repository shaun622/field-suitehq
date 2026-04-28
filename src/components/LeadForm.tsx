"use client";

import { useState } from "react";
import { PRODUCTS, Product } from "@/lib/products";
import { cn } from "@/lib/cn";

interface Props {
  /** Lock the product context (rendered on a product page) */
  product?: Product;
  /** Heading override */
  title?: string;
  /** Subhead override */
  subtitle?: string;
}

type State = "idle" | "submitting" | "ok" | "err";

const FIELD_CLASS =
  "w-full rounded-xl px-4 py-3 transition resize-y " +
  "bg-[rgb(var(--surface-card))] dark:bg-white/[.04] " +
  "border border-[rgb(var(--line))] dark:border-white/[.08] " +
  "text-[rgb(var(--ink))] placeholder:text-[rgb(var(--ink-4))] " +
  "focus:outline-none focus:border-[rgb(var(--brand-500))] " +
  "focus:ring-2 focus:ring-[rgb(var(--brand-500)/.18)]";

export function LeadForm({ product, title, subtitle }: Props) {
  const [state, setState] = useState<State>("idle");
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [interest, setInterest] = useState<string>(product?.slug ?? "");
  const [trap, setTrap] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "submitting") return;
    if (trap) { setState("ok"); return; }

    setState("submitting");
    setErrMsg(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      business: String(fd.get("business") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      interest: String(fd.get("interest") || product?.slug || "").trim(),
      message: String(fd.get("message") || "").trim(),
      source: typeof window !== "undefined" ? window.location.pathname : "",
    };

    if (!payload.email || !payload.email.includes("@")) {
      setErrMsg("Pop in a valid email so we can reply.");
      setState("err");
      return;
    }

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Couldn't send. Try again or email hello@fieldsuite.app.");
      }
      setState("ok");
      (e.target as HTMLFormElement).reset();
      setInterest(product?.slug ?? "");
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : "Something went wrong.";
      setErrMsg(m);
      setState("err");
    }
  };

  if (state === "ok") {
    return (
      <div className={cn(product ? `theme-${product.slug}` : "", "card p-8 lg:p-10 text-center max-w-2xl mx-auto")}>
        <div
          className="w-14 h-14 mx-auto rounded-2xl grid place-items-center"
          style={{ background: "linear-gradient(135deg, rgb(var(--brand-500)), rgb(var(--brand-700)))" }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22"><path d="M4 11l5 5L18 7" stroke="white" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div className="text-2xl font-extrabold text-[rgb(var(--ink))] mt-5 tracking-tight">Got it. Talk soon.</div>
        <div className="text-[rgb(var(--ink-2))] mt-3 leading-relaxed">
          We'll be in touch within one business day. If you're after a same-day reply,
          {" "}<a className="underline underline-offset-4 text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]" href="mailto:hello@fieldsuite.app">email us direct</a>.
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(product ? `theme-${product.slug}` : "", "card p-6 lg:p-8 max-w-2xl mx-auto")}
    >
      {title && <div className="text-2xl font-extrabold text-[rgb(var(--ink))] tracking-tight">{title}</div>}
      {subtitle && <div className="text-[rgb(var(--ink-2))] mt-2 leading-relaxed">{subtitle}</div>}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field name="name" label="Your name" placeholder="Shaun R." required />
        <Field name="email" label="Email" type="email" placeholder="you@example.com" required />
        <Field name="business" label="Business" placeholder="e.g. Byron Tree Co." />
        <Field name="phone" label="Phone (optional)" placeholder="07000 000000" />
      </div>

      {!product && (
        <label className="block mt-3">
          <div className="text-xs uppercase tracking-[.18em] font-mono text-[rgb(var(--ink-3))] mb-2">Which app?</div>
          <select
            name="interest"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className={FIELD_CLASS}
          >
            <option value="">Not sure yet — show me what fits</option>
            {PRODUCTS.map((p) => (
              <option key={p.slug} value={p.slug}>{p.name} — {p.industryShort}</option>
            ))}
          </select>
        </label>
      )}

      <label className="block mt-3">
        <div className="text-xs uppercase tracking-[.18em] font-mono text-[rgb(var(--ink-3))] mb-2">Tell us a bit</div>
        <textarea
          name="message"
          rows={3}
          placeholder="Crew of 4, stuck on a generic CRM, want to ditch the 9pm admin shift…"
          className={FIELD_CLASS}
        />
      </label>

      {/* Honeypot */}
      <input
        type="text"
        name="company"
        value={trap}
        onChange={(e) => setTrap(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        style={{ position: "absolute", left: "-5000px", width: 1, height: 1, opacity: 0 }}
      />

      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          type="submit"
          disabled={state === "submitting"}
          className="btn btn-primary justify-center sm:justify-start disabled:opacity-60 disabled:cursor-wait"
        >
          {state === "submitting" ? "Sending…" : "Get a demo →"}
        </button>
        <span className="text-xs text-[rgb(var(--ink-3))] font-mono tracking-wide">
          No spam. We reply within 1 business day.
        </span>
      </div>

      {state === "err" && errMsg && (
        <div className="mt-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-sm">
          {errMsg}
        </div>
      )}
    </form>
  );
}

function Field({
  name, label, type = "text", placeholder, required,
}: { name: string; label: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-[.18em] font-mono text-[rgb(var(--ink-3))] mb-2">
        {label} {required && <span className="text-[rgb(var(--brand-500))] normal-case tracking-normal">·</span>}
      </div>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className={FIELD_CLASS}
      />
    </label>
  );
}
