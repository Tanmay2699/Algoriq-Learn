import Link from 'next/link';
import type { Route } from 'next';
import { footer } from '../../config/navigation';
import { site } from '../../config/site';
import { Wordmark } from './wordmark';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="container-mk py-block">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {footer.map((group) => (
            <nav key={group.key} aria-labelledby={`footer-${group.key}`}>
              <h2 id={`footer-${group.key}`} className="text-caption font-medium uppercase tracking-wide text-fg-muted">
                {group.label}
              </h2>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href as Route}
                      className="text-mk-body-sm text-fg-muted transition-colors duration-fast hover:text-fg"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-block flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Wordmark />
            <p className="text-mk-body-sm text-fg-muted">© 2026 Akechi</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-mk-body-sm text-fg-muted">
            {/*
              Not a badge and not a boast — a fact a visitor can check in their own dev tools,
              and the reason there is no consent banner on this page.
            */}
            <Link href="/legal/cookies" className="underline underline-offset-4 hover:text-fg">
              This site sets no cookies
            </Link>
            <a href={`mailto:${site.contactEmail}`} className="underline underline-offset-4 hover:text-fg">
              {site.contactEmail}
            </a>
            <a
              href={site.appUrl}
              className="underline underline-offset-4 hover:text-fg"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sign in<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>

        <p className="mt-6 max-w-prose text-caption text-fg-muted">
          Moodle, Google Classroom and Canvas are trademarks of their respective owners. They are
          named on this site only to describe what each product does, and every comparison cell
          carries the source we took it from and the date we read it.
        </p>
      </div>
    </footer>
  );
}
