import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-ink-950 text-bone-100 grid place-items-center px-5">
      <div className="max-w-md text-center">
        <Wordmark size={28} />
        <div className="mt-8 font-mono text-[12px] tracking-[.22em] uppercase text-brand-400">404</div>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tightest text-white">Lost a track in the bush.</h1>
        <p className="mt-4 text-white/60 leading-relaxed">
          The page you're after isn't here. Try the homepage or jump straight to a product.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link href="/" className="btn btn-primary">Back to Field Mate →</Link>
          <Link href="/products/treepro" className="btn btn-ghost">See TreePro</Link>
        </div>
      </div>
    </main>
  );
}
