// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'off'
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'Mobile Viewport (360x640)',
      use: {
        viewport: { width: 360, height: 640 },
        isMobile: true
      }
    }
  ],
  webServer: {
    command: 'npx serve . -p 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 10000
  }
});
