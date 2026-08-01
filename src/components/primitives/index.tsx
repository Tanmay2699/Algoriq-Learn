import Link from 'next/link';
import type { Route } from 'next';
import { cn } from '../../lib/cn';
import { claim, claimValue, type ClaimId } from '../../lib/claims';

/* ------------------------------------------------------------------ CTA */

type Surface = 'paper' | 'ink';

export interface CtaProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg';
  /** Required — the treatment for secondary/ghost differs entirely by surface. */
  surface?: Surface;
  external?: boolean;
  className?: string;
}

const CTA_BASE =
  'inline-flex items-center justify-center gap-2 rounded-[--radius] font-medium ' +
  'transition-[background-color,color,border-color,transform] duration-fast ease-mk ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 hover:-translate-y-px active:translate-y-0';

/**
 * Every call to action on the site.
 *
 * `surface` is required rather than inferred because a secondary button on ink and a secondary
 * button on paper are different colours, and inferring it from context is how one of them ends
 * up invisible. No CTA on this site does asynchronous work, so there is no loading state — the
 * demo form owns its own.
 */
export function CTA({
  href,
  children,
  variant = 'primary',
  size = 'md',
  surface = 'paper',
  external = false,
  className,
}: CtaProps) {
  const sizing = size === 'lg' ? 'h-13 px-6 text-mk-body min-h-[52px]' : 'h-11 px-5 text-mk-body-sm min-h-[44px]';

  const look =
    variant === 'primary'
      ? 'bg-brand text-fg-inverse hover:bg-brand-600'
      : variant === 'secondary'
        ? surface === 'ink'
          ? 'border border-ink-border-strong text-on-ink hover:bg-white/5'
          : 'border border-border bg-surface text-fg hover:bg-surface-muted'
        : surface === 'ink'
          ? 'text-on-ink-muted hover:text-on-ink'
          : 'text-fg-muted hover:text-fg';

  const classes = cn(CTA_BASE, sizing, look, className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link href={href as Route} className={classes}>
      {children}
    </Link>
  );
}

/* -------------------------------------------------------------- Eyebrow */

/**
 * A `<p>`, never a heading — an eyebrow is not an outline level, and announcing it as one
 * puts a fake entry in a screen reader's document outline.
 */
export function Eyebrow({
  children,
  surface = 'paper',
  className,
}: {
  children: React.ReactNode;
  surface?: Surface;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'text-mk-eyebrow font-medium uppercase',
        surface === 'ink' ? 'text-on-ink-muted' : 'text-fg-muted',
        className,
      )}
    >
      {children}
    </p>
  );
}

/* -------------------------------------------------------------- Heading */

/**
 * `level` sets the tag; `display` sets the size. Two props, deliberately, so a section can
 * look like a display-2 while sitting at the h3 the document outline needs.
 */
export function Heading({
  level = 2,
  display = 'display-2',
  surface = 'paper',
  id,
  children,
  className,
}: {
  level?: 1 | 2 | 3 | 4;
  display?: 'display-1' | 'display-2' | 'display-3' | 'title' | 'subtitle';
  surface?: Surface;
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const tags = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4' } as const;
  const Tag = tags[level];
  const sizes = {
    'display-1': 'font-display font-normal text-display-1',
    'display-2': 'font-display font-normal text-display-2',
    'display-3': 'font-display font-normal text-display-3',
    title: 'font-sans font-semibold text-mk-title',
    subtitle: 'font-sans font-semibold text-mk-subtitle',
  } as const;

  return (
    <Tag
      id={id}
      className={cn(sizes[display], surface === 'ink' ? 'text-on-ink' : 'text-fg', className)}
    >
      {children}
    </Tag>
  );
}

/* ----------------------------------------------------------------- Lead */

export function Lead({
  children,
  surface = 'paper',
  className,
}: {
  children: React.ReactNode;
  surface?: Surface;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'max-w-measure text-mk-lead',
        surface === 'ink' ? 'text-on-ink-muted' : 'text-fg-muted',
        className,
      )}
    >
      {children}
    </p>
  );
}

/* ----------------------------------------------------------------- Card */

export function Card({
  children,
  surface = 'paper',
  elevation = 'e0',
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  surface?: Surface | 'glass';
  elevation?: 'e0' | 'e1' | 'e2' | 'e3';
  className?: string;
  as?: 'div' | 'li' | 'article' | 'section';
}) {
  const base = 'rounded-lg p-6';
  const skin =
    surface === 'ink'
      ? 'border border-ink-border bg-ink-800 text-on-ink'
      : surface === 'glass'
        ? 'glass text-on-ink'
        : cn(
            'border border-border bg-surface',
            elevation === 'e1' && 'shadow-e1',
            elevation === 'e2' && 'shadow-e2',
            elevation === 'e3' && 'shadow-e3',
          );

  return <Tag className={cn(base, skin, className)}>{children}</Tag>;
}

/* ---------------------------------------------------------------- Badge */

/**
 * `progress` is the "still being built" marker. It carries a glyph and screen-reader text as
 * well as a colour, because a colour alone is a WCAG 1.4.1 failure and because the whole point
 * of the marker is that it is read, not glanced at.
 */
export function Badge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: 'neutral' | 'brand' | 'accent' | 'progress';
  children: React.ReactNode;
  className?: string;
}) {
  const tones = {
    neutral: 'bg-surface-muted text-fg-muted border-border',
    brand: 'bg-brand-soft text-link border-transparent',
    // The tint reads on both surfaces; the text does not, so it follows the ancestor the
    // way the product-frame caption does.
    accent: 'bg-accent/10 text-accent-text [.on-ink_&]:text-accent border-transparent',
    progress: 'bg-surface-muted text-fg-muted border-border',
  } as const;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-caption font-medium',
        tones[tone],
        className,
      )}
    >
      {tone === 'progress' && <span aria-hidden="true">◔</span>}
      {children}
      {tone === 'progress' && <span className="sr-only"> — in progress, see build status</span>}
    </span>
  );
}

/* ------------------------------------------------------------- Divider */

export function Divider({ surface = 'paper', className }: { surface?: Surface; className?: string }) {
  return (
    <hr
      className={cn('border-0 border-t', surface === 'ink' ? 'border-ink-border' : 'border-border', className)}
    />
  );
}

/* ------------------------------------------------------------ StatBlock */

/**
 * A number with its evidence.
 *
 * `evidence` is a required `ClaimId`, so a statistic that is not in the registry does not
 * compile. That is the single most load-bearing type in this codebase (docs/17 §2).
 */
export function StatBlock({
  evidence,
  label,
  surface = 'paper',
  className,
}: {
  evidence: ClaimId;
  label: string;
  surface?: Surface;
  className?: string;
}) {
  const value = claimValue(evidence);
  return (
    <div className={cn(className)}>
      <p
        className={cn(
          'font-display text-display-3 tabular-nums',
          surface === 'ink' ? 'text-on-ink' : 'text-fg',
        )}
      >
        {value}
      </p>
      <p className={cn('mt-1 text-mk-body-sm', surface === 'ink' ? 'text-on-ink-muted' : 'text-fg-muted')}>
        {label}
      </p>
    </div>
  );
}

/** The registered wording of a claim, rendered inline. Keeps one sentence in one place. */
export function ClaimText({ id }: { id: ClaimId }) {
  return <>{claim(id).statement}</>;
}

/* ----------------------------------------------------------------- Mono */

export function Mono({ children, className }: { children: React.ReactNode; className?: string }) {
  return <code className={cn('font-mono text-mk-mono', className)}>{children}</code>;
}

/* -------------------------------------------------------------- Prose */

/**
 * The long-form container. 68ch measure, and the typographic details that a marketing page
 * needs and an application does not.
 */
export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'max-w-prose text-mk-body text-fg',
        '[&_p]:mt-4 [&_p:first-child]:mt-0',
        '[&_h2]:mt-block [&_h2]:font-display [&_h2]:text-display-3 [&_h2]:font-normal [&_h2]:scroll-mt-24',
        '[&_h3]:mt-10 [&_h3]:text-mk-title [&_h3]:font-semibold [&_h3]:scroll-mt-24',
        '[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:ps-6',
        '[&_li]:mt-2',
        '[&_a]:text-link [&_a]:underline [&_a]:underline-offset-[0.2em] hover:[&_a]:decoration-2',
        '[&_code]:rounded [&_code]:bg-surface-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em]',
        '[&_strong]:font-semibold [&_strong]:text-fg',
        '[&_blockquote]:mt-6 [&_blockquote]:border-s-2 [&_blockquote]:border-brand [&_blockquote]:ps-4 [&_blockquote]:text-fg-muted',
        className,
      )}
    >
      {children}
    </div>
  );
}
