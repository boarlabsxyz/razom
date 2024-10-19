import { test, expect } from "@playwright/test";

test.describe("Keystone Signup process", () => {
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

  test("should create new user and see dashboard", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await expect(page.getByLabel("Name")).toBeEmpty();
    await page.getByLabel("Name").click();
    await page.getByLabel("Name").fill("John");

    await expect(page.getByLabel("Email")).toBeEmpty();
    await page.getByLabel("Email").click();
    await page.getByLabel("Email").fill("john@test.com");

    await page.getByRole("button", { name: "Set Password" }).click();

    await expect(page.getByPlaceholder("New Password")).toBeVisible();
    await expect(page.getByPlaceholder("Confirm Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Show Text" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();

    await page.getByPlaceholder("New Password").click();
    await page.getByPlaceholder("New Password").fill("test1234");

    await page.getByPlaceholder("Confirm Password").click();
    await page.getByPlaceholder("Confirm Password").fill("test1234");

    await page.getByRole("button", { name: "Get started" }).click();
    await expect(page.getByRole("heading", { name: "Welcome" })).toBeVisible();

    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page).toHaveTitle("Keystone");
    await expect(
      page.getByRole("heading", { name: "Dashboard" })
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Users", exact: true })
    ).toBeVisible();
    await page.getByRole("link", { name: "Users", exact: true }).click();

    await page
      .getByRole("row", { name: "John john@test.com Is set" })
      .locator("svg")
      .click();

    await page.getByRole("link", { name: "John" }).click();

    await expect(page.getByRole("button", { name: "Delete" })).toBeVisible();
    await page.getByRole("button", { name: "Delete" }).click();

    await expect(
      page.getByRole("heading", { name: "Delete Confirmation" })
    ).toBeVisible();
    await expect(page.getByText("Are you sure you want to")).toBeVisible();
    await expect(
      page
        .getByLabel("Delete Confirmation")
        .getByRole("button", { name: "Delete" })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();

    await page
      .getByLabel("Delete Confirmation")
      .getByRole("button", { name: "Delete" })
      .click();
  });
});
