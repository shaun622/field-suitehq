// Minimal Cloudflare Pages Functions type stubs so the lead.ts file
// compiles without pulling @cloudflare/workers-types as a dep.
// At runtime Cloudflare provides the real types.

interface PagesFunctionContext<Env = Record<string, unknown>> {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request) => Promise<Response>;
  data: Record<string, unknown>;
}

type PagesFunction<Env = Record<string, unknown>> =
  (context: PagesFunctionContext<Env>) => Response | Promise<Response>;
