---
name: everyday-ui
description: Design and build user interfaces that are clear, accessible and distinctive instead of generic AI output. Use for any UI work - building screens, pages, components or flows, restyling or reviewing an existing interface, or setting up a project's visual foundation. Applies human-centered design principles (Norman, Nielsen, laws of UX), the Everyday UI design tokens and a build-then-review loop.
---

# Everyday UI

You are designing for people, not for a screenshot. Every interface you produce must let a
first-time user answer three questions without help: **What is this? What can I do here?
What just happened?** That is the core of human-centered design, and everything below
serves it.

## 0. Before anything: the project brief

Look for `everyday.md` in the project root.

- **Found:** read it. Its decisions (audience, tone, brand color, density, font) override the
  defaults in this skill.
- **Not found:** copy `templates/everyday.md` from this skill into the project root and fill in
  what the request and codebase already tell you. Ask the user at most **two** questions,
  only for things you cannot infer and that change the design (usually: who uses this, and
  one word for the feel). If the user is not available, choose sensibly, write your choices
  into the brief and say so.

Never re-decide the brief per screen. Consistency across a project beats a clever one-off.

## 1. Understand the task, not the layout

Write down (to yourself) before you draw anything:

1. **Who** is the user and what do they already know?
2. **Job:** what are they trying to get done on this screen? One sentence.
3. **Primary action:** the one thing most users come here to do.
4. **States:** empty, loading, partial, error, success, no permission. List the ones that apply.
5. **Content:** real or realistic content. Never design around lorem ipsum or "Item 1".

If you cannot name a primary action, the screen has a structure problem. Solve that first.

## 2. Build on the foundation

- **Tokens first.** Use the Everyday UI tokens (`@everyday-ui/tokens`, see
  `references/tokens.md`) or the project's own tokens if the brief names them. Do not type
  raw hex values, pixel spacings or ad-hoc shadows into components.
- **Stack.** Default stack is React + TypeScript + Tailwind v4. For React, follow
  `references/stack-react.md`. For other stacks, apply the same tokens and principles
  with that framework's idioms.
- **Semantic HTML before ARIA.** A `<button>` is a button. A link navigates. A form has
  labels.
- **Hierarchy by contrast in size, weight and space, not by color and boxes.** One primary
  button per view. Secondary actions look secondary.

## 3. Apply the principles

Read `references/principles.md` once per session. In short, for every interactive element:

| Principle | Ask |
| --- | --- |
| Affordance & signifier | Can I tell it is interactive, and how, without hovering? |
| Mapping | Does its position and form match what it controls? |
| Feedback | Does every action get a visible response within 100 ms? |
| Constraints | Does the UI prevent the wrong input instead of scolding it after? |
| Conceptual model | Would a user predict what happens next? |
| Consistency | Does the same thing look and behave the same everywhere? |
| Recovery | Can every destructive or costly action be undone or confirmed? |

## 4. Avoid the generic look

Check `references/anti-patterns.md`. The usual offenders: purple-to-blue gradients, every
card with the same rounded shadow box, emoji as icons, centered hero + three feature cards
by reflex, gray text on gray, glassmorphism as decoration, everything `rounded-2xl`, fake
dashboards full of meaningless charts. Distinctiveness comes from the brief: real content,
one confident accent, typographic rhythm, purposeful density.

## 5. Review before you hand over

Run `references/review-checklist.md` against what you built. Do it for real:

- Render it (browser, screenshot or preview) at **375 px** and **1280 px** wide, in light and
  dark mode, if you have any way to look at it.
- Tab through it with the keyboard.
- Trigger each state from step 1.

Fix what fails. Then report to the user in a few lines: what you built, the design
decisions that matter, and any checklist item you consciously left open and why.

## Scope notes

- **Reviewing existing UI:** skip steps 0-2 where the project already decides them; run
  sections 3-5 and report findings ordered by user impact, each with a concrete fix.
- **Tiny change (one button, one color):** keep to tokens and principles; skip the full review,
  but still check states and focus.
- **The user asks for something that breaks a principle** (e.g. "remove the focus ring"): say
  once, briefly, what it costs, offer the alternative, then do what they decide.
