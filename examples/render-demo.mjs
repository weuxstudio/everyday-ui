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
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Fraunces:wght@400;500;600&family=Instrument+Sans:wght@400;600&family=Nunito:wght@400;600;700&family=IBM+Plex+Sans:wght@400;600&family=Source+Sans+3:wght@400;600&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" />
  <link rel="stylesheet" href="./demo.css" />
  <!-- ?theme=<preset> swaps in a generated theme: components only read tokens, so nothing else changes. -->
  <script>
    const t = new URLSearchParams(location.search).get("theme");
    if (t) document.write('<link rel="stylesheet" href="../../packages/tokens/dist/themes/' + encodeURIComponent(t) + '/tokens.css">');
  </script>
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
const open = async (viewport, colorScheme = "light") => {
  const page = await browser.newPage({ viewport, colorScheme, deviceScaleFactor: 2 });
  await page.goto(url);
  await page.waitForSelector("h1");
  return page;
};

// 1. Default state: desktop light, phone dark.
for (const [name, viewport, scheme] of [
  ["desktop-light", { width: 1280, height: 900 }, "light"],
  ["mobile-dark", { width: 375, height: 800 }, "dark"],
]) {
  const page = await open(viewport, scheme);
  await page.screenshot({ path: join(here, `${name}.png`), fullPage: true });
  await page.close();
}

// 2. Error state: submit the form, validation runs on submit.
{
  const page = await open({ width: 1280, height: 900 });
  await page.getByRole("button", { name: "Save settings" }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(here, "errors-light.png"), fullPage: true });
  await page.close();
}

// 3. Destructive dialog with heavy friction, after pressing delete without confirming.
{
  const page = await open({ width: 1280, height: 800 });
  await page.getByRole("button", { name: "Delete workspace…" }).click();
  await page.waitForTimeout(300);
  await page.getByRole("dialog").getByRole("button", { name: "Delete workspace" }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(here, "dialog-light.png") });
  await page.close();
}

// 4. Squint test: blur the page. The primary action and structure must still read.
{
  const page = await open({ width: 1280, height: 900 });
  await page.addStyleTag({ content: "body{filter:blur(6px)}" });
  await page.screenshot({ path: join(here, "squint-test.png"), fullPage: true });
  await page.close();
}

// 5. The same screen in every preset theme.
for (const theme of ["neutral", "classic", "editorial", "friendly", "technical", "glass"]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto(url + "?theme=" + theme, { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForSelector("h1");
  await page.screenshot({ path: join(here, `theme-${theme}.png`) });
  await page.close();
}

await browser.close();
console.log("screenshots → examples/*.png (desktop, mobile dark, errors, dialog, squint test, every theme)");
