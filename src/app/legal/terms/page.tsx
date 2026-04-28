import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Terms" };

export default function Terms() {
  return (
    <main className="min-h-screen bg-[rgb(var(--surface))] text-[rgb(var(--ink))]">
      <Nav />
      <article className="max-w-3xl mx-auto px-5 lg:px-8 pt-32 pb-24">
        <div className="eyebrow mb-3">LEGAL</div>
        <h1 className="text-5xl font-extrabold tracking-tight text-[rgb(var(--ink))]">Terms of Use</h1>
        <p className="mt-6 text-[rgb(var(--ink-2))] leading-relaxed">
          By using fieldsuite.app you agree to the basics: don't try to break it, don't scrape it, don't use it to harm anyone. Full plain-English terms ship with each product trial.
        </p>

        <h2 className="mt-12 text-2xl font-bold text-[rgb(var(--ink))]">Marketing site</h2>
        <p className="mt-3 text-[rgb(var(--ink-2))] leading-relaxed">
          This site is provided as-is. We may change product details, pricing and availability without notice. Pricing on the homepage is indicative; the binding price is the one in your trial / subscription dashboard.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-[rgb(var(--ink))]">Trademarks &amp; content</h2>
        <p className="mt-3 text-[rgb(var(--ink-2))] leading-relaxed">
          &ldquo;FieldSuite&rdquo;, &ldquo;FieldMate&rdquo;, &ldquo;TreeMate&rdquo;, &ldquo;PoolMate&rdquo;, &ldquo;FireMate&rdquo;, &ldquo;PestMate&rdquo;, &ldquo;HygieneMate&rdquo;, &ldquo;LocksmithMate&rdquo; and the FieldSuite marks are trademarks of FieldSuite Ltd. References to third-party standards (AS 4373, BS 8214, BAFE, BPCA, BICSc, MLA, PWTAG) are descriptive and don't imply endorsement.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-[rgb(var(--ink))]">Contact</h2>
        <p className="mt-3 text-[rgb(var(--ink-2))] leading-relaxed">
          <a className="text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))] underline underline-offset-4" href="mailto:hello@fieldsuite.app">hello@fieldsuite.app</a>
        </p>

        <div className="mt-16">
          <Link href="/" className="btn btn-ghost">← Back to FieldSuite</Link>
        </div>
      </article>
      <Footer />
    </main>
  );
}
