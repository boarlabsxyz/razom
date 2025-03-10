import { test, expect } from '@playwright/test';

test('Snapshot for Home Page without Hero Section', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'http://localhost:8000/', {
    timeout: 60000,
    waitUntil: 'load',
  });

  await page.waitForLoadState('load');

  const heroSection = await page.waitForSelector(
    'section[data-test-id="blog-initiatives"]',
  );

  await page.waitForTimeout(5000);

  if (heroSection) {
    await page.evaluate(() => {
      document
        .querySelector('section[data-test-id="blog-initiatives"]')
        ?.remove();
    });
  }

  await page.waitForTimeout(5000);

  await page.setViewportSize({ width: 1280, height: 720 });

  const snapshot = await page.screenshot({ fullPage: true });

  expect(snapshot).toMatchSnapshot('homepage-no-hero.png');
});
