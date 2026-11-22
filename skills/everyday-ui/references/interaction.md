# Interaction, states and the details that separate good from great

## Every view has states

Design each one explicitly; generated UI usually only has "happy path with perfect data".

| State | Rule |
| --- | --- |
| Empty (first use) | Explain what goes here and offer the action that fills it. Optionally an example. |
| Empty (no results) | Echo the query, suggest a fix (spelling, fewer filters), offer to clear filters. |
| Loading | < 300 ms: show nothing new. Known shape: skeleton. Unknown: spinner with text. Keep previous content while refreshing. |
| Partial | Some data failed: show what loaded, mark what didn't, offer a retry. |
| Error | What happened, what to do, a retry. Keep user input. |
| Success | Confirm in place; say what's next. |
| Offline / no permission | Say so plainly and what still works. |

## Response times

- < 100 ms: feels instant. Every press needs a visual response in this window.
- < 400 ms: keeps people in flow. Use optimistic updates for likely-to-succeed actions (toggle,
  like, reorder) and roll back visibly on failure.
- > 1 s: show progress. > 10 s: show progress with an estimate, let people leave and notify them.

## Feedback channels

- Inline, next to the cause, for anything that needs action.
- Toasts only for brief, non-critical confirmations ("Saved"), with undo where relevant. Never
  for errors that need a decision: they disappear before people can act.
- Announce dynamic results to screen readers (`aria-live="polite"`, `role="alert"` for errors).
- Avoid feedback noise: no toast for every autosave.

## Mobile

Phone apps add thumb reach, system back, sheets, safe areas and the on-screen keyboard: see
`mobile.md` and the `patterns/mobile-app` blueprint.

## Motion

See `motion.md`: when to animate, timing tokens, reduced motion, and which tool (CSS,
View Transitions, Motion, GSAP) for which job. In short: motion explains change, uses the theme's
durations, stays short, and disappears under `prefers-reduced-motion`.

## Progressive disclosure

- Show what most people need now; put advanced options one step away (accordion, "Advanced
  settings", a details page).
- Labels on disclosures are descriptive ("Benefits of a custom domain"), not "Show more".
- Don't hide what most people need; hidden is the same as missing for many users.

## Choices (Hick's law)

Fewer, clearer choices are faster: remove options that don't earn their place; group long lists
into categories; split complex choices into steps; recommend a default or mark the popular one.

## Touch, pointer, keyboard

- Hover is an enhancement, never the only way to reveal something (no hover on touch).
- Primary actions within thumb reach on phones (lower half); avoid tiny targets at screen edges.
- Every interactive element reachable and operable by keyboard; visible focus; logical order.
- Escape closes overlays; Enter submits forms; arrow keys move within composite widgets (tabs,
  menus, radio groups).
- Provide a "Skip to content" link on pages with repeated navigation.

## Navigation and orientation

- Users must always know: where am I (current item highlighted, page title), where can I go
  (visible navigation), how do I get back (back link, breadcrumbs).
- Navigation items, tabs and cards signal interactivity by shape and position; they don't need
  underlines. Text links in content do.
- Keep URLs meaningful and state in the URL (filters, tabs) so back and share work.

## Data display

- Tables for comparison: right-align numbers, `tabular-nums`, units in the header, left-align
  text, consistent decimal places.
- Show the number that answers the question first; details on demand.
- Charts: start bars at zero, label directly instead of legends where possible, never color
  alone, and include the numbers for screen readers (a table or summary).

## Internationalization (plan for it from day one)

- Text expands: German is often 30–40 % longer than English. Don't size buttons or columns to
  the English string.
- Format numbers, dates, currencies, plurals with `Intl` APIs, never by string concatenation.
- Use logical CSS properties (`ms-`, `me-`, `ps-`, `pe-`, `start`, `end`) so right-to-left
  works.
- Don't put text in images. Allow names without first/last split where possible.

## Ethics: no dark patterns

Good UX never works against the user. Don't: pre-tick consent or upsells, shame people for
declining ("No thanks, I don't like saving money"), hide the cancel path, add surprise costs at
the last step, disguise ads as content, or make rejecting cookies harder than accepting.
In the EU several of these are also legally restricted (GDPR consent rules, Digital Services
Act, consumer protection law).

## Accessibility beyond contrast

- Assistive technology to design for: screen readers (structure, names, order) and screen
  magnifiers (users see a small area: keep related things close, left edge strong, avoid
  far-right lone buttons).
- Comparable experience for everyone, not a separate "accessible version".
- Text resizable to 200 %, content reflows at 320 px width without horizontal scrolling.
- Accessible design helps everyone: bright sunlight, a broken arm, a toddler on one hip.
