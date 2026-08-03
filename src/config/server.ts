/**
 * Server-only configuration.
 *
 * `site.ts` is imported by client components — the header reads the sandbox URL — so anything
 * in it is bundled into the browser. These two values have no business there: the API host is
 * internal infrastructure detail and the tenant slug is the name of our own institute. Neither
 * is a credential, but neither is a thing a marketing page needs to hand to every visitor, and
 * `e2e/headers-and-motion.spec.ts` asserts they never appear in a script the browser downloads.
 *
 * The guard is a real one rather than a comment: importing this from a client component throws
 * at module load, loudly, instead of shipping quietly.
 */
if (typeof window !== 'undefined') {
  throw new Error(
    'src/config/server.ts was imported into client code. Move the value you need into src/config/site.ts, or keep the work on the server.',
  );
}

export const server = {
  /** The product API. 127.0.0.1 rather than localhost — IPv6 resolution breaks container access. */
  apiUrl: process.env.API_URL ?? 'http://127.0.0.1:4000',
  /** Our own institute, on our own product: where an enquiry from /demo lands. */
  tenantSlug: process.env.ALGORYQ_TENANT_SLUG ?? 'algoryq-learn',
} as const;
