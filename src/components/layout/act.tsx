import { cn } from '../../lib/cn';

export type ActSurface = 'paper' | 'muted' | 'ink';

/**
 * A section of a page, owning its own vertical rhythm so no page hand-rolls padding.
 *
 * `labelledBy` is required: every `<section>` on this site is named by its own heading, which
 * is what lets a screen-reader user navigate the page by landmark rather than by scrolling.
 */
export function Act({
  id,
  labelledBy,
  surface = 'paper',
  spacing = 'normal',
  className,
  children,
}: {
  id?: string;
  labelledBy: string;
  surface?: ActSurface;
  spacing?: 'normal' | 'tight' | 'loose';
  className?: string;
  children: React.ReactNode;
}) {
  const surfaces = {
    paper: 'bg-surface-bg text-fg',
    muted: 'bg-surface-muted text-fg',
    ink: 'on-ink',
  } as const;

  const padding = {
    tight: 'py-block',
    normal: 'py-act',
    loose: 'py-act lg:py-[10rem]',
  } as const;

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('scroll-mt-20', surfaces[surface], padding[spacing], className)}
    >
      {children}
    </section>
  );
}
