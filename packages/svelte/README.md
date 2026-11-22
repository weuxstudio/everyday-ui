# @everyday-ui/svelte

Accessible Svelte 5 components for Everyday UI. Same rules as the React adapter; styling comes
only from the theme tokens (Tailwind v4 classes on `--eu-*` variables). Svelte ≥ 5.20 (runes,
`$props.id()`, class arrays).

## Setup

```css
/* app.css */
@import "tailwindcss";
@import "./styles/everyday/tailwind.css";        /* the generated theme from everyday.theme.json */
@import "@everyday-ui/svelte/styles.css";        /* dialog and sheet transitions */
@source "../node_modules/@everyday-ui/svelte/src";
```

```svelte
<script lang="ts">
  import { Button, Field, ErrorSummary, BottomSheet } from "@everyday-ui/svelte";
  let email = $state("");
  let open = $state(false);
</script>

<Field label="Email" type="email" autocomplete="email" required bind:value={email} />
<Button variant="primary" onclick={() => (open = true)}>Add appointment</Button>

<BottomSheet bind:open title="What do you want to add?">
  …
</BottomSheet>
```

Demo at phone width: `npm run demo:svelte` (from the repo root), then serve
`packages/svelte/demo/dist/` (ES modules need http, not `file://`), e.g.
`npx everyday-shots --serve packages/svelte/demo/dist /`.

## Components

| Component | Rules it carries |
| --- | --- |
| `Button` | primary / secondary / tertiary / danger by weight, not colour; `loading` keeps width and ignores repeat presses; `disabled` becomes `aria-disabled` (stays focusable); `sm` keeps a 44 px hit area; `fullWidth="mobile"` |
| `Field` | label above, hint and error above the input, `aria-describedby`, error = icon + text + border; `chars` matches width to the expected input; `bind:value` |
| `Checkbox` | positive label, takes effect on submit; error above; `bind:checked` |
| `Switch` | immediate effect, `role="switch"`, 48 px hit area; `bind:checked`, `onCheckedChange` |
| `SegmentedControl` | 2–4 modes that switch immediately, native radios (arrow keys); `bind:value` |
| `Dialog` | native `<dialog>`: focus trap, Escape, focus return; buttons by outcome, left-aligned, stacked on phones; `bind:open` |
| `BottomSheet` | native `<dialog>` at the bottom: handle + close button, ≤ 90 % height, safe-area padding; closes on Escape, scrim and **system/browser back** (history entry); `bind:open` |
| `EmptyState` | what goes here, why it's empty, the action that fills it |
| `ErrorSummary` | appears on submit, takes focus, links jump to the fields |
| `RequirementMark`, `FieldHint`, `FieldError` | building blocks for custom fields |

## Parity with the React adapter

Same class names, tokens, behaviour and accessibility. Differences follow each framework's idioms:

| | React | Svelte |
| --- | --- | --- |
| State | controlled / uncontrolled props (`checked` + `onCheckedChange`, `defaultChecked`) | `bind:` (`bind:value`, `bind:checked`, `bind:open`) plus the same callbacks |
| Rich content (icon, footer, action) | `ReactNode` props | snippets (`{#snippet footer()}…{/snippet}`) |
| Label, hint, error, title | `ReactNode` | `string` or a snippet |
| Close callback | `onClose` | `onclose` (plus `bind:open`) |
| `ErrorSummary` messages | `ReactNode` | `string` |
| CSS | `@everyday-ui/react/styles.css` | `@everyday-ui/svelte/styles.css` (generated from the React file, identical rules) |

Not yet in Svelte: `PasswordField`, `RadioGroup`, `Stepper`, `ProgressSteps`, `Badge`, `Card`
and the motion layer (`@everyday-ui/react/motion`). Until then, build them from the React
source: the class lists port one to one.

## Checks

`npm run check -w @everyday-ui/svelte` runs `svelte-check` with warnings as errors (part of the
repo's `npm run build`).
