import { expect, test } from '@playwright/test';

/**
 * The homepage's video hero — the one autoplaying, looping element on the site, and the one
 * place the header goes translucent. Both are exceptions to defaults this codebase otherwise
 * holds everywhere else (docs/09-VISUAL-LANGUAGE-AND-ASSETS.md §10, and the "always solid"
 * header this used to be), so the exceptions get their own coverage rather than riding along
 * inside `headers-and-motion.spec.ts`.
 */

test.describe('reduced motion', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('the hero video never autoplays, and never even fetches', async ({ page }) => {
    await page.goto('/');
    const video = page.locator('video');
    // `preload="none"` in the server HTML is what stops a reduced-motion visitor paying for
    // bytes they will never see move; `.paused` is what confirms nothing overrode it.
    await expect(video).toHaveAttribute('preload', 'none');
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  });

  test('the reader can still choose to play it — reduced motion is "don\'t start it on me," not "never"', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /play the background video/i })).toBeVisible();
  });
});

test.describe('with motion allowed', () => {
  test('the video autoplays muted and looped', async ({ page }) => {
    await page.goto('/');
    const video = page.locator('video');
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
    expect(await video.evaluate((v: HTMLVideoElement) => v.muted)).toBe(true);
    expect(await video.evaluate((v: HTMLVideoElement) => v.loop)).toBe(true);
  });

  test('the pause control (WCAG 2.2.2) actually pauses it, and its label flips', async ({ page }) => {
    await page.goto('/');
    const video = page.locator('video');
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);

    const pauseBtn = page.getByRole('button', { name: /pause the background video/i });
    await expect(pauseBtn).toBeVisible();
    await pauseBtn.click();

    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
    await expect(page.getByRole('button', { name: /play the background video/i })).toBeVisible();
  });
});

// The header's own blended-over-hero background — `rgb(7 12 24 / 0.75)` in the source, a
// translucent ink tint rather than true transparency. Real, not just decorative: axe's
// `color-contrast` walks the DOM ancestor chain for a declared background and cannot see the
// hero's own scrim, which is a sibling of the header, not an ancestor of it — a fully
// transparent header left on-ink text with nothing behind it *in that chain* to check
// contrast against, and axe correctly failed it. This is what closed that gap.
const BLENDED_BG = 'rgba(7, 12, 24, 0.75)';

test.describe('the header hand-off', () => {
  test('blends translucent-ink over the video, then solidifies once scrolled past it', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header');

    // The sentinel's first IntersectionObserver callback is async — same category of brief,
    // expected settle as the page's existing hairline sentinel. Background and text colour
    // both switch atomically on that same render (no CSS transition on background-color,
    // deliberately — see the comment on the header's own className), so once the observer has
    // settled there is no further mid-fade window to wait out.
    await expect
      .poll(() => header.evaluate((h) => getComputedStyle(h).backgroundColor))
      .toBe(BLENDED_BG);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.3));

    await expect
      .poll(() => header.evaluate((h) => getComputedStyle(h).backgroundColor))
      .not.toBe(BLENDED_BG);
  });

  test('every other page keeps the header solid from the first paint — unaffected by the sentinel', async ({
    page,
  }) => {
    await page.goto('/pricing');
    const header = page.locator('header');
    await expect
      .poll(() => header.evaluate((h) => getComputedStyle(h).backgroundColor))
      .not.toBe(BLENDED_BG);
  });
});

test.describe('with JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false });

  test('the h1 reads normally and the video sits paused on its poster', async ({ page }) => {
    await page.goto('/');
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('From the first enquiry');

    const video = page.locator('video');
    await expect(video).toHaveAttribute('preload', 'none');
    await expect(video).not.toHaveAttribute('autoplay', '');
  });
});
