import { SiteHeader } from '../../components/layout/header';
import { SiteFooter } from '../../components/layout/footer';

/**
 * The marketing shell. Everything public lives inside it; the three /api routes do not.
 *
 * The skip link is the first focusable element on every page — WCAG 2.4.1, and the one
 * accessibility feature a keyboard user notices within two seconds.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-[--radius] bg-surface px-4 py-2 text-mk-body-sm focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[60] focus:shadow-e3"
      >
        Skip to content
      </a>
      {/* The header solidifies when this scrolls out of view — one observer, no scroll listener. */}
      <div id="header-sentinel" aria-hidden="true" className="absolute top-0 h-10 w-px pointer-events-none" />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
