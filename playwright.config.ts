import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir:"./tests",
  timeout:180000,
  expect:{timeout:15000},
  fullyParallel:false,
  workers:1,
  reporter:"list",
  use:{baseURL:process.env.TEST_BASE_URL||"http://127.0.0.1:3000",locale:"fr-FR",actionTimeout:15000,navigationTimeout:30000,trace:"retain-on-failure",screenshot:"only-on-failure"},
  projects:[
    {name:"desktop",use:{...devices["Desktop Chrome"],viewport:{width:1440,height:1000}}},
    {name:"mobile",use:{...devices["iPhone 13"],defaultBrowserType:"chromium"}},
  ],
});
