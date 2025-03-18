import { test, expect } from '@playwright/test';

test('Snapshot for Home Page without Hero Section', async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });

  await page.goto(process.env.BASE_URL || 'http://localhost:8000/', {
    timeout: 60000,
    waitUntil: 'networkidle',
  });

  await Promise.all([
    page.waitForLoadState('domcontentloaded'),
    page.waitForLoadState('networkidle'),
  ]);

  await page.waitForSelector('select, input[type="checkbox"]', {
    state: 'visible',
    timeout: 10000,
  });

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

    try {
      await page.waitForSelector('[role="alert"]', {
        state: 'hidden',
        timeout: 2000,
      });
    } catch (e) {
      // If there's no error notification, continue
    }

    await page.waitForTimeout(2000);
  }

  const snapshot = await page.screenshot({
    fullPage: true,
    timeout: 30000,
  });

  expect(snapshot).toMatchSnapshot('homepage-no-hero.png', {
    maxDiffPixels: 200,
    threshold: 0.4,
  });
});
