import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { PRODUCTS } from "@/lib/products";

export function Footer() {
  return (
    <footer className="border-t border-[rgb(var(--line))] dark:border-white/[.06] bg-[rgb(var(--surface-2))] dark:bg-[rgb(var(--surface))] text-[rgb(var(--ink-2))]">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8">
          <div className="col-span-2 md:col-span-4">
            <Wordmark markSize={26} />
            <p className="mt-4 text-sm leading-relaxed max-w-sm">
              Trade-specific CRM and job management. Built mobile, priced for owner-operators.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="aus-badge">UK + AU</span>
              <span className="aus-badge">Mobile-first</span>
              <span className="aus-badge">PWA · Offline</span>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-[.2em] text-[rgb(var(--ink-3))] font-mono mb-4">Apps</div>
            <ul className="space-y-2 text-sm">
              {PRODUCTS.map((p) => (
                <li key={p.slug}>
                  <Link href={`/products/${p.slug}`} className="hover:text-[rgb(var(--ink))] transition flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: p.brandHex }}
                      aria-hidden
                    />
                    {p.name}
                    {p.status === "beta" && (
                      <span className="font-mono text-[9px] tracking-[.18em] text-amber-600/80 dark:text-amber-300/70 uppercase">Beta</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[.2em] text-[rgb(var(--ink-3))] font-mono mb-4">FieldSuite</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#story" className="hover:text-[rgb(var(--ink))] transition">Our story</Link></li>
              <li><Link href="/#how" className="hover:text-[rgb(var(--ink))] transition">How it works</Link></li>
              <li><Link href="/#pricing" className="hover:text-[rgb(var(--ink))] transition">Pricing</Link></li>
              <li><Link href="/#contact" className="hover:text-[rgb(var(--ink))] transition">Talk to us</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-[.2em] text-[rgb(var(--ink-3))] font-mono mb-4">Resources</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#contact" className="hover:text-[rgb(var(--ink))] transition">Get a demo</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-[rgb(var(--ink))] transition">Privacy</Link></li>
              <li><Link href="/legal/terms" className="hover:text-[rgb(var(--ink))] transition">Terms</Link></li>
              <li><a href="mailto:hello@fieldsuite.app" className="hover:text-[rgb(var(--ink))] transition">hello@fieldsuite.app</a></li>
            </ul>
          </div>
        </div>

        <div className="divider-dots my-10" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[rgb(var(--ink-3))]">
          <div className="font-mono tracking-[.04em]">
            © FieldSuite {new Date().getFullYear()}
          </div>
          <div className="font-mono tracking-[.18em] uppercase">
            v2.0 · UK + AU
          </div>
        </div>
      </div>
    </footer>
  );
}
