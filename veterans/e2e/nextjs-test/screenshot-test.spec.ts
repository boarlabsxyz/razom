import { test, expect } from '@playwright/test';

test('Snapshot for Home Page without Hero Section', async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });

  await page.goto(process.env.BASE_URL ?? 'http://localhost:8000/', {
    timeout: 60000,
    waitUntil: 'networkidle',
  });

  await Promise.all([
    page.waitForLoadState('domcontentloaded'),
    page.waitForLoadState('networkidle'),
  ]);
  await page.evaluate(() => {
    return document.fonts.ready;
  });

  await page.waitForSelector('select, input[type="checkbox"]', {
    state: 'visible',
    timeout: 10000,
  });

  if (browserName === 'webkit') {
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.textContent = `
        * {
          -webkit-font-smoothing: antialiased !important;
          text-rendering: geometricPrecision !important;
          letter-spacing: normal !important;
        }
      `;
      document.head.appendChild(style);
    });
    await page
      .waitForSelector('[role="alert"]', {
        state: 'hidden',
        timeout: 2000,
      })
      .catch(() => {});

    await page.waitForTimeout(2000);
  }

  const snapshot = await page.screenshot({
    fullPage: true,
    timeout: 30000,
  });

  expect(snapshot).toMatchSnapshot('homepage-no-hero.png', {
    maxDiffPixels: 300,
    threshold: 0.5,
  });
});
