# Architecture

Everyday UI separates **what good design is** from **how a framework renders it**.

```
skills/everyday-ui/          principles, workflow, review         (no framework)
packages/tokens/             tokens.json → CSS / Tailwind / JS     (no framework)
                             + theme generator: knobs → tokens     (no framework)
packages/react/              React components                      (adapter)
packages/svelte/             Svelte 5 components                   (adapter)
packages/lint/               everyday-lint: mechanical rule checks (no framework, no deps)
packages/shots/              everyday-shots: review renders        (no framework; Playwright)
packages/vue/                Vue components                        (adapter, planned)
```

## Rules that keep it extensible

1. **Tokens are the only source of visual values.** Adapters never contain a hex value,
   pixel spacing, shadow or duration of their own.
2. **Component contracts are framework-neutral.** Each component has the same name, props
   (Svelte/Vue: same prop names), states and accessibility behavior in every adapter. The
   React implementation is the reference.
3. **The skill never assumes React.** It points to `stack-<framework>.md` for idioms; the
   principles and checklist apply to all.

## Themes

A theme only changes token values. Components read semantic tokens (radius roles, `p-card`,
`bg-overlay`, `font-heading`), so a new preset or a project theme restyles every adapter with no
code change. New look-and-feel options become new knobs in `lib/theme.mjs`, never component props.

## Adding an adapter (e.g. Svelte)

1. `packages/svelte/` with `package.json` named `@everyday-ui/svelte`, peer-depending on
   `@everyday-ui/tokens`, `svelte` and `tailwindcss`.
2. Port each component from `packages/react/src/components/`, keeping props, variants,
   class lists and ARIA wiring identical. The Tailwind classes transfer one-to-one.
3. Add `skills/everyday-ui/references/stack-svelte.md` (setup, conventions).
4. Mention the new reference in `SKILL.md` under "Build on the foundation".
5. Add a demo in `examples/` and screenshot it with `npm run demo`.

Order does not matter: React first then Svelte, or the other way round, works the same
because both only consume the tokens.

## Releasing

- Tokens and adapters are versioned independently (semver). A token rename is a major
  version; a token value change is a minor version.
- The plugin version in `.claude-plugin/plugin.json` follows the skill.
