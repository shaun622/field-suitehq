import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LeadForm } from "@/components/LeadForm";
import { Phone } from "@/components/phones/Phone";
import {
  PhoneDashboard, PhoneJobs, PhoneQuote, PhonePortal, PhonePipeline,
} from "@/components/phones/PhoneScreens";
import { Product } from "@/lib/products";
import { TREEPRO_COPY, PIPELINE_STEPS } from "@/lib/treepro-copy";

export function TreeProPage({ product }: { product: Product }) {
  return (
    <main className={`theme-${product.slug} min-h-screen bg-ink-950 text-bone-100`}>
      <Nav product={product} />

      {/* ---------- HERO ---------- */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden canvas-dusk">
        <div className="halo" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <span className="aus-badge">AUS · MOBILE-FIRST</span>
              <span className="aus-badge">AS4373 BAKED IN</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tightest leading-[0.98] text-white">
              Quote it before<br />the kettle <span className="text-brand-400">cools</span>.
            </h1>

            <p className="mt-7 text-lg lg:text-xl text-white/70 leading-relaxed max-w-2xl">
              TreePro is the field-first SaaS for Aussie arborists. Site photos, AS4373 line items, hazard tags, customer portal &mdash; tap, tap, send. Quote, accept, deposit, scheduled. All before you've reversed out.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="#contact" className="btn btn-primary">Start 14-day trial →</Link>
              <Link href="#how" className="btn btn-ghost">See it run</Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/55">
              <span>Free 14-day trial</span><span>·</span>
              <span>No credit card</span><span>·</span>
              <span>Built by an arborist</span><span>·</span>
              <span>AUD/GST</span>
            </div>
          </div>

          {/* Hero phone */}
          <div className="lg:col-span-5 relative h-[560px] lg:h-[680px]">
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
              { n: "AS4373", l: "prune codes pre-loaded" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-3xl lg:text-4xl font-extrabold text-white tracking-tightest">{s.n}</div>
                <div className="mt-1 text-xs text-white/55 leading-relaxed">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SPEED ---------- */}
      <ConceptSection
        side="left"
        eyebrow={TREEPRO_COPY.speed.angle}
        headline={TREEPRO_COPY.speed.variants[0].headline}
        body={TREEPRO_COPY.speed.variants[0].primary}
        bullets={[
          "Pre-loaded equipment library priced in AUD",
          "AS4373 prune codes & hazard tags one tap away",
          "Customer accepts → deposit captured → job scheduled",
        ]}
        phone={<Phone width={300} height={620}><PhoneQuote /></Phone>}
      />

      {/* ---------- PAIN POINT ---------- */}
      <PainSection />

      {/* ---------- HOW IT WORKS ---------- */}
      <section id="how" className="py-24 lg:py-32 bg-ink-900 border-y border-white/[.04]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">{TREEPRO_COPY.pipeline.angle}</div>
            <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tightest text-white">
              {TREEPRO_COPY.pipeline.variants[0].headline}
            </h2>
            <p className="mt-5 text-lg text-white/65 leading-relaxed">
              {TREEPRO_COPY.pipeline.variants[0].primary}
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-5 gap-4">
            {PIPELINE_STEPS.map((s) => (
              <div key={s.n} className="card p-5 lg:p-6">
                <div
                  className="w-12 h-12 rounded-2xl grid place-items-center font-extrabold text-white text-lg shadow-glow"
                  style={{ background: "linear-gradient(135deg, rgb(var(--brand-400)), rgb(var(--brand-700)))" }}
                >
                  {s.n}
                </div>
                <div className="mt-4 text-white font-bold tracking-tight">{s.label}</div>
                <div className="mt-2 text-sm text-white/65 leading-relaxed">{s.body}</div>
              </div>
            ))}
          </div>

          {/* Phones row */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center justify-center">
            <div className="grid place-items-center"><Phone width={280} height={580}><PhoneDashboard /></Phone></div>
            <div className="grid place-items-center"><Phone width={280} height={580}><PhoneJobs /></Phone></div>
            <div className="grid place-items-center"><Phone width={280} height={580}><PhonePipeline /></Phone></div>
          </div>
        </div>
      </section>

      {/* ---------- CUSTOMER EXPERIENCE ---------- */}
      <ConceptSection
        side="right"
        eyebrow={TREEPRO_COPY.customer.angle}
        headline={TREEPRO_COPY.customer.variants[0].headline}
        body={TREEPRO_COPY.customer.variants[0].primary}
        bullets={[
          "Branded mobile-first quote link (not a PDF)",
          "Photos of your customer's actual trees",
          "One green ACCEPT button — deposit handled inline",
        ]}
        phone={<Phone width={290} height={600}><PhonePortal /></Phone>}
      />

      {/* ---------- INDUSTRY-SPECIFIC ---------- */}
      <section className="py-24 lg:py-32 bg-ink-900 border-y border-white/[.04]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <div className="eyebrow mb-4">{TREEPRO_COPY.industry.angle}</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tightest text-white">
              {TREEPRO_COPY.industry.variants[1].headline}
            </h2>
            <p className="mt-5 text-lg text-white/65 leading-relaxed">
              {TREEPRO_COPY.industry.variants[1].primary}
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "AS4373 prune codes", body: "Crown lift, crown reduction, formative prune, deadwooding — all in the dropdown, with the right vocabulary on the customer-facing report." },
              { title: "Hazard tags first-class", body: "Power lines, structures, heritage trees, slopes, confined space. Multi-select on the site, surfaced on every related document." },
              { title: "EWP, crane, chipper rates", body: "Equipment library priced in AUD by hour. Cat 2 crew flag. No 'custom field' required to handle the basics." },
              { title: "Heritage & council fields", body: "Strata, council, roadside, rural — site-type baked in. Permit numbers, TPO references, you know the drill." },
              { title: "Recurring maintenance", body: "Hedge schedules, formative prune cycles, seasonal contracts — auto-projected onto the calendar." },
              { title: "Photo evidence by tag", body: "Before / during / after / hazard / stump / equipment. Tagged at upload. Sortable in the customer portal." },
            ].map((c) => (
              <div key={c.title} className="card p-5">
                <div className="text-white font-bold tracking-tight">{c.title}</div>
                <div className="mt-2 text-sm text-white/65 leading-relaxed">{c.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FOUNDER ---------- */}
      <section className="py-24 lg:py-32 canvas-dusk relative overflow-hidden">
        <div className="halo opacity-50" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="eyebrow mb-4">{TREEPRO_COPY.founder.angle}</div>
            <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tightest text-white">
              {TREEPRO_COPY.founder.variants[0].headline}
            </h2>
            <p className="mt-5 text-lg text-white/70 leading-relaxed">
              {TREEPRO_COPY.founder.variants[0].primary}
            </p>
            <p className="mt-4 text-lg text-white/70 leading-relaxed">
              {TREEPRO_COPY.founder.variants[1].primary}
            </p>
          </div>
          <aside className="lg:col-span-5 lg:sticky lg:top-24 self-start">
            <div className="card p-7 lg:p-8 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-brand-500/15 blur-3xl" aria-hidden />
              <div className="relative">
                <div className="font-mono text-[11px] tracking-[.2em] uppercase text-brand-400">FROM THE BUCKET</div>
                <div className="mt-5 text-lg text-white/80 leading-relaxed italic">
                  &ldquo;Every screen in TreePro went through me halfway up a Eucalypt. If it didn't survive a wet day in the bucket — gloves on, sap on the screen, customer texting — it didn't ship.&rdquo;
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-700 grid place-items-center text-white font-extrabold">SR</div>
                  <div>
                    <div className="text-white font-bold tracking-tight text-sm">Shaun R.</div>
                    <div className="text-white/55 text-xs font-mono tracking-wide">Co-founder · 17 years on the tools</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ---------- PRICING ---------- */}
      <section id="pricing" className="py-24 lg:py-32 bg-ink-900 border-y border-white/[.04]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">PRICING · AUD + GST</div>
            <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tightest text-white">
              One flat number. <span className="text-brand-400">No per-seat ladder.</span>
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "Solo", price: "$49", popular: false, blurb: "Owner-operator. One user, full app.",
                features: ["1 user", "Unlimited jobs & quotes", "Customer portal", "Branded reports", "Email + SMS"] },
              { name: "Crew", price: "$99", popular: true, blurb: "Up to 5 users. Scheduling + dispatch.",
                features: ["Up to 5 users", "Route view & dispatch", "Recurring contracts", "Automations", "Stripe + Xero sync"] },
              { name: "Pro",  price: "$199", popular: false, blurb: "Up to 10 users. RBAC + API.",
                features: ["Up to 10 users", "Role-based access", "API + webhooks", "White-label portal", "Priority support"] },
            ].map((p) => (
              <div key={p.name} className={`card p-7 lg:p-8 relative ${p.popular ? "ring-1 ring-brand-500/40 lg:scale-[1.03]" : ""}`}>
                {p.popular && (
                  <div className="absolute -top-3 left-7 font-mono text-[10px] tracking-[.2em] uppercase px-2.5 py-1 rounded-full text-white"
                       style={{ background: "linear-gradient(135deg, rgb(var(--brand-400)), rgb(var(--brand-700)))" }}>
                    Most popular
                  </div>
                )}
                <div className="text-white font-extrabold text-xl tracking-tight">{p.name}</div>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-5xl font-extrabold text-white tracking-tightest">{p.price}</span>
                  <span className="text-white/55 font-mono text-sm">/mo + GST</span>
                </div>
                <div className="mt-3 text-sm text-white/65 leading-relaxed">{p.blurb}</div>
                <ul className="mt-6 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-white/75">
                      <svg width="14" height="14" viewBox="0 0 14 14" className="mt-0.5 text-brand-400 flex-shrink-0">
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
      <section className="py-24 lg:py-32 canvas-dusk">
        <div className="max-w-4xl mx-auto px-5 lg:px-8">
          <div className="eyebrow mb-4">FAQ</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tightest text-white">
            The questions other arborists asked us first.
          </h2>

          <div className="mt-12 divide-y divide-white/[.06]">
            {[
              { q: "Will it work in the bush with no signal?",
                a: "Yes. Quotes, photos, job reports queue offline and push when you're back in range. Photos compress on-device — they don't tank your data plan." },
              { q: "Does it integrate with Xero / MYOB?",
                a: "Xero invoice sync ships with Crew and Pro. MYOB AccountRight is on the roadmap for Q3 2026. Stripe for card payments works on every plan." },
              { q: "Can my customer accept and pay from one link?",
                a: "Yep. Customer portal link → review line items + photos → tap ACCEPT → deposit captured via Stripe → job scheduled. No PDF download required." },
              { q: "What about AS4373? Do I have to set it up?",
                a: "No — prune codes (formative, crown lift, crown reduction, deadwooding etc.) and hazard tags ship pre-loaded. Edit or hide what you don't use." },
              { q: "How does the trial work?",
                a: "Sign up, you're in. 14 days, full access, no credit card. We'll seed your trade's templates so you can run a real quote on day one." },
              { q: "Is my data mine?",
                a: "Yes. CSV export of every entity (clients, jobs, quotes, invoices, reports, photos) is one click. Cancel and you take it with you." },
            ].map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
                  <span className="text-white font-bold tracking-tight text-lg">{f.q}</span>
                  <span className="mt-1.5 text-brand-400 transition-transform group-open:rotate-45 text-2xl leading-none flex-shrink-0">+</span>
                </summary>
                <p className="mt-3 text-white/70 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA / LEAD ---------- */}
      <section id="contact" className="py-24 lg:py-32 bg-ink-900 border-t border-white/[.04] relative overflow-hidden">
        <div className="halo opacity-40" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <div className="eyebrow mb-4">START YOUR TRIAL</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tightest text-white">
              Try it on your <span className="text-brand-400">next job</span>.
            </h2>
            <p className="mt-4 text-lg text-white/65 leading-relaxed">
              Drop your details. We'll spin up a TreePro account pre-loaded with your equipment library and AS4373 templates, and walk you through one real quote.
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
    <section className="py-24 lg:py-32 canvas-dusk relative overflow-hidden">
      <div className="halo opacity-40" aria-hidden />
      <div className={`relative max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${side === "right" ? "lg:[&>div:first-child]:order-last" : ""}`}>
        <div className="lg:col-span-7">
          <div className="eyebrow mb-4">{eyebrow}</div>
          <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tightest text-white">{headline}</h2>
          <p className="mt-5 text-lg text-white/70 leading-relaxed max-w-2xl">{body}</p>
          <ul className="mt-7 space-y-3 max-w-2xl">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-base text-white/80">
                <svg width="18" height="18" viewBox="0 0 18 18" className="mt-1 text-brand-400 flex-shrink-0">
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
    <section className="py-24 lg:py-32 bg-ink-900 border-y border-white/[.04]">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        <div className="lg:col-span-5">
          <div className="eyebrow mb-4">{TREEPRO_COPY.pain.angle}</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tightest text-white">
            {TREEPRO_COPY.pain.variants[0].headline}
          </h2>
          <p className="mt-5 text-lg text-white/70 leading-relaxed">
            {TREEPRO_COPY.pain.variants[0].primary}
          </p>
          <p className="mt-4 text-lg text-white/70 leading-relaxed">
            {TREEPRO_COPY.pain.variants[2].primary}
          </p>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* BEFORE */}
          <div className="card p-6 lg:p-7" style={{ background: "linear-gradient(160deg, #1a1410 0%, #0a0807 100%)" }}>
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
          <div className="card p-6 lg:p-7" style={{ background: "linear-gradient(160deg, rgb(var(--brand-900)) 0%, #07100a 100%)" }}>
            <div className="font-mono text-[11px] tracking-[.22em] uppercase text-brand-400">
              5:42 PM · AFTER
            </div>
            <div className="mt-4 grid place-items-center min-h-[180px]">
              <Phone width={170} height={350} tilt={-3}><PhonePipeline /></Phone>
            </div>
            <ul className="mt-5 font-mono text-[12px] leading-relaxed text-brand-300/85" style={{ letterSpacing: ".06em" }}>
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
