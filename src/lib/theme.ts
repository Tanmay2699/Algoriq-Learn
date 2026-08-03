/**
 * Theme handling — the same contract as the product (`apps/web/src/lib/theme.ts`), because
 * the token layer it drives is the same file. Copied rather than imported: `@akechi/ui` does
 * not export it, and reaching into another app's `src/lib` would couple the two deployments
 * for eight lines. If the contract ever changes, both must change; the tokens themselves are
 * the shared thing and they *are* imported.
 *
 *   - no `data-theme`      → follow the OS via prefers-color-scheme
 *   - data-theme="light"   → explicit light, beating a dark OS
 *   - data-theme="dark"    → explicit dark, beating a light OS
 */

export const THEME_KEY = 'algoryq-learn-theme';

export type ThemeMode = 'light' | 'dark' | 'system';

const MODES: readonly ThemeMode[] = ['light', 'dark', 'system'];

export function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && (MODES as readonly string[]).includes(value);
}

export function parseThemeMode(value: string | null | undefined): ThemeMode {
  return isThemeMode(value) ? value : 'system';
}

export function resolveTheme(mode: ThemeMode, prefersDark: boolean): 'light' | 'dark' {
  if (mode === 'system') return prefersDark ? 'dark' : 'light';
  return mode;
}

/** light → dark → system → light. */
export function nextThemeMode(mode: ThemeMode): ThemeMode {
  const order: ThemeMode[] = ['light', 'dark', 'system'];
  return order[(order.indexOf(mode) + 1) % order.length] ?? 'system';
}

export function applyThemeMode(mode: ThemeMode, root?: HTMLElement): void {
  const el = root ?? (typeof document !== 'undefined' ? document.documentElement : undefined);
  if (!el) return;
  if (mode === 'system') el.removeAttribute('data-theme');
  else el.setAttribute('data-theme', mode);
}

/**
 * Run before first paint so an explicit choice never flashes the wrong colours.
 *
 * This is the one inline script on the site, and it is why `script-src` is `'self'` rather
 * than `'none'` — Next hashes it into the CSP-compatible bootstrap. It must stay tiny and
 * must never throw: a throw here runs before anything else on the page.
 */
export const NO_FLASH_SCRIPT = `(function(){try{var m=localStorage.getItem('${THEME_KEY}');if(m==='light'||m==='dark'){document.documentElement.setAttribute('data-theme',m);}}catch(e){}})();`;
