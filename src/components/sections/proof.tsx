import Link from 'next/link';
import type { Route } from 'next';
import { site } from '../../config/site';

/**
 * The proof components.
 *
 * All four return `null` on empty input — not a skeleton, not a grey placeholder, nothing —
 * and the surrounding layout is designed to read as finished without them (ADR 0004). The
 * arrays below are empty and will stay empty until there is a real customer who has signed a
 * written permission. There is no code path that renders an invented one.
 */

export interface Testimonial {
  quote: string;
  person: string;
  role: string;
  institute: string;
  approvedOn: string;
}

export interface CaseStudy {
  href: string;
  institute: string;
  summary: string;
  publishedOn: string;
}

export const testimonials: Testimonial[] = [];
export const caseStudies: CaseStudy[] = [];
export const awards: { name: string; issuer: string; year: number }[] = [];
export const customerLogos: { name: string; src: string }[] = [];

export function Testimonials({ items = testimonials }: { items?: Testimonial[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {items.map((item) => (
        <li key={item.quote} className="rounded-lg border border-border bg-surface p-6">
          <blockquote className="text-mk-body text-fg">“{item.quote}”</blockquote>
          <p className="mt-4 text-mk-body-sm text-fg-muted">
            {item.person}, {item.role} · {item.institute}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function CaseStudies({ items = caseStudies }: { items?: CaseStudy[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {items.map((item) => (
        <li key={item.href} className="rounded-lg border border-border bg-surface p-6">
          <h3 className="text-mk-subtitle font-semibold text-fg">{item.institute}</h3>
          <p className="mt-2 text-mk-body-sm text-fg-muted">{item.summary}</p>
        </li>
      ))}
    </ul>
  );
}

export function Awards({ items = awards }: { items?: typeof awards }) {
  if (items.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-4">
      {items.map((item) => (
        <li key={item.name} className="text-mk-body-sm text-fg-muted">
          {item.name} — {item.issuer}, {item.year}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------ Verifiable by */

interface VerifiableItem {
  label: string;
  detail: string;
  href: string;
  external?: boolean;
}

/**
 * What goes where a competitor puts six grey customer logos.
 *
 * Six things a stranger can check in ninety seconds without talking to us. For the two
 * personas who kill deals in this category — the IT reviewer and procurement — this is
 * strictly better than logos, because they cannot verify a logo and they can run
 * `docker compose up`.
 */
export const verifiableItems: VerifiableItem[] = [
  {
    label: 'A live sandbox',
    detail: 'A real institute with seeded data. No signup.',
    href: site.sandboxUrl,
    external: true,
  },
  { label: 'The API reference', detail: 'Every endpoint, versioned and permission-checked.', href: '/developers' },
  {
    label: 'A certificate you can check',
    detail: 'Paste a code. No account. It answers.',
    href: '/security#verification',
  },
  { label: 'docker compose up', detail: 'The whole platform, on your laptop, no cloud account.', href: '/resources/self-hosting-algoryq-learn' },
  { label: 'Our accessibility statement', detail: 'Including what still fails.', href: '/accessibility' },
  { label: 'What we have not built', detail: 'The real completion matrix, all twenty-four rows.', href: '/trust/build-status' },
];

export function ProofBand({ surface = 'ink' }: { surface?: 'ink' | 'paper' }) {
  const ink = surface === 'ink';
  return (
    <section aria-labelledby="verifiable-heading">
      <p className={ink ? 'text-mk-body-sm text-on-ink-muted' : 'text-mk-body-sm text-fg-muted'}>
        We have no customer logos to show you yet. Here are six things you can check without
        asking us.
      </p>
      <h2 id="verifiable-heading" className="sr-only">
        Verifiable by
      </h2>
      <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {verifiableItems.map((item) => (
          <li key={item.label}>
            {item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <VerifiableBody item={item} ink={ink} external />
              </a>
            ) : (
              <Link href={item.href as Route} className="group block focus-visible:outline-2 focus-visible:outline-offset-2">
                <VerifiableBody item={item} ink={ink} />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function VerifiableBody({
  item,
  ink,
  external = false,
}: {
  item: VerifiableItem;
  ink: boolean;
  external?: boolean;
}) {
  return (
    <>
      <span
        className={
          ink
            ? 'block font-mono text-mk-mono text-on-ink underline decoration-transparent underline-offset-4 transition-colors duration-fast group-hover:decoration-current'
            : 'block font-mono text-mk-mono text-fg underline decoration-transparent underline-offset-4 transition-colors duration-fast group-hover:decoration-current'
        }
      >
        {item.label}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </span>
      <span className={ink ? 'mt-1 block text-mk-body-sm text-on-ink-muted' : 'mt-1 block text-mk-body-sm text-fg-muted'}>
        {item.detail}
      </span>
    </>
  );
}

/* --------------------------------------------------- The design-partner offer */

/**
 * What stands in for case studies at launch. Not a "coming soon" — that is a promise with no
 * cost attached — but a specific, reciprocal, time-boxed ask.
 */
export function DesignPartnerOffer({ surface = 'paper' }: { surface?: 'paper' | 'ink' }) {
  const ink = surface === 'ink';
  return (
    <div
      className={
        ink
          ? 'rounded-lg border border-ink-border bg-ink-800 p-6 sm:p-8'
          : 'rounded-lg border border-border bg-surface p-6 sm:p-8'
      }
    >
      <h3 className={ink ? 'text-mk-title font-semibold text-on-ink' : 'text-mk-title font-semibold text-fg'}>
        We have no case studies yet.
      </h3>
      <p className={ink ? 'mt-3 max-w-measure text-mk-body text-on-ink-muted' : 'mt-3 max-w-measure text-mk-body text-fg-muted'}>
        Algoryq Learn has not shipped to a paying customer. We are taking three design partners: the
        Growth plan free for twelve months, direct access to the people who built it, weekly
        calls, and a named case study at ninety days — yours to approve, or to refuse. In
        exchange: your real workload, your real complaints, and permission to fix things in
        front of you.
      </p>
      <p className="mt-5">
        <Link
          href={{ pathname: '/demo', query: { intent: 'design-partner' } }}
          className={
            ink
              ? 'inline-flex min-h-[44px] items-center text-mk-body text-on-ink underline underline-offset-4'
              : 'inline-flex min-h-[44px] items-center text-mk-body text-link underline underline-offset-4'
          }
        >
          Apply as a design partner
        </Link>
      </p>
    </div>
  );
}
