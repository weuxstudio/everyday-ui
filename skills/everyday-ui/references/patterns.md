# Patterns

Proven structures for recurring product screens. Each pattern folder in `patterns/` holds:

- `README.md` – the job, the structure, rules with reasons, states, copy, variants, what to avoid
- paired React and Svelte blueprints with shared examples in `data.ts`. Copy the entry for your framework and its local imports. The mobile shell uses shared HTML/CSS/JS.

## How to use

1. Find the pattern that matches the screen's job (table below). Read its README fully.
2. Copy the blueprint into the project and **adapt it to the real content and the brief**:
   rename, remove what doesn't apply, add what's missing. A blueprint is a starting structure,
   not a template to fill with placeholder text.
3. Keep the rules even when the layout changes. If the product needs to break one, write the
   reason in `everyday.md`.
4. Run the review checklist plus the pattern's own checks.

| Screen job | Pattern |
| --- | --- |
| Create an account, first-run experience, getting to value | `patterns/signup-onboarding` |
| Compare plans and choose one | `patterns/pricing` |
| See status at a glance, spot what needs attention | `patterns/dashboard` |
| Configure account, workspace or app | `patterns/settings` |
| Buy: delivery, payment, review, confirmation | `patterns/checkout` |
| Browse, search, filter, act on many records | `patterns/lists-tables` |
| Phone app: bottom navigation, bottom sheet, system back, agenda, detail screen | `patterns/mobile-app` |

## Combining patterns

Most products combine several: a SaaS app is usually sign-up → onboarding checklist → dashboard
→ lists → settings, with pricing and checkout around the upgrade. Keep navigation, page headers,
spacing and wording identical across them; that consistency is what makes a product feel designed.

## Shared page frame

All blueprints use the same frame so they combine cleanly:

- Page header: optional eyebrow (context), `h1`, one-sentence description, page-level actions
  right of the title on desktop, below it on phones.
- Content width: forms and settings `max-w-2xl`; dashboards and tables up to `max-w-6xl`;
  prose `max-w-measure`.
- Sections separated by `gap-12`; groups inside by `gap-6`.
