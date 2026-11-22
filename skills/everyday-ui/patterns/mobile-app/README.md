# Pattern: mobile app shell

**Job:** let people move between a few places they return to, see what's next, open one thing,
act on it and come back to exactly where they were – with one thumb, on any phone.

For native-feeling web apps (PWA, Capacitor, WebView) and phone-first products. The general
rules are in `references/mobile.md`; this pattern puts them together into one working screen set.

Blueprint (framework-neutral, plain HTML/CSS/JS on the theme tokens):

- `blueprint.html` – structure and markup
- `mobile-app.css` – styles, only `var(--eu-*)` tokens
- `mobile-app.js` – routing with real history, sheet as a history entry, agenda grouping

Open `blueprint.html` directly in a browser at 375 px. `?screen=detail` and `?sheet=1` open the
other states. Port it to React or Svelte by keeping the rules, not the DOM details; the React
and Svelte adapters have a `BottomSheet` component that follows the same rules.

## Structure

```
Top bar        back (sub-screens) · title once scrolled · ≤ 2 rare icon actions
Large title    top-level screens only
Week strip     7 days, today = label + outline, selected = filled
Agenda         day heading → list card (time · title · type label · who · status · chevron)
Bottom nav     4 destinations + 1 central creation action, icon + label, safe-area padding
───────────────
Detail screen  back "Agenda" → summary header (type, title, status, when/where/with)
               → participants → history → destructive action (tertiary, at the end)
               → sticky action bar with the one primary action
Bottom sheet   handle + title + close button → choices → closes on every "back"
```

## Rules and reasons

### Bottom navigation
1. **3–5 destinations, each a place**, with icon **and** label. Labels make first use possible
   without guessing; places (not actions) keep the bar's meaning stable.
2. **Selected = indicator shape + ink colour + `aria-current="page"`**, never colour alone.
3. **The central "+" is an action, not a tab.** It opens a sheet and returns. Justified only when
   creating is the main reason to open the app. It has a visible label ("New").
4. **Count badges only for things that need action**, capped ("99+"), included in the
   accessible name ("Inbox, 3 unread").
5. **Tapping the active tab scrolls to the top**; each tab keeps its own scroll position.
6. **Hidden only in focused flows** (here: the detail screen, which has its own action bar and back).

### Back button and history
7. **Every in-app navigation is a history entry**, so the system back gesture, the browser back
   button and the in-app back do the same thing.
8. **An open sheet is a history entry too.** Back closes the sheet instead of leaving the screen.
   The close button, Escape and the scrim all call `history.back()`, so there is one way out.
9. **Back restores the scroll position** of the previous screen and moves focus to its heading.
10. **Deep links get a parent:** opening `#/item/…` directly and pressing back goes to the agenda,
    not out of the app.

### Bottom sheet vs. dialog vs. screen
11. Sheet for short, contextual choices (here: what to create). Dialog for a blocking decision
    (cancel appointment). New screen for forms and anything with several steps.
12. Sheet: max 90 % height, grab handle **and** close button, content scrolls inside,
    `overscroll-behavior: contain`, bottom padding includes the safe-area inset.
13. Native `<dialog>` with `showModal()`: focus trap, Escape, inert background and focus return
    come from the browser. Focus starts on the sheet's title.

### Agenda
14. **Group by day headings** ("Wed 18 Nov · Today") instead of repeating the date in each row.
    Relative words ("Today", "Tomorrow") come in addition to the date, never instead.
15. **One chronological stream**: appointments, tasks and reminders merged by time; all-day
    items first. Type shown as icon + text label.
16. **Past items muted and marked "Done"**, not hidden: people check what already happened.
17. Day headings are sticky, so the context stays visible while scrolling a long day.

### Detail screen
18. **Summary header first**: type, title, status as a labelled badge, when/where/with. A person
    who reads only the header knows whether they need to act.
19. **One primary action in a sticky bar at the bottom**, full width, above the home indicator.
    It changes with the state ("Send reminder to Priya" while waiting, "Add a note" when confirmed).
20. **Destructive action at the end** of the page as a tertiary button, never next to the primary.

### Everywhere
21. **Safe areas:** top bar pads `safe-area-inset-top`, bottom nav, action bar and sheet pad
    `safe-area-inset-bottom`; `viewport-fit=cover`; full height with `100dvh`.
22. **Targets ≥ 48 px** (`--eu-size-touch`), whole rows tappable, `touch-action: manipulation`.
23. **Focus in clipped lists:** rows inside the rounded, `overflow: hidden` card use an inset
    focus ring (`outline-offset: -2px`), otherwise the ring is cut off.
24. **Scroll edge:** the top bar gets a border once content scrolls under it, and the small title
    appears when the large title has scrolled away.
25. **Translucent bottom bar** uses the theme's overlay colour and blur; under Reduce
    Transparency the theme makes it solid.

## States to design (not all are in the blueprint)

| State | What to show |
| --- | --- |
| Empty day | Day heading + "Nothing planned" + "New appointment" (tertiary) |
| Empty agenda (first use) | Empty state explaining what appears here, primary "Add your first appointment" |
| Loading | Skeleton rows of real height under real day headings; keep the week strip |
| Offline | Last loaded agenda stays, a banner "Offline · last updated 10:12", writes queued with a note |
| Item deleted elsewhere | Detail screen says so and offers "Back to agenda" |

## Copy

- Tab labels: one short noun. "Agenda", not "My agenda overview".
- Status in words: "Waiting for confirmation", "Confirmed" – no colour-only dots.
- Primary action names the outcome and, where natural, the person: "Send reminder to Priya".
- Times in the locale's format (24-hour in Germany: "14:00–15:00"; see `references/locale-de.md`).

## Variants

- **Platform-adaptive:** on Android use an arrow without the previous title in the back button,
  and a floating action button bottom-right instead of the central "+".
- **Tablet (≥ 600 px):** navigation rail on the left, agenda and detail side by side.
- **Month planning:** month grid instead of the week strip, when people plan weeks ahead.

## Avoid

- Hamburger menu for ≤ 5 top-level destinations.
- Icon-only tab bars, colour-only selected states.
- Sheets that don't close on back; stacked sheets; forms in half-height sheets.
- Primary actions in the top-right corner of a phone screen.
- Repeating the full date in every agenda row.
