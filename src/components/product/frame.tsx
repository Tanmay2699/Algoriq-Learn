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

/** The product's sidebar, at frame scale. Labels come from its real navigation registry. */
export function FrameSidebar({ items, active }: { items: string[]; active: string }) {
  return (
    <nav aria-hidden="true" className="hidden w-40 shrink-0 sm:block">
      <ul className="space-y-0.5">
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
