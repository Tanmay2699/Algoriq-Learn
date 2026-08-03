import { cn } from '../../lib/cn';

/**
 * The mark: the Algoryq "A" — an apex, a descending stroke, a crossbar and a detached foot.
 *
 * It is the parent company's mark, unmodified, because Algoryq Learn is a product of Algoryq
 * Technologies and not a separate identity. A sibling brand that redraws the mark is a brand
 * that has to be introduced twice. The geometry below is the same path data algoryq.com
 * serves, on the same 100×100 viewBox.
 *
 * The crossbar is a flat `--brand-500` here rather than the three-stop gradient the parent
 * uses. At 24px that gradient spans about twelve pixels and resolves to a single colour
 * anyway, and an `<svg>` gradient needs an `id` — which, in a component rendered twice on a
 * page (header and footer), means duplicate IDs in the document. The gradient survives where
 * it can actually be seen: `public/icon.svg` at 100×100, and `--mk-grad-brand` for rules.
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width="24"
      height="24"
      fill="none"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      {/*
        `paint-order: stroke`, with a stroke of the same paint as the fill, is how the parent
        keeps these thin wedges from thinning out at small sizes — it grows each shape by half
        the stroke width rather than letting the rasteriser drop a two-pixel edge.
      */}
      <g strokeLinejoin="round" paintOrder="stroke" strokeWidth="4">
        <path
          fill="currentColor"
          stroke="currentColor"
          d="M50 8 L76.4 63.5 L59.75 63.5 L50 44 L26 92 L10 92 Z"
        />
        <path
          fill="var(--brand-500)"
          stroke="var(--brand-500)"
          d="M42.55 69 L87.05 69 L93.65 81 L46.15 81 Z"
        />
        <path fill="currentColor" stroke="currentColor" d="M72 86.5 L86 86.5 L90 92 L76 92 Z" />
      </g>
    </svg>
  );
}

/**
 * Wordmark: the mark plus "Algoryq Learn" in the display face. Live text rather than an
 * outlined SVG in the header, so it scales with the user's font size and is selectable and
 * searchable.
 *
 * "Learn" carries the brand colour and "Algoryq" does not — the same construction the parent
 * uses for `algoryq.tech`, so the two lockups read as one family. The colour is decoration
 * only and never the sole carrier of meaning (WCAG 1.4.1): the words are also separated by a
 * space, and the accessible name of the link this sits inside is the full product name.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-fg', className)}>
      <Mark className="text-fg" />
      <span className="font-display text-[1.375rem] font-semibold leading-none tracking-[-0.02em]">
        Algoryq <span className="text-brand">Learn</span>
      </span>
    </span>
  );
}

/**
 * The endorsement line — who builds this.
 *
 * A fact about ownership rather than a badge, so it is set as text at the size of the legal
 * copy it sits beside, not as a second logo. It carries no `target="_blank"`: a visitor
 * leaving for the parent company's site is leaving deliberately, and forcing a tab on them is
 * not our call. `rel="noopener"` is there because the destination is a different origin.
 */
export function PoweredByAlgoryq({ className }: { className?: string }) {
  return (
    <p className={cn('text-mk-body-sm text-fg-muted', className)}>
      A product of{' '}
      <a
        href="https://algoryq.com"
        rel="noopener"
        className="font-medium text-link underline underline-offset-4 hover:text-fg"
      >
        Algoryq Technologies
      </a>{' '}
      — algoryq.tech
    </p>
  );
}
