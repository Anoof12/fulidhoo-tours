import { expect, test } from "@playwright/test";

/** Seeded demo accounts (see prisma/seed.ts) */
const CUSTOMER_EMAIL = process.env.E2E_CUSTOMER_EMAIL ?? "customer@example.com";
const CUSTOMER_PASSWORD = process.env.E2E_CUSTOMER_PASSWORD ?? "Customer123!";
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "admin@fulidhootours.com";
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "Admin123!";

function futureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
}

async function login(page: import("@playwright/test").Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/^password$/i).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL((url) => url.pathname !== "/login", { timeout: 45_000 });
}

test.describe("Auth gate", () => {
  test("anonymous visit to home redirects to login", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
    await ctx.close();
  });
});

test.describe("Customer flows", () => {
  test("login lands on homepage", async ({ page }) => {
    await login(page, CUSTOMER_EMAIL, CUSTOMER_PASSWORD);
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: /explore the island/i })).toBeVisible();
  });

  test("excursions listing loads", async ({ page }) => {
    await login(page, CUSTOMER_EMAIL, CUSTOMER_PASSWORD);
    await page.goto("/excursions");
    await expect(page.getByRole("heading", { name: /find your perfect excursion/i })).toBeVisible();
  });

  test("contact page renders", async ({ page }) => {
    await login(page, CUSTOMER_EMAIL, CUSTOMER_PASSWORD);
    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: /get in touch/i })).toBeVisible();
  });

  test("excursion detail → cart → checkout → reserve", async ({ page }) => {
    await login(page, CUSTOMER_EMAIL, CUSTOMER_PASSWORD);

    await page.goto("/excursions/shark-point-snorkeling");
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();

    const bookingDate = futureDate(120);
    await page.locator("#booking-date").fill(bookingDate);

    const addBtn = page.getByRole("button", { name: /add to cart/i });
    await expect(addBtn).toBeEnabled({ timeout: 60_000 });
    await addBtn.click();

    await expect(page.getByText(/added to cart/i)).toBeVisible();
    await page.getByRole("link", { name: /continue to checkout/i }).click();
    await expect(page).toHaveURL("/checkout");
    await expect(page.getByRole("heading", { name: /reserve your booking/i })).toBeVisible();

    await page.getByPlaceholder("Full name").fill("E2E Test User");
    await page.getByPlaceholder("Email").fill("e2e-test@example.com");
    await page.getByPlaceholder("Phone number").fill("+9607700000");

    await page.getByRole("button", { name: /reserve booking/i }).click();

    await expect(page.getByText(/booking reserved successfully/i)).toBeVisible({ timeout: 30_000 });
  });

  test("account dashboard reachable after login", async ({ page }) => {
    await login(page, CUSTOMER_EMAIL, CUSTOMER_PASSWORD);
    await page.goto("/account/dashboard");
    await expect(page.getByRole("heading", { name: /welcome/i })).toBeVisible();
  });
});

test.describe("Admin flows", () => {
  test("admin login lands on admin dashboard", async ({ page }) => {
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await expect(page).toHaveURL("/admin");
    await expect(page.getByRole("heading", { name: /admin dashboard/i })).toBeVisible();
  });

  test("admin excursions list loads", async ({ page }) => {
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto("/admin/excursions");
    await expect(page.getByRole("heading", { name: /manage excursions/i })).toBeVisible();
  });

  test("admin bookings page loads", async ({ page }) => {
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto("/admin/bookings");
    await expect(page.getByRole("heading", { name: /manage bookings/i })).toBeVisible();
  });
});
