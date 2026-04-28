import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[rgb(var(--surface))] text-[rgb(var(--ink))] grid place-items-center px-5">
      <div className="max-w-md text-center">
        <Wordmark markSize={28} />
        <div className="mt-8 font-mono text-[12px] tracking-[.22em] uppercase text-[rgb(var(--brand-600))] dark:text-[rgb(var(--brand-400))]">404</div>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[rgb(var(--ink))]">Lost a track in the bush.</h1>
        <p className="mt-4 text-[rgb(var(--ink-2))] leading-relaxed">
          The page you're after isn't here. Try the homepage or jump straight to one of the apps.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link href="/" className="btn btn-primary">Back to FieldSuite →</Link>
          <Link href="/products/treemate" className="btn btn-ghost">See TreeMate</Link>
        </div>
      </div>
    </main>
  );
}
