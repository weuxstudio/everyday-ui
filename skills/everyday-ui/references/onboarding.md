# Onboarding: from a description to a design system

Every project gets its own look; the rules stay the same. The look is described by a few
**knobs** in `everyday.theme.json`. The theme generator turns them into tokens (CSS variables,
Tailwind theme), checks every color pair for contrast, fixes what fails, and renders a
specimen page to judge the result.

Run onboarding when a project has no `everyday.theme.json`, or when the user asks for a new
style, a rebrand, or "a design system".

## The generator

Zero dependencies, runs with plain Node 18+:

```bash
GEN="node <this skill>/theme-generator/bin/everyday-theme.mjs"   # or: npx everyday-theme (if @everyday-ui/tokens is installed)

$GEN presets                                   # list starting points
$GEN knobs                                     # list every knob and its values
$GEN init --preset editorial --accent "#1e5b4f" --name "Atlas" --out src/styles/everyday
$GEN set shape.corners squircle                # change one knob, rebuilds
$GEN build --report                            # rebuild, print the full contrast table
```

Output folder: `tokens.css`, `base.css`, `tailwind.css` (import this one), `theme.tokens.json`
(full DTCG token file, e.g. for Figma), `specimen.html` (light + dark preview), `THEME.md` (knobs,
notes, font setup). Never edit generated files; change knobs and rebuild.

## Presets (starting points)

| Preset | Feel | Typical use |
| --- | --- | --- |
| `neutral` | Calm, universal; warm off-white, cobalt, subtle radii | Default, tools, MVPs |
| `classic` | Professional, trustworthy; pure grays, navy, restrained | B2B, finance, public sector |
| `editorial` | Considered, literary; serif headlines, sharp, flat, spacious | Content, publishing, portfolios, premium |
| `friendly` | Warm, playful; rounded type, pill controls, springy motion | Consumer apps, education, community |
| `technical` | Dense, precise; cool grays, compact, minimal motion | Developer tools, dashboards, admin |
| `glass` | Light, layered; frosted overlays (contrast-safe), squircles | Modern SaaS, creative tools |

## Step 1 – Listen first, then ask what's missing

If the user already described the product and the feel, extract the answers; don't re-ask.
Otherwise ask **at most four questions in one go** (use a multiple-choice question tool if you
have one; users can always type their own answer):

1. **What are you building, for whom?** (free text; it decides density and tone)
2. **How should it feel?** Offer the presets as options with their one-line feel; allow up to
   three own words ("calm, premium, warm").
3. **Brand color?** A hex value, "use our logo color", or "suggest one".
4. **Light, dark, or both?** Plus anything to avoid ("no rounded corners", "not corporate").

## Step 2 – Translate words into knobs

Pick the closest preset, then override knobs. Common words:

| They say | Knobs |
| --- | --- |
| calm, quiet, focused | `depth: subtle`, `motion: minimal`, `color.tint: subtle` |
| trustworthy, professional, serious | preset `classic`; `color.neutral: neutral` |
| premium, luxury, refined | `type.display` serif (e.g. Fraunces), `density: spacious`, `depth: flat` or `subtle`, `type.headingWeight: 500`; dark mode as an option |
| playful, fun, friendly, approachable | preset `friendly`; `shape.radius: round` or `pill`, `motion: playful` |
| technical, dense, data, power users | preset `technical`; `density: compact`, `type.scale: compact` |
| modern, fresh, airy | `shape.radius: round`, `color.neutral: cool`, `surface: glass` (if they like glass) |
| bold, energetic, loud | `type.scale: dramatic`, `depth: dramatic`, a saturated accent |
| minimal, clean, Swiss | `depth: flat`, `shape.radius: sharp` or `none`, `color.tint: none` |
| warm, human, organic | `color.neutral: warm`, `color.tint: noticeable`, `shape.radius: soft` |
| cool, clinical, precise | `color.neutral: cool` |
| glassy, frosted, layered | `surface: glass` (see note below) |
| editorial, magazine, classic print | preset `editorial` |
| apple-like, soft corners | `shape.corners: squircle`, `shape.radius: round` |

Fonts: choose Open Font License faces with good UI legibility and full Latin Extended
(ä ö ü ß €). Good pairs: Hanken Grotesk; Source Sans 3; IBM Plex Sans + IBM Plex Mono;
Instrument Sans + Fraunces (serif display); Nunito (rounded); Plus Jakarta Sans; Public Sans;
Atkinson Hyperlegible (maximum legibility). Use a display face for headings only.

**Glass, honestly:** glassmorphism usually fails contrast. Here the generator raises overlay
opacity until text passes WCAG and APCA over the worst plausible backdrop, so the effect is
subtle (around 80 % opaque in light mode). Glass is for floating layers (dialogs, menus, sticky
bars), never for cards in the page flow, and it turns solid for people who ask for reduced
transparency. Over full-bleed photos, add a scrim.

## Step 3 – Generate and show

1. Write `everyday.theme.json` (closest preset + overrides, `name`, `output` folder).
2. Run the generator. Read the notes it prints: contrast auto-fixes, brand-color warnings
   (a red or green brand reads as error or success), squircle support, compact-density caveats.
   Pass the relevant ones on to the user in plain words.
3. Show `specimen.html` (screenshot it, or open it in a browser). If the brief allows two clearly
   different readings, generate **two directions** (e.g. `classic` vs. `editorial` with the same
   accent) into two folders and let the user pick.
4. Record the result in `everyday.md` → Visual decisions, and one line in the decisions log
   ("2026-11-22 – editorial preset, accent #1e5b4f, squircle corners – user wants premium, calm").

## Step 4 – Fine-tuning

Users refine with words; map each request to one knob, rebuild, show the specimen again.

| Request | Command |
| --- | --- |
| "rounder" / "less rounded" | `set shape.radius` one step along none → sharp → subtle → soft → round → pill |
| "squircle corners" / "normal corners" | `set shape.corners squircle` / `round` |
| "more compact" / "more airy" | `set density compact` / `spacious` |
| "flatter" / "more depth" | `set depth` along flat → subtle → soft → dramatic |
| "calmer" / "livelier animations" | `set motion minimal` / `playful` |
| "warmer" / "cooler" grays | `set color.neutral warm` / `cool` (or a hue number) |
| "more color in the grays" | `set color.tint noticeable` |
| "bigger headings" | `set type.scale` along compact → balanced → expressive → dramatic |
| "serif headings" | `set type.display "Fraunces"` and `set type.displayStyle serif` |
| "bolder headings" | `set type.headingWeight 700` |
| "dark by default" | `set color.mode dark` |
| "higher contrast" (accessibility focus, older audiences) | `set color.contrast high` |
| "glass" / "no glass" | `set surface glass` / `layered` |
| new brand color | `set color.accent "#hex"` |

Rules always win. If a request would break a rule (for example a light accent that fails contrast),
the generator adjusts and you explain the trade-off in one sentence. If the user insists on a
value the knobs can't express, override the CSS variable after the import in the app's CSS, and
record the reason in `everyday.md`; the review checklist still applies.

## Not a knob

Spacing steps, contrast minimums, target sizes, type sizes for body text, component behavior.
These are the system's guarantees; themes can't switch them off.
