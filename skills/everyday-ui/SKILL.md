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

## 0. Before anything: the project brief

Look for `everyday.md` in the project root.

- **Found:** read it. Its decisions (audience, tone, accent, density, font, vocabulary) override
  the defaults in this skill.
- **Not found:** copy `templates/everyday.md` into the project root and fill in what the request
  and codebase already tell you. Ask the user at most **two** questions, only for things you
  can't infer and that change the design (usually: who uses this, and one word for the feel).
  If the user isn't available, choose sensibly, write the choices into the brief and say so.

Never re-decide the brief per screen. Consistency across a project beats a clever one-off.

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
| Forms, inputs, settings, checkout, sign-up | `references/forms.md` |
| Buttons, dialogs, destructive or disabled actions | `references/buttons-and-actions.md` |
| States, feedback, motion, navigation, tables, i18n | `references/interaction.md` |
| Setting up or changing tokens | `references/tokens.md` |
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
- **Components:** React adapter has Button, Field, Checkbox, RadioGroup, Switch, Stepper,
  ErrorSummary, Badge, Card, Dialog. Reuse before inventing; extend in the same style.

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
