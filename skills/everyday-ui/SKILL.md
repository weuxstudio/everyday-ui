---
name: everyday-ui
description: Design and build user interfaces that are clear, accessible and distinctive instead of generic AI output. Use for any UI work - building screens, pages, components, forms or flows, restyling or reviewing an existing interface, writing interface copy, or setting up a project's visual foundation. Applies human-centered design principles (Norman, Nielsen, laws of UX, WCAG 2.2 + APCA), the Everyday UI design tokens and a build-then-review loop.
---

# Everyday UI

You are designing for people, not for a screenshot. Every interface you produce must let a
first-time user answer three questions without help: **What is this? What can I do here?
What just happened?** Everything below serves that.

Have a reason for every detail. If you can't say what a color, line, size or position does for
the user, remove it or change it.

## 0. Before anything: brief and theme

Each project has two files in its root. The rules in this skill are fixed; these two decide what
the project is and how it looks.

| File | Holds | If missing |
| --- | --- | --- |
| `everyday.md` | Product, users, tone, glossary, layout decisions, decisions log | Copy `templates/everyday.md`, fill in what you can infer |
| `everyday.theme.json` | The look as knobs: accent, neutrals, fonts, radius, corners, density, depth, surface, motion | Run onboarding: `references/onboarding.md` |

- **Both found:** read them; they override this skill's defaults. Import the generated theme
  (the `output` folder in `everyday.theme.json`), never the package default.
- **Missing:** onboarding asks at most four questions in one go (product, feel, brand color,
  light/dark), turns the answers into knobs, generates and shows a specimen. If the user isn't
  available, choose the closest preset, say which and why, and carry on.
- **"Change the look"** ("rounder", "squircle", "warmer", "more compact", new brand color): change
  the knob with the generator's `set` command and rebuild. Don't edit generated CSS or hard-code
  values in components.

Never re-decide the brief or theme per screen. Consistency across a project beats a clever one-off.

## 1. Understand the task, not the layout

Before drawing anything, write down (to yourself):

1. **Who** is the user and what do they already know? What device, what situation?
2. **Job:** what are they trying to get done here? One sentence.
3. **Primary action:** the one thing most users come here to do (80/20: design for this first).
4. **Content:** real or realistic, including extremes (long names, 0 and 10,000 items,
   translations). Never lorem ipsum.
5. **States:** empty, loading, partial, error, success, no permission. List the ones that apply.

If you can't name a primary action, the screen has a structure problem. Solve that first.

## 2. Read the references for what you are building

Read `references/principles.md` once per session. Then load what the task touches:

| Building or reviewing… | Read |
| --- | --- |
| Anything visual | `references/layout.md`, `references/color.md`, `references/typography.md` |
| Any text in the UI (labels, buttons, errors, headings) | `references/copy.md` |
| A German interface (strings, dates, numbers, du/Sie) | `references/locale-de.md` |
| Forms, inputs, settings, checkout, sign-up | `references/forms.md` |
| Buttons, dialogs, destructive or disabled actions | `references/buttons-and-actions.md` |
| States, feedback, navigation, tables, i18n | `references/interaction.md` |
| Animation, transitions, choosing a motion library | `references/motion.md` |
| Phone apps (PWA, Capacitor, native), phone-first sites, iOS/Android reviews | `references/mobile.md` |
| A recurring screen: sign-up, onboarding, pricing, dashboard, settings, checkout, lists/tables, mobile app shell (bottom nav, sheets, agenda, detail) | `references/patterns.md`, then the pattern's README and blueprint |
| A new project's look, a rebrand, or style changes | `references/onboarding.md` |
| Token names and roles | `references/tokens.md` |
| React code | `references/stack-react.md` |

## 3. Build on the foundation

- **Tokens only.** Use the Everyday UI tokens (or the project's, if the brief names them). No raw
  hex, no off-scale spacing, no ad-hoc shadows, no extra font weights.
- **Mobile first.** Start at 375 px; the constraint forces priorities. Then widen.
- **Grayscale first.** Get grouping, spacing and hierarchy right without color; then add the one
  accent for actions and status colors for status.
- **Conventional patterns** (Jakob's law). Inputs look like inputs, links like links, checkboxes
  like checkboxes. Innovate only where the product is genuinely different.
- **Semantic HTML before ARIA.** A `<button>` is a button, a link navigates, inputs have labels.
- **Patterns before blank pages.** If the screen matches a pattern, start from its blueprint and
  adapt it to the real content; don't reinvent a checkout or a pricing page.
- **Components:** React adapter has Button, Field, PasswordField, Checkbox, RadioGroup,
  SegmentedControl, Switch, Stepper, ProgressSteps, ErrorSummary, EmptyState, Badge, Card,
  Dialog, BottomSheet. Reuse before inventing; extend in the same style.

## 4. The rules you'll apply most

1. One primary button per view; secondary = outlined, tertiary = underlined text.
2. Space inside groups < space between groups. 8-pt scale only (4 · 8 · 16 · 24 · 32 · 48 · 80).
3. Left-align text and actions; one alignment per component; body text 45–75 characters wide.
4. Body text ≥ 16 px (long reading ≥ 18 px), line height ≥ 1.5; two weights: regular + semibold.
5. Never color alone: links underlined, errors with icon + text + border, status with label.
6. Contrast passes WCAG 2.2 AA **and** APCA: text 4.5:1 / Lc 60+ (body Lc 75+), controls 3:1 / Lc 45+.
7. Targets ≥ 44 px (48 px on touch), ≥ 8 px apart. Actions next to what they affect.
8. Forms: one column, labels above, hints above the input, validate on submit with an error
   summary, mark required (*) and optional, no placeholder labels, no disabled submit.
9. Copy: sentence case, front-loaded, plain words, verb + noun buttons, descriptive links,
   errors that say how to fix.
10. Destructive actions: undo if possible; otherwise friction proportional to the loss.

## 5. Avoid the generic look

Check `references/anti-patterns.md`. Distinctiveness comes from the brief: real content, one
confident accent, typographic rhythm, purposeful density, and details with reasons.

## 6. Review before you hand over

Run `references/review-checklist.md` against what you built. Do it for real:

- Render it at **375 px** and **1280 px**, in light and dark mode, if you can look at it at all.
- **Squint test:** blur the screenshot (CSS `filter: blur(6px)`). The primary action and the
  purpose of the screen must still stand out.
- Tab through it with the keyboard; trigger each state from step 1, including validation errors.

Fix what fails. Then report in a few lines: what you built, the decisions that matter, and any
checklist item you consciously left open and why.

## Scope notes

- **Reviewing existing UI:** skip steps 0–3 where the project already decides them; run 4–6 and
  report findings ordered by user impact, each with the rule it breaks and a concrete fix.
- **Tiny change (one button, one string):** tokens and rules still apply; skip the full review,
  but check states, focus and copy.
- **The user asks for something that breaks a rule** (e.g. "remove the focus ring", "right-align
  the buttons"): say once, briefly, what it costs and offer the alternative, then do what they
  decide and record it in `everyday.md`.
- **Guidelines, not laws.** These rules work in most cases. When context clearly argues
  otherwise (an established platform convention, tested user evidence), follow the evidence and
  note the reason.
