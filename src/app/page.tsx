import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { RotatingHeadline } from "@/components/RotatingHeadline";
import { ProductCard } from "@/components/ProductCard";
import { LeadForm } from "@/components/LeadForm";
import { SimpleStrap } from "@/components/marketing/SimpleStrap";
import { AppDashboardLive } from "@/components/marketing/AppDashboardLive";
import { RealPhone } from "@/components/marketing/RealPhone";
import { PRODUCTS, productBySlug } from "@/lib/products";

const FEATURED_FOR_PARENT = productBySlug("treemate")!;

// Three products picked for visual variety in the hero phone trio:
// red, green and amber accents on real mobile screenshots.
const HERO_PRODUCTS = [
  productBySlug("firemate")!,
  productBySlug("pestmate")!,
  productBySlug("locksmithmate")!,
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[rgb(var(--surface))] text-[rgb(var(--ink))]">
      <Nav />

      {/* ---------- HERO ---------- */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden canvas-smart">
        <div className="halo" aria-hidden />

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="mb-6">
              <SimpleStrap variant="parent">
                FIELDSUITE · SIMPLE CRM + JOB MANAGEMENT FOR THE TRADES
              </SimpleStrap>
            </div>

            <RotatingHeadline
              prefix="Built for"
              suffix="Quote, schedule, invoice and get paid. From your phone."
            />

            <p className="mt-6 text-lg lg:text-xl text-[rgb(var(--ink-2))] leading-relaxed max-w-2xl">
              Each app is its own thing. Pre-loaded for the work you actually do, not a generic CRM you have to bend.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#products" className="btn btn-primary">Pick your trade →</Link>
              <Link href="#contact" className="btn btn-ghost">Talk to a human</Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[rgb(var(--ink-3))]">
              {[
                "Free 14-day trial",
                "No credit card",
                "Cancel any time",
                "Made in AU + UK",
              ].map((b) => (
                <span key={b} className="flex items-center gap-2">
                  <span className="text-[rgb(var(--brand-500))]" aria-hidden>•</span>
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Three real product screenshots, layered. Themed differently
              for visual variety (red / green / amber). */}
          <div className="lg:col-span-5 relative h-[440px] sm:h-[540px] lg:h-[680px] hidden md:block">
            {HERO_PRODUCTS[0].screenshots?.mobile && (
              <div className="absolute right-0 top-2" style={{ transform: "rotate(5deg)" }}>
                <RealPhone shot={HERO_PRODUCTS[0].screenshots.mobile} width={260} />
              </div>
            )}
            {HERO_PRODUCTS[1].screenshots?.mobile && (
              <div className="absolute left-0 top-24 lg:top-28" style={{ transform: "rotate(-6deg)" }}>
                <RealPhone shot={HERO_PRODUCTS[1].screenshots.mobile} width={240} />
              </div>
            )}
            {HERO_PRODUCTS[2].screenshots?.mobile && (
              <div className="absolute left-32 lg:left-40 bottom-0" style={{ transform: "rotate(2deg)" }}>
                <RealPhone shot={HERO_PRODUCTS[2].screenshots.mobile} width={230} />
              </div>
            )}
          </div>
        </div>

        {/* Marquee strip */}
        <div className="relative mt-16 marquee-mask">
          <div className="marquee-track animate-marquee text-[rgb(var(--ink-3))] font-mono text-[12px] tracking-[.22em] uppercase">
            {Array.from({ length: 2 }).flatMap((_, k) =>
              [
                "Tree services", "Pool care", "Fire-door inspection",
                "Pest management", "Hygiene services", "Locksmiths",
                "Coming next: lawn care", "Coming next: solar maintenance", "Coming next: window cleaning",
              ].map((s, i) => (
                <span key={`${k}-${i}`} className="flex items-center gap-12">
                  <span className="text-[rgb(var(--brand-500))]">●</span>
                  {s}
                </span>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ---------- PRODUCT GRID ---------- */}
      <section id="products" className="py-24 lg:py-32 bg-[rgb(var(--surface-2))] dark:bg-[rgb(var(--surface))] border-y border-[rgb(var(--line-2))] dark:border-white/[.04]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">The lineup</div>
            <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-[rgb(var(--ink))]">
              An app{" "}
              <em className="font-display italic font-semibold text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]" style={{ fontStyle: "italic" }}>
                per trade.
              </em>
            </h2>
            <p className="mt-5 text-lg text-[rgb(var(--ink-2))] leading-relaxed">
              Each app stands alone. Built around one trade. Pre-loaded for the work. No platform to learn.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>

          <div className="mt-12 flex items-center justify-between gap-4 text-sm text-[rgb(var(--ink-3))]">
            <span className="font-mono tracking-[.04em]">More verticals shipping every quarter.</span>
            <Link href="#contact" className="text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))] font-semibold hover:opacity-80 transition flex items-center gap-1">
              Suggest a trade →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS (parent dashboard preview) ---------- */}
      <section id="how" className="py-24 lg:py-32 canvas-smart relative overflow-hidden">
        <div className="halo opacity-50" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">How a job runs · same five steps, every trade</div>
            <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-[rgb(var(--ink))]">
              Quote. Job. Invoice.{" "}
              <em className="font-display italic font-semibold text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]" style={{ fontStyle: "italic" }}>
                Paid.
              </em>
            </h2>
            <p className="mt-5 text-lg text-[rgb(var(--ink-2))] leading-relaxed">
              First call to getting paid. The whole loop, in your trade&apos;s app.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { n: "01", title: "Enquiry", body: "Phone call, web form, or repeat customer. Lands in your inbox with site notes." },
              { n: "02", title: "Quote",   body: "On-site, mobile-first. Branded link your customer actually opens. Accept + deposit in one tap." },
              { n: "03", title: "Job",     body: "Auto-scheduled. Crew + equipment booked. Customer SMS'd the day before." },
              { n: "04", title: "Report",  body: "Photos, sign-off, materials used, hazards logged. Branded PDF emailed instantly." },
              { n: "05", title: "Paid",    body: "Invoice writes itself from the report. Card link in the customer's hand. Reminder fires at 7 days." },
            ].map((s) => (
              <div key={s.n} className="card p-5 lg:p-6">
                <div
                  className="w-12 h-12 rounded-2xl grid place-items-center font-extrabold text-white text-lg"
                  style={{
                    background: "linear-gradient(135deg, rgb(var(--brand-500)), rgb(var(--brand-700)))",
                    boxShadow: "0 8px 24px rgb(var(--brand-500) / .35)",
                  }}
                >
                  {s.n}
                </div>
                <div className="mt-4 text-[rgb(var(--ink))] font-bold tracking-tight">{s.title}</div>
                <div className="mt-2 text-sm text-[rgb(var(--ink-2))] leading-relaxed">{s.body}</div>
              </div>
            ))}
          </div>

          {/* Featured interactive dashboard preview (TreeMate) */}
          <div className="mt-16 max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <span className="font-mono text-[10px] tracking-[.18em] uppercase text-[rgb(var(--ink-3))]">
                Live preview · TreeMate dashboard · click any tab
              </span>
            </div>
            <div className="rounded-2xl border border-[rgb(var(--line))] dark:border-white/[.08] bg-[rgb(var(--surface))] dark:bg-[#0a0e14] shadow-2xl overflow-hidden">
              <AppDashboardLive product={FEATURED_FOR_PARENT} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- WHY FIELDSUITE ---------- */}
      <section className="py-24 lg:py-32 bg-[rgb(var(--surface-2))] dark:bg-[rgb(var(--surface))] border-y border-[rgb(var(--line-2))] dark:border-white/[.04]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <div className="eyebrow mb-4">Why FieldSuite</div>
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[rgb(var(--ink))]">
                Vertical, <em className="font-display italic font-semibold text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]" style={{ fontStyle: "italic" }}>not horizontal.</em>
              </h2>
              <p className="mt-5 text-lg text-[rgb(var(--ink-2))] leading-relaxed">
                Generic field-service software pretends every trade is the same. It isn&apos;t. Each app is its own thing, built by someone who works your trade.
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { n: "01", title: "Pre-loaded for your trade",
                  body: "Equipment library, checklists, cert numbers, PDF templates. Set up before you log in." },
                { n: "02", title: "Speaks your language",
                  body: "TreeMate talks AS 4373. FireMate talks BS 8214. PestMate talks BPCA. Not \"service business with extra steps\"." },
                { n: "03", title: "Built by trade operators",
                  body: "TreeMate by an arborist. PestMate by a BPCA-registered tech. Not someone who Googled \"tree CRM\"." },
                { n: "04", title: "Your brand on every PDF",
                  body: "Customer-facing docs carry your logo, your colours, your cert numbers. Not ours." },
                { n: "05", title: "Offline-first",
                  body: "Patchy 3G in a basement? Lift in a tower? Underground car park? It keeps working. Syncs when you're back." },
                { n: "06", title: "Customer portal, included",
                  body: "Clients log in, see history, download reports. Not a $20/mo bolt-on." },
              ].map((b) => (
                <div key={b.title} className="card p-6 card-glow">
                  <div className="font-mono text-[11px] tracking-[.18em] text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]">— {b.n}</div>
                  <div className="text-[rgb(var(--ink))] font-bold tracking-tight mt-2">{b.title}</div>
                  <div className="mt-1.5 text-sm text-[rgb(var(--ink-2))] leading-relaxed">{b.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- PRICING ---------- */}
      <section id="pricing" className="py-24 lg:py-32 canvas-smart relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">Pricing · one flat number</div>
            <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-[rgb(var(--ink))]">
              Owner-operator priced.{" "}
              <em className="font-display italic font-semibold text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]" style={{ fontStyle: "italic" }}>
                No per-seat ladder.
              </em>
            </h2>
            <p className="mt-5 text-lg text-[rgb(var(--ink-2))] leading-relaxed">
              Same plans, every app. From $29/mo.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "Solo",     price: "$29",  per: "/mo + GST", blurb: "For one tech with a phone.",
                features: ["1 user", "Unlimited jobs & quotes", "Customer portal", "Branded reports", "Email + SMS"], popular: false },
              { name: "Crew",     price: "$79",  per: "/mo + GST", blurb: "For a small team. Up to 5 users.",
                features: ["Up to 5 users", "Recurring contracts", "Route planning", "Automations", "Stripe + Xero"], popular: true },
              { name: "Business", price: "$199", per: "/mo + GST", blurb: "For a multi-van operation.",
                features: ["Up to 25 users", "API + webhooks", "Custom branding", "Priority support", "Onboarding included"], popular: false },
            ].map((p) => (
              <div
                key={p.name}
                className={`card p-7 lg:p-8 relative ${p.popular ? "ring-1 ring-[rgb(var(--brand-500)/.45)] lg:scale-[1.03]" : ""}`}
              >
                {p.popular && (
                  <div
                    className="absolute -top-3 left-7 font-mono text-[10px] tracking-[.2em] uppercase px-2.5 py-1 rounded-full text-white"
                    style={{ background: "linear-gradient(135deg, rgb(var(--brand-500)), rgb(var(--brand-700)))" }}
                  >
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

      {/* ---------- FOUNDER STORY ---------- */}
      <section id="story" className="py-24 lg:py-32 bg-[rgb(var(--surface-2))] dark:bg-[rgb(var(--surface))] border-y border-[rgb(var(--line-2))] dark:border-white/[.04]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <div className="eyebrow mb-4">Our story</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[rgb(var(--ink))]">
              Built between jobs, <em className="font-display italic font-semibold text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]" style={{ fontStyle: "italic" }}>for jobs.</em>
            </h2>
            <div className="mt-6 space-y-5 text-lg text-[rgb(var(--ink-2))] leading-relaxed">
              <p>
                Started with one app. The founder spent 17 years up trees with a chainsaw, then two more years swearing at generic field-service software at 9pm.
              </p>
              <p>
                Sketched the first prototype on a phone halfway up a Spotted Gum. It still runs the same way. Gloved-thumb friendly, every screen.
              </p>
              <p>
                Then a pool tech mate said &ldquo;do mine next.&rdquo; Then a fire-safety engineer. Then a pest controller. So we ship a trade-specific app instead of a bloated CRM.
              </p>
              <p className="text-[rgb(var(--ink))] font-medium">
                Each app stands alone. Different language, different standards, different builders. <em>Your</em> trade isn&apos;t &ldquo;service business with extra steps&rdquo;.
              </p>
            </div>
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-24 self-start">
            <div className="card p-7 lg:p-8 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[rgb(var(--brand-500)/.15)] blur-3xl" aria-hidden />
              <div className="relative">
                <div className="font-mono text-[11px] tracking-[.2em] uppercase text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]">FieldSuite · numbers</div>
                <div className="mt-6 grid grid-cols-2 gap-y-6 gap-x-4">
                  {[
                    { n: "17yr",  l: "average founder time on the tools" },
                    { n: "<60s",  l: "median time to send a quote" },
                    { n: "AU+UK", l: "markets shipping today" },
                    { n: "$0",    l: "extra per seat" },
                  ].map((s) => (
                    <div key={s.l}>
                      <div className="text-4xl font-extrabold text-[rgb(var(--ink))] tracking-tight font-display">{s.n}</div>
                      <div className="mt-1 text-xs text-[rgb(var(--ink-3))] leading-relaxed">{s.l}</div>
                    </div>
                  ))}
                </div>
                <div className="divider-dots my-6" />
                <p className="text-sm text-[rgb(var(--ink-2))] leading-relaxed italic">
                  &ldquo;If a feature didn't survive a wet day in the bucket, it didn't ship.&rdquo;
                </p>
                <p className="mt-3 text-xs text-[rgb(var(--ink-3))] font-mono tracking-wide">— SR, FieldSuite co-founder</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ---------- CTA / LEAD ---------- */}
      <section id="contact" className="py-24 lg:py-32 canvas-smart relative overflow-hidden">
        <div className="halo" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <div className="eyebrow mb-4 justify-center">Get started</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[rgb(var(--ink))]">
              Pick a trade.{" "}
              <em className="font-display italic font-semibold text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]" style={{ fontStyle: "italic" }}>
                Get a real demo.
              </em>
            </h2>
            <p className="mt-4 text-lg text-[rgb(var(--ink-2))] leading-relaxed">
              14-day trial, pre-loaded with your trade&apos;s templates. No credit card. No sales call.
            </p>
          </div>

          <LeadForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
