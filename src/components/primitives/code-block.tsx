import { cn } from '../../lib/cn';

/**
 * A code sample.
 *
 * Two things a raw `<pre className="overflow-x-auto">` gets wrong, and both only show up on a
 * phone:
 *
 *  1. It becomes a scrollable region, and a scrollable region that cannot be reached from a
 *     keyboard is a WCAG 2.1.1 failure. It needs `tabindex` and a name.
 *  2. As a grid or flex child it inherits `min-width: auto`, refuses to shrink below its
 *     longest line, and pushes the whole page sideways. `min-w-0` is the fix, and forgetting
 *     it is why the homepage scrolled 89 pixels horizontally at 360.
 */
export function CodeBlock({
  children,
  label,
  surface = 'paper',
  className,
}: {
  children: string;
  /** What the sample shows. Read out before a screen-reader user enters the region. */
  label: string;
  surface?: 'paper' | 'ink';
  className?: string;
}) {
  return (
    <pre
      tabIndex={0}
      role="region"
      aria-label={label}
      className={cn(
        'min-w-0 overflow-x-auto rounded-[--radius] border p-4 font-mono text-mk-mono',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        surface === 'ink'
          ? 'border-ink-border bg-ink-800 text-on-ink'
          : 'border-border bg-surface-muted text-fg',
        className,
      )}
    >
      {children}
    </pre>
  );
}
