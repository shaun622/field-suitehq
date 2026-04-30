// Run `next build` against an isolated distDir so it doesn't clobber the
// .next/ cache that the running `next dev` server is using.
//
// Without this, `npm run build` (e.g. for local verification) overwrites
// dev-mode webpack chunks the dev server has loaded into memory, and the
// dev server starts throwing ENOENT/MODULE_NOT_FOUND on hot reload.
//
// next.config.mjs reads `NEXT_DIST_DIR` and points distDir at it.
//
// IMPORTANT: in Next 15 with `output: "export"`, the static export lands
// inside the distDir (e.g. `.next-build/`), NOT in `out/` like Next 14.
// Cloudflare Pages expects `out/` as the build output directory, so we
// copy the export to `out/` after the build finishes. (Cloudflare's
// build output directory stays as `out` per project settings.)
import { spawnSync } from "node:child_process";
import { rmSync, cpSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const DIST_DIR = ".next-build";
const OUT_DIR = "out";

// Things inside .next-build/ that are Next.js internals — NOT the static
// export. We skip these when copying to out/.
const INTERNAL_ENTRIES = new Set([
  "cache",
  "server",
  "static",
  "trace",
  "build-manifest.json",
  "prerender-manifest.json",
  "routes-manifest.json",
  "app-build-manifest.json",
  "app-path-routes-manifest.json",
  "export-marker.json",
  "images-manifest.json",
  "next-minimal-server.js.nft.json",
  "next-server.js.nft.json",
  "package.json",
  "react-loadable-manifest.json",
  "required-server-files.json",
  "BUILD_ID",
  "diagnostics",
  "types",
]);

process.env.NEXT_DIST_DIR = DIST_DIR;

const buildResult = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});
if (buildResult.status !== 0) process.exit(buildResult.status ?? 1);

if (!existsSync(DIST_DIR)) {
  console.error(`Build script: expected ${DIST_DIR}/ to exist after build.`);
  process.exit(1);
}

// Recreate out/ from scratch so stale files from previous builds don't
// linger.
rmSync(OUT_DIR, { recursive: true, force: true });

// Copy every top-level entry from .next-build/ into out/, except the
// known Next-internal directories. _next/ IS shipped (it's the static
// chunks), so it's not in the skip list.
const entries = readdirSync(DIST_DIR);
let copied = 0;
for (const entry of entries) {
  if (INTERNAL_ENTRIES.has(entry)) continue;
  const src = path.join(DIST_DIR, entry);
  const dst = path.join(OUT_DIR, entry);
  cpSync(src, dst, { recursive: true });
  copied++;
}

if (!existsSync(path.join(OUT_DIR, "index.html"))) {
  console.error(`Build script: ${OUT_DIR}/index.html missing — export probably didn't run.`);
  process.exit(1);
}
console.log(`✓ Copied ${copied} entr${copied === 1 ? "y" : "ies"} from ${DIST_DIR}/ to ${OUT_DIR}/`);
