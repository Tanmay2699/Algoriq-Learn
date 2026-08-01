import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { routes } from './routes';

/**
 * Automated accessibility, on every route, in both themes.
 *
 * Automated checks catch roughly a third of real problems — the manual keyboard and
 * screen-reader passes in docs/12 §5 are the other two thirds and are a launch gate. What this
 * catches is the third that regresses silently.
 */

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/**
 * Scroll the whole page and let the entrance animations finish before analysing.
 *
 * Scroll reveals transition opacity, and an element caught mid-transition measures a contrast
 * ratio nobody ever sees. Driving the page the way a reader does — to the bottom, then back —
 * fires every observer and settles every transition, so what axe measures is what is read.
 */
async function settle(page: Page) {
  // An instant scroll on purpose: the page sets scroll-behavior: smooth, and a smooth scroll
  // is still travelling when axe starts — which measures the sticky header against whatever
  // section it happens to be passing at that moment.
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  await page.waitForTimeout(700);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(400);
}

test.describe('axe', () => {
  for (const route of routes) {
    test(`${route} has no violations`, async ({ page }) => {
      await page.goto(route);
      await settle(page);
      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      expect(
        results.violations.map((violation) => `${violation.id}: ${violation.help}`),
        `${route} accessibility violations`,
      ).toEqual([]);
    });
  }
});

test.describe('axe in dark mode', () => {
  test.use({ colorScheme: 'dark' });

  // The whole site re-themes from one token collection, so a dark-mode contrast failure is a
  // token problem rather than a page problem — a sample is enough to catch one.
  for (const route of ['/', '/security', '/pricing', '/trust/build-status', '/demo']) {
    test(`${route} has no violations in the dark theme`, async ({ page }) => {
      await page.goto(route);
      await settle(page);
      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.help}`), `${route} dark`).toEqual([]);
    });
  }
});

test.describe('reflow', () => {
  /**
   * The user-facing question, asked the user-facing way: try to scroll the page sideways, and
   * see whether it moves.
   *
   * `documentElement.scrollWidth` is the obvious metric and it is not the right one — Chromium
   * reports a wide value for a table that is fully clipped inside its own `overflow-x: auto`
   * region, which is a deliberate, labelled, keyboard-reachable scroller and not a defect. It
   * did catch a real 89-pixel overflow on the homepage first, so it is worth saying why it was
   * replaced rather than simply loosening the threshold: what matters is whether the *page*
   * moves, and this measures exactly that.
   */
  test('the page itself never moves sideways', async ({ page }) => {
    for (const route of ['/', '/security', '/pricing', '/compare/moodle', '/developers', '/demo']) {
      await page.goto(route);
      const moved = await page.evaluate(() => {
        window.scrollTo({ left: 9999, top: 0, behavior: 'instant' });
        const x = window.scrollX;
        window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
        return x;
      });
      expect(moved, `${route} scrolls sideways by ${moved}px`).toBe(0);

      // And no element sticks out past the viewport unless something is clipping it.
      const escapees = await page.evaluate(() => {
        const limit = document.documentElement.clientWidth;
        const clips = (el: Element) =>
          ['auto', 'scroll', 'hidden', 'clip'].includes(getComputedStyle(el).overflowX);
        const out: string[] = [];
        document.querySelectorAll<HTMLElement>('body *').forEach((el) => {
          if (el.getBoundingClientRect().right <= limit + 1) return;
          let parent: Element | null = el.parentElement;
          while (parent && parent !== document.body) {
            if (clips(parent)) return;
            parent = parent.parentElement;
          }
          out.push(`${el.tagName}.${el.className.toString().slice(0, 60)}`);
        });
        return out.slice(0, 5);
      });
      expect(escapees, `${route} has unclipped content past the viewport`).toEqual([]);
    }
  });
});
