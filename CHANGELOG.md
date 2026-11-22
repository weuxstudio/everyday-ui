# Changelog

## 0.5.0 - 2026-11-22

- Motion guide (`references/motion.md`): when to animate, timing tokens, reduced motion, tool
  choice (CSS → @starting-style → View Transitions → Motion → GSAP per project, with license
  notes), patterns and anti-patterns.
- Tokens: `--eu-spring-bounce` and `--eu-motion-distance`, set by the `motion` knob
  (minimal 4 px / smooth 8 px / playful 12 px + bounce 0.3) and zeroed under reduced motion.
- Dialog enters and exits with CSS only (`@starting-style`, `allow-discrete`); `.eu-enter`
  utility; View Transition timing from the theme.
- Optional `@everyday-ui/react/motion` (Motion, MIT): `MotionProvider`, `Reveal`, `Collapse`,
  `AnimatedList`, `useViewTransition`, `useMotionTokens` (reads the theme live).
- Button labels keep visible and screen-reader-only parts in one accessible name.
- Motion showcase (`?pattern=motion`), tested in smooth, playful and reduced-motion modes.

## 0.4.0 - 2026-11-22

- Pattern library (`skills/everyday-ui/patterns/`): sign-up & onboarding, pricing, dashboard,
  settings, checkout, lists & tables. Each with a README (job, structure, rules, states, copy,
  what to avoid) and a working React blueprint that adapts to every theme.
- Checkout blueprint follows EU/German order-button rules ("order with obligation to pay").
- New components: PasswordField, SegmentedControl, ProgressSteps, EmptyState.
- Pattern gallery (`examples/patterns.tsx`, `?pattern=&theme=`), screenshots per pattern on
  desktop and phone (dark); blueprints are typechecked in the build.

## 0.3.0 - 2026-11-22

- Theme generator (`everyday-theme`): knobs for accent, neutral hue and tint, mode, contrast level,
  fonts (UI, display, mono), type scale, heading weight and tracking, radius, round or squircle
  corners, density, depth, surface (solid, layered, glass) and motion. Commands: presets, knobs,
  init, set (with +1/-1 steps), build. Writes CSS, Tailwind theme, DTCG tokens, specimen page and
  THEME.md with font self-hosting instructions.
- Six presets: neutral, classic, editorial, friendly, technical, glass.
- Contrast auto-fix: moves failing colors until WCAG 2.2 and APCA pass; glass opacity is computed
  against the worst plausible backdrop; warnings for very light brand colors and red/green brands.
- Tokens: `brand`, `overlay`, display font, heading weight, radius roles (control, check, card,
  dialog, badge), corner shape, overlay blur, card padding; reduced-transparency support;
  `data-theme` works on any element.
- Components use the semantic tokens, so every preset restyles them without code changes.
- Skill: onboarding reference (interview, words → knobs, fine-tuning), brief and theme in step 0.
- Demo: `?theme=<preset>` and screenshots of every preset.

## 0.2.0 - 2026-11-22

- Skill: new topic guides `layout.md`, `color.md`, `typography.md`, `copy.md`, `forms.md`,
  `buttons-and-actions.md`, `interaction.md`; working principles (rationale per detail, usability
  risk, interaction cost, cognitive load, 80/20); rewritten SKILL.md with routing table and the
  ten most-used rules; expanded anti-patterns and review checklist; squint test in the review loop.
- Tokens: APCA contrast check alongside WCAG 2.2 (52 pairs); dark-mode colors raised to pass APCA;
  8-pt spacing steps (2xs-2xl); control sizes 36/44/48 px, touch 48 px; medium weight removed;
  base styles underline links and use tabular figures in tables.
- React: Button gets primary/secondary/tertiary/danger, focusable aria-disabled, full width on
  mobile; Field gets required/optional marks, hint and error above the input, width by
  characters; new Checkbox, RadioGroup, Switch, Stepper, ErrorSummary, Badge; Dialog buttons
  left-aligned, most important first.
- Demo: validate-on-submit form, heavy-friction delete confirmation, screenshots incl. squint test.

## 0.1.0 - 2026-11-22

- Skill: workflow, principles (Norman, Nielsen, laws of UX, WCAG 2.2), anti-patterns,
  review checklist, project brief template.
- Tokens: color roles with light/dark values, type scale, spacing, sizes, radius, shadow,
  motion. Builds to CSS variables, Tailwind v4 theme and JS; contrast-checked (50 pairs).
- React adapter: Button, Field, Card, Dialog.
- Demo with screenshot review at 375 px dark and 1280 px light.
