import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:5000',
    browserName: 'chromium',
    channel: 'msedge',
    headless: true,
  },
  workers: 1,
});
