import { cn } from '../../lib/cn';
import { walkingList } from '../product/frame';

/**
 * A marketing table.
 *
 * The wrapper is `tabindex={0}` with `role="region"` and a label: a horizontally scrollable
 * region that cannot be reached from the keyboard is a WCAG 2.1.1 failure, and it is the one
 * almost every marketing site ships. The caption is required for the same family of reasons —
 * it is what a screen-reader user hears before deciding whether to enter the table.
 */
export function Table({
  caption,
  captionVisible = false,
  head,
  children,
  surface = 'paper',
  walkRows,
  className,
}: {
  caption: string;
  captionVisible?: boolean;
  head: React.ReactNode[];
  children: React.ReactNode;
  surface?: 'paper' | 'ink';
  /**
   * Walk a highlight down the rows, the way every product surface on the site does.
   *
   * Opt-in, and it should stay opt-in. A product frame is a picture of software and motion
   * inside one reads as the software being alive. Most tables here are not that — they are
   * prose in columns, and a highlight crawling past a sentence somebody is halfway through
   * reading is the kind of movement people turn reduced motion on to escape. Pass the row
   * count where the table is showing a *system*, not where it is making an argument.
   */
  walkRows?: number;
  className?: string;
}) {
  const ink = surface === 'ink';
  return (
    <div
      role="region"
      aria-label={caption}
      tabIndex={0}
      className={cn(
        'overflow-x-auto rounded-lg border focus-visible:outline-2 focus-visible:outline-offset-2',
        ink ? 'border-ink-border' : 'border-border',
        className,
      )}
    >
      <table className="w-full min-w-[36rem] border-collapse text-start text-mk-body-sm">
        <caption
          className={cn(
            'px-4 py-3 text-start text-caption',
            ink ? 'text-on-ink-muted' : 'text-fg-muted',
            !captionVisible && 'sr-only',
          )}
        >
          {caption}
        </caption>
        <thead>
          <tr className={cn('border-b', ink ? 'border-ink-border' : 'border-border')}>
            {head.map((cell, index) => (
              <th
                key={index}
                scope="col"
                className={cn(
                  'px-4 py-3 text-start text-caption font-medium uppercase tracking-wide',
                  ink ? 'text-on-ink-muted' : 'text-fg-muted',
                )}
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={cn(walkRows && 'mk-rows')}
          style={
            walkRows
              ? walkingList(walkRows, {
                  // A reading cursor, not a selection: these rows carry their own meaning
                  // and a brand-blue wash behind one would read as marking it out.
                  fg: ink ? 'var(--mk-on-ink-muted)' : 'var(--text-muted)',
                  litFg: ink ? 'var(--mk-on-ink)' : 'var(--text-primary)',
                  litBg: ink ? 'var(--mk-ink-800)' : 'var(--surface-muted)',
                  // Slower than a product list: these rows are sentences, and a cursor that
                  // outruns the reading is the thing that makes this gesture irritating.
                  dwell: 1200,
                })
              : undefined
          }
        >
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function Tr({
  children,
  surface = 'paper',
  className,
}: {
  children: React.ReactNode;
  surface?: 'paper' | 'ink';
  className?: string;
}) {
  return (
    <tr
      className={cn(
        'border-b last:border-0',
        surface === 'ink' ? 'border-ink-border' : 'border-border',
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function Td({
  children,
  header = false,
  surface = 'paper',
  className,
}: {
  children: React.ReactNode;
  header?: boolean;
  surface?: 'paper' | 'ink';
  className?: string;
}) {
  const classes = cn(
    'px-4 py-3 align-top',
    surface === 'ink' ? 'text-on-ink-muted' : 'text-fg-muted',
    header && (surface === 'ink' ? 'font-medium text-on-ink' : 'font-medium text-fg'),
    className,
  );

  return header ? (
    <th scope="row" className={cn(classes, 'text-start')}>
      {children}
    </th>
  ) : (
    <td className={classes}>{children}</td>
  );
}
