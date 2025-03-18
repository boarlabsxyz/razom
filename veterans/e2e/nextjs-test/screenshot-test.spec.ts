import { test, expect } from '@playwright/test';

test('Snapshot for Home Page without Hero Section', async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });

  await page.goto(process.env.BASE_URL || 'http://localhost:8000/', {
    timeout: 60000,
    waitUntil: 'domcontentloaded',
  });

  await page.waitForLoadState('domcontentloaded');

  const svgElement = await page.waitForSelector('svg[data-test-id="svg-map"]', {
    timeout: 10000,
    state: 'attached',
  });
  if (svgElement) {
    await page.evaluate(() => {
      const element = document.querySelector(
        'svg[data-test-id="svg-map"]',
      ) as SVGElement;
      if (element) {
        element.style.display = 'none';
        element.remove();
      }
    });
  }

  if (browserName === 'webkit') {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  }
  const snapshot = await page.screenshot({
    fullPage: true,
    timeout: 30000,
  });

  expect(snapshot).toMatchSnapshot('homepage-no-hero.png', {
    maxDiffPixels: 100,
    threshold: 0.3,
  });
});
