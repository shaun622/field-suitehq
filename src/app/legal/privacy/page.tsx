import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Privacy" };

export default function Privacy() {
  return (
    <main className="min-h-screen bg-[rgb(var(--surface))] text-[rgb(var(--ink))]">
      <Nav />
      <article className="max-w-3xl mx-auto px-5 lg:px-8 pt-32 pb-24">
        <div className="eyebrow mb-3">LEGAL</div>
        <h1 className="text-5xl font-extrabold tracking-tight text-[rgb(var(--ink))]">Privacy</h1>
        <p className="mt-6 text-[rgb(var(--ink-2))] leading-relaxed">
          FieldSuite Ltd respects your privacy and complies with UK GDPR / Data Protection Act 2018 where data is collected in the UK, and the Australian Privacy Principles under the Privacy Act 1988 (Cth) where data is collected in Australia.
        </p>

        <h2 className="mt-12 text-2xl font-bold text-[rgb(var(--ink))]">What we collect</h2>
        <ul className="mt-3 list-disc pl-6 space-y-2 text-[rgb(var(--ink-2))]">
          <li>Contact details you submit via our lead form (name, email, business, phone, message).</li>
          <li>Anonymised analytics (page paths, referrer, country) — no third-party trackers, no cross-site cookies.</li>
          <li>Account data once you start a trial — handled per the in-app privacy notice.</li>
        </ul>

        <h2 className="mt-10 text-2xl font-bold text-[rgb(var(--ink))]">How we use it</h2>
        <p className="mt-3 text-[rgb(var(--ink-2))] leading-relaxed">
          To respond to your enquiry and to send occasional product updates if you opt in. We don't sell your data, ever.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-[rgb(var(--ink))]">Contact</h2>
        <p className="mt-3 text-[rgb(var(--ink-2))] leading-relaxed">
          Questions or removal requests: <a className="text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))] underline underline-offset-4" href="mailto:hello@fieldsuite.app">hello@fieldsuite.app</a>.
        </p>

        <div className="mt-16">
          <Link href="/" className="btn btn-ghost">← Back to FieldSuite</Link>
        </div>
      </article>
      <Footer />
    </main>
  );
}
