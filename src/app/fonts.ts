import localFont from 'next/font/local';

/**
 * Self-hosted, variable, latin-subset. Two files, 115 KB, served from our own origin —
 * a font CDN would be a third-party origin and the CSP forbids one (ADR 0007).
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
 * Fraunces, display only (≥40px — docs/05 §3.1, ADR 0003).
 *
 * The file is the `opsz,wght@9..144,300..700` cut, so SOFT and WONK sit at their defaults of
 * 0: this is the clean high-contrast Scotch Roman, not the wonky specimen. `font-optical-sizing`
 * is left at `auto`, which is what makes large type look drawn rather than scaled.
 */
export const fraunces = localFont({
  src: './fonts/fraunces-latin.woff2',
  variable: '--font-fraunces',
  display: 'swap',
  weight: '300 700',
  style: 'normal',
  adjustFontFallback: 'Times New Roman',
  preload: true,
});

/**
 * There is no third font file. The mono role — permission keys, code samples, the
 * "Verifiable by" labels — uses the platform's own monospace stack, which is excellent
 * everywhere and costs zero bytes. Shipping a 31 KB JetBrains Mono to set a dozen labels
 * would have put the font budget 25% over for no legibility gain.
 */
export const fontVariables = `${inter.variable} ${fraunces.variable}`;
