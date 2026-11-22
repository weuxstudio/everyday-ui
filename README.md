# Everyday UI

**Interfaces that explain themselves.**

Everyday UI is an agent skill plus a small design system that gives every project a
considered, human-made interface instead of generic "AI slop". It is built on the
principles of human-centered design (Don Norman's *The Design of Everyday Things*,
Nielsen's heuristics, established laws of UX), turned into rules an AI agent can apply
and check.

You install it once. Every project after that starts from the same foundation:
principles, tokens, components, and a review loop.

## What's inside

| Layer | Path | What it is |
| --- | --- | --- |
| Skill | `skills/everyday-ui/` | Instructions for the agent: workflow, principles, and topic guides for layout, color, typography, copy, forms, buttons and interaction, plus anti-patterns and a review checklist |
| Tokens | `packages/tokens/` | Framework-agnostic design tokens (W3C DTCG format) built to CSS variables and a Tailwind v4 theme; every color pair checked against WCAG 2.2 and APCA |
| React adapter | `packages/react/` | Accessible React + Tailwind components (Button, Field, Checkbox, RadioGroup, Switch, Stepper, ErrorSummary, Badge, Card, Dialog) that only consume tokens |
| Theme generator | `packages/tokens/bin/everyday-theme.mjs` (also shipped inside the skill) | Turns a few knobs (accent, neutrals, fonts, radius, squircle corners, density, depth, glass, motion) into a complete, contrast-checked theme with a specimen page. Six presets. |
| Project brief | `skills/everyday-ui/templates/everyday.md` | Per-project product, tone, glossary and decisions |

```
            ┌──────────────────────────────┐
            │  Skill (principles + review)  │   framework-agnostic
            └──────────────┬───────────────┘
            ┌──────────────┴───────────────┐
            │   Tokens (tokens.json → CSS)  │   framework-agnostic
            └──────┬───────────┬───────────┘
          ┌────────┴──┐   ┌────┴──────┐   ┌───────────┐
          │   React   │   │  Svelte   │   │    Vue    │   adapters
          │ (v0.1)    │   │ (planned) │   │ (planned) │
          └───────────┘   └───────────┘   └───────────┘
```

Adapters never define their own colors, spacing or motion. They read the tokens. That is
what makes adding Svelte or Vue later a matter of porting components, not redesigning.

## Use it with Claude

**Claude Code (plugin):**

```bash
/plugin marketplace add <your-github-user>/everyday-ui
/plugin install everyday-ui@everyday-ui
```

**Any agent that reads skills** (Claude Code, Claude apps, other skill-compatible tools):
copy `skills/everyday-ui/` into your skills folder, e.g. `~/.claude/skills/everyday-ui/`.

Then, in a project, ask for UI work as usual: "build the settings page", "review this
screen". The skill kicks in, reads the project brief (`everyday.md` in the project root,
created on first use) and follows its build-then-review loop.

## Give each project its own look

The rules are fixed; the look is not. Describe it with knobs in `everyday.theme.json`, or let the
skill interview you ("calm, premium, warm, brand color #1e5b4f") and pick them:

```bash
npx everyday-theme presets                    # neutral, classic, editorial, friendly, technical, glass
npx everyday-theme init --preset editorial --accent "#1e5b4f" --out src/styles/everyday
npx everyday-theme set shape.corners squircle # fine-tune one knob at a time
npx everyday-theme set shape.radius +1        # one step rounder
npx everyday-theme set density -1             # one step more compact
```

Each build writes CSS variables, a Tailwind v4 theme, a full DTCG token file and `specimen.html`
(light and dark preview). Every color pair is checked against WCAG 2.2 and APCA; failing colors are
corrected automatically (a too-light brand color, translucent "glass" surfaces) and the generator
tells you what it changed.

## Use the tokens directly

```bash
npm install @everyday-ui/tokens
```

```css
/* app.css (Tailwind v4) */
@import "tailwindcss";
@import "@everyday-ui/tokens/tailwind.css";
```

Without Tailwind, import `@everyday-ui/tokens/tokens.css` and use the CSS variables
(`var(--eu-color-accent)`, `var(--eu-space-s)` …).

## Develop

```bash
npm install
npm run build       # builds tokens, typechecks the React adapter
npm run demo        # builds the demo and screenshots it: desktop, phone dark, errors, dialog, squint test
```

## Roadmap

- [x] Skill: workflow, principles, anti-patterns, review checklist
- [x] Topic guides: layout, color, typography, copy, forms, buttons & actions, interaction
- [x] Tokens: color (light/dark), type, 8-pt spacing, sizes, radius, shadow, motion
- [x] Contrast gate: WCAG 2.2 AA + APCA for every token pair
- [x] React adapter: Button, Field, Checkbox, RadioGroup, Switch, Stepper, ErrorSummary, Badge, Card, Dialog
- [x] Theme generator: knobs, six presets, contrast auto-fix, accessible glass, squircle corners, specimen
- [ ] Pattern library: proven layouts per use case (onboarding, pricing, dashboard, settings, checkout)
- [ ] More React components (Combobox/autocomplete, Tabs, Toast with undo, Table, multi-step form)
- [ ] Svelte adapter
- [ ] Vue adapter
- [ ] Figma variables export from the same `tokens.json`

## Credits and sources

Everyday UI stands on the work of others. Their ideas are summarized and reorganized here in our
own words; no text or images from these works are reproduced. Read the originals, they're worth it.

| Source | What it shaped |
| --- | --- |
| Don Norman, *The Design of Everyday Things*, revised edition, 2013 | Core principles: discoverability, affordances and signifiers, mapping, feedback, constraints, conceptual models, error handling |
| Adham Dannaway, *Practical UI*, 2022 ([practical-ui.com](https://www.practical-ui.com)) | Practical rules for layout and spacing, color palettes, typography, copywriting, forms and buttons |
| Jakob Nielsen, *10 Usability Heuristics*, Nielsen Norman Group | Heuristics behind the review checklist |
| Jon Yablonski, *Laws of UX* ([lawsofux.com](https://lawsofux.com)) | Fitts's, Hick's, Jakob's, Tesler's law and related effects |
| W3C, *WCAG 2.2* | Accessibility requirements and contrast ratios |
| Andrew Somers, *APCA* ([apcacontrast.com](https://apcacontrast.com)) | Perceptual contrast check in the token build |

## License

MIT, see [LICENSE](LICENSE). Third-party notices: [docs/LEGAL.md](docs/LEGAL.md).
