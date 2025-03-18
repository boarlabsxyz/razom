import { test, expect } from '@playwright/test';

test('Snapshot for Home Page without Hero Section', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'http://localhost:8000/', {
    timeout: 60000,
    waitUntil: 'load',
  });

  await page.waitForLoadState('load');

  const svgElement = await page.waitForSelector('svg[data-test-id="svg-map"]', {
    timeout: 5000,
  });

  await page.waitForTimeout(5000);

  if (svgElement) {
    await page.evaluate(() => {
      document.querySelector('svg[data-test-id="svg-map"]')?.remove();
    });
  }

  await page.waitForTimeout(5000);

  await page.setViewportSize({ width: 1280, height: 720 });

  const snapshot = await page.screenshot({ fullPage: true });

  expect(snapshot).toMatchSnapshot('homepage-no-hero.png');
});
