import { test, expect } from "@playwright/test";

test.describe("Keystone Signup page", () => {
  test("should navigate to the signup page and see signup form", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/");
    await expect(page).toHaveURL("http://localhost:3000/init");
    await expect(
      page.getByRole("heading", { name: "Welcome to KeystoneJS" })
    ).toBeVisible();
    await expect(page.getByText("Create your first user to get")).toBeVisible();
    await expect(page.locator("form")).toContainText("Name");
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.locator("form")).toContainText("Email");
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.locator("form")).toContainText("Password");
    await expect(
      page.getByRole("button", { name: "Set Password" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Get started" })
    ).toBeVisible();
  });

  test("should have validation on signup form", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("button", { name: "Get started" }).click();
    await expect(page.locator("form")).toContainText("Name must not be empty");
    await expect(page.locator("form")).toContainText("Email must not be empty");
    await expect(page.getByRole("group")).toContainText("Password is required");
  });
});
