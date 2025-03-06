import { test, expect } from '@playwright/test';

test('Snapshot for Home Page without Hero Section', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'http://localhost:8000/', {
    timeout: 60000,
    waitUntil: 'load',
  });

  const heroSection = await page.waitForSelector(
    'section[data-test-id="blog-initiatives"]',
    { timeout: 5000 },
  );

  if (heroSection) {
    await page.evaluate(() => {
      const hero = document.querySelector(
        'section[data-test-id="blog-initiatives"]',
      );
      if (hero) {
        hero.remove();
      }
    });
  }

  await page.waitForLoadState('load');
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.waitForSelector('[data-test-id="loader"]', {
    state: 'detached',
    timeout: 10000,
  });

  const snapshot = await page.screenshot({ fullPage: true });

  expect(snapshot).toMatchSnapshot('homepage-no-hero.png');
});
