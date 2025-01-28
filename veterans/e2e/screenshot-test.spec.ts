import { test, expect } from '@playwright/test';

test('Snapshot for Home Page without Hero Section', async ({ page }) => {
  await page.goto('http://localhost:8000/');

  const selector = '[data-test-id="blog-initiatives"]';

  try {
    await page.waitForSelector(selector, { timeout: 5000 });

    await page.evaluate((sel) => {
      const hero = document.querySelector(sel);
      hero?.remove();
    }, selector);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.warn(`Hero section not found: ${error.message}`);
    } else {
      console.warn('An unknown error occurred');
    }
  }

  await page.waitForLoadState('networkidle');

  const snapshot = await page.screenshot({ fullPage: true });

  expect(snapshot).toMatchSnapshot('homepage-no-hero.png');
});
