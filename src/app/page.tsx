import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { RotatingHeadline } from "@/components/RotatingHeadline";
import { ProductCard } from "@/components/ProductCard";
import { LeadForm } from "@/components/LeadForm";
import { PRODUCTS } from "@/lib/products";
import { Phone } from "@/components/phones/Phone";
import { PhoneDashboard, PhoneQuote, PhonePipeline, POOL_DASH, FIRE_DASH } from "@/components/phones/PhoneScreens";

export default function Home() {
  return (
    <main className="min-h-screen bg-ink-950 text-bone-100">
      <Nav />

      {/* ---------- HERO ---------- */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden canvas-dusk">
        <div className="halo" aria-hidden />

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 animate-slide-up">
            <div className="eyebrow mb-5">A FAMILY OF FIELD APPS · AU + UK</div>

            <RotatingHeadline
              prefix="Software for"
              suffix="Built mobile. Made by tradies. Priced for owner-operators."
            />

            <p className="mt-6 text-lg lg:text-xl text-white/65 leading-relaxed max-w-2xl">
              Field Mate ships purpose-built apps for trades that get short-changed by generic CRMs.
              Six industries today. Quote, schedule, invoice and get paid &mdash; from your phone, before you've reversed out of the driveway.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#products" className="btn btn-primary">Pick your trade →</Link>
              <Link href="#contact" className="btn btn-ghost">Talk to a human</Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              {[
                { label: "Free 14-day trial", glyph: "•" },
                { label: "No credit card", glyph: "•" },
                { label: "Cancel any time", glyph: "•" },
                { label: "Made in AU + UK", glyph: "•" },
              ].map((b) => (
                <span key={b.label} className="text-white/55 flex items-center gap-2">
                  <span className="text-brand-400" aria-hidden>{b.glyph}</span>
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Floating phones — three layered, themed differently */}
          <div className="lg:col-span-5 relative h-[520px] lg:h-[640px] hidden md:block">
            <div className="absolute right-0 top-4 theme-treepro" style={{ transform: "rotate(6deg)" }}>
              <Phone width={260} height={540}><PhoneQuote /></Phone>
            </div>
            <div className="absolute left-2 top-32 theme-poolpro" style={{ transform: "rotate(-5deg)" }}>
              <Phone width={240} height={500}><PhoneDashboard copy={POOL_DASH} /></Phone>
            </div>
            <div className="absolute left-24 bottom-0 theme-firepro" style={{ transform: "rotate(2deg)" }}>
              <Phone width={230} height={480}><PhoneDashboard copy={FIRE_DASH} /></Phone>
            </div>
          </div>
        </div>

        {/* Marquee strip */}
        <div className="relative mt-20 marquee-mask">
          <div className="marquee-track animate-marquee text-white/35 font-mono text-[12px] tracking-[.22em] uppercase">
            {Array.from({ length: 2 }).flatMap((_, k) =>
              [
                "Tree services",
                "Pool care",
                "Fire-door inspection",
                "Pest management",
                "Hygiene services",
                "Locksmiths",
                "Coming next: lawn care",
                "Coming next: solar maintenance",
                "Coming next: window cleaning",
              ].map((s, i) => (
                <span key={`${k}-${i}`} className="flex items-center gap-12">
                  <span className="text-brand-400/70">●</span>
                  {s}
                </span>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ---------- PRODUCT GRID ---------- */}
      <section id="products" className="py-24 lg:py-32 bg-ink-900 border-y border-white/[.04]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">THE LINEUP</div>
            <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tightest text-white">
              Six trades. <span className="text-brand-400">Six dedicated apps.</span>
            </h2>
            <p className="mt-5 text-lg text-white/65 leading-relaxed">
              Each Field Mate app is built around one trade — its standards, its hazards, its terminology, its pricing reality. No "custom field" hacks. No buttons labelled in someone else's language.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>

          <div className="mt-12 flex items-center justify-between gap-4 text-sm text-white/55">
            <span className="font-mono tracking-[.04em]">More verticals shipping every quarter.</span>
            <Link href="#contact" className="text-brand-400 font-semibold hover:text-brand-300 transition flex items-center gap-1">
              Suggest a trade →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section id="how" className="py-24 lg:py-32 canvas-dusk relative overflow-hidden">
        <div className="halo opacity-50" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">HOW IT WORKS · SAME FIVE STEPS, EVERY TRADE</div>
            <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tightest text-white">
              Quote. Job. Invoice. <span className="text-brand-400">Paid.</span>
            </h2>
            <p className="mt-5 text-lg text-white/65 leading-relaxed">
              Whatever you do — chainsaws, pool chemicals, fire-doors, bait stations, deep-cleans, lock cylinders — the loop is the same. Field Mate runs it from one screen.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { n: "01", title: "Enquiry", body: "Phone call, web form, or repeat customer. Lands in your inbox with site notes." },
              { n: "02", title: "Quote", body: "On-site, mobile-first. Branded link your customer actually opens. Accept + deposit in one tap." },
              { n: "03", title: "Job", body: "Auto-scheduled. Crew + equipment booked. Customer SMS'd the day before." },
              { n: "04", title: "Report", body: "Photos, sign-off, materials used, hazards logged. Branded PDF emailed instantly." },
              { n: "05", title: "Paid", body: "Invoice writes itself from the report. Card link in the customer's hand. Reminder fires at 7 days." },
            ].map((s) => (
              <div key={s.n} className="card p-5 lg:p-6">
                <div
                  className="w-12 h-12 rounded-2xl grid place-items-center font-extrabold text-white text-lg shadow-glow"
                  style={{ background: "linear-gradient(135deg, rgb(var(--brand-400)), rgb(var(--brand-700)))" }}
                >
                  {s.n}
                </div>
                <div className="mt-4 text-white font-bold text-base tracking-tight">{s.title}</div>
                <div className="mt-2 text-sm text-white/65 leading-relaxed">{s.body}</div>
              </div>
            ))}
          </div>

          {/* Hero phone-trio underneath */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-center">
            <div className="theme-treepro grid place-items-center">
              <Phone width={280} height={580}><PhoneDashboard /></Phone>
            </div>
            <div className="theme-treepro grid place-items-center">
              <Phone width={280} height={580}><PhoneQuote /></Phone>
            </div>
            <div className="theme-treepro grid place-items-center">
              <Phone width={280} height={580}><PhonePipeline /></Phone>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- WHY FIELD MATE ---------- */}
      <section className="py-24 lg:py-32 bg-ink-900 border-y border-white/[.04]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <div className="eyebrow mb-4">WHY FIELD MATE</div>
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tightest text-white">
                The opposite of a generic CRM.
              </h2>
              <p className="mt-5 text-lg text-white/65 leading-relaxed">
                ServiceM8 and Tradify ask you to bend your trade to fit their fields. We do it the other way around. Every Field Mate app is a complete vertical &mdash; the language, the standards, the hazards, the equipment, the pricing reality of one trade, baked in.
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "One trade per app",
                  body: "TreePro knows what an EWP is. PoolPro knows pH ranges. FirePro knows BS 8214. Built-in, not bolted-on.",
                },
                {
                  title: "Mobile-first, gloved-thumb friendly",
                  body: "Big tap targets. Offline queue. Survives a wet day in the bucket. Designed at a worksite, not a whiteboard.",
                },
                {
                  title: "Customer-facing portals",
                  body: "Branded quote links, accept buttons, photo galleries, sign-off forms. Your customers see polish — not noreply@.",
                },
                {
                  title: "Compliance evidence by default",
                  body: "Every photo timestamped. Every chemical logged. Every signature stored. Audit trail survives an inspector or tribunal.",
                },
                {
                  title: "Owner-operator pricing",
                  body: "Flat per-month. No per-seat ladder. Pro plan covers crews up to 10. No 'upgrade to access this feature' nonsense.",
                },
                {
                  title: "Built by people who do the work",
                  body: "Founder team includes an arborist, a pool tech, and a fire-safety engineer. Every screen ships through them first.",
                },
              ].map((b) => (
                <div key={b.title} className="card p-6 card-glow">
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-0.5 w-7 h-7 rounded-lg grid place-items-center flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, rgb(var(--brand-400)), rgb(var(--brand-700)))" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7.5l3 3 7-7" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div>
                      <div className="text-white font-bold tracking-tight">{b.title}</div>
                      <div className="mt-1.5 text-sm text-white/65 leading-relaxed">{b.body}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- PRICING ---------- */}
      <section id="pricing" className="py-24 lg:py-32 canvas-dusk relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">PRICING · ONE FLAT NUMBER</div>
            <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tightest text-white">
              Owner-operator priced. <span className="text-brand-400">No per-seat ladder.</span>
            </h2>
            <p className="mt-5 text-lg text-white/65 leading-relaxed">
              Same pricing across every Field Mate app. Pick the trade, pick the plan, get the lot.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: "Solo",
                price: "$49",
                period: "/mo + GST",
                blurb: "For owner-operators. One user, full app, customer portal included.",
                features: ["1 user", "Unlimited jobs & quotes", "Customer portal", "Branded reports", "Email + SMS"],
                cta: "Start 14-day trial",
                primary: false,
              },
              {
                name: "Crew",
                price: "$99",
                period: "/mo + GST",
                blurb: "For small crews. Up to 5 users, scheduling, route view, dispatch.",
                features: ["Up to 5 users", "Route + dispatch", "Recurring contracts", "Automations", "Stripe + Xero sync"],
                cta: "Start 14-day trial",
                primary: true,
              },
              {
                name: "Pro",
                price: "$199",
                period: "/mo + GST",
                blurb: "For multi-crew operators. Up to 10 users, role-based access, API.",
                features: ["Up to 10 users", "Role-based access", "API + webhooks", "White-label portal", "Priority support"],
                cta: "Talk to us",
                primary: false,
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`card p-7 lg:p-8 relative ${p.primary ? "ring-1 ring-brand-500/40 lg:scale-[1.03]" : ""}`}
              >
                {p.primary && (
                  <div
                    className="absolute -top-3 left-7 font-mono text-[10px] tracking-[.2em] uppercase px-2.5 py-1 rounded-full text-white"
                    style={{ background: "linear-gradient(135deg, rgb(var(--brand-400)), rgb(var(--brand-700)))" }}
                  >
                    Most popular
                  </div>
                )}
                <div className="text-white font-extrabold text-xl tracking-tight">{p.name}</div>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-5xl font-extrabold text-white tracking-tightest">{p.price}</span>
                  <span className="text-white/55 font-mono text-sm">{p.period}</span>
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
                <Link href="#contact" className={`mt-7 ${p.primary ? "btn btn-primary" : "btn btn-ghost"} w-full justify-center`}>
                  {p.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FOUNDER STORY ---------- */}
      <section id="story" className="py-24 lg:py-32 bg-ink-900 border-y border-white/[.04]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <div className="eyebrow mb-4">OUR STORY</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tightest text-white">
              Built between jobs, for jobs.
            </h2>
            <div className="mt-6 space-y-5 text-lg text-white/70 leading-relaxed">
              <p>
                Field Mate started with one app. The founder spent 17 years up trees with a chainsaw, then spent two more years swearing at Tradify on the kitchen table at 9pm.
              </p>
              <p>
                The first prototype was sketched on a phone halfway up a Spotted Gum. It still runs the same way — gloved-thumb friendly, every screen.
              </p>
              <p>
                Then a pool tech mate said "do mine next." Then a fire-safety engineer. Then a pest controller. So instead of one bloated CRM with custom fields, we ship a dedicated app per trade.
              </p>
              <p className="text-white/85 font-medium">
                Same engine underneath. Same opinionated approach. Different language and standards on top &mdash; because <em>your</em> trade isn't just "service business with extra steps."
              </p>
            </div>
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-24 self-start">
            <div className="card p-7 lg:p-8 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-brand-500/15 blur-3xl" aria-hidden />
              <div className="relative">
                <div className="font-mono text-[11px] tracking-[.2em] uppercase text-brand-400">Field Mate · numbers</div>
                <div className="mt-6 grid grid-cols-2 gap-y-6 gap-x-4">
                  {[
                    { n: "6", l: "vertical apps live or in beta" },
                    { n: "17yr", l: "average founder time on the tools" },
                    { n: "AU+UK", l: "markets shipping today" },
                    { n: "<60s", l: "median time to send a quote" },
                  ].map((s) => (
                    <div key={s.l}>
                      <div className="text-4xl font-extrabold text-white tracking-tightest">{s.n}</div>
                      <div className="mt-1 text-xs text-white/55 leading-relaxed">{s.l}</div>
                    </div>
                  ))}
                </div>
                <div className="divider-dots my-6" />
                <p className="text-sm text-white/65 leading-relaxed italic">
                  &ldquo;If a feature didn't survive a wet day in the bucket, it didn't ship.&rdquo;
                </p>
                <p className="mt-3 text-xs text-white/50 font-mono tracking-wide">— SR, Field Mate co-founder</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ---------- LEAD FORM ---------- */}
      <section id="contact" className="py-24 lg:py-32 canvas-dusk relative overflow-hidden">
        <div className="halo" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <div className="eyebrow mb-4">GET STARTED</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tightest text-white">
              Pick a trade. Get a real demo.
            </h2>
            <p className="mt-4 text-lg text-white/65 leading-relaxed">
              Drop your details. We'll set you up with a 14-day trial pre-loaded with your trade's templates &mdash; no credit card, no boilerplate sales call.
            </p>
          </div>

          <LeadForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
