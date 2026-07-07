import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 60000,
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    baseURL: 'http://localhost:5173',
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--disable-features=WebRtcHideLocalIpsWithMdns',
            '--use-fake-ui-for-media-stream'
          ]
        }
      },
    },
  ],
  webServer: [
    {
      command: 'npm run start',
      url: 'http://localhost:5555/api/health',
      reuseExistingServer: !process.env.CI,
      cwd: '../server',
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      cwd: './',
    }
  ],
});
