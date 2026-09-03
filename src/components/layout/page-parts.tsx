import Link from 'next/link';
import type { Route } from 'next';
import { cn } from '../../lib/cn';
import { Reveal } from '../primitives/motion';
import { site } from '../../config/site';
import { CTA, Eyebrow, Heading, Lead } from '../primitives';
import { Act } from './act';

/**
 * Breadcrumbs. Semantic `<nav><ol>`, and the same trail is emitted as BreadcrumbList JSON-LD
 * by the page that renders it — one source, two consumers.
 */
export function Breadcrumbs({ trail }: { trail: { href: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-mk-body-sm text-fg-muted">
        <li>
          <Link href="/" className="hover:text-fg">
            Home
          </Link>
        </li>
        {trail.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-2">
            <span aria-hidden="true">›</span>
            {index === trail.length - 1 ? (
              <span aria-current="page" className="text-fg">
                {crumb.label}
              </span>
            ) : (
              <Link href={crumb.href as Route} className="hover:text-fg">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** The standard page opening: breadcrumb, eyebrow, H1, lead. */
export function PageHero({
  eyebrow,
  title,
  lead,
  trail,
  children,
  surface = 'paper',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  trail?: { href: string; label: string }[];
  children?: React.ReactNode;
  surface?: 'paper' | 'muted' | 'ink';
}) {
  const ink = surface === 'ink';
  return (
    <Act labelledBy="page-title" surface={surface} spacing="tight" className="pt-10">
      <div className="container-mk">
        {trail && <Breadcrumbs trail={trail} />}
        {eyebrow && (
          <Eyebrow surface={ink ? 'ink' : 'paper'} className="mk-enter">
            {eyebrow}
          </Eyebrow>
        )}
        <Heading
          level={1}
          display="display-3"
          id="page-title"
          surface={ink ? 'ink' : 'paper'}
          /*
           * `mk-wipe`, not `mk-enter`: a page title is the one line on the page that should
           * arrive at full opacity throughout, and a clip-path wipe does that where a fade
           * cannot. Same ladder position, same delay token — only the gesture differs.
           */
          className={cn('mk-wipe mk-enter-2', eyebrow && 'mt-3', 'max-w-[22ch]')}
        >
          {title}
        </Heading>
        {lead && (
          <Lead surface={ink ? 'ink' : 'paper'} className="mk-enter mk-enter-3 mt-5">
            {lead}
          </Lead>
        )}
        {children && <div className="mk-enter mk-enter-4">{children}</div>}
      </div>
    </Act>
  );
}

/**
 * The closing band. Every page ends with a next step, and it is never the same one twice in a
 * row on the same page.
 */
export function ClosingCTA({
  title = 'Start on the free tier. Bring your spreadsheet.',
  lead = 'A hundred seats, twenty-five courses and no conversation. If you would rather see it driven by someone who knows it, that takes twenty minutes.',
  primary = { href: '/pricing', label: 'Start free — 100 seats' },
  secondary = { href: '/demo', label: 'Book a 20-minute walkthrough' },
}: {
  title?: string;
  lead?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <Act labelledBy="closing-cta-title" surface="ink" spacing="normal" aurora>
      <div className="container-mk">
        {/*
          The same ladder as the hero, built from `Reveal` rather than `mk-enter` because this
          band is below the fold on every page it appears on. The rungs are the reading order
          — the ask, the terms, the buttons, the escape hatch — and the delays are short
          enough that somebody who scrolls straight here is not kept waiting for a button.
        */}
        <Reveal variant="lines">
          <Heading level={2} id="closing-cta-title" surface="ink" className="max-w-[18ch]">
            {title}
          </Heading>
        </Reveal>
        <Reveal delay={120}>
          <Lead surface="ink" className="mt-5">
            {lead}
          </Lead>
        </Reveal>
        <Reveal delay={220} className="mt-8 flex flex-wrap gap-3">
          <CTA href={primary.href} size="lg" surface="ink">
            {primary.label}
          </CTA>
          <CTA href={secondary.href} variant="secondary" size="lg" surface="ink">
            {secondary.label}
          </CTA>
        </Reveal>
        <Reveal delay={300}>
          <p className="mt-4 text-mk-body-sm text-on-ink-muted">
            Or{' '}
            <a
              href={site.sandboxUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              open the sandbox
              <span className="sr-only"> (opens in a new tab)</span>
            </a>{' '}
            and click around first. No form.
          </p>
        </Reveal>
      </div>
    </Act>
  );
}

/** A short, honest note about what a surface does not do yet. Used on every module page. */
export function NotBuilt({ items, className }: { items: string[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <div className={cn('rounded-lg border border-border bg-surface-muted p-6', className)}>
      <h2 className="text-mk-subtitle font-semibold text-fg">What this does not do yet</h2>
      <p className="mt-2 text-mk-body-sm text-fg-muted">
        Naming these is cheaper for both of us than discovering them in week six.
      </p>
      <ul className="mt-4 space-y-2 text-mk-body-sm text-fg-muted">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true">·</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-mk-body-sm">
        <Link href="/trust/build-status" className="text-link underline underline-offset-4">
          The whole list, with percentages
        </Link>
      </p>
    </div>
  );
}
