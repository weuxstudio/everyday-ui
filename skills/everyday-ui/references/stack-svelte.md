# Svelte (Svelte 5 + Tailwind v4)

Use the Svelte adapter `@everyday-ui/svelte` (in this repo: `packages/svelte/`). It carries the
same rules as the React adapter; read `stack-react.md` for the reasoning behind each component.

## Setup

```css
@import "tailwindcss";
@import "<theme output>/tailwind.css";          /* generated from everyday.theme.json */
@import "@everyday-ui/svelte/styles.css";
@source "../node_modules/@everyday-ui/svelte/src";
```

Components: `Button`, `Field`, `Checkbox`, `Switch`, `SegmentedControl`, `Dialog`, `BottomSheet`,
`EmptyState`, `ErrorSummary` (+ `RequirementMark`, `FieldHint`, `FieldError`).
State with `bind:` (`bind:value`, `bind:checked`, `bind:open`); rich content with snippets.

## Rules in Svelte terms

- **Runes only** in new code: `$state`, `$derived`, `$props`, `$bindable`, `$effect` for DOM
  sync only (open a dialog, move focus), never to derive state.
- **Ids** with `$props.id()`, so labels, hints and errors link correctly with SSR.
- **Classes** as arrays (`class={["base", cond && "x", className]}`), tokens only.
- **Forms:** `novalidate` + validate in `onsubmit`, show `ErrorSummary` and field errors; never
  bind `disabled` to the submit button's validity (`everyday-lint` flags it).
- **Sheets and back:** `BottomSheet` pushes a history entry while open. In SvelteKit you can
  model it as a route state instead (`pushState` / `page.state` shallow routing) and set
  `closeOnBack={false}`.
- **Transitions:** CSS first (`styles.css`). Svelte's `transition:` directives are fine for
  enter/exit of list items; read durations from the theme variables and respect
  `prefers-reduced-motion` (Svelte's built-in transitions don't on their own).
- **Missing components** (PasswordField, RadioGroup, Stepper, ProgressSteps, Badge, Card): port
  from the React source; class lists carry over one to one.
