# Motion

Animation is part of the interface's language: it says *where something came from, where it
went, what changed, and that the system heard you*. Motion that says nothing is noise, and for
some people (vestibular disorders, migraine, attention difficulties) it is a barrier.

## When to animate

| Purpose | Examples | Rule |
| --- | --- | --- |
| **Feedback** | Button press, toggle, checkbox, saved tick | Instant (80–140 ms). Always. |
| **Continuity** | Dialog opening from its trigger, item removed and the list closing the gap, panel expanding | Short (140–340 ms). Shows cause and effect, keeps people oriented. |
| **State change** | Tab switch, filter applied, step change, theme switch | Cross-fade or View Transition; no travel. |
| **Attention** | A new error summary, a newly arrived item | Rarely, once, subtle. Never loop. |
| **Delight** | Success after a long flow, first project created | Rarely, at the peak or end of a flow, short, skippable. |

Don't animate: page loads of content people came to read, every list item on every render,
anything that delays input, text people are reading, scrolling itself (no scroll-jacking).

## Timing and easing

Use the theme tokens, never ad-hoc numbers. The `motion` knob (minimal / smooth / playful) sets
them all, and `prefers-reduced-motion` sets durations and travel to zero.

The three levels have clearly different characters, not just different speeds:

| | minimal | smooth (default) | playful |
| --- | --- | --- | --- |
| Character | Fades only, nothing travels | Short glide, no overshoot | Springs overshoot, pop-in, squishy press |
| `--eu-duration-instant` / `fast` | 50 / 90 ms | 80 / 140 ms | 120 / 180 ms |
| `--eu-duration-base` / `slow` | 140 / 200 ms | 240 / 360 ms | 360 / 520 ms |
| `--eu-motion-distance` (travel on enter) | 0 | 10 px | 24 px |
| `--eu-motion-scale` (enter starts at) | 1 | 1 | 0.9 |
| `--eu-spring-bounce` | 0 | 0 | 0.45 |
| `--eu-press-scale` (pressed control) | 1 | 0.98 | 0.94 |
| Fits | Finance, health, admin, dense tools | Most products | Consumer, education, creative, games |

Easing: `--eu-ease-out` for entering, `--eu-ease-in` for leaving, `--eu-ease-in-out` for moving
between two positions (playful uses overshooting curves). All of it drops to zero under
reduced motion.

See them side by side: `examples/dist/patterns.html?pattern=motion-compare` (with slow motion).

Rules:
- Exits are faster than entrances; people have already decided.
- Bigger things and longer distances take a little longer; tiny things are near-instant.
- Stagger only short sets (≤ 5 items, 30–50 ms apart); never stagger a long list.
- Animate `opacity` and `transform` (translate, scale). Avoid animating layout properties
  directly in CSS; use Motion's `layout` for that.
- Bounce and overshoot carry personality: fine for friendly, playful products; wrong for
  finance, health, or error states.

## Reduced motion

- Respect `prefers-reduced-motion`: the tokens do it for CSS and for Motion (durations 0, no
  travel, no bounce). Never override it.
- Replace movement with an instant change or a very short fade; keep state changes visible.
- Nothing essential may exist only as motion (e.g. "drag to reorder" needs buttons too).
- Auto-playing animation that runs longer than five seconds needs a pause control (WCAG 2.2.2).

## Choosing the tool

Use the lightest tool that does the job:

1. **CSS transitions with tokens**: hover, focus, press, color, small reveals. Components already
   do this.
2. **CSS `@starting-style` + `transition-behavior: allow-discrete`**: enter *and* exit for
   elements that appear and disappear (dialogs, popovers, menus, `display: none` toggles).
   The `Dialog` uses this; add `class="eu-enter"` for simple entrances. Unsupported browsers
   just show and hide.
3. **View Transitions API** (`useViewTransition()` or `document.startViewTransition`): switching
   between states or views (tabs, filters, list ↔ detail), shared elements via
   `view-transition-name`. Same-document transitions work in all major engines; cross-document
   (multi-page) ones in Chromium and Safari. Always a progressive enhancement.
4. **Motion** (`@everyday-ui/react/motion`, motion.dev, MIT): what CSS can't do well:
   exit animations in React (`Reveal`, `AnimatePresence`), height-auto expand/collapse
   (`Collapse`), lists that add, remove and reorder (`AnimatedList`, `layout`), gestures (drag,
   swipe), springs. Wrap the app in `MotionProvider` once.
5. **GSAP**: only per project, for marketing pages with complex timelines or scroll-driven
   storytelling. Free including plugins, but not open source and its license prohibits building
   visual no-code animation tools that compete with Webflow. Never a dependency of the core.
6. **Lottie or Rive**: illustrated animations (empty states, onboarding illustrations, success
   moments). Keep them short, give a static fallback for reduced motion.

## Patterns

| Situation | Do |
| --- | --- |
| Dialog, menu, popover | Fade + small rise in (base, ease-out); quicker fade out (fast, ease-in); backdrop fades |
| Inline message, revealed field | `Reveal`: fade + rise; the space opens without a jump |
| Accordion, "Advanced settings" | `Collapse` to natural height; chevron rotates with it |
| Item added / removed / reordered | `AnimatedList`: new item fades in, removed fades out, neighbours slide into place |
| Tabs, filters, segmented views | View Transition cross-fade; no sliding carousels |
| List ↔ detail | View Transition with a shared `view-transition-name` on the item's title or image |
| Loading → content | Skeleton, then cross-fade; keep the layout stable |
| Success at the end of a flow | One short checkmark or confetti-free emphasis; then get out of the way |
| Toggle, checkbox, button press | Instant feedback only (instant/fast tokens) |

## Avoid

- Animating everything on page load ("reveal on scroll" for every section).
- Parallax and scroll-jacking. Infinite pulsing, shimmering or floating decorations.
- Durations over ~400 ms for UI responses; animations that block clicks until they finish.
- Spinners for under a second; bouncy motion for errors or destructive confirmations.
- Library animations with hard-coded durations that ignore the theme and reduced motion.
