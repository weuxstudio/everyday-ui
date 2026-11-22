# Review checklist

Run this before handing over any screen. Mark each item pass, fail (then fix) or n/a.
Report only failures you couldn't fix, and why. Section references point to the rule.

## Task and structure (principles.md, layout.md)
- [ ] A first-time user can tell what this screen is for within five seconds.
- [ ] The primary action is the most prominent element, and there is at most one.
- [ ] Every element has a reason; nothing decorative competes with content.
- [ ] Headings form a logical outline (one `h1`, no skipped levels) and are descriptive.
- [ ] Realistic content: long names, missing images, 0 / 1 / 10,000 items, German-length strings.
- [ ] Squint test passes: blurred, the primary action and purpose still stand out.

## Layout and spacing (layout.md)
- [ ] Only spacing steps 4 · 8 · 16 · 24 · 32 · 48 · 80 px.
- [ ] Space within groups is smaller than space between groups (inside → out).
- [ ] Grouping uses proximity first; containers only where grouping was unclear.
- [ ] Things that look alike work alike; non-interactive things don't look like buttons.
- [ ] One alignment per component; text on a straight left edge; mixed sizes baseline-aligned.
- [ ] Actions sit next to what they affect; important content and actions are visible.
- [ ] Works at 375 px without horizontal scroll and at 1280 px+ without stretched lines.

## Color (color.md)
- [ ] Only tokens; one accent, used for interactive elements only.
- [ ] Headings and non-links are not in the accent color.
- [ ] Contrast: text 4.5:1 and APCA Lc 60+ (body 75+); controls and focus 3:1 and Lc 45+.
- [ ] Nothing relies on color alone (links underlined, errors with icon and text, status labeled).
- [ ] Status colors only for status. Text on images meets contrast.
- [ ] Dark mode checked separately: surfaces, borders and focus still visible.

## Typography (typography.md)
- [ ] Two weights (regular + semibold); sizes from the scale; ≤ 4 sizes per section.
- [ ] Body ≥ 16 px; long reading ≥ 18 px; line height ≥ 1.5; headings tighter.
- [ ] Lines 45–75 characters; long text left-aligned, never justified or centered.

## Copy (copy.md)
- [ ] Sentence case; no UPPERCASE except short labels.
- [ ] Concise, front-loaded, plain language; no unexplained abbreviations.
- [ ] Buttons are verb + noun; links name their destination (no "click here", no "learn more" ×3).
- [ ] Same word for the same thing everywhere; matches the glossary in `everyday.md`.
- [ ] Numbers as numerals, formatted for the locale; short strings without full stops.
- [ ] Errors say what happened and how to fix it; no blame, no "oops".
- [ ] German UI: `locale-de.md` checklist passes (du/Sie, test strings, formats, quotes).

## Forms (forms.md)
- [ ] One column; labels above inputs, close to them; checkboxes and radios stacked.
- [ ] Every field necessary; optional info as opt-in where possible.
- [ ] Required marked with *, optional with "(optional)", note at the top.
- [ ] Hints above the input; no placeholder used as a label.
- [ ] Field width matches the expected input.
- [ ] Right control per choice (radios ≤ 10, autocomplete for long lists, stepper for small numbers,
      checkbox on submit vs. switch for immediate effect); checkbox labels positive.
- [ ] `type`, `inputmode`, `autocomplete` set; paste allowed.
- [ ] Validation on submit: focused error summary with links, message above each field, input
      preserved; submit button never disabled.

## Buttons and actions (buttons-and-actions.md)
- [ ] Primary / secondary / tertiary distinguishable without color.
- [ ] Buttons left-aligned, most important first; stacked full width on phones.
- [ ] Targets ≥ 44 px (48 on touch), ≥ 8 px apart.
- [ ] No unexplained disabled buttons; if disabled, focusable with a visible reason.
- [ ] Destructive actions: undo, or friction matching the loss; trigger isn't red; confirmation
      names object, consequence and both outcomes.

## States and feedback (interaction.md)
- [ ] Empty, loading, partial, error, success states designed and reachable.
- [ ] Visible response < 100 ms; progress after 1 s; no layout jump while loading.
- [ ] Toasts only for non-critical confirmations; errors inline.
- [ ] Motion explains something, uses token durations, and stops under reduced motion.
- [ ] No dark patterns (pre-ticked boxes, confirmshaming, hidden cancel, surprise costs).

## Mobile (mobile.md)
- [ ] Primary action and navigation within thumb reach; ≤ 5 top-level destinations in a bottom bar with labels.
- [ ] System back, browser back and Escape close sheets, dialogs and menus before leaving the screen.
- [ ] Back returns with scroll position and input intact.
- [ ] Safe-area insets on top bar, bottom bar, sheets and landscape sides; full height with `100dvh`.
- [ ] Every gesture has a visible alternative; no hover-only information.
- [ ] Keyboard doesn't cover the focused field or the primary action; inputs ≥ 16 px.
- [ ] Focus rings visible inside clipped lists and cards (inset outline).
- [ ] Usable at 200 % system text size.

## Accessibility (WCAG 2.2 AA)
- [ ] All functionality works with the keyboard; tab order follows the visual order.
- [ ] Focus visible everywhere; moves into dialogs and back out; error summary takes focus.
- [ ] Every input has a programmatically linked label; errors linked via `aria-describedby`.
- [ ] Images have meaningful `alt` (empty if decorative); icon-only buttons have `aria-label`.
- [ ] Dynamic results announced (`aria-live` / `role="alert"`).
- [ ] Zoom to 200 % and reflow at 320 px keep content usable.
- [ ] `prefers-reduced-motion` and `prefers-color-scheme` respected.
