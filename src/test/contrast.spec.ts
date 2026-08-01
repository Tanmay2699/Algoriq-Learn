import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Contrast, computed from the token files rather than eyeballed.
 *
 * This test exists because of a real incident in the product: the status *fill* colours were
 * used as *text* colours, and error messages rendered at 2.1:1 for three days. Nothing caught
 * it, because a colour that is merely wrong still renders. A token that does not resolve, or
 * resolves to something illegible, fails silently — so it needs a test that does not.
 */

const PRODUCT_TOKENS = readFileSync(
  join(process.cwd(), 'src', 'styles', 'tokens.product.css'),
  'utf8',
);
const MARKETING_TOKENS = readFileSync(
  join(process.cwd(), 'src', 'styles', 'tokens.marketing.css'),
  'utf8',
);

/** Reads a custom property out of the first `:root {}` block — i.e. the light theme. */
function token(css: string, name: string): string {
  const root = css.slice(css.indexOf(':root'), css.indexOf('@media'));
  const match = new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,8})`).exec(root);
  if (!match) throw new Error(`Token --${name} not found, or is not a hex colour.`);
  return match[1]!;
}

function srgb(hex: string): [number, number, number] {
  const full = hex.length === 4 ? hex.replace(/#(.)(.)(.)/, '#$1$1$2$2$3$3') : hex;
  return [1, 3, 5].map((i) => parseInt(full.slice(i, i + 2), 16) / 255) as [number, number, number];
}

function luminance(hex: string): number {
  const [r, g, b] = srgb(hex).map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  ) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

const p = (name: string) => token(PRODUCT_TOKENS, name);
const m = (name: string) => token(MARKETING_TOKENS, name);

describe('inherited product tokens', () => {
  const cases: [string, string, string, number][] = [
    ['body text on a card', 'text-primary', 'surface', 4.5],
    ['body text on the page', 'text-primary', 'surface-bg', 4.5],
    ['muted text on a card', 'text-muted', 'surface', 4.5],
    // The one that failed at 4.47 in the product and was darkened to fix it.
    ['muted text on the recessed surface', 'text-muted', 'surface-muted', 4.5],
    ['a link on a card', 'brand-500', 'surface', 4.5],
    ['danger TEXT on a card', 'danger-text', 'surface', 4.5],
    ['warning TEXT on a card', 'warning-text', 'surface', 4.5],
    ['success TEXT on a card', 'success-text', 'surface', 4.5],
    ['button label on brand', 'text-inverse', 'brand-500', 4.5],
  ];

  for (const [name, fg, bg, floor] of cases) {
    it(`${name} clears ${floor}:1`, () => {
      expect(ratio(p(fg), p(bg))).toBeGreaterThanOrEqual(floor);
    });
  }

  it('the focus ring clears 3:1 against every surface it lands on', () => {
    for (const surface of ['surface', 'surface-bg', 'surface-muted']) {
      expect(ratio(p('brand-500'), p(surface))).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('marketing ink tokens', () => {
  it('body text on ink clears AAA, not merely AA', () => {
    expect(ratio(m('mk-on-ink'), m('mk-ink-900'))).toBeGreaterThanOrEqual(7);
  });

  it('muted text on ink clears AA', () => {
    expect(ratio(m('mk-on-ink-muted'), m('mk-ink-900'))).toBeGreaterThanOrEqual(4.5);
  });

  it('muted text on the raised ink surface clears AA too', () => {
    expect(ratio(m('mk-on-ink-muted'), m('mk-ink-800'))).toBeGreaterThanOrEqual(4.5);
  });

  it('the accent, as text, clears AA on paper — the fill does not', () => {
    // #12a594 measures 3.07:1 on white. --mk-accent-text exists because of that.
    expect(ratio(m('mk-accent-text'), p('surface'))).toBeGreaterThanOrEqual(4.5);
    expect(ratio(p('accent-500'), p('surface'))).toBeLessThan(4.5);
  });

  it('the faint token is BELOW the text floor — it is decorative, and must stay off text', () => {
    // If this ever passes, somebody has lightened it, and the next person will use it as text.
    expect(ratio(m('mk-on-ink-faint'), m('mk-ink-900'))).toBeLessThan(4.5);
  });
});

describe('the status text variants exist at all', () => {
  it('are separate tokens from the fills', () => {
    // The fills are lighter; using one as text is the bug this whole file is about.
    for (const status of ['danger', 'warning', 'success']) {
      expect(p(`${status}-text`)).not.toBe(p(status));
      expect(luminance(p(`${status}-text`))).toBeLessThan(luminance(p(status)));
    }
  });
});
