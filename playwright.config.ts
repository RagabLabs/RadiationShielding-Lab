import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
 testDir:'tests/e2e',fullyParallel:true,forbidOnly:!!process.env.CI,retries:process.env.CI?1:0,
 reporter:[['list'],['json',{outputFile:'reports/playwright-results.json'}],['html',{outputFolder:'reports/playwright-html',open:'never'}]],
 use:{baseURL:'http://127.0.0.1:4173/RadiationShielding-Lab/',trace:'retain-on-failure',acceptDownloads:true},
 projects:[{name:'desktop-chromium',use:{...devices['Desktop Chrome']}},{name:'mobile-chromium',use:{...devices['iPhone 13'],defaultBrowserType:'chromium'}}],
 webServer:{command:'npm run preview -- --port 4173 --strictPort',url:'http://127.0.0.1:4173/RadiationShielding-Lab/',reuseExistingServer:!process.env.CI},
});
