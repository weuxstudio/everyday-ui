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
| Skill | `skills/everyday-ui/` | Instructions for the agent: workflow, principles, anti-patterns, review checklist |
| Tokens | `packages/tokens/` | Framework-agnostic design tokens (W3C DTCG format) built to CSS variables and a Tailwind v4 theme |
| React adapter | `packages/react/` | Accessible React + Tailwind components that only consume tokens |
| Project brief | `skills/everyday-ui/templates/everyday.md` | Per-project overrides: audience, tone, brand colors, density |

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
(`var(--eu-color-accent)`, `var(--eu-space-4)` …).

## Develop

```bash
npm install
npm run build       # builds tokens, typechecks the React adapter
npm run demo        # renders examples/demo.html for a visual check
```

## Roadmap

- [x] Skill: workflow, principles, anti-patterns, review checklist
- [x] Tokens: color (light/dark), type, space, radius, shadow, motion
- [x] React adapter: Button, Field, Card, Dialog
- [ ] More React components (Select, Tabs, Toast, Table)
- [ ] Svelte adapter
- [ ] Vue adapter
- [ ] Figma variables export from the same `tokens.json`

## License

MIT, see [LICENSE](LICENSE). Third-party notices: [docs/LEGAL.md](docs/LEGAL.md).
