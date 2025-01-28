import { test, expect } from '@playwright/test';

test('Snapshot for Home Page without Hero Section', async ({ page }) => {
  await page.goto('http://localhost:8000/');

  const heroSection = await page.waitForSelector(
    'section[aria-label="Blog initiatives"]',
    { timeout: 5000 },
  );

  if (heroSection) {
    await page.evaluate(() => {
      const hero = document.querySelector(
        'section[aria-label="Blog initiatives"]',
      );
      if (hero) {
        hero.remove();
      }
    });
  }

  await page.waitForTimeout(500);

  const snapshot = await page.screenshot({ fullPage: true });

  expect(snapshot).toMatchSnapshot('homepage-no-hero.png');
});
