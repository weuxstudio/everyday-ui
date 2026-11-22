# React + Tailwind v4

## Setup

```bash
npm install @everyday-ui/tokens @everyday-ui/react
```

```css
/* src/app.css */
@import "tailwindcss";
@import "@everyday-ui/tokens/tailwind.css";
@import "@everyday-ui/react/styles.css";
@source "../node_modules/@everyday-ui/react/src";
```

Load the font once (Hanken Grotesk, SIL OFL) or let it fall back to the system UI font.

If the packages are not available, copy the components from `packages/react/src` into
the project (`src/components/ui/`); they have no dependencies beyond React and Tailwind.

## Components available

| Component | Notes |
| --- | --- |
| `Button` | `variant`: primary / secondary / ghost / danger. `loading` keeps width and blocks repeat clicks. One `primary` per view. |
| `Field` | Label always visible, `hint` before errors happen, `error` with fix instructions, `optional` instead of required-asterisks. |
| `Card` | Border, no shadow by default. `title`, `description`, `actions` top-right. |
| `Dialog` | Native `<dialog>`: focus trap, Escape, focus return for free. Name the consequence in `description`; primary action last and labeled with its outcome. |

Build new components the same way: tokens only, semantic element first, every state
(hover, active, focus-visible, disabled, loading, error) designed. Add them to
`packages/react/src` and export them from `index.ts` if they are reusable.

## Conventions

- Function components, TypeScript, `forwardRef` for anything wrapping a native input or button.
- Props extend the native element's attributes, so `aria-*`, `data-*` and handlers pass through.
- Class merging with the local `cx()` helper. Variants as plain objects, no CSS-in-JS.
- IDs via `useId()`; label/description wiring is the component's job, not the caller's.
- No layout shift on state changes (loading, error messages appear below, not inline).
- Prefer the platform: `<dialog>`, `<details>`, `popover`, native form validation hooks.
- Accessible names on icon-only buttons (`aria-label`), `aria-hidden` on decorative icons.

## Page structure

- One `<main>`, one `h1`, landmarks for `<nav>`, `<header>`, `<footer>`.
- Content width `max-w-3xl` for forms and settings, `max-w-measure` for prose, wider only for
  tables and dashboards.
- Section spacing `gap-6` to `gap-10`; inside a group `gap-2` to `gap-4`.
