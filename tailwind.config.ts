import type { Config } from 'tailwindcss';
import preset from './src/styles/tailwind-preset';

/**
 * Layer 1 comes from the product's preset and is never redeclared here (ADR 0002).
 * Everything below is layer 2 — marketing-only, and every colour resolves to a `--mk-*`
 * custom property so a token change is one edit in tokens.marketing.css.
 */
const config: Config = {
  presets: [preset],
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: 'var(--mk-ink-900)',
          900: 'var(--mk-ink-900)',
          800: 'var(--mk-ink-800)',
          700: 'var(--mk-ink-700)',
          border: 'var(--mk-ink-border)',
          'border-strong': 'var(--mk-ink-border-strong)',
        },
        'accent-text': 'var(--mk-accent-text)',
        link: 'var(--mk-link)',
        'on-ink': {
          DEFAULT: 'var(--mk-on-ink)',
          muted: 'var(--mk-on-ink-muted)',
          faint: 'var(--mk-on-ink-faint)',
        },
        viz: {
          1: 'var(--mk-viz-1)',
          2: 'var(--mk-viz-2)',
          3: 'var(--mk-viz-3)',
          4: 'var(--mk-viz-4)',
          5: 'var(--mk-viz-5)',
        },
      },
      fontFamily: {
        display: ['var(--mk-font-display)', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['var(--mk-font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--mk-font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Marketing scale (docs/05 §3.2). Fluid; every bound tested at 320 and 2560.
        'display-1': ['clamp(2.75rem, 1.15rem + 6.2vw, 6.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-2': ['clamp(2.25rem, 1.1rem + 4.4vw, 4.5rem)', { lineHeight: '1', letterSpacing: '-0.025em' }],
        'display-3': ['clamp(1.875rem, 1.1rem + 2.6vw, 2.75rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'mk-title': ['clamp(1.375rem, 1.05rem + 1.2vw, 1.875rem)', { lineHeight: '1.22', letterSpacing: '-0.015em' }],
        'mk-subtitle': ['1.125rem', { lineHeight: '1.45', letterSpacing: '-0.005em' }],
        'mk-lead': ['clamp(1.0625rem, 1rem + 0.42vw, 1.3125rem)', { lineHeight: '1.55' }],
        'mk-body': ['1.0625rem', { lineHeight: '1.65' }],
        'mk-body-sm': ['0.9375rem', { lineHeight: '1.6' }],
        'mk-eyebrow': ['0.8125rem', { lineHeight: '1.2', letterSpacing: '0.08em' }],
        'mk-mono': ['0.875rem', { lineHeight: '1.6' }],
      },
      spacing: {
        act: 'var(--mk-space-act)',
        block: 'var(--mk-space-block)',
        gutter: 'var(--mk-gutter)',
      },
      maxWidth: {
        content: '80rem',
        wide: '90rem',
        prose: '68ch',
        measure: '46rem',
      },
      borderRadius: {
        xl: 'var(--mk-radius-xl)',
        '2xl': 'var(--mk-radius-2xl)',
      },
      transitionTimingFunction: {
        mk: 'var(--mk-ease)',
        entrance: 'var(--mk-ease-entrance)',
        exit: 'var(--mk-ease-exit)',
      },
      transitionDuration: {
        instant: '80ms',
        fast: '120ms',
        DEFAULT: '200ms',
        slow: '320ms',
        scene: '560ms',
      },
      boxShadow: {
        e1: '0 1px 2px rgb(16 18 27 / 0.04)',
        e2: '0 4px 12px rgb(16 18 27 / 0.06)',
        e3: '0 12px 32px rgb(16 18 27 / 0.10)',
        e4: '0 32px 64px -16px rgb(16 18 27 / 0.18)',
      },
      backgroundImage: {
        'grad-brand': 'var(--mk-grad-brand)',
      },
    },
  },
  plugins: [],
};

export default config;
