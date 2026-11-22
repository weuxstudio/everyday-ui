# React + Tailwind v4

## Setup

```bash
npm install @everyday-ui/tokens @everyday-ui/react
```

```css
/* src/app.css */
@import "tailwindcss";
@import "./styles/everyday/tailwind.css";      /* the project's generated theme (everyday.theme.json → output) */
/* no theme yet? @import "@everyday-ui/tokens/tailwind.css"; */
@import "@everyday-ui/react/styles.css";
@source "../node_modules/@everyday-ui/react/src";
```

Load the font once (Hanken Grotesk, SIL OFL) or let it fall back to the system UI font.

If the packages are not available, copy the components from `packages/react/src` into the
project (`src/components/ui/`); they depend only on React and Tailwind.

## Components

| Component | Key behavior |
| --- | --- |
| `Button` | `variant`: primary / secondary / tertiary / danger. `size`: sm 36 (44 hit area) · md 44 · lg 48. `loading` keeps width and blocks repeats. `disabled` stays focusable (`aria-disabled`). `fullWidth="mobile"`. |
| `Field` | Label above; `hint` and `error` between label and input; `required` (*) / `optional`; `chars` matches width to expected input; error = icon + text + 2 px border + tint. |
| `Checkbox` | Positive phrasing; 48 px row; error above. For choices applied on submit. |
| `RadioGroup` | `<fieldset>` + `<legend>`; stacked options with optional hints. Use for ≤ ~10 options. |
| `Switch` | `role="switch"`; immediate effect only. |
| `Stepper` | − / + side by side, 48 px, typable value. Small numbers only. |
| `ErrorSummary` | Shown on submit; takes focus; links move focus to the fields. |
| `Badge` | Status pill in status tones; never the action color. |
| `Card` | Border, no shadow by default; `title`, `description`, `actions`. |
| `Dialog` | Native `<dialog>`; buttons left-aligned, most important first, stacked on phones. |

Build new components the same way: tokens only, semantic element first, every state designed
(hover, active, focus-visible, disabled, loading, error), labels and descriptions wired inside the
component.

## Form pattern

```tsx
<form noValidate onSubmit={validateAndSubmit}>
  <ErrorSummary errors={errors} />                    {/* focused on submit with errors */}
  <p className="text-sm text-ink-muted">Required fields are marked with an asterisk *</p>
  <Field id="email" label="Email" required type="email" autoComplete="email"
         error={errorFor("email")} />
  <Field id="postcode" label="Postcode" required chars={5} inputMode="numeric"
         autoComplete="postal-code" error={errorFor("postcode")} />
  <Button type="submit" variant="primary" fullWidth="mobile">Create account</Button>
</form>
```

`noValidate` turns off browser bubbles so validation runs on submit with your own messages.

## Conventions

- Function components, TypeScript, `forwardRef` for anything wrapping a native input or button.
- Props extend native attributes, so `aria-*`, `data-*` and handlers pass through.
- Class merging with the local `cx()` helper; variants as plain objects; no CSS-in-JS.
- IDs via `useId()`.
- No layout shift on state changes.
- Prefer the platform: `<dialog>`, `<details>`, `popover`, `inputmode`, `autocomplete`.
- Format numbers and dates with `Intl`, never by string concatenation.

## Page structure

- One `<main>`, one `h1`, landmarks for `<nav>`, `<header>`, `<footer>`; skip link on pages with
  navigation.
- Content width: `max-w-2xl` for forms and settings, `max-w-measure` for prose, wider only for
  tables and dashboards. Side padding `px-4` on phones, growing to `px-20` or a centered container.
- Sections `gap-12` to `gap-20`; groups inside `gap-6`; items inside groups `gap-2` to `gap-4`.
- Main layout on a 12-column grid at `lg` (`grid grid-cols-12 gap-8`), 4 columns on phones.
