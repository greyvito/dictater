import { defineConfig, devices } from '@playwright/test';

// Dedicated port so Playwright does not reuse another Vite app on the default 5173.
const E2E_PORT = Number(process.env.E2E_PORT) || 5199;
const E2E_URL = `http://localhost:${E2E_PORT}`;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: E2E_URL,
    trace: 'on-first-retry'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run dev -- --host --port ${E2E_PORT} --strictPort`,
    url: E2E_URL,
    reuseExistingServer: !process.env.CI
  }
});
