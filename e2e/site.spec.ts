import { expect, test } from '@playwright/test';
import { routes } from './routes';

/**
 * Every route renders, is named, is canonical, and asks nothing of any other host.
 *
 * The third-party assertion is the cheapest high-value gate on the project: five lines that
 * prevent the single most common way a fast site becomes a slow one (ADR 0007).
 */

test.describe('every route', () => {
  for (const route of routes) {
    test(`${route} renders correctly`, async ({ page, baseURL }) => {
      const thirdParty: string[] = [];
      const consoleErrors: string[] = [];

      page.on('request', (request) => {
        const url = new URL(request.url());
        if (url.origin !== new URL(baseURL!).origin && url.protocol !== 'data:') {
          thirdParty.push(request.url());
        }
      });
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });

      const response = await page.goto(route);
      expect(response?.status(), `${route} status`).toBe(200);

      // Exactly one h1, and it says something. Four characters rather than a rounder number
      // because "Terms", "Cookies" and "Webhooks" are the correct headings for their pages —
      // an arbitrary minimum here would only push somebody into padding a good title.
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      expect((await h1.innerText()).trim().length).toBeGreaterThanOrEqual(4);

      // Named, described and canonical.
      expect((await page.title()).length).toBeGreaterThan(10);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description?.length ?? 0).toBeGreaterThan(60);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical, `${route} canonical`).toContain(route === '/' ? '' : route);
      expect(canonical, `${route} canonical must not be relative`).toMatch(/^https?:\/\//);

      // A skip link, first in the tab order.
      await expect(page.locator('a[href="#main"]').first()).toHaveCount(1);
      await expect(page.locator('main#main')).toHaveCount(1);

      // Nothing leaves the origin. Nothing shouts in the console.
      expect(thirdParty, `${route} made third-party requests`).toEqual([]);
      expect(consoleErrors, `${route} logged console errors`).toEqual([]);
    });
  }
});

test.describe('structured data', () => {
  test('the homepage emits valid JSON-LD, and no rating', async ({ page }) => {
    await page.goto('/');
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.length).toBeGreaterThan(0);

    const parsed = blocks.flatMap((block) => JSON.parse(block) as unknown);
    const types = JSON.stringify(parsed);
    expect(types).toContain('SoftwareApplication');
    expect(types).toContain('FAQPage');
    // We have no reviews. Emitting a rating would be both a lie and a manual-action risk.
    expect(types).not.toContain('AggregateRating');
  });
});

test.describe('machine-readable files', () => {
  test('robots and the sitemap agree with the site', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain('Sitemap:');

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    expect(xml).toContain('/security');
    expect(xml).toContain('/trust/build-status');
    // /demo is noindex, so it has no business in the sitemap.
    expect(xml).not.toContain('/demo<');
  });
});

test.describe('a 404', () => {
  test('is a real 404 with somewhere to go', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // The lifecycle spine as navigation — seven ways out, plus the overview.
    expect(await page.locator('main a[href^="/product"]').count()).toBeGreaterThanOrEqual(7);
  });
});
