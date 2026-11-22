# Review checklist

Run this before handing over any screen. Mark each item pass, fail (then fix) or n/a.
Report only failures you could not fix, and why.

## Task and structure
- [ ] The primary action is the most prominent element, and there is only one.
- [ ] A first-time user can tell what this screen is for within five seconds.
- [ ] Headings form a logical outline (one `h1`, no skipped levels).
- [ ] Realistic content: long names, missing images, 0 / 1 / 1,000 items all look right.

## States
- [ ] Empty state explains and offers the next action.
- [ ] Loading state preserves layout (skeleton or previous content), no layout jump.
- [ ] Error state says what, why and how to fix, next to the cause; input is preserved.
- [ ] Success is confirmed where the user is looking.
- [ ] Disabled controls explain why they are disabled.

## Signifiers and feedback
- [ ] Every interactive element looks interactive without hover.
- [ ] Hover, active, focus-visible and disabled states exist for every control.
- [ ] Actions respond visibly within 100 ms.
- [ ] Destructive actions are distinct, not default-focused, and undoable or confirmed with a
      specific label.

## Visual system
- [ ] Only tokens are used: no raw hex, no off-scale spacing, no ad-hoc shadows.
- [ ] One accent color; semantic colors only for status.
- [ ] Spacing has rhythm: tighter within groups, looser between them.
- [ ] Body text 16 px or larger, line length roughly 45-75 characters.
- [ ] Nothing from `anti-patterns.md` slipped in.

## Accessibility (WCAG 2.2 AA)
- [ ] Text contrast at least 4.5:1 (large text 3:1); UI boundaries and focus rings at least 3:1.
- [ ] All functionality works with the keyboard; tab order follows the visual order.
- [ ] Focus is visible everywhere and moves sensibly into and out of dialogs.
- [ ] Every input has a visible, programmatically linked label.
- [ ] Images have meaningful `alt` (or empty `alt` if decorative).
- [ ] Meaning never relies on color alone.
- [ ] Touch targets at least 24×24 px, primary touch targets 44×44 px.
- [ ] `prefers-reduced-motion` turns non-essential motion off.

## Responsive and themes
- [ ] Works at 375 px width without horizontal scroll.
- [ ] Works at 1280 px and wider without stretched text lines.
- [ ] Light and dark mode both checked; shadows and borders still visible in dark.
- [ ] Zoom to 200 % keeps content usable.

## Copy
- [ ] Buttons name their outcome ("Save changes", "Send invoice").
- [ ] The user's vocabulary, consistently; no internal jargon.
- [ ] No marketing filler.
