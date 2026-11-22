# Color

Color is information, not decoration. Every color on screen should answer "what does this
tell the user?". Start every design in grayscale; add color only where it carries meaning.

## Contrast: two checks, both must pass

| What | WCAG 2.2 AA | APCA (Lc) |
| --- | --- | --- |
| Body text, any size | 4.5:1 | 75 minimum, 90 preferred |
| Secondary text, links, button labels, status text | 4.5:1 | 60 minimum |
| Large text (≥ 24 px regular or ≥ 18.7 px bold) | 3:1 | 45 minimum |
| Input borders, focus rings, control outlines, icons that carry meaning | 3:1 | 45 minimum |
| Placeholder or disabled text (never the only label) | – | 30 absolute minimum |
| Decorative dividers | none | 15 recommended |

- WCAG 2 is the legal baseline. APCA (from the WCAG 3 draft) models perception better and
  catches what WCAG 2 gets wrong, especially **light text on dark backgrounds** (WCAG 2 passes
  dark-mode pairs that are hard to read) and **white text on saturated mid tones** (WCAG 2 fails
  pairs that read fine). The token build checks both and fails on either.
- APCA is directional: text-on-background differs from background-on-text. Check the pair the
  way it is used.
- Avoid the extremes: light gray text is inaccessible; pure black on pure white (#000/#fff) is
  harsh for long reading. Use the `ink` token (a very dark, slightly tinted gray).

## Never color alone

About 1 in 12 men has a color vision deficiency. Every color signal needs a second cue:

- Links: color **and** underline (base styles do this).
- Errors: red **and** icon **and** thicker border **and** message text.
- Status: badge text or icon, not a colored dot alone.
- Charts: labels, patterns or direct annotation in addition to hue.
- Selected state: check mark, weight, or border, not only a tint.

## One accent, used for action

- One brand/accent color, applied to **interactive** things: primary buttons, links, focus,
  selected controls. This teaches users what can be pressed.
- Don't color non-interactive elements in the accent (headings, icons, badges): they will be
  mistaken for links.
- More than one brand color? The one with the best contrast becomes the action color; the
  others may appear only in decoration (illustration, backgrounds), never on controls.
- If the brand color already means something (red = error, green = success, amber = warning),
  don't use it for actions. Use the darkest neutral or a blue for actions instead.

## Status (system) colors

| Role | Meaning | Use |
| --- | --- | --- |
| `danger` (red) | Error, failure, destructive confirmation | Needs attention now |
| `warning` (amber) | Risk, pending, caution | Proceed carefully |
| `success` (green) | Done as expected | Confirmation |

Text in status colors needs 4.5:1; icons and shapes need 3:1. Pair them with `-subtle`
backgrounds for banners and badges.

## Palette structure (what each token is for)

A small palette with rules beats a large one without. Everyday UI's roles map to the classic
"one brand color + tinted neutrals" system:

| Role | Token | Rule |
| --- | --- | --- |
| Action | `accent` | ≥ 4.5:1 on backgrounds |
| Headings & body text | `ink` | Highest text contrast |
| Secondary text | `ink-muted` | Still ≥ 4.5:1; never lighter |
| Functional borders (inputs, controls) | `border-strong` | ≥ 3:1 |
| Decorative borders (dividers, card edges) | `border` | No minimum; removing it must not hurt usability |
| Alternate background | `sunken` | Text on it must still pass |
| Main background | `paper` / `surface` | |

- Neutrals may carry a hint of the brand hue (a "tinted" or monochromatic palette) for cohesion.
  Set the neutral hue in the project's token overrides.
- Need a hover color? Prefer a defined `-hover` token over ad-hoc opacity.

## Difficult brand colors

- **Very light brand color** (yellow, mint) on a light UI: use dark text (`ink`) on the brand
  fill, add a `border-strong` outline so the button shape reaches 3:1, and use the darkest
  neutral for text links. Or darken the brand slightly if recognition survives.
- **Very dark brand color** on a dark UI: white text on the fill, a light border for 3:1, and
  white/light links. Or lighten the brand slightly.

## Light, dark, and both

- Light interfaces are the safe default (familiar, legible in sunlight).
- Dark interfaces feel dramatic or premium but need more contrast care; never just invert.
  In dark mode, raise elevated surfaces lighter, desaturate accents, and check APCA.
- Mixed light and dark regions are a valid grouping tool (e.g. dark sidebar, light content).
- Design in black and white first; color is the last layer.

## Using color for hierarchy

More important = more saturated, warmer, or higher contrast. Less important = closer to the
background. Headings darker than body; metadata lighter than body (within contrast limits).

## Images

- Text on photos must meet the same contrast. Options: gradient scrim from the darkest neutral
  (e.g. 90 % → 0 % over half the image), a solid 50 % overlay, background blur, or a solid label
  background behind the text.
- For decorative photography, match color temperature to the palette (cool palette, cooler
  photos). Never alter product photos where true color matters.
