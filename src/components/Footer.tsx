import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { PRODUCTS } from "@/lib/products";

export function Footer() {
  return (
    <footer className="border-t border-white/[.06] bg-ink-950 text-white/60">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8">
          <div className="col-span-2 md:col-span-4">
            <Wordmark size={22} />
            <p className="mt-4 text-sm leading-relaxed max-w-sm">
              Software for the people who do the work. Built mobile, priced for owner-operators, opinionated about the trade you're in.
            </p>
            <div className="mt-5 flex gap-2">
              <span className="aus-badge">AU/UK</span>
              <span className="aus-badge">Mobile-first</span>
              <span className="aus-badge">GST-ready</span>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-[.2em] text-white/40 font-mono mb-4">Products</div>
            <ul className="space-y-2 text-sm">
              {PRODUCTS.map((p) => (
                <li key={p.slug}>
                  <Link href={`/products/${p.slug}`} className="hover:text-white transition flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: p.brandHex }}
                      aria-hidden
                    />
                    {p.name}
                    {p.status === "beta" && (
                      <span className="font-mono text-[9px] tracking-[.18em] text-amber-300/70 uppercase">Beta</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[.2em] text-white/40 font-mono mb-4">Field Mate</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#story" className="hover:text-white transition">Our story</Link></li>
              <li><Link href="/#how" className="hover:text-white transition">How it works</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link href="/#contact" className="hover:text-white transition">Talk to us</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-[.2em] text-white/40 font-mono mb-4">Resources</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#contact" className="hover:text-white transition">Get a demo</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-white transition">Privacy</Link></li>
              <li><Link href="/legal/terms" className="hover:text-white transition">Terms</Link></li>
              <li><a href="mailto:hello@fieldmate.app" className="hover:text-white transition">hello@fieldmate.app</a></li>
            </ul>
          </div>
        </div>

        <div className="divider-dots my-10" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
          <div className="font-mono tracking-[.04em] text-white/40">
            © {new Date().getFullYear()} Field Mate Pty Ltd · ABN 00 000 000 000
          </div>
          <div className="font-mono tracking-[.18em] uppercase text-white/35">
            v1.0 · Made in AU
          </div>
        </div>
      </div>
    </footer>
  );
}
