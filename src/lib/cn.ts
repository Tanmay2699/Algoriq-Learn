import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Class composition — a local `cn`, not the one from `@akechi/ui`, and this is why.
 *
 * tailwind-merge decides which classes conflict by matching them against Tailwind's own
 * scales. It has never heard of `text-display-2` or `text-mk-body`, so it falls back to the
 * only other thing `text-*` can mean and files them under **text colour**. Put a size and a
 * colour on the same element — which every heading on this site does — and it silently drops
 * one of them:
 *
 *     cn('font-display text-display-2', 'text-fg')  →  'font-display text-fg'
 *
 * The class disappears from the markup, the rule is still in the stylesheet, nothing warns,
 * and the page renders at the inherited size. It shipped that way for exactly as long as it
 * took a browser test to look at the built HTML — which is the argument for having one.
 *
 * Teaching the merger the custom scale fixes it at the root. The names below must stay in step
 * with the `fontSize` block in `tailwind.config.ts`; `src/test/cn.spec.ts` asserts they do.
 */

export const MARKETING_FONT_SIZES = [
  'display-1',
  'display-2',
  'display-3',
  'mk-title',
  'mk-subtitle',
  'mk-lead',
  'mk-body',
  'mk-body-sm',
  'mk-eyebrow',
  'mk-mono',
] as const;

/** The product's own ramp, inherited through the shared preset and just as invisible to twMerge. */
export const PRODUCT_FONT_SIZES = ['display', 'h1', 'h2', 'h3', 'body', 'small', 'caption'] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [...MARKETING_FONT_SIZES, ...PRODUCT_FONT_SIZES] }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
