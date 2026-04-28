import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LeadForm } from "@/components/LeadForm";
import { HowItRuns } from "@/components/marketing/HowItRuns";
import { ProductGallery } from "@/components/marketing/ProductGallery";
import { RealPhone } from "@/components/marketing/RealPhone";
import { Phone } from "@/components/phones/Phone";
import { PhoneJobs, PhoneQuote, PhonePipeline } from "@/components/phones/PhoneScreens";
import { Product } from "@/lib/products";

/**
 * Per-product hero content. The COPY map in the design handoff drives this.
 * Headlines use a Fraunces italic accent for the emphasised phrase.
 */
type HeroBlock = {
  /** Eyebrow string (e.g. "PESTMATE · FOR PEST CONTROLLERS") */
  eyebrow: string;
  /** Hero h1 — first non-italic part */
  hLead: React.ReactNode;
  /** Italic accent fragment for inside <em>  */
  hAccent: string;
  /** First-paragraph lede */
  lede: string;
  /** Below-CTA mini-meta line */
  meta: string[];
  /** Ghost CTA label */
  ghostCta: string;
};

const HERO: Record<Product["slug"], HeroBlock | undefined> = {
  treemate: undefined, // handled by TreeMatePage
  poolmate: {
    eyebrow: "POOLMATE · FOR POOL TECHS",
    hLead: <>Pool service rounds, </>,
    hAccent: "on autopilot.",
    lede: "Chemical readings, dosing log, before and after photos. Whole round on your phone. Recurring contracts schedule themselves. Branded PDF after every visit.",
    meta: ["14-day free trial · No card", "Cancel anytime", "PWTAG-aware"],
    ghostCta: "See a sample service report",
  },
  firemate: {
    eyebrow: "FIREMATE · FOR FIRE-DOOR SURVEYORS",
    hLead: <>Fire-door inspections </>,
    hAccent: "your assessor will sign.",
    lede: "BS 8214 fire-door surveys on a tablet. 71 points per door. Photo evidence on every fail. Dual sign-off. Branded PDF in the RP&apos;s inbox before you leave the building.",
    meta: ["14-day free trial · No card", "Cancel anytime", "BS 8214 ready"],
    ghostCta: "Download a sample report",
  },
  pestmate: {
    eyebrow: "PESTMATE · FOR PEST CONTROLLERS",
    hLead: <>The pest control app </>,
    hAccent: "that does the paperwork.",
    lede: "Pest round on your phone. Bait points, HSE numbers, photo evidence, tech sign-off. Branded PDF before the van leaves. Built for BPCA-registered techs.",
    meta: ["14-day free trial · No card", "Cancel anytime", "BPCA-aware"],
    ghostCta: "Watch a 90-second demo",
  },
  hygienemate: {
    eyebrow: "HYGIENEMATE · FOR DEEP-CLEAN CREWS",
    hLead: <>The deep-clean app </>,
    hAccent: "your customers actually open.",
    lede: "Before and after photos. Tech signature. Every chemical logged with batch and quantity. Kitchen extraction, washrooms, deep cleans. The audit trail FSA inspectors actually want.",
    meta: ["14-day free trial · No card", "Cancel anytime", "BICSc-aware"],
    ghostCta: "See a sample report",
  },
  locksmithmate: {
    eyebrow: "LOCKSMITHMATE · FOR MOBILE LOCKSMITHS",
    hLead: <>Run your locksmith round </>,
    hAccent: "from the van.",
    lede: "Quote on the phone. Send your photo and DBS card before you arrive. Photo of the work, digital invoice, card on file before the van leaves. Built for locksmiths who hate &lsquo;I&apos;ll send the invoice later&rsquo;.",
    meta: ["14-day free trial · No card", "Cancel anytime", "MLA-aware · DBS-ready"],
    ghostCta: "See a sample job sheet",
  },
};

/**
 * Generic, themable per-product page. Used for every product except TreeMate
 * (which has its own bespoke long-form page).
 *
 * Pulls feats[6], checklist[4], strip[4], pricing[3], faq[] from products.ts.
 * Inserts <HowItRuns/> directly under the hero.
 */
export function GenericProductPage({ product }: { product: Product }) {
  const hero = HERO[product.slug];
  if (!hero) {
    return (
      <main className={`theme-${product.slug} min-h-screen bg-[rgb(var(--surface))] text-[rgb(var(--ink))]`}>
        <Nav product={product} />
        <section className="pt-40 pb-24 canvas-smart text-center">
          <h1 className="text-4xl font-extrabold">{product.name}</h1>
          <p className="mt-4 text-[rgb(var(--ink-3))]">Coming soon.</p>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className={`theme-${product.slug} min-h-screen bg-[rgb(var(--surface))] text-[rgb(var(--ink))]`}>
      <Nav product={product} />

      {/* HERO */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden canvas-smart">
        <div className="halo" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="aus-badge">{hero.eyebrow}</span>
              {product.status === "beta" && (
                <span className="font-mono text-[10px] tracking-[.2em] uppercase px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                  Private beta
                </span>
              )}
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[80px] font-extrabold tracking-tight leading-[0.98] text-[rgb(var(--ink))]">
              {hero.hLead}
              <em
                className="font-display italic font-semibold not-italic-fallback text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]"
                style={{ fontStyle: "italic" }}
              >
                {hero.hAccent}
              </em>
            </h1>

            <p className="mt-7 text-lg lg:text-xl text-[rgb(var(--ink-2))] leading-relaxed max-w-2xl">
              {hero.lede}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="#contact" className="btn btn-primary">Start 14-day trial →</Link>
              <Link href="#how" className="btn btn-ghost">{hero.ghostCta}</Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[rgb(var(--ink-3))]">
              {hero.meta.map((m, i) => (
                <span key={m} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>·</span>}
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Hero phones — real mobile screenshot when available, synthetic as accent */}
          <div className="lg:col-span-5 relative h-[480px] sm:h-[560px] lg:h-[680px]">
            {product.screenshots?.mobile ? (
              <>
                <div className="absolute right-0 top-4 lg:right-4" style={{ transform: "rotate(4deg)" }}>
                  <RealPhone shot={product.screenshots.mobile} width={300} />
                </div>
                <div className="absolute -left-2 bottom-4 hidden lg:block" style={{ transform: "rotate(-6deg)" }}>
                  <Phone width={230} height={490}><PhoneJobs /></Phone>
                </div>
              </>
            ) : (
              <>
                <div className="absolute right-0 top-4 lg:right-4" style={{ transform: "rotate(4deg)" }}>
                  <Phone width={310} height={640}><PhoneQuote /></Phone>
                </div>
                <div className="absolute -left-2 bottom-4 hidden lg:block" style={{ transform: "rotate(-6deg)" }}>
                  <Phone width={240} height={500}><PhoneJobs /></Phone>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Strip */}
        <div className="relative mt-16 max-w-7xl mx-auto px-5 lg:px-8">
          <div className="card p-5 lg:p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {product.strip.map(([k, v]) => (
              <div key={k}>
                <div className="font-mono text-[10px] tracking-[.16em] uppercase text-[rgb(var(--ink-3))]">{k}</div>
                <div className="mt-2 text-[rgb(var(--ink))] font-bold tracking-tight text-base lg:text-lg">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT RUNS — directly under hero */}
      <HowItRuns product={product} />

      {/* DEEP-SCREENS GALLERY — only renders if product has gallery shots */}
      <ProductGallery product={product} />

      {/* FEATURES — 6 numbered cards */}
      <section id="features" className="py-24 lg:py-32 bg-[rgb(var(--surface))] dark:bg-[rgb(var(--surface-2))]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">What you get</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[rgb(var(--ink))]">
              An app for the trade.{" "}
              <em
                className="font-display italic font-semibold text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]"
                style={{ fontStyle: "italic" }}
              >
                Not a generic CRM with custom fields.
              </em>
            </h2>
            <p className="mt-5 text-lg text-[rgb(var(--ink-2))] leading-relaxed">
              Every screen, field, checklist and PDF pre-loaded for the work you actually do.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.feats.map((f) => (
              <div key={f.n} className="card p-6 lg:p-7">
                <div
                  className="font-mono text-[11px] tracking-[.18em]"
                  style={{ color: product.brandHex }}
                >
                  — {f.n}
                </div>
                <h3 className="mt-2 text-lg font-bold tracking-tight text-[rgb(var(--ink))]">{f.title}</h3>
                <p className="mt-2 text-sm text-[rgb(var(--ink-2))] leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* "HOW IT WORKS" PIPELINE strip — quick visual breakdown */}
      <section id="how" className="py-24 lg:py-32 bg-[rgb(var(--surface-2))] dark:bg-[rgb(var(--surface))] border-y border-[rgb(var(--line-2))] dark:border-white/[.04]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">The full loop</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[rgb(var(--ink))]">
              Quote. Job. Invoice. <em className="font-display italic font-semibold text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]" style={{ fontStyle: "italic" }}>Paid.</em>
            </h2>
            <p className="mt-5 text-lg text-[rgb(var(--ink-2))] leading-relaxed">
              First call to final invoice. Every step in the app. No spreadsheet, no group SMS.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
            {product.checklist.map((step, i) => (
              <div key={step.title} className="card p-5 lg:p-6">
                <div
                  className="w-12 h-12 rounded-2xl grid place-items-center text-white text-lg font-extrabold"
                  style={{ background: `linear-gradient(135deg, ${product.brandHex}, ${product.brandHexDeep})`, boxShadow: `0 8px 24px ${product.brandHex}40` }}
                >
                  0{i + 1}
                </div>
                <div className="mt-4 text-[rgb(var(--ink))] font-bold tracking-tight">{step.title}</div>
                <div className="mt-2 text-sm text-[rgb(var(--ink-2))] leading-relaxed">{step.body}</div>
              </div>
            ))}
          </div>

          {/* Pipeline phones row — keep some texture in the page */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center">
            <div className="grid place-items-center"><Phone width={260} height={540}><PhoneQuote /></Phone></div>
            <div className="grid place-items-center"><Phone width={260} height={540}><PhoneJobs /></Phone></div>
            <div className="grid place-items-center"><Phone width={260} height={540}><PhonePipeline /></Phone></div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 lg:py-32 bg-[rgb(var(--surface))] dark:bg-[rgb(var(--surface-2))]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">Pricing</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[rgb(var(--ink))]">
              One price. Every feature. <em className="font-display italic font-semibold text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]" style={{ fontStyle: "italic" }}>Cancel anytime.</em>
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            {product.pricing.map((p) => (
              <div
                key={p.name}
                className={`card p-7 lg:p-8 relative ${p.popular ? "ring-1 ring-[rgb(var(--brand-500)/.45)] lg:scale-[1.03]" : ""}`}
              >
                {p.popular && (
                  <div
                    className="absolute -top-3 left-7 font-mono text-[10px] tracking-[.2em] uppercase px-2.5 py-1 rounded-full text-white"
                    style={{ background: `linear-gradient(135deg, ${product.brandHex}, ${product.brandHexDeep})` }}
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
                      <svg
                        width="14" height="14" viewBox="0 0 14 14"
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: product.brandHex }}
                      >
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

      {/* FAQ */}
      <section className="py-24 lg:py-32 bg-[rgb(var(--surface-2))] dark:bg-[rgb(var(--surface))] border-y border-[rgb(var(--line-2))] dark:border-white/[.04]">
        <div className="max-w-4xl mx-auto px-5 lg:px-8">
          <div className="eyebrow mb-4">FAQ</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[rgb(var(--ink))]">
            What you'd ask first.
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

      {/* CTA */}
      <section id="contact" className="py-24 lg:py-32 canvas-smart relative overflow-hidden">
        <div className="halo opacity-40" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <div className="eyebrow mb-4 justify-center">
              {product.status === "beta" ? "JOIN THE BETA" : "GET STARTED"}
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[rgb(var(--ink))]">
              {product.status === "beta" ? (
                <>Be the first crew on{" "}
                  <em className="font-display italic font-semibold text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]" style={{ fontStyle: "italic" }}>{product.name}.</em>
                </>
              ) : (
                <>Try {product.name} on your{" "}
                  <em className="font-display italic font-semibold text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]" style={{ fontStyle: "italic" }}>next job.</em>
                </>
              )}
            </h2>
            <p className="mt-4 text-lg text-[rgb(var(--ink-2))] leading-relaxed">
              14-day {product.name} sandbox, pre-loaded with your trade&apos;s templates. No sales call.
            </p>
          </div>
          <LeadForm product={product} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
