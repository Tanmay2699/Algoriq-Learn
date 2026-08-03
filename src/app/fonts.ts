import localFont from 'next/font/local';

/**
 * Self-hosted, variable, latin-subset. Two files, 70 KB, served from our own origin —
 * a font CDN would be a third-party origin and the CSP forbids one (ADR 0007). The woff2s
 * were fetched once, at author time, and are committed here; nothing resolves a font host
 * at build time or at runtime, which is what makes the CSP claim checkable rather than
 * aspirational.
 *
 * `next/font/local` is used rather than a hand-written @font-face for one specific reason:
 * `adjustFontFallback` reads the real metrics out of the woff2 and emits a metric-matched
 * fallback face (size-adjust / ascent-override / descent-override). Without that, a 6.5rem
 * display headline visibly reflows when the webfont lands — which is the single most
 * conspicuous layout shift available to us, at the exact moment the page is being judged.
 * Hand-authoring those numbers would mean inventing metrics we cannot measure here; this
 * derives them.
 */

export const inter = localFont({
  src: './fonts/inter-latin.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
  style: 'normal',
  adjustFontFallback: 'Arial',
  preload: true,
});

/**
 * Space Grotesk, display only (≥40px — docs/05 §3.1, ADR 0010).
 *
 * The face the parent brand sets its own display type in, which is the whole reason it is
 * here: a visitor arriving from algoryq.com should not have to be told the two sites are the
 * same company. The `wght@300..700` variable cut, latin subset, 22 KB — 45 KB less than the
 * Fraunces it replaced, so the rebrand paid for itself against the font budget in docs/13 §2.
 *
 * Its quirks are the point at display size: the flat-sided `o`, the squared bowls and the
 * single-storey `a` are what stop a geometric grotesque from reading as Helvetica at 6.5rem.
 * At body size they would read as noise, which is why this is a display face and Inter still
 * sets everything under 40px.
 */
export const grotesk = localFont({
  src: './fonts/space-grotesk-latin.woff2',
  variable: '--font-grotesk',
  display: 'swap',
  weight: '300 700',
  style: 'normal',
  adjustFontFallback: 'Arial',
  preload: true,
});

/**
 * There is no third font file. The mono role — permission keys, code samples, the
 * "Verifiable by" labels — uses the platform's own monospace stack, which is excellent
 * everywhere and costs zero bytes. Shipping a 31 KB JetBrains Mono to set a dozen labels
 * would have put the font budget 25% over for no legibility gain.
 */
export const fontVariables = `${inter.variable} ${grotesk.variable}`;
