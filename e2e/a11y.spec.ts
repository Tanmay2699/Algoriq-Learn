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

  /*
   * Then wait for the page-load entrance specifically, rather than trusting the timeouts
   * above to have outlasted it. The entrance runs for `--mk-dur-entrance` plus up to five
   * stagger steps, which is longer than the 1100ms of scrolling — so axe could analyse a
   * heading still at partial opacity and report a contrast ratio no reader ever sees. That
   * failed on exactly the routes with the longest hero ladder, and only sometimes, which is
   * the worst kind of test to debug.
   *
   * The ambient drift and the scroll-linked parallax are excluded: one never ends and the
   * other is driven by scroll position, so neither would ever settle.
   */
  await page.waitForFunction(
    () =>
      document
        .getAnimations()
        .filter((animation) => {
          const name = (animation as CSSAnimation).animationName;
          return typeof name === 'string' && name.startsWith('mk-enter');
        })
        .every((animation) => animation.playState === 'finished'),
    undefined,
    { timeout: 5000 },
  );
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

  /**
   * The same question asked *between* the two widths Playwright runs at.
   *
   * The projects are 360 and 1440, so everything from 361 to 1439 was unverified — and that is
   * exactly where a responsive header breaks, because a bar that fits at both ends can still be
   * over budget in the middle. It was: the 2026-08-01 rebrand widened the wordmark and the row
   * ran 248px past its box at 1024, through a `flex-1` nav that absorbs the excess by sliding
   * its links under the CTAs rather than by pushing anything past the viewport edge. Both
   * assertions above were green the whole time.
   *
   * So this sweeps the breakpoint boundaries and the pixel either side of each, and adds a
   * collision check the reflow assertions cannot make: overlap *inside* the bar never reaches
   * the viewport edge, so it has to be measured against the neighbour, not the page.
   */
  test('the header survives every width between the two we render at', async ({ page }) => {
    const widths = [360, 400, 480, 639, 640, 641, 767, 768, 769, 900, 1023, 1024, 1150, 1279, 1280, 1281, 1440, 1600, 1920];

    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');

      const report = await page.evaluate(() => {
        const bar = document.querySelector('header > div')!;
        const limit = document.documentElement.clientWidth;

        // Anything in the bar that runs past the viewport.
        const past = [...bar.querySelectorAll<HTMLElement>('*')]
          .filter((el) => el.getBoundingClientRect().right > limit + 1)
          .map((el) => el.tagName + '.' + el.className.toString().slice(0, 40));

        // Anything in the bar that overlaps its next visible sibling. `getClientRects().length`
        // filters out the display:none controls, which report a zero rect at the origin and
        // would otherwise "overlap" everything.
        const boxes = [...bar.children]
          .flatMap((el) => [...el.querySelectorAll<HTMLElement>('a, button')])
          .filter((el) => el.getClientRects().length > 0)
          .map((el) => ({ label: (el.textContent || '').trim().slice(0, 20), r: el.getBoundingClientRect() }))
          .sort((a, b) => a.r.left - b.r.left);

        const collisions: string[] = [];
        for (let i = 1; i < boxes.length; i++) {
          const prev = boxes[i - 1]!;
          const cur = boxes[i]!;
          if (cur.r.left < prev.r.right - 1) collisions.push(`"${prev.label}" over "${cur.label}"`);
        }
        return { past, collisions };
      });

      expect(report.past, `header content past the viewport at ${width}px`).toEqual([]);
      expect(report.collisions, `header controls overlap at ${width}px`).toEqual([]);
    }
  });
});

/*
 * The old reflow test lived here. It was replaced by the per-width header check above and
 * left behind as a skipped placeholder — but the leftover body still carried the closing
 * brace of a `for` loop that no longer existed, and a reference to an undefined `route`.
 * Being `test.skip` did not help: Playwright parses the file before it decides what to
 * skip, so the syntax error took the whole accessibility suite down with it, and axe was
 * silently not running on any route.
 */
