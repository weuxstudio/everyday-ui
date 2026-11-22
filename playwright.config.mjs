import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  workers: 3,
  use: { baseURL: "http://127.0.0.1:4173", trace: "retain-on-failure" },
  projects: ["chromium", "firefox", "webkit"].map(browserName => ({ name: browserName, use: { browserName }, testIgnore: browserName === "chromium" ? [] : ["**/shots.spec.mjs"] })),
  webServer: { command: "node tests/serve.mjs", port: 4173 },
});
