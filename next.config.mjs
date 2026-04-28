/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  // The marketing copy has lots of unescaped apostrophes in JSX text.
  // Don't let `react/no-unescaped-entities` block the build.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
