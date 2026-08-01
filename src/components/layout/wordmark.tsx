import { cn } from '../../lib/cn';

/**
 * The mark: two overlapping rounded rectangles forming a shallow spine — the lifecycle,
 * abstracted. Monochrome, `currentColor`, legible at 16px.
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <rect x="2.5" y="6" width="13" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.6" />
      <rect
        x="8.5"
        y="6"
        width="13"
        height="12"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.45"
      />
    </svg>
  );
}

/**
 * Wordmark: the mark plus "Akechi" in the display face. Live text rather than an outlined SVG
 * in the header, so it scales with the user's font size and is selectable and searchable.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-fg', className)}>
      <Mark className="text-brand" />
      <span className="font-display text-[1.375rem] font-normal leading-none tracking-[-0.02em]">
        Akechi
      </span>
    </span>
  );
}
