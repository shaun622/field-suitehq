// Run `next build` against an isolated distDir so it doesn't clobber the
// .next/ cache that the running `next dev` server is using.
//
// Without this, `npm run build` (e.g. for local verification) overwrites
// dev-mode webpack chunks the dev server has loaded into memory, and the
// dev server starts throwing ENOENT/MODULE_NOT_FOUND on hot reload.
//
// next.config.mjs reads `NEXT_DIST_DIR` and points distDir at it.
// Static export still lands in `out/` regardless (Next's static export
// path is independent of distDir).
import { spawnSync } from "node:child_process";

process.env.NEXT_DIST_DIR = ".next-build";

const r = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});
process.exit(r.status ?? 1);
