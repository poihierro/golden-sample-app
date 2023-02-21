import {devices, PlaywrightTestConfig} from '@playwright/test';

const config: PlaywrightTestConfig = {
  globalSetup: require.resolve('./apps/golden-sample-app-e2e/global-setup'),
  webServer: {
    command: 'npm start',
    port: 4200,
    reuseExistingServer: !process.env['CI'],
  },
  testDir: './apps/golden-sample-app-e2e',
  forbidOnly: !!process.env['CI'],
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'retain-on-failure',
    headless: !process.env['HEADLESS'],
    storageState: 'auth.json'
  },
  projects: [
    {name: 'chromium', use: {...devices['Desktop Chrome']}},
    {name: 'firefox', use: {...devices['Desktop Firefox']}},
    {name: 'webkit', use: {...devices['Desktop Safari']}},
    {name: 'android', use: {...devices['Pixel 5']}},
    {name: 'iphone', use: {...devices['iPhone 13 Pro']}},
  ],
  outputDir: 'test-results/',
};
export default config;
