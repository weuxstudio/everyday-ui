# @everyday-ui/lint

Checks the Everyday UI rules that are mechanical, so a review can spend its time on judgment
instead of `grep`. No dependencies; Node 18+.

```sh
npx everyday-lint src                 # or: node skills/everyday-ui/tools/lint/bin/everyday-lint.mjs src
npx everyday-lint src --max-warnings 0   # in CI
npx everyday-lint src --json          # machine-readable
npx everyday-lint --rules             # list rules
```

Scans `.css`, `.scss`, `.tsx`, `.jsx`, `.svelte`, `.vue`, `.html` (and `.ts`/`.js` for dialogs
and class strings). Skips `node_modules`, `dist`, `build`, `.svelte-kit`, `.next` and similar.

## Rules

| Rule | Severity | Finds |
| --- | --- | --- |
| `font-weight` | error | `font-weight` values and `font-*` classes outside the allowed weights: 400, 600 and the theme's heading weight (read from `everyday.theme.json`) |
| `spacing` | error / warning | margin, padding and gap off the 8-pt scale (4 · 8 · 16 · 24 · 32 · 48 · 80 px): raw `px`/`rem` (error), off-scale Tailwind steps like `gap-5`, `mt-10` (warning), `var(--…)` that isn't a spacing token (warning). Half steps (`gap-1.5`, `px-3`) are allowed inside component folders |
| `raw-color` | error | hex, `rgb()`, `hsl()`, `oklch()` … outside token files; Tailwind's default palette (`text-gray-500`, `bg-white`); arbitrary colour values (`bg-[#f00]`) |
| `native-dialog` | error | `confirm()`, `alert()`, `prompt()` (not when the file defines its own function of that name) |
| `disabled-submit` | warning | submit buttons with a `disabled` binding (`disabled={…}`, `:disabled`, `disabled`) – including implicit submits inside a `<form>` |
| `icon-button-name` | error | `<button>`/`<Button>` whose only content is an icon, without `aria-label`, `aria-labelledby`, `title` or visually hidden text |

Output: `file:line:col severity rule message → fix`. Exit code 1 on errors, or when warnings
exceed `--max-warnings`.

## Exceptions

Justify an exception where it happens:

```tsx
{/* everyday-lint-ignore-next-line spacing -- aligns with the 20 px icon + 8 px gap */}
<ul className="pl-7">
```

```css
.sr-only { margin: -1px; } /* everyday-lint-ignore spacing -- visually hidden pattern */
```

`everyday-lint-ignore-file <rule>` anywhere in a file switches a rule off for that file.
Without a rule name, the comment ignores all rules.

## Configuration

Optional `everyday.lint.json` in the project root:

```json
{
  "fontWeights": [400, 600],
  "extraTokenPrefixes": ["--app-space-"],
  "extraComponentPaths": ["/patterns/"],
  "extraTokenFiles": ["/design-system/"],
  "rules": { "disabled-submit": "error", "spacing": "warning" }
}
```

- Keys replace the defaults; `extra…` keys extend them (`extraTokenPrefixes`,
  `extraComponentPaths`, `extraTokenFiles`, `extraSpacingPx`, `extraTailwindSteps`).
- `rules`: set a rule to `"off"`, `"warning"` or `"error"`.
- Token files (default: `tokens.css`, `theme.css`, `tailwind.css`, `*.tokens.*`, `/tokens/`,
  `/themes/`) may hold raw colours and spacing.

## Limits

It reads text, not a syntax tree. Class names built at runtime, styles from CSS-in-JS
libraries and props passed through spreads aren't seen. The disabled-submit and icon-button
checks are heuristics. Treat it as a fast first pass before the review checklist, not as the
review.
