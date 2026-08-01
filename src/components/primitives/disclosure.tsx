import { cn } from '../../lib/cn';

/**
 * Accordion and disclosure, built on native `<details>`/`<summary>`.
 *
 * Native rather than an ARIA pattern for three reasons that all matter more than the
 * animation we give up: the content is in the DOM for crawlers, find-in-page works, and it
 * works with JavaScript disabled. The FAQ is the highest-value structured-data block on the
 * site and it is entirely server-rendered because of this choice.
 */
export function Disclosure({
  summary,
  children,
  surface = 'paper',
  defaultOpen = false,
  className,
}: {
  summary: React.ReactNode;
  children: React.ReactNode;
  surface?: 'paper' | 'ink';
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details
      open={defaultOpen}
      className={cn(
        'group border-b',
        surface === 'ink' ? 'border-ink-border' : 'border-border',
        className,
      )}
    >
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-start',
          'min-h-[44px] font-medium [&::-webkit-details-marker]:hidden',
          'focus-visible:outline-2 focus-visible:outline-offset-2',
          surface === 'ink' ? 'text-on-ink' : 'text-fg',
        )}
      >
        <span>{summary}</span>
        <span
          aria-hidden="true"
          className={cn(
            'shrink-0 transition-transform duration-fast ease-mk group-open:rotate-45',
            surface === 'ink' ? 'text-on-ink-muted' : 'text-fg-muted',
          )}
        >
          +
        </span>
      </summary>
      <div
        className={cn(
          'pb-5 text-mk-body-sm',
          surface === 'ink' ? 'text-on-ink-muted' : 'text-fg-muted',
        )}
      >
        {children}
      </div>
    </details>
  );
}
