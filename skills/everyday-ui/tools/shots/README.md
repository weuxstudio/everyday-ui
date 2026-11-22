# @everyday-ui/shots

The renders the Everyday UI review asks for, for any project, in one command: 375 px and
1280 px, light and dark, the squint test, a keyboard focus pass, reduced motion and 200 % zoom,
collected in an HTML contact sheet with the findings a screenshot doesn't show.

Needs Playwright (`npm i -D playwright && npx playwright install chromium`); it is resolved
from your project, so the tool itself has no dependencies.

```sh
# a running dev server
npx everyday-shots http://localhost:5173 / /settings /checkout

# a built site or a folder of HTML files (serves it on a free port, SPA fallback to index.html)
npx everyday-shots --serve dist / /about

# from the skill, without npm
node <skill>/tools/shots/bin/everyday-shots.mjs http://localhost:5173 /

# flags
--light-only         projects that ship light only (brief: "Themes: light only")
--only phone         one viewport
--dpr 2              sharper images for people; 1 (default) is faster for agents
--out <dir>          output folder (default ./everyday-shots)
--config <file>      config file (default ./everyday.shots.json)
```

Open `everyday-shots/index.html`.

## What you get per route

| Shot | Why |
| --- | --- |
| phone 375 px and desktop 1280 px, light and dark | The two widths and both modes the checklist asks for |
| squint (`filter: blur(6px)`) | The primary action and the screen's purpose must still stand out |
| keyboard (Tab × N) + tab order list | Focus visible and order logical; stops without a visible focus style are marked ⚠ |
| reduced motion | The page with `prefers-reduced-motion: reduce` |
| 200 % zoom (desktop) | Half the CSS width at double density, as browser zoom does; horizontal scroll is reported |

**Automatic findings** in the contact sheet and `report.json`: horizontal scroll, targets
under 24 px (WCAG 2.5.8; inline text links exempt), buttons and links without an accessible
name, missing `lang`, not exactly one visible `h1`, console errors and uncaught exceptions.

## Config

`everyday.shots.json` in the project root:

```json
{
  "baseUrl": "http://localhost:5173",
  "routes": [
    "/",
    { "path": "/settings", "name": "settings", "waitFor": "main h1" },
    { "path": "/checkout", "name": "checkout-errors", "actions": [{ "click": "text=Continue" }, { "wait": 300 }] }
  ],
  "viewports": { "phone": [375, 812], "desktop": [1280, 800] },
  "schemes": ["light", "dark"],
  "variants": ["squint", "keyboard", "reduced-motion", "zoom"],
  "keyboardTabs": 8,
  "init": "scripts/shots-init.js",
  "mocks": "mocks/shots.json"
}
```

- **`actions`** per route reach states: `click`, `fill: [selector, value]`, `press`, `wait` (ms).
  Use them to render validation errors, open dialogs or sheets.
- **`init`**: a script run before the page's own scripts, e.g. to sign in for screenshots:
  `localStorage.setItem("token", "demo")`. Use demo credentials only, never real ones.
- **`mocks`**: render without a backend. Keys are URL globs, values `{ "json": {…} }`,
  `{ "file": "user.json" }` or `{ "status": 500 }` (to render error states):

  ```json
  { "**/api/me": { "json": { "name": "Mara Lindqvist" } }, "**/api/invoices*": { "file": "invoices.json" } }
  ```

Full-page shots capture fixed bars (bottom navigation, sticky action bars) at their position in
the first viewport; the squint, keyboard and reduced-motion shots are viewport-sized and show them
where people see them.
