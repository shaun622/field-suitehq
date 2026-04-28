/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  // The marketing copy has lots of unescaped apostrophes in JSX text.
  // Don't let `react/no-unescaped-entities` block the build.
  eslint: { ignoreDuringBuilds: true },
  // Read distDir from env so prod builds (`npm run build` via
  // scripts/build.mjs which sets NEXT_DIST_DIR=.next-build) write to a
  // separate cache dir than `next dev`'s default `.next/`. Stops the
  // build from clobbering the running dev server.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
};

export default nextConfig;
