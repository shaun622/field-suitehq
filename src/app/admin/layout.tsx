import type { Metadata } from "next";

// Admin layout — explicitly noindex/nofollow at the page metadata level
// (in addition to the robots.txt disallow) so even if a search engine
// crawls the URL via a leaked link, it won't index it. This is the
// minimum viable defence; the proper one is Cloudflare Access in front
// of this entire route once the real domain is wired up.
export const metadata: Metadata = {
  title: "Admin · FieldSuite",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
