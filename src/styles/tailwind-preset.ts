import type { Config } from 'tailwindcss';

/**
 * Layer 1 of the two-layer token system (ADR 0002) — a vendored copy of
 * `packages/ui/src/tailwind-preset.ts` from the product monorepo, where it is authored.
 * `tailwind.config.ts` extends it and never redeclares what it defines. Copied for the same
 * reason `tokens.product.css` is: this repository is the marketing site alone. Upstream is the
 * product repo — re-copy on change rather than editing here.
 *
 * The original header follows.
 *
 * ---
 *
 * The shared Tailwind preset. `apps/web` extends this rather than redeclaring the
 * scale, so a token added here is available everywhere without a second edit.
 *
 * Colours resolve to CSS variables, never literal hex, because per-tenant branding is
 * applied at runtime from `tenant_branding` — one build serves every tenant
 * (docs/13-AI-AND-FUTURE.md §4.2).
 */
const preset = {
  content: [],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--brand-500)',
          600: 'var(--brand-600)',
          soft: 'var(--brand-soft)',
        },
        accent: 'var(--accent-500)',
        /*
         * Nested rather than flat so `text-success-text` resolves. As flat strings these
         * generated `text-danger` and nothing else, which meant the 50 call sites written
         * against `text-danger-text` produced no rule at all — Tailwind does not warn about
         * a utility it cannot match, so the failure was invisible until an error banner was
         * read side by side with body text. `bg-danger` / `border-danger` keep working via
         * DEFAULT; the `-text` key is the one to reach for whenever the colour carries words.
         */
        success: { DEFAULT: 'var(--success)', text: 'var(--success-text)' },
        warning: { DEFAULT: 'var(--warning)', text: 'var(--warning-text)' },
        danger: { DEFAULT: 'var(--danger)', text: 'var(--danger-text)' },
        surface: {
          DEFAULT: 'var(--surface)',
          bg: 'var(--surface-bg)',
          muted: 'var(--surface-muted)',
        },
        border: 'var(--border)',
        fg: {
          DEFAULT: 'var(--text-primary)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius-lg)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Matches the Figma type ramp exactly (Display → Caption).
        display: ['2rem', { lineHeight: '2.5rem', fontWeight: '600' }],
        h1: ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        h2: ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        h3: ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }],
        body: ['0.875rem', { lineHeight: '1.375rem' }],
        small: ['0.8125rem', { lineHeight: '1.25rem' }],
        caption: ['0.75rem', { lineHeight: '1rem', fontWeight: '500' }],
      },
    },
  },
  plugins: [],
} satisfies Config;

export default preset;
