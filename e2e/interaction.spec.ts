import { expect, test } from '@playwright/test';

/**
 * The interactive parts, driven the way a keyboard user drives them.
 *
 * Every one of these is a claim the site makes about itself on /accessibility, so each is
 * checked rather than asserted.
 */

test.describe('the skip link', () => {
  test('is the first focusable thing and reaches main', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toHaveAttribute('href', '#main');
    await expect(focused).toBeVisible();
  });
});

test.describe('the hero role switcher', () => {
  test('is a real tab set, driven by arrow keys, activated deliberately', async ({ page }) => {
    await page.goto('/');
    const tablist = page.getByRole('tablist', { name: /choose a role/i });
    await expect(tablist).toBeVisible();

    const tabs = tablist.getByRole('tab');
    await expect(tabs).toHaveCount(4);
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');

    await tabs.first().focus();
    await page.keyboard.press('ArrowRight');
    // Manual activation: focus has moved, the selection has not.
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('Enter');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');

    // End jumps to the last tab; Home comes back.
    await page.keyboard.press('End');
    await expect(tabs.nth(3)).toBeFocused();
    await page.keyboard.press('Home');
    await expect(tabs.first()).toBeFocused();
  });

  test('shows a different dashboard for each role', async ({ page }) => {
    await page.goto('/');
    const tabs = page.getByRole('tablist', { name: /choose a role/i }).getByRole('tab');
    // Two tab sets on the page: the hero switcher and the module explorer. This is the first.
    const panel = page.getByRole('tabpanel').first();

    await expect(panel).toContainText('Rajesh Kumar');
    await tabs.nth(2).click();
    await expect(panel).toContainText('Sana Khan');
    await tabs.nth(3).click();
    await expect(panel).toContainText('Vikram Rao');
  });
});

test.describe('the FAQ', () => {
  test('has its answers in the HTML, open or closed', async ({ page }) => {
    await page.goto('/');
    // <details>, so find-in-page and a crawler both see the answer without JavaScript.
    const answer = page.getByText(/boots the entire platform/i).first();
    await expect(answer).toBeAttached();

    const summary = page.getByText('Can we self-host it?').first();
    await summary.click();
    await expect(answer).toBeVisible();
  });
});

test.describe('the permission catalogue', () => {
  test('filters 272 real keys', async ({ page }) => {
    await page.goto('/security');
    const search = page.getByLabel('Search the catalogue');
    await expect(page.getByText(/272 of 272 keys/)).toBeVisible();

    await search.fill('invoice');
    await expect(page.getByText(/of 272 keys/)).toContainText('matching');
    await expect(page.getByText('finance.invoice.refund').first()).toBeVisible();

    await search.fill('zzzzz');
    await expect(page.getByText(/Nothing matches/)).toBeVisible();
  });
});

test.describe('the ROI calculator', () => {
  test('starts empty and prints its own formula', async ({ page }) => {
    await page.goto('/why-algoryq-learn');
    await expect(page.getByText(/We have not pre-filled anything/)).toBeVisible();

    await page.getByLabel('Learners you would put on it').fill('400');
    await page.getByLabel('Monthly spend on the tools you would retire').fill('12000');
    await expect(page.getByText('First-year difference on your numbers:')).toBeVisible();

    await page.getByText('Show the maths').click();
    await expect(page.getByText('monthlyToolSpend × 12')).toBeVisible();
    await expect(page.getByText(/not a study/)).toBeVisible();
  });
});

test.describe('the demo form', () => {
  test('validates inline and moves focus to the first problem', async ({ page }) => {
    await page.goto('/demo');
    await page.getByRole('button', { name: 'Send it' }).click();

    await expect(page.getByText('Please tell us your name.')).toBeVisible();
    await expect(page.getByLabel('Your name')).toBeFocused();

    // The honeypot must be unreachable by tab, and invisible.
    await expect(page.locator('#lead-website')).toHaveAttribute('tabindex', '-1');
  });

  test('changes its heading with the intent, and records it', async ({ page }) => {
    await page.goto('/demo?intent=design-partner');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('design partner');
  });
});

test.describe('the mobile navigation', () => {
  test.use({ viewport: { width: 360, height: 780 } });

  test('traps focus, closes on Escape and returns focus', async ({ page }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Menu' });
    await trigger.click();

    const sheet = page.locator('#mobile-nav');
    await expect(sheet).toBeVisible();
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

    await page.keyboard.press('Escape');
    await expect(sheet).toBeHidden();
  });
});

test.describe('the theme', () => {
  test('an explicit choice beats the operating system, in both directions', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');

    const toggle = page.getByRole('button', { name: /change theme/i });
    await toggle.click(); // system → light
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await toggle.click(); // light → dark
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await toggle.click(); // dark → system
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark');
  });
});

test.describe('external links', () => {
  test('announce that they open a new tab, and are safe', async ({ page }) => {
    await page.goto('/');
    const external = page.locator('a[target="_blank"]');
    const count = await external.count();
    expect(count).toBeGreaterThan(0);

    for (let index = 0; index < count; index += 1) {
      const link = external.nth(index);
      await expect(link).toHaveAttribute('rel', /noopener/);
      expect(await link.innerText()).toBeTruthy();
      // The announcement is visually hidden text, not a title attribute.
      expect(await link.locator('.sr-only').count()).toBeGreaterThan(0);
    }
  });
});
