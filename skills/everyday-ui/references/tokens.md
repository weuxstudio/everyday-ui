# Tokens

Default source: `packages/tokens/src/tokens.json` (W3C DTCG format). Project themes are generated
from it by the theme generator (see `onboarding.md`). All CSS variables are prefixed `--eu-`.
In a project with `everyday.theme.json`, import the generated folder instead of the package default.

## Setup in a project

**Tailwind v4 (default):**

```css
@import "tailwindcss";
@import "@everyday-ui/tokens/tailwind.css";
```

This replaces Tailwind's default palette, so only token colors exist (`bg-accent`,
`text-ink-muted`, `border-border-strong`). Typing `bg-purple-500` produces nothing: that is
intended.

**Plain CSS / any framework:** `@import "@everyday-ui/tokens/tokens.css";` and
`@everyday-ui/tokens/base.css`, then use `var(--eu-color-accent)` etc.

**JS:** `import { tokens, cssVar } from "@everyday-ui/tokens"`.

If the package is not installed, copy `tokens.css`, `base.css` and `tailwind.css` from this
skill's `assets/` folder into the project (e.g. `src/styles/everyday/`) and import from there.
Never re-type token values by hand.

## Color roles

| Token | Use for |
| --- | --- |
| `paper` | Page background |
| `surface` | Cards, dialogs, inputs |
| `sunken` | Wells, table stripes, dialog footers, hover on secondary |
| `ink` | Primary text |
| `ink-muted` | Secondary text, metadata, hints (AA-compliant, do not go lighter) |
| `border` | Dividers and card edges (decorative) |
| `border-strong` | Input boundaries, secondary buttons (3:1 non-text contrast) |
| `accent` / `accent-hover` / `accent-ink` | Primary action, links, selection. **One** accent per product. |
| `accent-subtle` | Selected rows, tinted info areas |
| `danger`, `success`, `warning` (+ `-subtle`, `-ink`, `-hover`) | Status only, never decoration |
| `focus` | Focus rings |
| `overlay` | Floating surfaces: dialogs, menus, popovers (translucent in glass themes) |
| `scrim` | Backdrop behind modals |
| `brand` | The brand color exactly as given; decoration only (illustration, highlights), never controls or text |

Every pairing above is contrast-checked when tokens build, in light and dark mode, against
**both** WCAG 2.2 AA ratios and APCA lightness contrast (Lc). The build fails if a change breaks
either. Run `npm run report -w @everyday-ui/tokens` for the full table, including pairs that pass
but sit below the preferred APCA level.

## Type

`text-xs` … `text-5xl` (12 · 14 · 16 · 18 · 22 · 28 · 36 · 48 · 64 px). Each size carries its own
line height and letter spacing. UI text is `text-base` (16 px); long reading `text-lg` (18 px).
Weights: `font-regular` and `font-semibold` (`font-bold` only for display sizes). There is no
medium weight on purpose.

## Space and size

8-point scale; use only these steps (CSS variable → Tailwind number):

| Step | px | CSS | Tailwind |
| --- | --- | --- | --- |
| 2xs | 4 | `--eu-space-2xs` | `1` |
| xs | 8 | `--eu-space-xs` | `2` |
| s | 16 | `--eu-space-s` | `4` |
| m | 24 | `--eu-space-m` | `6` |
| l | 32 | `--eu-space-l` | `8` |
| xl | 48 | `--eu-space-xl` | `12` |
| 2xl | 80 | `--eu-space-2xl` | `20` |

Half steps (`gap-1.5`, `py-2.5`) are for optical alignment inside components only.

Named sizes: `h-control-sm|md|lg` (36 / 44 / 48 px), `size-touch` / `min-h-touch` (48 px),
`max-w-measure` (68ch).

## Radius, shadow, motion

- Radius roles (set by the theme): `rounded-control` (buttons, inputs), `rounded-check`
  (checkboxes), `rounded-card`, `rounded-dialog`, `rounded-badge`. Use roles in components;
  `rounded-sm|md|lg|xl|full` remain for one-off shapes. Squircle themes apply CSS `corner-shape`
  to the roles where supported.
- Card padding follows density: `p-card`.
- Shadow: `shadow-sm|md|lg`, only for things that float (menus, popovers, dialogs).
- Motion: `transition-*` uses `--eu-duration-fast` and `--eu-ease-out` by default. Durations
  collapse to 0 under `prefers-reduced-motion`.

## Theming per project

Use the theme generator (`references/onboarding.md`): knobs in `everyday.theme.json` →
generated tokens, contrast-checked and auto-corrected. Don't override variables by hand unless the
knobs can't express a requirement; then override after the import and record why in `everyday.md`.

Dark mode follows the OS by default (`color.mode` knob can force light or dark).
`data-theme="light" | "dark"` on `<html>` or any element switches that subtree.
