import { test, expect } from '@playwright/test';
async function readyForScreenshot(page) {
  await page
    .locator('img')
    .evaluateAll((images) => images.forEach((img) => (img.loading = 'eager')));
  await page.waitForFunction(
    () => [...document.images].every((image) => image.complete && image.naturalWidth > 0),
    { timeout: 30000 }
  );
}
test('desktop storefront, filters, authentication, cart and checkout', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Everyday, upgraded.' })).toBeVisible();
  await expect(page.locator('.product-card')).toHaveCount(4);
  await readyForScreenshot(page);
  await page.screenshot({ path: '../docs/home-desktop.png', fullPage: true });
  await page.goto('/products?category=Electronics');
  await expect(page.locator('.product-card')).toHaveCount(3);
  await page.getByLabel('Search products').fill('Studio');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Add Studio Wireless Headphones to cart' }).click();
  await page.getByRole('link', { name: 'Cart, 1 items' }).click();
  await expect(page.getByRole('heading', { name: 'Shopping bag (1)' })).toBeVisible();
  await page.getByRole('button', { name: 'Increase Studio Wireless Headphones' }).click();
  await expect(page.getByRole('heading', { name: 'Shopping bag (2)' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Shopping bag (2)' })).toBeVisible();
  await page.getByRole('link', { name: 'Proceed to checkout' }).click();
  await expect(page).toHaveURL(/login/);
  await page.getByRole('link', { name: 'Create an account' }).click();
  await page.getByLabel('Full name').fill('Browser Shopper');
  await page.getByLabel('Email address').fill(`browser-${Date.now()}@example.com`);
  await page.getByLabel('Password', { exact: true }).fill('BrowserPass123!');
  await page.getByLabel('Confirm password').fill('BrowserPass123!');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page).toHaveURL(/checkout/);
  await page.getByLabel('Phone number').fill('9876543210');
  await page.getByLabel('Street address').fill('42 Browser Street');
  await page.getByLabel('City', { exact: true }).fill('Pune');
  await page.getByLabel('State', { exact: true }).fill('Maharashtra');
  await page.getByLabel('Postal code').fill('411001');
  await page.getByRole('button', { name: 'Place order' }).click();
  await expect(page.getByText('Your order is placed.')).toBeVisible();
  await expect(page.locator('.order-card')).toHaveCount(1);
  await expect(page.getByText('Processing', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Cart, 0 items' })).toBeVisible();
  await page.goto('/admin');
  await expect(page).toHaveURL('http://localhost:5000/');
  expect(errors).toEqual([]);
});
test('mobile navigation and product details fit the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.product-card')).toHaveCount(4);
  await readyForScreenshot(page);
  await page.screenshot({ path: '../docs/home-mobile.png', fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  );
  await page.getByLabel('Toggle navigation').click();
  await page.locator('nav').getByRole('link', { name: 'Products', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(12);
  await page.getByText('View details', { exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  );
});
