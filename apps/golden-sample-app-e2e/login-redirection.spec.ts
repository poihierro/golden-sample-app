import { test, expect } from '@playwright/test';

test.use({
  storageState: {
    cookies: [],
    origins: []
  }
})

test('should redirect to the login page', async ({ page }) => {
  await page.goto('');
  const title = page.locator('#kc-page-title');
  await expect(title).toHaveText('Welcome to your online banking');
});
