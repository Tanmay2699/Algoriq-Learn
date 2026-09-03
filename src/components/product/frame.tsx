import { cn } from '../../lib/cn';
import { provenanceNote, type Provenance } from '../../content/demo-data';

/**
 * The chrome around every product rendering on this site.
 *
 * `provenance` is required. It decides the caption, and the caption is always rendered —
 * there is no way to show a product surface here without saying where its contents came from
 * (ADR 0008). That is what lets the site show software without fabricating data.
 *
 * These are DOM recreations built from the product's own tokens rather than screenshots:
 * they are responsive, theme-aware, selectable, translatable and accessible, they cost bytes
 * in the tens rather than the hundreds of kilobytes, and they cannot silently go stale in the
 * way a PNG does.
 */
export function ProductFrame({
  route,
  provenance,
  caption,
  children,
  chrome = 'browser',
  className,
}: {
  /** The product route this recreates. Shown in the address bar — it is a real path. */
  route: string;
  provenance: Provenance;
  /** A short claim-shaped sentence. The provenance note is appended automatically. */
  caption?: string;
  children: React.ReactNode;
  chrome?: 'browser' | 'phone' | 'none';
  className?: string;
}) {
  return (
    <figure className={cn('m-0 min-w-0', className)}>
      <div
        className={cn(
          'overflow-hidden border border-border bg-surface shadow-e4',
          chrome === 'phone' ? 'rounded-xl' : 'rounded-xl',
        )}
      >
        {chrome !== 'none' && (
          <div className="flex items-center gap-3 border-b border-border bg-surface-muted px-4 py-3">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-fg-muted/25" />
              <span className="h-2 w-2 rounded-full bg-fg-muted/25" />
              <span className="h-2 w-2 rounded-full bg-fg-muted/25" />
            </div>
            <p className="truncate rounded-full bg-surface px-3 py-1 font-mono text-caption text-fg-muted">
              app.learn.algoryq.com<span className="text-fg">{route}</span>
            </p>
          </div>
        )}
        <div className="bg-surface-bg p-4 sm:p-5">{children}</div>
      </div>

      {/*
        The caption sits OUTSIDE the frame, so it lands on whatever surface the act uses — and
        a frame is used on both paper and ink. Rather than make every call site pass a surface
        and eventually forget on one, the colours key off the `.on-ink` ancestor that <Act>
        already sets. A frame dropped into a dark act is legible without anybody remembering.
        (It was not, briefly: the caption rendered at 1.13:1 on ink until axe said so.)
      */}
      <figcaption className="mt-3 text-mk-body-sm text-fg-muted [.on-ink_&]:text-on-ink-muted">
        {caption && <span className="text-fg [.on-ink_&]:text-on-ink">{caption} </span>}
        {provenanceNote[provenance]}
      </figcaption>
    </figure>
  );
}

/** A panel inside a frame — the product's card shape, at frame scale. */
export function FramePanel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('rounded-[--radius] border border-border bg-surface p-3.5', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="text-caption font-medium uppercase tracking-wide text-fg-muted">{title}</h4>
        {action && <span className="text-caption text-link">{action}</span>}
      </div>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

/**
 * A list whose selection walks its rows on its own.
 *
 * Every product surface on this site that is a list of rows uses this: the frame sidebar,
 * the roles matrix, the people list, the item analysis, the risk list. It is what stops a
 * product rendering reading as a screenshot — a still list shows one state of a screen, a
 * walking one shows that the screen has rows and something is looking through them.
 *
 * No JavaScript at all. These frames are server components and a page carries several; a
 * timer each would be React re-rendering a highlight. Spread this on the list, add the
 * `mk-rows` class, and the CSS in `globals.css` indexes the children itself — nothing has to
 * thread a row number through a `map`.
 *
 * Above twelve rows it returns nothing and the list simply does not animate. That is not a
 * limit worth engineering around: a walking highlight in a thirteen-row list takes long
 * enough per row that a reader has scrolled past before it reaches the bottom, and the
 * generated keyframes stop there for the same reason.
 */
export function walkingList(
  count: number,
  opts?: {
    fg?: string;
    litFg?: string;
    litBg?: string;
    /**
     * How long to rest on each row, in ms.
     *
     * Omit it and the list takes one `--mk-nav-cycle` to walk however many rows it has —
     * which is what the frame sidebar wants, because it sits inside the role switcher and
     * has to finish its trip exactly as the switcher swaps (see `--mk-cycle`).
     *
     * Every other list should set it. A fixed total cycle means an eleven-row roles matrix
     * flickers at 430ms a row while a three-card risk list dozes at 1.6s, and the two read
     * as different mechanisms rather than the same one. A fixed dwell reads as one cursor
     * moving at one speed, whatever it is moving through.
     */
    dwell?: number;
  },
): React.CSSProperties | undefined {
  if (count < 2 || count > 12) return undefined;
  return {
    '--mk-row-kf': `mk-row-${count}`,
    '--mk-row-n': count,
    '--mk-row-fg': opts?.fg ?? 'var(--text-muted)',
    '--mk-row-lit-fg': opts?.litFg ?? 'var(--mk-link)',
    '--mk-row-lit-bg': opts?.litBg ?? 'var(--brand-soft)',
    ...(opts?.dwell ? { '--mk-nav-cycle': `${count * opts.dwell}ms` } : null),
  } as React.CSSProperties;
}

/**
 * The product's sidebar, at frame scale. Labels come from its real navigation registry.
 *
 * The selection walks the list on its own — Dashboard through Settings, then round again.
 * A still sidebar shows one page of the product; a walking one shows that the product *has*
 * those pages, which is the only thing this decoration is here to say. The whole nav is
 * `aria-hidden`, so this is motion in a picture of software, announced to nobody.
 *
 * `active` decides which row is lit when the animation is off — reduced motion, or a list
 * too long for the generated keyframes.
 */
export function FrameSidebar({ items, active }: { items: string[]; active: string }) {
  return (
    <nav aria-hidden="true" className="hidden w-40 shrink-0 sm:block">
      <ul className="mk-rows space-y-0.5" style={walkingList(items.length)}>
        {items.map((item) => (
          <li
            key={item}
            className={cn(
              'truncate rounded-sm px-2.5 py-1.5 text-caption',
              item === active ? 'bg-brand-soft font-medium text-link' : 'text-fg-muted',
            )}
          >
            {item}
          </li>
        ))}
      </ul>
    </nav>
  );
}
