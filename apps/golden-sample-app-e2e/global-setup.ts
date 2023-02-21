import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  if (!process.env['USERNAME'] || !process.env['PASSWORD']) {
    throw new Error('Please provide an username and password');
  }
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch({headless: !process.env['HEADLESS']});
  const page = await browser.newPage();
  await page.goto(`${baseURL}`);
  await page.getByLabel('Username or email').fill(process.env['USERNAME']);
  await page.getByLabel('Password').fill(process.env['PASSWORD']);
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('link', { name: 'Make transfer' }).click();
  await page.context().storageState({ path: `${storageState}` });
  await browser.close();
}

export default globalSetup;
