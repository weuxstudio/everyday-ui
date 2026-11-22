# Dashboard

**Job:** answer "how are things, and what needs me?" in a few seconds. A dashboard is a
summary with exits to detail, not a wall of charts.

## Structure

1. App frame: navigation (sidebar on desktop, bottom bar or menu on phones), current section
   highlighted.
2. Page header: greeting or context, time range control, one primary action if there is a
   common next task ("New invoice").
3. **Attention zone** first: things that need action (overdue invoices, failed payments, pending
   approvals) as a short list with direct actions.
4. **Key numbers:** 3–5 metric tiles. Each: label, value, comparison ("+12 % vs. last month") with
   direction shown by icon and words, not only red/green.
5. **One or two charts** that answer a question named in their title ("Revenue by month").
6. **Recent activity or latest records** as a short table or list with a "View all" link.

## Rules

1. **Start from questions.** List the 3–5 questions users bring; every element must answer one.
   Remove the rest.
2. **Most important top left**, in reading order. Attention items above general numbers.
3. **Numbers need context**: comparison period, target or trend. A raw number alone is trivia.
4. **Format for reading**: locale formatting, rounding to meaningful precision ("€48.2k" in a tile,
   exact in the detail), tabular figures, units in the label.
5. **Charts:** a title that states the question, direct labels instead of legends, bars start at
   zero, few colors (accent for the focus series, neutrals for context), a text or table
   alternative for screen readers.
6. **Every tile and chart leads somewhere** (link to the filtered detail), and says so ("View
   overdue invoices").
7. **Time range is global and visible**; changing it updates everything and is reflected in the
   URL.
8. **Phones:** single column in priority order: attention list, key numbers (2 per row), one chart,
   recent records as a list.

## States

- First use (no data): replace the dashboard with an onboarding empty state and the first action;
  don't show zeros everywhere.
- Loading: skeleton tiles with fixed sizes; no layout shift when numbers arrive.
- Partial failure: the failed tile says so and offers retry; the rest still shows.
- All good: the attention zone says "Nothing needs your attention" rather than disappearing.

## Avoid

- Gauges, 3D charts, pie charts with many slices, decorative sparklines without axes or values.
- Ten KPIs of equal weight. Rainbow color palettes. Charts without a question.
- Status shown only by red/green.

## Blueprint

`Dashboard.tsx` and `Dashboard.svelte` – sidebar app frame, attention list, four metric tiles with comparisons, an
accessible bar chart (SVG + data table for screen readers), and a recent invoices table.
Adapt: the questions, metrics and records of the product.
