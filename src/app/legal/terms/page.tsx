import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Terms" };

export default function Terms() {
  return (
    <main className="min-h-screen bg-ink-950 text-bone-100">
      <Nav />
      <article className="max-w-3xl mx-auto px-5 lg:px-8 pt-32 pb-24">
        <div className="eyebrow mb-3">LEGAL</div>
        <h1 className="text-5xl font-extrabold tracking-tightest text-white">Terms of Use</h1>
        <p className="mt-6 text-white/60 leading-relaxed">
          By using fieldmate.app you agree to the basics: don't try to break it, don't scrape it, don't use it to harm anyone. Full plain-English terms ship with each product trial.
        </p>

        <h2 className="mt-12 text-2xl font-bold text-white">Marketing site</h2>
        <p className="mt-3 text-white/70 leading-relaxed">
          This site is provided as-is. We may change product details, pricing and availability without notice. Pricing on the homepage is indicative; the binding price is the one in your trial / subscription dashboard.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-white">Trademarks & content</h2>
        <p className="mt-3 text-white/70 leading-relaxed">
          &ldquo;Field Mate&rdquo;, &ldquo;TreePro&rdquo;, &ldquo;PoolPro&rdquo;, &ldquo;FirePro&rdquo;, &ldquo;PestPro&rdquo;, &ldquo;HygienePro&rdquo;, &ldquo;LockPro&rdquo; and the Field Mate marks are trademarks of Field Mate Pty Ltd. References to third-party standards (AS4373, BS 8214, BAFE, BPCA, BICSc, MLA) are descriptive and don't imply endorsement.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-white">Contact</h2>
        <p className="mt-3 text-white/70 leading-relaxed">
          <a className="text-brand-400 underline underline-offset-4" href="mailto:hello@fieldmate.app">hello@fieldmate.app</a>
        </p>

        <div className="mt-16">
          <Link href="/" className="btn btn-ghost">← Back to Field Mate</Link>
        </div>
      </article>
      <Footer />
    </main>
  );
}
