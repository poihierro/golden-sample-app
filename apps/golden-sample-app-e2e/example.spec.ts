import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('');
  const title = page.locator('#kc-page-title');
  await expect(title).toHaveText('Welcome to your online banking');
});
