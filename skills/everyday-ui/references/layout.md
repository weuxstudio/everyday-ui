# Layout and spacing

An interface is boxes inside boxes. Good layout makes the relationships between those
boxes obvious: what belongs together, what matters most, where to look next.

## Grouping: four tools, weakest to strongest

1. **Proximity** – related things sit close; unrelated things are farther apart. Usually enough.
2. **Similarity** – things that look alike are read as a set (and are expected to behave alike).
3. **Continuity** – things on one line or axis belong together (lists, rows, columns). Breaking
   the line ends the group or highlights an item.
4. **Common region** – a container (border, background, shadow) groups most strongly.

Use the weakest tool that makes the grouping unambiguous. Containers around everything create
clutter; try spacing first, then add a container only where grouping is still unclear (e.g. an
author name that could belong to the card above or below).

Corollaries:
- Things that look the same must work the same. A non-interactive icon must not look like a
  button; a badge must not look like a primary button (use a pill shape, a tint, no action
  color).
- Highlight one item in a set by making it slightly different (larger, bordered, labeled
  "Most popular"), not by changing everything.

## Visual hierarchy

Tools, roughly in order of strength: **size, color/contrast, weight, spacing, position, depth**.

Procedure for any screen:
1. Group related information into sections.
2. Order items inside each section, then the sections themselves, by importance.
3. Style by importance: the key item large/strong/dark; supporting items smaller, regular,
   `ink-muted`; labels that are obvious from context removed entirely.
4. Place the primary action where the eye and thumb already are; on mobile it can stick to the
   bottom edge, elevated.
5. **Squint test**: blur the screen (or step back). The most important element and the purpose of
   the screen must still be recognizable. If everything blurs into the same gray, hierarchy is
   missing.

People remember first and last items best (serial position): put key facts (like a price next to
"Book now") at those positions.

## Depth

- Elevation shows importance and layering: higher = closer = more prominent.
- Three shadow levels (`shadow-sm|md|lg`) are enough: small and sharp lifts slightly; large and
  soft floats (dialogs, menus).
- Light comes from above; shadows are tinted with the darkest neutral, not pure black.
- Lighter surfaces on darker backgrounds read as raised even without a shadow (white card on
  `sunken`). In dark mode, raise with lighter surfaces rather than shadows.

## Spacing system

8-point scale, named like t-shirt sizes. Use only these steps:

| Name | px | Tailwind | Typical use |
| --- | --- | --- | --- |
| 2xs | 4 | 1 | Label ↔ hint, icon ↔ text |
| xs | 8 | 2 | Label ↔ input, tightly related lines |
| s | 16 | 4 | Between fields, between buttons, list rows |
| m | 24 | 6 | Card padding, between groups in a section |
| l | 32 | 8 | Grid gutters (desktop), between cards |
| xl | 48 | 12 | Between sections |
| 2xl | 80 | 20 | Between major page sections, desktop side margins |

Rules:
- **Inside out**: start with the smallest space for the innermost box and increase as you move
  outward. Space between groups is always larger than space within them.
- Same relationship, same space, everywhere (consistency is rhythm).
- When in doubt, take the next step up. Generous white space makes grouping and hierarchy
  readable; cramped layouts hide both.
- Write spacing rules down per project in `everyday.md` (e.g. "cards: m padding; sections: 2xl").

## Grid

- Main layout on a 12-column grid on desktop, 8 on tablet, 4 on phone. Columns flex; gutters are
  fixed (32 px desktop → 16 px phone); outer margins grow with the screen (16 px phone → 80 px
  desktop, or a centered max-width container).
- Only the main containers align to columns; small elements inside use the spacing scale.
- Three cards in a row span 4 columns each on desktop and stack on mobile.

## Alignment

- Left-align by default. One strong left edge is the easiest thing to scan and the safest for
  screen-magnifier users, who see only a small part of the screen.
- Avoid mixing alignments inside one component (centered title, left text, right image).
  Centering is fine for short, isolated blocks (empty states, small promos) if everything in
  the block is centered.
- Keep text on a straight left edge even next to icons (put icons above, or hang them outside
  the text edge).
- Text of different sizes on one line aligns on the **baseline**, not the vertical center
  (`items-baseline`), e.g. "€20 /month".

## Proximity of actions (Fitts's law)

- Put actions next to the thing they act on (a filter above its list, "Add to cart" next to the
  quantity).
- Targets at least 48 × 48 px on touch (44 px minimum), at least 8 px apart (16 px safer).
- Small visual elements can have a larger invisible hit area; show the larger area (row
  highlight, border) where it helps people aim.
- In menus that open from a button, put the close control where the open control was.

## Keep important things visible

- Hidden means missing for many users. Show primary navigation and key actions when there is
  room; hide only what is secondary.
- If content must scroll horizontally, let the next item peek in so the overflow is discoverable.

## Make it unbreakable

- Design for real and extreme content: long names, 0 / 1 / 10,000 items, missing images,
  translated strings 30–40 % longer (German!).
- Let content wrap and reflow. Truncate only non-essential text; if you must truncate, keep the
  distinguishing part (truncate in the middle for file names and paths) and expose the full text.
- Mobile first: start at the smallest width. Constraints force prioritization, and the larger
  layouts stay simpler.

## Images

- Crop to the rule of thirds: place the subject on an intersection of the 3 × 3 grid, horizons on
  a third line.
- Reserve space with `aspect-ratio` so images don't shift the layout when they load.
