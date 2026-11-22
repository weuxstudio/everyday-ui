import { test, expect } from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadConfig, run, serveStatic } from "../../packages/shots/lib/shots.mjs";

test("review variants capture the same populated dialog", async ({ browser }, info) => {
  const dir = info.outputPath("route");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), '<!doctype html><html lang="en"><title>Review</title><style>*{caret-color:transparent}</style><h1>Order</h1><button onclick="document.querySelector(\'dialog\').showModal()">Edit</button><dialog><label>Name <input></label></dialog></html>');
  const { server, url } = await serveStatic(dir);
  try {
    const route = { name: "order", path: "/", actions: [{ click: "button" }, { fill: ["input", "Mara"] }] };
    const config = loadConfig(dir, null, { baseUrl: url, routes: [route], viewports: { desktop: [800, 600] }, schemes: ["light"], variants: ["zoom", "reduced-motion"], settle: 0 });
    const { outDir } = await run(config);
    for (const [suffix, zoom] of [["", false], ["--reduced-motion", false], ["--zoom200", true]]) {
      const page = await browser.newPage({ viewport: zoom ? { width: 400, height: 300 } : { width: 800, height: 600 }, deviceScaleFactor: zoom ? 2 : 1 });
      await page.goto(url);
      await page.getByRole("button").click();
      await page.getByRole("textbox").fill("Mara");
      const reference = await page.screenshot({ fullPage: true });
      expect(readFileSync(join(outDir, "order--desktop--light" + suffix + ".png")).equals(reference)).toBe(true);
      await page.close();
    }
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
