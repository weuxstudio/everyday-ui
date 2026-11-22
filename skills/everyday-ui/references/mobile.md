# Mobile apps and phone-first web

Read this for anything that runs mainly on a phone: native-feeling web apps (PWA, Capacitor,
WebView), responsive sites whose users are mostly on phones, and reviews of iOS or Android
screens. The general rules still apply; this file adds what a small touch screen, a thumb and
the platform conventions change.

The platform guidelines are the authority for platform conventions: Apple's Human Interface
Guidelines (iOS 26/27, Liquid Glass) and Google's Material 3 (Expressive). This file condenses
the parts that matter in daily product work and adds Everyday UI's own rules. When a project
targets one platform only, follow that platform's convention where it differs from here and
note it in `everyday.md`.

## 1. Decide the platform stance first

Record it in the brief (`Platforms:`), because it changes many details below.

| Stance | When | Consequence |
| --- | --- | --- |
| **Platform-adaptive** | Native or Capacitor app in both stores, users live in one OS | Back affordance, sheet style, switch look, date pickers and haptics follow each OS |
| **One brand UI** | Web app or PWA, brand matters more than OS feel | One design everywhere, but system gestures, safe areas, keyboard and text size still follow the OS |

Never fight the system: the edge-swipe back on iOS, the back gesture on Android, the home
indicator, the status bar and system text size belong to the user, not to the app.

## 2. Reach: the thumb decides

People mostly hold a phone in one hand and tap with the thumb. The bottom half of the screen
is easy to reach, the top corners are hard.

- **Primary actions low.** The main action of a screen sits at the bottom (sticky action bar or
  full-width button at the end of the content), not in the top-right corner.
- **Navigation low.** Top-level destinations in a bottom navigation bar, not in a hamburger
  menu, as long as there are five or fewer.
- **Destructive actions away from the easy zone** and never next to the primary action without
  space (≥ 16 px) or a different weight.
- **Top bar for orientation:** title, back, and at most two icon actions that are used rarely
  (share, more). Search can sit at the top because it opens the keyboard anyway.
- **Large phones:** don't put essential controls only in the top 20 % of the screen.

## 3. Navigation

### Bottom navigation (tab bar)

- **3 to 5 destinations**, each a place the user returns to, not an action. Fewer than 3: use
  tabs or a single screen. More than 5: group, or use a "More" destination.
- **Icon + visible label** on every item. Labels are one short noun ("Today", "Inbox",
  "Account"). Icon-only bars fail first-time users (recognition over recall).
- **Selected state not by colour alone:** filled icon or indicator shape plus colour, and
  `aria-current="page"`.
- **Stable:** same items, same order on every top-level screen. Don't hide the bar on top-level
  screens; hide it only in focused flows (checkout, compose) that have their own exit.
- **Tapping the active tab** scrolls its screen to the top or returns to the tab's root.
- Each tab keeps its own history and scroll position when the user switches away and back.
- iOS 26/27 floats the tab bar as glass and may minimise it on scroll; a web app doesn't need to
  copy that, but it must keep content readable under any translucent bar (section 9).

### A central primary action ("+")

Justified only when one creation action is the main reason to open the app (new entry, new
post, scan) and it is used often. Then:

- It is a **real action**, not a destination: it opens a sheet or a creation screen and returns
  to where the user was.
- Give it an accessible name ("New appointment") and a visible label or a tooltip-free
  meaning; a lone "+" is acceptable only when the creation object is obvious from the app.
- One per app. If several things can be created, the "+" opens a short sheet to pick one.
- Alternative: Material's floating action button bottom-right, above the navigation bar.

### Badges

- A count badge only when the count asks for action (unread messages, tasks due). Never for
  marketing ("New!") or totals.
- Cap the number ("99+"), and give the item an accessible name that includes the count
  ("Inbox, 3 unread"). A dot without number only for "something new here", sparingly.
- Clear the badge when the user has seen the items, not when they opened the app.

### Top bar and back

- Every screen below the top level has a visible back affordance in the top-left.
  iOS style: chevron + title of the previous screen when it fits; Android style: arrow.
- The screen title says where the user is; on top-level screens a large title that collapses
  on scroll is a good default.
- **Back means back:** it returns to the previous screen with its scroll position and input
  intact, never to the home screen, never to a different tab.

## 4. System back button and gestures

Android's back gesture/button, iOS's edge swipe, the browser back button and the Escape key
all mean "undo the last navigation step". Make them behave the same.

- **An open sheet, dialog, menu or full-screen image closes on back** instead of leaving the
  screen. In web apps, push a history entry when it opens (`history.pushState` or the router's
  shallow routing) and close it on `popstate`; closing it with its own button calls
  `history.back()` so the history stays clean.
- **Unsaved input:** back on a form with changes asks once ("Discard draft?" with "Keep editing"
  and "Discard"), or better, keeps the draft and says so.
- **Don't trap:** back from the first screen of the app leaves the app (Android) or does
  nothing; never a "Press again to exit" toast unless data would be lost.
- Deep links open the target screen with a sensible back path (to its parent, not to nothing).

### Gestures

- Every gesture has a **visible alternative**: swipe-to-delete also in a "More" menu or edit
  mode; pull-to-refresh also triggers on screen focus or with a refresh button on desktop.
- Don't claim the screen edges: horizontal swipes from the edge are the system's back.
- Swipe actions in lists: at most one per side, labelled with text (and icon), the destructive
  one with undo.
- Long press only for shortcuts, never as the only way to an action.

## 5. Sheets, dialogs or a new screen

| Use | When | Rules |
| --- | --- | --- |
| **Bottom sheet** | A short, contextual task or choice that keeps the screen behind it relevant: filter, pick, quick add, share, actions on an item | Max height about 90 % so the screen behind stays visible; grab handle **and** a visible close button; content scrolls inside, header and action bar stay; closes on back, Escape and (if nothing would be lost) tap on the scrim |
| **Dialog** | A decision that must be made before going on: confirm a destructive action, resolve a conflict | Short: title, one sentence, two outcomes; never forms longer than one field |
| **New screen** | Multi-step tasks, long forms, content people want to share or return to (has its own URL) | Full-screen with back; on iOS a full-screen modal with "Cancel" for creation flows |

- **Sizes (detents):** a sheet that starts at half height and expands to full is fine for
  lists of options; don't start forms at half height (the keyboard will cover them).
- **Action bar inside a sheet:** primary button at the bottom, full width, above the safe area.
- **Focus:** moves into the sheet on open (to the title or the first control), is trapped while
  it is modal, and returns to the trigger on close. A native `<dialog>` opened with
  `showModal()` does most of this.
- **Non-modal sheets** (map apps, players) don't trap focus and don't dim the background.
- **Never stack sheets.** If a sheet needs another sheet, the task deserves a screen.

## 6. Safe areas, viewport and system UI

- Set `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
  and pad edge-touching bars with `env(safe-area-inset-top | right | bottom | left)`:
  top bar gets the top inset, bottom navigation and sheets the bottom inset, landscape layouts
  the side insets. Add the inset to the normal padding: `calc(var(--eu-space-s) + env(safe-area-inset-bottom))`.
- Full-height layouts use `100dvh` (dynamic viewport), not `100vh`, which ignores the
  collapsing browser bars.
- `overscroll-behavior: contain` on sheets and inner scroll areas, so scrolling them doesn't
  scroll or refresh the page behind.
- Status bar: matching `theme-color` meta for light and dark; content under a translucent
  status bar needs the top inset.
- Never allow `user-scalable=no` or `maximum-scale=1`: zoom is an accessibility feature.

## 7. Touch targets and input

- **Targets:** at least 44 × 44 pt (iOS) / 48 × 48 dp (Android); Everyday UI uses
  `--eu-size-touch` (48 px) for touch. Small visual elements get an invisible hit area
  (`::after` with negative inset), and adjacent targets keep ≥ 8 px between hit areas.
- **Whole rows are tappable** in lists that navigate; a chevron shows that a row opens something.
- **No hover-only information.** Tooltips, hover menus and hover previews don't exist on touch;
  put the information on the screen or behind a tap.
- `touch-action: manipulation` on controls removes double-tap-zoom delays; don't disable text
  selection globally, only on controls.
- **Feedback within 100 ms** on every press (pressed state from the theme's `--eu-press-scale`
  or a background change). The native tap highlight can be replaced, not just removed.

### Keyboard on screen

- Right keyboard per field: `type`, `inputmode` (`numeric`, `decimal`, `tel`, `email`,
  `search`), `autocomplete` (including `one-time-code` for SMS codes), and `enterkeyhint`
  (`next`, `search`, `send`, `done`).
- Inputs at least 16 px font size, otherwise iOS Safari zooms in on focus.
- The focused field and its error stay visible above the keyboard (`scrollIntoView` on focus,
  or `interactive-widget=resizes-content` in the viewport meta where supported).
- The primary action of a form stays reachable while the keyboard is open (at the end of the
  form or in a bar that sits above the keyboard), never hidden behind it.
- Don't open the keyboard automatically on screen entry, except on a dedicated search screen.

## 8. Text size, density and content

- **Respect the user's text size.** Sizes in `rem`, layouts that grow with text; test at 200 %
  (iOS Dynamic Type "accessibility" sizes, Android font scale). Truncate only with a way to see
  the full text; prefer wrapping.
- Body text 16–17 px on phones (iOS body is 17 pt, Material body 16 sp); secondary text never
  below 13 px.
- One column. Cards full width minus 16 px gutters; no side-by-side cards below 600 px unless
  they are small, equal tiles.
- **Grouping by headings**, not by repeating context: an agenda groups appointments under day
  headings ("Wed 18 Nov") instead of printing the date in every row.
- Truncated lists say how many more there are ("Show all 24").

## 9. Glass, translucency and depth (2026)

Apple's Liquid Glass (iOS 26, refined in iOS 27) and Material 3 Expressive's blurred surfaces
make translucent bars and sheets common. Apple had to add a user control for it in iOS 27
(from clear to fully tinted) because readability suffered. Design for both ends:

- Text and icons on glass must pass contrast against the **worst realistic backdrop** (busy
  content, photos), not against an empty background. Everyday UI's generator checks glass
  against a blurred-content backdrop; keep that gate on.
- Respect **Reduce Transparency** (`prefers-reduced-transparency`) and **Increase Contrast**
  (`prefers-contrast: more`): glass becomes solid, borders become stronger. The theme does the
  first automatically.
- Content scrolling under a translucent bar needs a scroll-edge treatment (fade or solid
  backing) so text under the bar never mixes with the bar's labels.
- Glass for **controls and navigation layers** (bars, sheets, floating buttons), not for
  content (cards, lists, text blocks). No glass on glass.
- When in doubt, choose `surface: layered` instead of `glass`.

## 10. Motion and haptics

- Use the platform's spatial model: drilling down pushes in from the trailing edge, back
  slides out; sheets rise from the bottom and go back down; dialogs fade and scale slightly.
  Motion explains where things came from and went (see `motion.md`).
- Springs feel native on both platforms (Material 3 Expressive is spring-based; iOS uses springs
  throughout). The theme's `motion: smooth` or `playful` level maps to that.
- Shape morphing and emphasized typography (Material 3 Expressive) are for **key moments**
  (a completed task, the main action), not for every element.
- **Haptics** (native or Capacitor): light impact for a selection change, success/warning
  notifications for completed or failed important actions, nothing for ordinary taps or
  scrolling. Haptics support visible feedback, never replace it, and follow the system setting.
- All of it stops under reduced motion; haptics follow the system setting.

## 11. Lists, agenda and detail screens

### Lists

- Row height ≥ 48 px; primary text first, secondary text below in muted ink; trailing value
  or status right-aligned; chevron for rows that navigate.
- Sticky section headers for long grouped lists.
- **Focus in clipped containers:** lists inside `overflow: hidden` or rounded cards cut off
  outside focus outlines. Use an inset outline on rows (`outline-offset: -2px`) or padding
  around the list so the ring stays visible.
- Empty, loading (skeleton rows of the real height) and error states per list.

### Agenda and calendar

- **Week strip** (seven days, today marked) above an agenda list for "what's next" apps; **month
  grid** only when people plan by month (shifts, bookings). Don't show both at full size.
- Days as headings with weekday and date ("Wed 18 Nov"; German "Mi 18.11."); relative words
  ("Today", "Tomorrow") in addition, not instead.
- One chronological stream: different item types (appointments, tasks, reminders) merged by
  time, distinguished by a label or icon plus text, not only by colour.
- Today is marked with a label or shape, not only colour; past items are muted, not hidden.
- Times in the locale's format; all-day items before timed items.

### Detail screen

- **A header that summarises the state** before the details: what it is, who, when, status
  (as a labelled badge), and the one primary action. A person who only reads the header knows
  whether they need to do something.
- Then sub-items (participants, line items, history) as grouped lists.
- Secondary actions in a "More" menu; destructive action at the end of the page or in the menu,
  never in the header next to the primary action.

## 12. Permissions, onboarding and offline

- **Ask for permissions in context**, when the user starts the feature that needs it, after a
  one-sentence explanation of the benefit in the app's own UI. Never several system prompts at
  launch. If denied, the feature says what it can't do and links to the system settings.
- Onboarding: value first, ask for sign-up as late as possible, always a way to skip. No
  carousels of feature slides; teach in context instead (empty states, a first-run hint).
- Notifications: see `notifications.md`.
- **Offline and flaky networks** are normal on phones: keep the last content visible, mark it
  as not current, queue writes where it's safe and say so ("Saved on this phone, will sync").

## 13. Larger screens: tablets and foldables

Material's window size classes are a good default for breakpoints: compact (< 600 dp), medium
(600–839 dp), expanded (≥ 840 dp).

- Compact: bottom navigation, one column.
- Medium: navigation rail on the side, two columns where content allows (list + detail).
- Expanded: rail or sidebar, list–detail side by side; never just the phone layout stretched.
- Support both orientations unless the task truly needs one (camera, video).

## Mobile review (add to the checklist when `Platforms` includes phone)

- [ ] Primary action and navigation within thumb reach; top-level destinations ≤ 5 in a bottom bar with labels.
- [ ] System back, edge swipe, browser back and Escape close sheets, dialogs and menus before leaving the screen.
- [ ] Back returns with scroll position and input intact; unsaved input is kept or confirmed.
- [ ] Safe-area insets on top bar, bottom bar, sheets and landscape sides; `100dvh` for full height.
- [ ] Targets ≥ 48 px with ≥ 8 px gap; no hover-only information; every gesture has a visible alternative.
- [ ] Keyboard: right `inputmode`/`autocomplete`/`enterkeyhint`; inputs ≥ 16 px; field and primary action not covered.
- [ ] Works at 200 % text size without clipped or overlapping text.
- [ ] Focus rings visible inside clipped lists and cards.
- [ ] Glass/translucent layers readable over busy content and solid under Reduce Transparency.
- [ ] Permissions asked in context with an explanation; denied state handled.

## Sources

- Apple, *Human Interface Guidelines* (layout, navigation, tab bars, sheets, materials, accessibility), developer.apple.com/design/human-interface-guidelines, and the iOS 26/27 Liquid Glass updates (WWDC 2025 and 2026).
- Google, *Material Design 3* and *Material 3 Expressive* (navigation bar and rail, bottom sheets, window size classes, motion), m3.material.io.
- Steven Hoober, research on how people hold and touch phones (thumb reach).
- W3C, *WCAG 2.2*: 2.5.8 Target Size, 1.4.4 Resize Text, 1.4.10 Reflow, 2.5.1 Pointer Gestures.
- Rules are paraphrased and extended; no text or images from these sources are reproduced.
