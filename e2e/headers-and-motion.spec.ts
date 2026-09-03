import { expect, test } from '@playwright/test';
import { keyRoutes } from './routes';

/**
 * The security-header snapshot.
 *
 * `default-src 'self'` is a claim this site makes on /security and on /legal/cookies. This
 * test is what stops it being widened quietly — a change here is a change to a claim, and it
 * should arrive as a failing test and a conversation rather than as a diff nobody read.
 */
const EXPECTED_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ');

test.describe('security headers', () => {
  test('are exactly what we say they are', async ({ request }) => {
    const response = await request.get('/');
    const headers = response.headers();

    expect(headers['content-security-policy']).toBe(EXPECTED_CSP);
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['permissions-policy']).toContain('camera=()');
    expect(headers['strict-transport-security']).toContain('max-age=');
    // Next advertises itself by default; there is no reason to.
    expect(headers['x-powered-by']).toBeUndefined();
  });

  test('no route sets a cookie', async ({ page, context }) => {
    // /legal/cookies says this site sets none. That is a testable claim.
    for (const route of keyRoutes) {
      await page.goto(route);
    }
    expect(await context.cookies()).toEqual([]);
  });
});

test.describe('no secrets in the bundle', () => {
  test('the API host and tenant slug never reach the browser', async ({ page }) => {
    await page.goto('/');
    const scripts = await page.locator('script[src]').evaluateAll((nodes) =>
      nodes.map((node) => (node as HTMLScriptElement).src),
    );
    for (const src of scripts) {
      const body = await (await fetch(src)).text();
      expect(body).not.toContain('ALGORYQ_TENANT_SLUG');
      expect(body).not.toContain('127.0.0.1:4000');
    }
  });
});

test.describe('reduced motion', () => {
  // `reducedMotion` is a config-level use-option rather than a fixture this version of
  // Playwright types for `test.use()`, so it is emulated per test instead.
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('is a rendering, not a stripped one — the same words are visible', async ({ page }) => {
    await page.goto('/');

    // Content that a naive reveal implementation would leave at opacity 0.
    await expect(page.getByRole('heading', { name: /Nothing reconciles/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /One record travels the whole way/ })).toBeVisible();
    await expect(page.getByText('No enquiry goes cold.')).toBeVisible();

    // Nothing is still animating after load.
    const running = await page.evaluate(
      () => document.getAnimations().filter((animation) => animation.playState === 'running').length,
    );
    expect(running).toBe(0);
  });

  test('the counters show their real values immediately', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('497', { exact: false }).first()).toBeVisible();
  });
});

test.describe('with JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false });

  test('the homepage is still readable and navigable', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // Reveal-wrapped content is server-rendered and visible: the animation is an enhancement.
    await expect(page.getByText('No enquiry goes cold.')).toBeVisible();
    // The FAQ is <details>, so its answers are in the document either way. Match on the
    // command rather than the sentence around it: the prose gets edited, `docker compose up`
    // does not, and this assertion is about the answer being in the DOM without JS.
    await expect(page.getByText(/docker compose up/i).first()).toBeAttached();
    // Every navigation destination is a real link.
    expect(await page.locator('footer a').count()).toBeGreaterThan(20);
  });
});
