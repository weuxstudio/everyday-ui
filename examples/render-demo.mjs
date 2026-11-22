// Builds the demo page and, if Playwright is available, screenshots it at
// phone and desktop width in light and dark mode: the skill's own review loop.
import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, "dist");
mkdirSync(dist, { recursive: true });
const run = (cmd) => execSync(cmd, { cwd: join(here, ".."), stdio: "inherit" });

run("node packages/tokens/scripts/build.mjs");
run(`npx esbuild examples/demo.tsx --bundle --format=iife --jsx=automatic --minify --outfile=examples/dist/demo.js --log-level=warning`);
run(`npx @tailwindcss/cli -i examples/demo.css -o examples/dist/demo.css --minify`);

writeFileSync(
  join(dist, "index.html"),
  `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Everyday UI demo</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap" />
  <link rel="stylesheet" href="./demo.css" />
</head>
<body><div id="root"></div><script src="./demo.js"></script></body>
</html>
`,
);
console.log("demo → examples/dist/index.html");

let playwright;
try {
  playwright = createRequire(import.meta.url)("playwright");
} catch {
  console.log("Playwright not installed: open examples/dist/index.html in a browser to review.");
  process.exit(0);
}

const url = pathToFileURL(join(dist, "index.html")).href;
const browser = await playwright.chromium.launch();
const shots = [
  ["desktop-light", { width: 1280, height: 1100 }, "light"],
  ["mobile-dark", { width: 375, height: 1400 }, "dark"],
];
for (const [name, viewport, colorScheme] of shots) {
  const page = await browser.newPage({ viewport, colorScheme, deviceScaleFactor: 2 });
  await page.goto(url);
  await page.waitForSelector("h1");
  await page.screenshot({ path: join(here, `${name}.png`), fullPage: true });
  await page.close();
}
// Dialog state
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
await page.goto(url);
await page.getByRole("button", { name: "Delete workspace…" }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: join(here, "dialog-light.png") });
await browser.close();
console.log("screenshots → examples/*.png");
