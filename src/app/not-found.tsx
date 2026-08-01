import Link from 'next/link';
import type { Route } from 'next';
import { SiteFooter } from '../components/layout/footer';
import { SiteHeader } from '../components/layout/header';
import { spine } from '../content/lifecycle';

/**
 * 404.
 *
 * The lifecycle spine as a navigation device rather than an apology with a broken-robot
 * illustration. No search box — the site has fifty-one pages and seven of them are almost
 * certainly what somebody meant.
 *
 * It renders its own header and footer because `not-found.tsx` at the app root sits outside
 * the (marketing) group's layout.
 */
export default function NotFound() {
  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-[--radius] bg-surface px-4 py-2 text-mk-body-sm focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[60] focus:shadow-e3"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <section aria-labelledby="nf-title" className="bg-surface-bg py-act">
          <div className="container-mk">
            <p className="text-mk-eyebrow font-medium uppercase text-fg-muted">404</p>
            <h1 id="nf-title" className="mt-4 font-display text-display-2 font-normal text-fg">
              That page is somewhere between enquiry and outcome.
            </h1>
            <p className="mt-5 max-w-measure text-mk-lead text-fg-muted">
              It is not here, at least. Here are the seven places you might have meant.
            </p>

            <ol className="mt-block grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {spine.map((stop, index) => (
                <li key={stop.step}>
                  <Link
                    href={stop.href as Route}
                    className="block h-full rounded-lg border border-border bg-surface p-5 transition-colors duration-fast hover:bg-surface-muted"
                  >
                    <span className="font-mono text-caption text-fg-muted">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="mt-2 block text-mk-subtitle font-semibold text-fg">{stop.step}</span>
                    <span className="mt-1 block text-mk-body-sm text-fg-muted">{stop.module}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/product"
                  className="block h-full rounded-lg border border-border bg-surface-muted p-5 transition-colors duration-fast hover:bg-surface"
                >
                  <span className="font-mono text-caption text-fg-muted">All</span>
                  <span className="mt-2 block text-mk-subtitle font-semibold text-fg">
                    The whole product
                  </span>
                  <span className="mt-1 block text-mk-body-sm text-fg-muted">
                    Seven clusters, thirty-one modules
                  </span>
                </Link>
              </li>
            </ol>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
