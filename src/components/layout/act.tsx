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
  aurora = false,
  className,
  children,
}: {
  id?: string;
  labelledBy: string;
  surface?: ActSurface;
  spacing?: 'normal' | 'tight' | 'loose';
  /**
   * Paint the drifting aurora behind this act. Ink surfaces only — the gradients are tuned
   * for a near-black ground and on paper they are a smudge.
   *
   * Decorative in the strict sense: `aria-hidden`, no text on it (rule 8), and it survives
   * being switched off entirely under reduced motion or on a phone with nothing lost but
   * atmosphere. It is what stops a dark band reading as a flat rectangle.
   */
  aurora?: boolean;
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
    loose: 'py-act lg:py-act-loose',
  } as const;

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        'scroll-mt-20',
        surfaces[surface],
        padding[spacing],
        // The aurora bleeds past its own box so the drift has somewhere to travel; without
        // the clip it is the one thing on the site that scrolls the page sideways at 360px.
        aurora && 'relative overflow-hidden',
        className,
      )}
    >
      {aurora && (
        <div aria-hidden="true" className="aurora aurora-drift pointer-events-none absolute inset-0" />
      )}
      {aurora ? <div className="relative">{children}</div> : children}
    </section>
  );
}
