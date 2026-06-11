import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2, // python -m http.server is single-threaded; >2 workers causes ERR_CONNECTION_REFUSED flake
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:8391',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
  ],
  webServer: {
    command: 'python -m http.server 8391',
    url: 'http://127.0.0.1:8391',
    reuseExistingServer: true,
    timeout: 30000,
  },
});
