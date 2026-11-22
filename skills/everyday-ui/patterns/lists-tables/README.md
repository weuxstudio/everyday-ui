# Lists and tables

**Job:** find the right records among many, compare them, and act on one or several. The
quality of a list decides how fast people work in most business software.

## Structure

1. Page header: title with count ("Invoices · 212"), primary action ("New invoice").
2. Toolbar: search, the 2–4 most used filters visible (status, date range, owner), "More filters"
   for the rest, active filters as removable chips with "Clear all".
3. The list: a table on desktop for comparable records; cards or two-line rows on phones.
4. Selection: checkbox column; when something is selected, a bulk action bar replaces the toolbar
   ("3 selected · Send reminders · Export · Clear selection").
5. Pagination or "Load more" at the bottom with the range ("1–25 of 212").

## Rules

1. **Choose columns by decision**, not by data model: the 4–7 columns people compare. Details go
   to the record page.
2. **Alignment carries meaning**: text left, numbers and amounts right with tabular figures, status
   as a badge with text, dates in one format.
3. **The first column identifies the record** and is the link to it. Row actions are tertiary
   buttons or an overflow menu at the row end; destructive ones last.
4. **Sorting** on columns where it helps, with the current sort visible (`aria-sort`). Default sort
   answers the most common question (newest first, overdue first).
5. **Search and filters are reflected in the URL** and survive back navigation.
6. **Header stays visible** on long tables (sticky), and the identifier column stays visible on
   horizontal scroll.
7. **Density follows the task**: comfortable rows by default, a compact option for power users.
8. **Bulk actions confirm the count** ("Delete 3 invoices?") and offer undo.
9. **Phones**: don't shrink the table; switch to a list of cards with the identifier, the key number
   and status, and the same actions.

## States

- No records yet: empty state with the first action and maybe an import.
- No results: echo the query and filters, suggest removing filters, "Clear filters" button.
- Loading: skeleton rows with fixed height; keep previous results while refreshing.
- Error: message in place of the rows with retry; filters stay.
- Partial selection across pages: say what's selected ("All 25 on this page selected · Select all
  212").

## Avoid

- Twelve columns with truncated text. Icons-only row actions. Zebra stripes plus borders plus
  hover all at once (pick one or two cues).
- Infinite scroll for work lists (no orientation, footer unreachable). Filters hidden behind an
  icon when there's room.

## Blueprint

`ListsTables.tsx` – header with count, search and status filter with chips, sortable table with
right-aligned amounts and status badges, selection with bulk action bar, mobile card list, empty
and no-results states, pagination range. Adapt: columns, filters, actions.
