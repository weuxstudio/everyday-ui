# Typography

Interface text exists to be read quickly and correctly. Type choices serve legibility first,
mood second.

## Typeface

- One sans-serif family for the whole UI is the safe default: legible at small sizes, neutral,
  simple. Default: Hanken Grotesk (SIL OFL) with system-UI fallback.
- Choosing a different one: popular and well tested; many weights; generous x-height and
  spacing for small sizes; covers all required languages and characters (ä ö ü ß €);
  OpenType features (tabular figures). When unsure, the platform's system font.
- Personality comes from an optional **second typeface for headings only** (serif = established,
  rounded sans = friendly, light sans = refined, script = personal). Never for body or UI text.
- Monospace for code and for figures that are compared in columns (or use tabular figures:
  `tabular-nums`).

## Weights

Two in practice: **regular** for reading, **semibold** for emphasis (headings, labels, button
text). `bold` only for display sizes if the face needs it. Very thin or very heavy weights only
at large sizes. Many weights on one screen look noisy and are hard to apply consistently.

## Size scale

- A modular scale keeps sizes related. Small ratios (1.125–1.2) suit dense tools and dashboards;
  larger ratios (1.25–1.333) suit marketing pages. Round to whole pixels. Use a smaller ratio on
  phones if headlines wrap awkwardly.
- Everyday UI tokens: 12 · 14 · 16 · 18 · 22 · 28 · 36 · 48 · 64 px (`text-xs` … `text-5xl`).
- Define only the sizes you use. Three or four sizes per screen section are plenty.

| Use | Token |
| --- | --- |
| UI text, labels, inputs, short body | `text-base` (16 px) |
| Long-form reading (articles, docs, descriptions longer than a few lines) | `text-lg` (18 px) or larger |
| Secondary text, hints, metadata | `text-sm` (14 px) |
| Overline/eyebrow labels | `text-sm` semibold, UPPERCASE, +0.08em tracking (short labels only) |
| Never | Below 12 px; body text below 16 px |

## Line height

- Body text at least 1.5 (tokens use 1.5–1.6). Longer lines, heavier faces and faces that look
  large need more.
- Decrease line height as size grows (headings 1.0–1.35), so the gap between lines stays
  visually similar. Tokens carry the right value per size.

## Line length

- 45–75 characters per line for running text (40–80 at the outer limits). Use `max-w-measure`
  (68ch). Full-width paragraphs on desktop are a common failure.

## Alignment

- Left-aligned (ragged right) for anything longer than two lines.
- No centered long text: every line starts somewhere new.
- No justified text on the web: uneven word spacing creates "rivers" and hurts readers with
  dyslexia.

## Letter spacing

- Large text set in a text face looks loose; tighten it slightly as it grows (tokens:
  −0.01em at 22 px to −0.03em at 64 px).
- Small uppercase labels need the opposite: positive tracking.

## Text on images

See `color.md` → Images. Text over a photo must pass contrast on the worst part of the photo.

## Polishing

- `text-wrap: balance` for headings, `text-wrap: pretty` for paragraphs (base styles set this).
- Real typographic characters: – for ranges and pauses, … for truncation, “ ” or „ “ for quotes,
  × for dimensions, non-breaking space between number and unit (`12 €`, `5 min`).
