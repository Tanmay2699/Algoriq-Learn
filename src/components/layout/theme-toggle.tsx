'use client';

// 'use client': reads and writes localStorage and the document root attribute.

import { useEffect, useState } from 'react';
import { applyThemeMode, nextThemeMode, parseThemeMode, THEME_KEY, type ThemeMode } from '../../lib/theme';

const LABELS: Record<ThemeMode, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

const GLYPHS: Record<ThemeMode, string> = {
  light: '☀',
  dark: '☾',
  system: '◐',
};

/**
 * light → dark → system → light.
 *
 * The button renders "System" until mount, matching the server, so hydration never mismatches;
 * the actual applied theme is set before first paint by the no-flash script, so the *page*
 * never flashes even though the button label settles a frame later.
 */
export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setMode(parseThemeMode(localStorage.getItem(THEME_KEY)));
    } catch {
      /* storage can be unavailable; system is the right answer then. */
    }
  }, []);

  const cycle = () => {
    const next = nextThemeMode(mode);
    setMode(next);
    applyThemeMode(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* the theme still applies for this session. */
    }
  };

  return (
    <button
      type="button"
      onClick={cycle}
      className="inline-flex h-11 min-w-[44px] items-center justify-center gap-1.5 rounded-[--radius] px-2.5 text-mk-body-sm text-fg-muted transition-colors duration-fast hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span aria-hidden="true">{GLYPHS[mode]}</span>
      <span className="sr-only">
        {mounted ? `Theme: ${LABELS[mode]}. Change theme.` : 'Change theme'}
      </span>
    </button>
  );
}
