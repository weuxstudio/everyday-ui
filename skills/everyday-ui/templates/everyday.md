# everyday.md - design brief for this project

<!-- Read by the Everyday UI skill before any UI work. Keep it short and current.
     Anything not set here falls back to the Everyday UI defaults. -->

## Product
- **What it is (one sentence):**
- **Primary users:** <!-- who, how experienced, what device, what context -->
- **Their main job here:**

## Feel
- **Three words:** <!-- e.g. calm, precise, warm -->
- **Not:** <!-- e.g. playful, corporate, techy -->
- **Reference products the users already know:** <!-- Jakob's law: borrow their conventions -->

## Visual decisions
<!-- The look lives in everyday.theme.json (knobs) and is generated; summarize it here
     in words so humans and future sessions know the intent. -->
- **Theme file:** everyday.theme.json → output folder: <!-- e.g. src/styles/everyday -->
- **Preset and why:** <!-- e.g. editorial: premium, calm, content-first -->
- **Accent (brand) color:** <!-- e.g. #1e5b4f; note if the generator darkened it for contrast -->
- **Fonts:** <!-- e.g. Instrument Sans (UI), Fraunces (headings), self-hosted via Fontsource -->
- **Shape, density, depth, surface, motion:** <!-- e.g. sharp · spacious · flat · solid · minimal -->
- **Mode:** <!-- follows OS | light | dark -->

## Content and language
- **Language(s) and locale:** <!-- e.g. de-DE: 1.000,50 € · 24.12.2026 -->
- **Address:** <!-- German: du or Sie, never mixed -->
- **Tone:** <!-- e.g. direct, friendly, no jargon -->
- **Glossary (one word per concept):** <!-- e.g. cart (not bag) · sign in (not log in) · delete = gone, remove = from list -->

## Layout rules
- **Content width:** <!-- e.g. forms max-w-2xl, prose max-w-measure -->
- **Spacing rules:** <!-- e.g. card padding m (24) · between cards l (32) · sections 2xl (80) -->
- **Button alignment:** left, most important first <!-- change only with a reason -->
- **Required/optional marking:** asterisk + "(optional)" <!-- or: all required, no marks -->
- **Validation:** on submit with error summary

## Constraints
- **Stack:** React + Tailwind v4 <!-- or Svelte, Vue, plain HTML -->
- **Accessibility target:** WCAG 2.2 AA
- **Other:** <!-- brand guidelines, legal requirements, performance budgets -->

## Decisions log
<!-- Date - decision - reason. Keeps future screens consistent. -->
