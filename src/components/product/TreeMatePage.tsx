import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LeadForm } from "@/components/LeadForm";
import { Phone } from "@/components/phones/Phone";
import {
  PhoneJobs, PhoneQuote, PhonePortal, PhonePipeline,
} from "@/components/phones/PhoneScreens";
import { HowItRuns } from "@/components/marketing/HowItRuns";
import { Product } from "@/lib/products";
import { TREEMATE_COPY, PIPELINE_STEPS } from "@/lib/treemate-copy";

export function TreeMatePage({ product }: { product: Product }) {
  return (
    <main className={`theme-${product.slug} min-h-screen bg-[rgb(var(--surface))] text-[rgb(var(--ink))]`}>
      <Nav product={product} />

      {/* ---------- HERO ---------- */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden canvas-smart">
        <div className="halo" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="aus-badge">AUS · MOBILE-FIRST</span>
              <span className="aus-badge">AS 4373 BAKED IN</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[80px] font-extrabold tracking-tight leading-[0.98] text-[rgb(var(--ink))]">
              Quote on-site.{" "}
              <em className="font-display italic font-semibold not-italic-fallback text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]" style={{ fontStyle: "italic" }}>
                Win on-site.
              </em>
            </h1>

            <p className="mt-7 text-lg lg:text-xl text-[rgb(var(--ink-2))] leading-relaxed max-w-2xl">
              TreeMate is the field-first CRM + job-management app for Aussie arborists. Site photos, AS 4373 line items, hazard tags, customer portal &mdash; tap, tap, send. Quote, accept, deposit, scheduled. All before you've reversed out.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="#contact" className="btn btn-primary">Start 14-day trial →</Link>
              <Link href="#how" className="btn btn-ghost">See it run</Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[rgb(var(--ink-3))]">
              <span>Free 14-day trial</span><span>·</span>
              <span>No card</span><span>·</span>
              <span>Built by an arborist</span><span>·</span>
              <span>AUD/GST</span>
            </div>
          </div>

          {/* Hero phone */}
          <div className="lg:col-span-5 relative h-[480px] sm:h-[560px] lg:h-[680px]">
            <div className="absolute right-0 top-4 lg:right-4" style={{ transform: "rotate(4deg)" }}>
              <Phone width={310} height={640}><PhoneQuote /></Phone>
            </div>
            <div className="absolute -left-2 bottom-4 hidden lg:block" style={{ transform: "rotate(-6deg)" }}>
              <Phone width={240} height={500}><PhonePortal /></Phone>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="relative mt-16 max-w-7xl mx-auto px-5 lg:px-8">
          <div className="card p-5 lg:p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { n: "<60s", l: "to send a quote from site" },
              { n: "3×",   l: "tap rate vs. PDF quotes" },
              { n: "11d",  l: "faster paid on average" },
              { n: "AS 4373", l: "prune codes pre-loaded" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-3xl lg:text-4xl font-extrabold text-[rgb(var(--ink))] tracking-tight">{s.n}</div>
                <div className="mt-1 text-xs text-[rgb(var(--ink-3))] leading-relaxed">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- HOW IT RUNS (NEW — directly under hero) ---------- */}
      <HowItRuns product={product} />

      {/* ---------- FEATURES (6 numbered, from products.ts) ---------- */}
      <section className="py-24 lg:py-32 bg-[rgb(var(--surface))] dark:bg-[rgb(var(--surface-2))]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">What you get</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[rgb(var(--ink))]">
              An app for tree work. <em className="font-display italic font-semibold text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]" style={{ fontStyle: "italic" }}>Not a generic CRM with custom fields.</em>
            </h2>
            <p className="mt-5 text-lg text-[rgb(var(--ink-2))] leading-relaxed">
              Every screen designed for one trade. Every field, every checklist, every PDF — pre-loaded for the work you actually do.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.feats.map((f) => (
              <div key={f.n} className="card p-6 lg:p-7">
                <div className="font-mono text-[11px] tracking-[.18em] text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]">— {f.n}</div>
                <h3 className="mt-2 text-lg font-bold tracking-tight text-[rgb(var(--ink))]">{f.title}</h3>
                <p className="mt-2 text-sm text-[rgb(var(--ink-2))] leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PAIN POINT ---------- */}
      <PainSection />

      {/* ---------- PIPELINE WALKTHROUGH ---------- */}
      <section id="how" className="py-24 lg:py-32 bg-[rgb(var(--surface-2))] dark:bg-[rgb(var(--surface))] border-y border-[rgb(var(--line-2))] dark:border-white/[.04]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">{TREEMATE_COPY.pipeline.angle}</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[rgb(var(--ink))]">
              {TREEMATE_COPY.pipeline.variants[0].headline}
            </h2>
            <p className="mt-5 text-lg text-[rgb(var(--ink-2))] leading-relaxed">
              {TREEMATE_COPY.pipeline.variants[0].primary}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-4">
            {PIPELINE_STEPS.map((s) => (
              <div key={s.n} className="card p-5 lg:p-6">
                <div
                  className="w-12 h-12 rounded-2xl grid place-items-center font-extrabold text-white text-lg"
                  style={{ background: `linear-gradient(135deg, ${product.brandHex}, ${product.brandHexDeep})`, boxShadow: `0 8px 24px ${product.brandHex}40` }}
                >
                  {s.n}
                </div>
                <div className="mt-4 text-[rgb(var(--ink))] font-bold tracking-tight">{s.label}</div>
                <div className="mt-2 text-sm text-[rgb(var(--ink-2))] leading-relaxed">{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CUSTOMER EXPERIENCE ---------- */}
      <ConceptSection
        side="right"
        eyebrow={TREEMATE_COPY.customer.angle}
        headline={TREEMATE_COPY.customer.variants[0].headline}
        body={TREEMATE_COPY.customer.variants[0].primary}
        bullets={[
          "Branded mobile-first quote link (not a PDF)",
          "Photos of your customer's actual trees",
          "One green ACCEPT button — deposit handled inline",
        ]}
        phone={<Phone width={290} height={600}><PhonePortal /></Phone>}
      />

      {/* ---------- INDUSTRY-SPECIFIC ---------- */}
      <section className="py-24 lg:py-32 bg-[rgb(var(--surface-2))] dark:bg-[rgb(var(--surface))] border-y border-[rgb(var(--line-2))] dark:border-white/[.04]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <div className="eyebrow mb-4">{TREEMATE_COPY.industry.angle}</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[rgb(var(--ink))]">
              AS 4373 baked in.
            </h2>
            <p className="mt-5 text-lg text-[rgb(var(--ink-2))] leading-relaxed">
              {TREEMATE_COPY.industry.variants[1].primary}
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "AS 4373 prune codes", body: "Crown lift, crown reduction, formative prune, deadwooding — all in the dropdown, with the right vocabulary on the customer-facing report." },
              { title: "Hazard tags first-class", body: "Power lines, structures, heritage trees, slopes, confined space. Multi-select on the site, surfaced on every related document." },
              { title: "EWP, crane, chipper rates", body: "Equipment library priced in AUD by hour. Cat 2 crew flag. No 'custom field' required to handle the basics." },
              { title: "Heritage & council fields", body: "Strata, council, roadside, rural — site-type baked in. Permit numbers, TPO references, you know the drill." },
              { title: "Recurring maintenance", body: "Hedge schedules, formative prune cycles, seasonal contracts — auto-projected onto the calendar." },
              { title: "Photo evidence by tag", body: "Before / during / after / hazard / stump / equipment. Tagged at upload. Sortable in the customer portal." },
            ].map((c) => (
              <div key={c.title} className="card p-5">
                <div className="text-[rgb(var(--ink))] font-bold tracking-tight">{c.title}</div>
                <div className="mt-2 text-sm text-[rgb(var(--ink-2))] leading-relaxed">{c.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FOUNDER ---------- */}
      <section className="py-24 lg:py-32 canvas-smart relative overflow-hidden">
        <div className="halo opacity-40" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="eyebrow mb-4">{TREEMATE_COPY.founder.angle}</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[rgb(var(--ink))]">
              {TREEMATE_COPY.founder.variants[0].headline}
            </h2>
            <p className="mt-5 text-lg text-[rgb(var(--ink-2))] leading-relaxed">
              {TREEMATE_COPY.founder.variants[0].primary}
            </p>
            <p className="mt-4 text-lg text-[rgb(var(--ink-2))] leading-relaxed">
              {TREEMATE_COPY.founder.variants[1].primary}
            </p>
          </div>
          <aside className="lg:col-span-5 lg:sticky lg:top-24 self-start">
            <div className="card p-7 lg:p-8 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[rgb(var(--brand-500)/.18)] blur-3xl" aria-hidden />
              <div className="relative">
                <div className="font-mono text-[11px] tracking-[.2em] uppercase text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]">FROM THE BUCKET</div>
                <div className="mt-5 text-lg text-[rgb(var(--ink-2))] leading-relaxed italic">
                  &ldquo;Every screen in TreeMate went through me halfway up a Eucalypt. If it didn't survive a wet day in the bucket — gloves on, sap on the screen, customer texting — it didn't ship.&rdquo;
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl grid place-items-center text-white font-extrabold"
                       style={{ background: `linear-gradient(135deg, ${product.brandHex}, ${product.brandHexDeep})` }}>SR</div>
                  <div>
                    <div className="text-[rgb(var(--ink))] font-bold tracking-tight text-sm">Shaun R.</div>
                    <div className="text-[rgb(var(--ink-3))] text-xs font-mono tracking-wide">Co-founder · 17 years on the tools</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ---------- PRICING ---------- */}
      <section id="pricing" className="py-24 lg:py-32 bg-[rgb(var(--surface-2))] dark:bg-[rgb(var(--surface))] border-y border-[rgb(var(--line-2))] dark:border-white/[.04]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">PRICING · AUD + GST</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[rgb(var(--ink))]">
              One flat number. <em className="font-display italic font-semibold text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]" style={{ fontStyle: "italic" }}>No per-seat ladder.</em>
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            {product.pricing.map((p) => (
              <div key={p.name} className={`card p-7 lg:p-8 relative ${p.popular ? "ring-1 ring-[rgb(var(--brand-500)/.45)] lg:scale-[1.03]" : ""}`}>
                {p.popular && (
                  <div className="absolute -top-3 left-7 font-mono text-[10px] tracking-[.2em] uppercase px-2.5 py-1 rounded-full text-white"
                       style={{ background: `linear-gradient(135deg, ${product.brandHex}, ${product.brandHexDeep})` }}>
                    Most popular
                  </div>
                )}
                <div className="text-[rgb(var(--ink))] font-extrabold text-xl tracking-tight">{p.name}</div>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-5xl font-extrabold text-[rgb(var(--ink))] tracking-tight font-display">{p.price}</span>
                  <span className="text-[rgb(var(--ink-3))] font-mono text-sm">{p.per}</span>
                </div>
                <div className="mt-3 text-sm text-[rgb(var(--ink-2))] leading-relaxed">{p.blurb}</div>
                <ul className="mt-6 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[rgb(var(--ink-2))]">
                      <svg width="14" height="14" viewBox="0 0 14 14" className="mt-0.5 text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))] flex-shrink-0">
                        <path d="M2 7.5l3 3 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="#contact" className={`mt-7 ${p.popular ? "btn btn-primary" : "btn btn-ghost"} w-full justify-center`}>
                  Start 14-day trial →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="py-24 lg:py-32 canvas-smart">
        <div className="max-w-4xl mx-auto px-5 lg:px-8">
          <div className="eyebrow mb-4">FAQ</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[rgb(var(--ink))]">
            The questions other arborists asked us first.
          </h2>

          <div className="mt-12 divide-y divide-[rgb(var(--line-2))] dark:divide-white/[.06]">
            {product.faq.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
                  <span className="text-[rgb(var(--ink))] font-bold tracking-tight text-lg">{f.q}</span>
                  <span className="mt-1.5 text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))] transition-transform group-open:rotate-45 text-2xl leading-none flex-shrink-0">+</span>
                </summary>
                <p className="mt-3 text-[rgb(var(--ink-2))] leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA / LEAD ---------- */}
      <section id="contact" className="py-24 lg:py-32 bg-[rgb(var(--surface-2))] dark:bg-[rgb(var(--surface))] border-t border-[rgb(var(--line-2))] dark:border-white/[.04] relative overflow-hidden">
        <div className="halo opacity-40" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <div className="eyebrow mb-4 justify-center">START YOUR TRIAL</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[rgb(var(--ink))]">
              Try it on your{" "}
              <em className="font-display italic font-semibold text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]" style={{ fontStyle: "italic" }}>
                next job
              </em>.
            </h2>
            <p className="mt-4 text-lg text-[rgb(var(--ink-2))] leading-relaxed">
              Drop your details. We'll spin up a TreeMate account pre-loaded with your equipment library and AS 4373 templates, and walk you through one real quote.
            </p>
          </div>
          <LeadForm product={product} />
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* -------- shared inline pieces -------- */

function ConceptSection({
  side, eyebrow, headline, body, bullets, phone,
}: {
  side: "left" | "right";
  eyebrow: string; headline: string; body: string;
  bullets: string[]; phone: React.ReactNode;
}) {
  return (
    <section className="py-24 lg:py-32 canvas-smart relative overflow-hidden">
      <div className="halo opacity-40" aria-hidden />
      <div className={`relative max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${side === "right" ? "lg:[&>div:first-child]:order-last" : ""}`}>
        <div className="lg:col-span-7">
          <div className="eyebrow mb-4">{eyebrow}</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[rgb(var(--ink))]">{headline}</h2>
          <p className="mt-5 text-lg text-[rgb(var(--ink-2))] leading-relaxed max-w-2xl">{body}</p>
          <ul className="mt-7 space-y-3 max-w-2xl">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-base text-[rgb(var(--ink-2))]">
                <svg width="18" height="18" viewBox="0 0 18 18" className="mt-1 text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))] flex-shrink-0">
                  <path d="M3 9.5l4 4 8-8" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-5 grid place-items-center">
          {phone}
        </div>
      </div>
    </section>
  );
}

function PainSection() {
  return (
    <section className="py-24 lg:py-32 bg-[rgb(var(--surface))] dark:bg-[rgb(var(--surface-2))]">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        <div className="lg:col-span-5">
          <div className="eyebrow mb-4">{TREEMATE_COPY.pain.angle}</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[rgb(var(--ink))]">
            {TREEMATE_COPY.pain.variants[0].headline}
          </h2>
          <p className="mt-5 text-lg text-[rgb(var(--ink-2))] leading-relaxed">
            {TREEMATE_COPY.pain.variants[0].primary}
          </p>
          <p className="mt-4 text-lg text-[rgb(var(--ink-2))] leading-relaxed">
            {TREEMATE_COPY.pain.variants[2].primary}
          </p>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* BEFORE — always toned warm/dim regardless of theme */}
          <div className="rounded-3xl p-6 lg:p-7 border border-amber-900/20 dark:border-amber-200/10"
               style={{ background: "linear-gradient(160deg, #1a1410 0%, #0a0807 100%)" }}>
            <div className="font-mono text-[11px] tracking-[.22em] uppercase" style={{ color: "rgba(255,200,140,.7)" }}>
              9:14 PM · BEFORE
            </div>
            <div className="mt-4 photo-slot rounded-2xl min-h-[180px]"
                 style={{ background: "repeating-linear-gradient(135deg, rgba(255,200,120,.04) 0 12px, rgba(255,200,120,.08) 12px 24px)",
                          color: "rgba(255,200,140,.6)", borderColor: "rgba(255,200,140,.1)" }}>
              <span>Tradie at kitchen table.<br/>Laptop + paper. Dim lamp.</span>
            </div>
            <ul className="mt-5 font-mono text-[12px] leading-relaxed" style={{ color: "rgba(255,200,140,.55)", letterSpacing: ".06em" }}>
              <li>☐ Quotes to send: 4</li>
              <li>☐ Invoices behind: 7</li>
              <li>☐ Bedtime: ???</li>
            </ul>
          </div>

          {/* AFTER */}
          <div className="rounded-3xl p-6 lg:p-7 border border-[rgb(var(--brand-500)/.3)]"
               style={{ background: "linear-gradient(160deg, rgb(var(--brand-900)) 0%, #07100a 100%)" }}>
            <div className="font-mono text-[11px] tracking-[.22em] uppercase text-[rgb(var(--brand-400))]">
              5:42 PM · AFTER
            </div>
            <div className="mt-4 grid place-items-center min-h-[180px]">
              <Phone width={170} height={350} tilt={-3}><PhonePipeline /></Phone>
            </div>
            <ul className="mt-5 font-mono text-[12px] leading-relaxed text-[rgb(var(--brand-300)/.85)]" style={{ letterSpacing: ".06em" }}>
              <li>✓ All quotes sent</li>
              <li>✓ Invoice auto-queued</li>
              <li>✓ Beer in hand</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
