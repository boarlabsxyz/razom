import { test, expect, Page } from '@playwright/test';

async function isUserAuthorized(page: Page): Promise<boolean> {
  await page.goto('/');
  return (await page.url()) === 'http://localhost:3000/signin';
}

test.describe('Keystone Signup page', () => {
  test('should behave differently based on authorization', async ({
    page,
  }: {
    page: Page;
  }) => {
    const authorized = await isUserAuthorized(page);

    if (!authorized) {
      await expect(page).toHaveURL('/init');
      await expect(
        page.getByRole('heading', { name: 'Welcome to KeystoneJS' }),
      ).toBeVisible();
      await expect(
        page.getByText('Create your first user to get'),
      ).toBeVisible();
      await expect(page.locator('form')).toContainText('Name');
      await expect(page.getByLabel('Name')).toBeVisible();
      await expect(page.locator('form')).toContainText('Email');
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.locator('form')).toContainText('Password');
      await expect(
        page.getByRole('button', { name: 'Set Password' }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Get started' }),
      ).toBeVisible();
    } else {
      await expect(page).toHaveURL('/signin');
      await expect(
        page.getByRole('heading', { name: 'Sign in' }),
      ).toBeVisible();
    }
  });

  test('should have validation on signup form if unauthenticated', async ({
    page,
  }: {
    page: Page;
  }) => {
    const authorized = await isUserAuthorized(page);

    if (!authorized) {
      await page.goto('/');
      await page.getByRole('button', { name: 'Get started' }).click();
      await expect(page.locator('form')).toContainText(
        'Name must not be empty',
      );
      await expect(page.locator('form')).toContainText(
        'Email must not be empty',
      );
      await expect(page.getByRole('group')).toContainText(
        'Password is required',
      );
    }
  });
});
