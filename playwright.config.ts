import { defineConfig, devices } from "@playwright/test";

const PORTA = Number(process.env.PORTA ?? 3100);

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  use: { baseURL: `http://localhost:${PORTA}`, trace: "retain-on-failure" },
  projects: [
    { name: "celular", use: { ...devices["Pixel 7"] } },
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1366, height: 900 } } },
  ],
  webServer: { command: `npx next dev -p ${PORTA}`, url: `http://localhost:${PORTA}`, reuseExistingServer: true, timeout: 120_000 },
});
