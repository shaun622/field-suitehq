import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LeadForm } from "@/components/LeadForm";
import { Phone } from "@/components/phones/Phone";
import { PhoneDashboard, PhoneJobs, PhoneQuote, PhonePipeline, POOL_DASH, FIRE_DASH } from "@/components/phones/PhoneScreens";
import { Product } from "@/lib/products";

interface VerticalCopy {
  heroEyebrow: string;
  heroH1: React.ReactNode;
  heroSub: string;
  paragraphs: { eyebrow: string; title: string; body: string; bullets: string[] }[];
  faq: { q: string; a: string }[];
  /** Fallback dashboard copy preset for the hero phone */
  dashCopy?: typeof POOL_DASH;
}

const VERTICAL_COPY: Record<Product["slug"], VerticalCopy | undefined> = {
  treepro: undefined,
  poolpro: {
    heroEyebrow: "AUS · POOL CARE · MOBILE-FIRST",
    heroH1: <>Route → service → <span className="text-brand-400">paid</span>. Same arvo.</>,
    heroSub: "PoolPro is the field-first SaaS for Aussie pool techs and shops. Drag-to-reorder routes, target-range chemical logs, photo-stamped service reports, customer portal — all from the truck.",
    dashCopy: POOL_DASH,
    paragraphs: [
      {
        eyebrow: "ROUTES",
        title: "Drag-and-drop daily routes.",
        body: "Stops auto-sequenced by suburb. Drag to reorder. Customer SMS'd 30 min before. Skip a stop and the next one slides up.",
        bullets: ["Address-clustered routing", "ETA-aware customer SMS", "Skip / reschedule in two taps"],
      },
      {
        eyebrow: "CHEMISTRY",
        title: "Targets baked in. Not a spreadsheet.",
        body: "pH, free Cl, total Cl, alkalinity, calcium hardness, salt — pre-loaded with target ranges per pool type (chlorine, salt, mineral, freshwater). Out-of-range flags itself.",
        bullets: ["Pool-type aware target ranges", "Chemical library with AUD pricing", "Auto-flag out-of-range readings"],
      },
      {
        eyebrow: "CUSTOMER PORTAL",
        title: "Photos. Readings. History. One link.",
        body: "Branded link your customer actually opens. Service history, photos, chemical trends, next visit, accept/pay. The polish your pool shop deserves.",
        bullets: ["Service history with photos", "Chemical trend charts", "One-tap accept and pay"],
      },
    ],
    faq: [
      { q: "Does it handle one-off jobs and recurring maintenance together?",
        a: "Yes. Recurring weekly/fortnightly contracts and one-off acid washes / pump rebuilds run through the same job pipeline." },
      { q: "Will it work in the truck on patchy reception?",
        a: "Yes. Service reports, photos and chemical logs queue offline and push when you're back in range." },
      { q: "How does the trial work?",
        a: "14 days, full app, no card. We'll seed a sample route and chemical library so you can run a real service on day one." },
    ],
  },
  firepro: {
    heroEyebrow: "UK · BAFE-READY · BS 8214 BAKED IN",
    heroH1: <>71 inspection points <span className="text-brand-400">per door</span>. On the record.</>,
    heroSub: "FirePro is the fire-door inspection app your Responsible Person actually wants to sign. Per-door 71-point BS 8214:2016 checklist, dual sign-off (assessor + RP), branded compliance PDF, audit trail that survives litigation.",
    dashCopy: FIRE_DASH,
    paragraphs: [
      {
        eyebrow: "PER-DOOR REGISTER",
        title: "Every door, registered. Every fail, evidenced.",
        body: "Each door is its own record with metadata snapshotted at time of assessment. Three-state pass / fail / N-A buttons, photo evidence required on every fail. Sticky 'progress 12/71' bar.",
        bullets: ["71-point BS 8214 checklist per door", "Photo evidence on every fail", "Door metadata immutable post-assessment"],
      },
      {
        eyebrow: "DUAL SIGN-OFF",
        title: "Assessor cert no. + Responsible Person, both timestamped.",
        body: "Two on-screen signature pads. The assessor signs with their BAFE cert number; the RP signs by name with their criminal liability acknowledgement. Both signatures live in the PDF and the audit trail.",
        bullets: ["BAFE cert number captured", "Responsible Person on the form by name", "Signatures stored 5 years, immutable"],
      },
      {
        eyebrow: "INSURER-READY PDF",
        title: "Building report, branded, with compliance %.",
        body: "Single-door report, or whole-building report with cover page, compliance %, register index, per-door chapters with photos. Hand it to the inspector. Email it to your insurer. Survives a tribunal.",
        bullets: ["Branded cover + compliance %", "Per-door chapters with photos", "Audit trail for 5 years"],
      },
    ],
    faq: [
      { q: "Does it cover RRO 2005 and Building Safety Act?",
        a: "Yes. The checklist is mapped to BS 8214:2016 and the report layout is built for the evidence requirements under the Regulatory Reform (Fire Safety) Order 2005 and the Building Safety Act regime." },
      { q: "Can we set re-inspection cadence per door?",
        a: "Yes. One cadence per building by default, with optional per-door override. The next visit projects itself onto the calendar." },
      { q: "How does the beta work?",
        a: "Private beta currently. Drop your details and we'll set up a sample building so you can run a real assessment on the next site visit." },
    ],
  },
  pestpro: {
    heroEyebrow: "UK + AU · BPCA-READY · COSHH TRACEABLE",
    heroH1: <>Pest management. <span className="text-brand-400">On the record.</span></>,
    heroSub: "PestPro is the audit-ready service app for pest controllers. Bait-point mapping, COSHH-traceable products, dual signatures, branded report emailed before the van leaves. Hand the EHO a PDF, not a clipboard.",
    paragraphs: [
      {
        eyebrow: "EVIDENCE BY DEFAULT",
        title: "Every visit. Every bait. Every photograph. Logged.",
        body: "Task checklist, products used (with HSE approval numbers), photo evidence, technician signature — all completed before the technician leaves site.",
        bullets: ["Hot-spot bait-point mapping", "HSE-numbered product log", "Before/after photos auto-stamped"],
      },
      {
        eyebrow: "RECURRING CONTRACTS",
        title: "Monthly. Quarterly. Auto-projected.",
        body: "Recurring service profiles auto-project onto the calendar. No more 'when was the last visit?' emails from facilities. Customer portal shows the schedule.",
        bullets: ["Recurring contracts auto-scheduled", "Customer-visible schedule", "Skip / reschedule with audit"],
      },
      {
        eyebrow: "BRANDED REPORTS",
        title: "PDF in the inbox before the van leaves.",
        body: "Branded report emailed instantly. Recipient gets a real document — not a paper sheet stuffed under the wiper. Inspector turns up? You hand them a PDF.",
        bullets: ["Same-day report delivery", "BPCA cert number on the report", "Multi-recipient routing (FM, ops, head office)"],
      },
    ],
    faq: [
      { q: "Does it handle CRRU and COSHH compliance?",
        a: "Yes. Products are logged with batch and quantity. The CRRU UK Code stewardship language is on the report by default." },
      { q: "What about hospitality contracts (FSA, EHO)?",
        a: "PestPro reports are designed for FSA / EHO inspections. The visit log, products used, technician sign-off and photos are all in one PDF you can hand over on the spot." },
      { q: "Can it cover other divisions later (fire, hygiene, locks)?",
        a: "Yes — Field Mate ships dedicated apps per division. One supplier, one invoice, one phone number across compliance." },
    ],
  },
  hygienepro: {
    heroEyebrow: "UK + AU · BICSc-READY · ISO 9001",
    heroH1: <>Clean enough <span className="text-brand-400">to inspect</span>.</>,
    heroSub: "HygienePro hands you the before/after photos, the chemicals used, the technician sign-off, and a PDF you can wave at the FSA. Built for kitchen deep-cleans, washroom contracts, healthcare IPC, and end-of-tenancy.",
    paragraphs: [
      {
        eyebrow: "PHOTO-STAMPED EVIDENCE",
        title: "Before. After. Documented.",
        body: "Every visit attaches before/after photos to the report. Date and time stamped. Tagged to the area. Surfaced in the customer portal for the FSA.",
        bullets: ["Before/after auto-tagging", "Per-area photo grids", "Chain-of-custody on the PDF"],
      },
      {
        eyebrow: "CHEMICAL TRACEABILITY",
        title: "Every product. Batch and quantity.",
        body: "COSHH-aware chemical library. Every product used logged with batch number and quantity. SDS attached per product. Dilution rates recorded.",
        bullets: ["COSHH-aware library", "Batch + quantity per use", "SDS attached, one tap to view"],
      },
      {
        eyebrow: "RECURRING SCHEDULES",
        title: "Kitchen extraction every six months. Washrooms weekly.",
        body: "Per-site recurring schedules. Kitchen extraction, washroom services, IPC rounds — all auto-projected. Skip a visit and the next one slides up with an audit reason.",
        bullets: ["Per-site recurring schedules", "Multi-area, multi-frequency", "Skip with reason, audited"],
      },
    ],
    faq: [
      { q: "Does it work for healthcare IPC contracts?",
        a: "Yes. Care home / clinical area schedules with IPC-specific checklists are templated. Sign-off captured per area." },
      { q: "Can we bundle with PestPro and FirePro?",
        a: "Yes. Customers on multiple Field Mate apps can roll into a single invoice. One supplier across compliance." },
      { q: "How do we get started?",
        a: "Drop your details. Private beta access — we'll seed your sites and recurring schedules from your existing contracts." },
    ],
  },
  lockpro: {
    heroEyebrow: "UK + AU · MLA-STYLE · BS 3621",
    heroH1: <>MLA-tidy. <span className="text-brand-400">Phone-bookable.</span></>,
    heroSub: "LockPro replaces the 'cash only on the doorstep' image with live ETA, fixed-price quoting, BS 3621 stock list, and photo + invoice before the van leaves. Built for residential lockouts, letting agents, and small commercial.",
    paragraphs: [
      {
        eyebrow: "LIVE ETA",
        title: "Locked out? 60-min window. Tracked.",
        body: "Customer books, sees the technician en-route on a live map, gets a 60-min ETA window. No 'sometime this afternoon'.",
        bullets: ["Live tech ETA", "Customer SMS at dispatch + 5 min away", "Auto-fallback to next nearest tech"],
      },
      {
        eyebrow: "FIXED-PRICE",
        title: "Quoted on the phone. Honoured on the doorstep.",
        body: "Pre-loaded BS 3621 / 8621 stock with parts and labour. Quote on the call, no doorstep surprises. MLA-style transparency.",
        bullets: ["BS 3621 / 8621 stock library", "Phone-quoted pricing on file", "Doorstep upsell flagged for audit"],
      },
      {
        eyebrow: "PHOTO + INVOICE",
        title: "Before the van leaves.",
        body: "Photo of the new lock. Digital invoice. Card or BACS. Receipt in the customer's inbox before the van leaves. No 'I'll send it later'.",
        bullets: ["Photo of fitted hardware", "Digital invoice on-site", "Card / BACS / PayID accepted"],
      },
    ],
    faq: [
      { q: "Does it handle landlord / lettings packages?",
        a: "Yes. Between-tenancy bulk lock changes, master keying schedules, and key-handover sign-off are all templated for letting agents." },
      { q: "What about insurance compliance (BS 3621)?",
        a: "Stock library defaults to BS 3621 deadlocks for insurance compliance. Pre-fill the certificate on the report, ready for the customer's insurer." },
      { q: "Can dispatchers see all jobs in real time?",
        a: "Yes. Live map of techs, jobs in progress, ETAs, and pending bookings. Drag to reassign. Customer SMS auto-fires on assignment." },
    ],
  },
};

export function GenericProductPage({ product }: { product: Product }) {
  const copy = VERTICAL_COPY[product.slug];
  if (!copy) {
    return (
      <main className={`theme-${product.slug} min-h-screen bg-ink-950 text-bone-100`}>
        <Nav product={product} />
        <section className="pt-40 pb-24 canvas-dusk text-center">
          <h1 className="text-4xl font-extrabold text-white">{product.name}</h1>
          <p className="mt-4 text-white/65">Coming soon.</p>
        </section>
        <Footer />
      </main>
    );
  }

  // Hero phone choice — Quote screen reads beautifully across verticals
  const heroPhones = (
    <>
      <div className="absolute right-0 top-4 lg:right-4" style={{ transform: "rotate(4deg)" }}>
        {product.slug === "poolpro" && <Phone width={310} height={640}><PhoneDashboard copy={POOL_DASH} /></Phone>}
        {product.slug === "firepro" && <Phone width={310} height={640}><PhoneDashboard copy={FIRE_DASH} /></Phone>}
        {!["poolpro", "firepro"].includes(product.slug) && <Phone width={310} height={640}><PhoneQuote /></Phone>}
      </div>
      <div className="absolute -left-2 bottom-4 hidden lg:block" style={{ transform: "rotate(-6deg)" }}>
        <Phone width={240} height={500}><PhoneJobs /></Phone>
      </div>
    </>
  );

  return (
    <main className={`theme-${product.slug} min-h-screen bg-ink-950 text-bone-100`}>
      <Nav product={product} />

      {/* HERO */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden canvas-dusk">
        <div className="halo" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 animate-slide-up">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="aus-badge">{copy.heroEyebrow}</span>
              {product.status === "beta" && (
                <span className="font-mono text-[10px] tracking-[.2em] uppercase px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">
                  Private beta · invite a tester
                </span>
              )}
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tightest leading-[0.98] text-white">
              {copy.heroH1}
            </h1>
            <p className="mt-7 text-lg lg:text-xl text-white/70 leading-relaxed max-w-2xl">{copy.heroSub}</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="#contact" className="btn btn-primary">
                {product.status === "beta" ? "Request beta access →" : "Start 14-day trial →"}
              </Link>
              <Link href="/" className="btn btn-ghost">See the family</Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-white/55">
              {product.certs.map((c) => (
                <span key={c} className="font-mono text-[11px] tracking-[.14em] uppercase px-2 py-1 rounded bg-white/[.04] border border-white/[.06]">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[560px] lg:h-[680px] hidden md:block">{heroPhones}</div>
        </div>
      </section>

      {/* PARAGRAPHS — alternating */}
      {copy.paragraphs.map((p, i) => (
        <section
          key={p.title}
          className={i % 2 === 0
            ? "py-24 lg:py-32 bg-ink-900 border-y border-white/[.04]"
            : "py-24 lg:py-32 canvas-dusk relative overflow-hidden"}
        >
          {i % 2 === 1 && <div className="halo opacity-40" aria-hidden />}
          <div className={`relative max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${i % 2 === 1 ? "lg:[&>div:first-child]:order-last" : ""}`}>
            <div className="lg:col-span-7">
              <div className="eyebrow mb-4">{p.eyebrow}</div>
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tightest text-white">{p.title}</h2>
              <p className="mt-5 text-lg text-white/70 leading-relaxed max-w-2xl">{p.body}</p>
              <ul className="mt-7 space-y-3">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-base text-white/80">
                    <svg width="18" height="18" viewBox="0 0 18 18" className="mt-1 text-brand-400 flex-shrink-0">
                      <path d="M3 9.5l4 4 8-8" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>{b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-5 grid place-items-center">
              {i === 0 && <Phone width={290} height={600}>{copy.dashCopy ? <PhoneDashboard copy={copy.dashCopy} /> : <PhoneDashboard />}</Phone>}
              {i === 1 && <Phone width={290} height={600}><PhonePipeline /></Phone>}
              {i === 2 && <Phone width={290} height={600}><PhoneQuote /></Phone>}
            </div>
          </div>
        </section>
      ))}

      {/* FAQ */}
      <section className="py-24 lg:py-32 bg-ink-900 border-y border-white/[.04]">
        <div className="max-w-4xl mx-auto px-5 lg:px-8">
          <div className="eyebrow mb-4">FAQ</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tightest text-white">
            What you'd ask first.
          </h2>
          <div className="mt-12 divide-y divide-white/[.06]">
            {copy.faq.map((f) => (
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

      {/* CTA */}
      <section id="contact" className="py-24 lg:py-32 canvas-dusk relative overflow-hidden">
        <div className="halo opacity-50" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <div className="eyebrow mb-4">
              {product.status === "beta" ? "JOIN THE BETA" : "GET STARTED"}
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tightest text-white">
              {product.status === "beta" ? <>Be the first crew on <span className="text-brand-400">{product.name}</span>.</> : <>Try {product.name} on your <span className="text-brand-400">next job</span>.</>}
            </h2>
            <p className="mt-4 text-lg text-white/65 leading-relaxed">
              Drop your details. We'll spin up a {product.name} sandbox pre-loaded with your trade's templates &mdash; no boilerplate sales call.
            </p>
          </div>
          <LeadForm product={product} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
