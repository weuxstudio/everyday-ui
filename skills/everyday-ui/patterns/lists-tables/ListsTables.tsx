// Blueprint: list with search, filters, sorting, selection and bulk actions.
// Rules: patterns/lists-tables/README.md
import { useMemo, useState } from "react";
import { Badge, Button, EmptyState, SegmentedControl, cx } from "@everyday-ui/react";

import { money, date, type Status, INVOICES, TONE, type SortKey } from "./data";

export default function ListsTables() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "due", dir: 1 });
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INVOICES.filter((i) => (status === "all" || i.status.toLowerCase() === status) && (!q || `${i.client} ${i.no}`.toLowerCase().includes(q))).sort(
      (a, b) => (a[sort.key] < b[sort.key] ? -1 : a[sort.key] > b[sort.key] ? 1 : 0) * sort.dir,
    );
  }, [query, status, sort]);

  const filtered = query.trim() !== "" || status !== "all";
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.no));
  const toggle = (no: string) => setSelected((s) => { const n = new Set(s); n.has(no) ? n.delete(no) : n.add(no); return n; });
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.no)));
  const clearFilters = () => { setQuery(""); setStatus("all"); };

  const SortHeader = ({ k, children, align = "left" }: { k: SortKey; children: string; align?: "left" | "right" }) => {
    const active = sort.key === k;
    return (
      <th scope="col" aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : "none"} className={cx("px-3 py-2 font-regular", align === "right" && "text-right")}>
        <button
          type="button"
          onClick={() => setSort({ key: k, dir: active ? (sort.dir === 1 ? -1 : 1) : 1 })}
          className={cx("inline-flex min-h-touch items-center gap-1 rounded-control hover:text-ink focus-visible:outline-2 focus-visible:outline-focus", active && "font-semibold text-ink")}
        >
          {children}
          <span aria-hidden="true" className={active ? "" : "opacity-40"}>{active && sort.dir === -1 ? "↓" : "↑"}</span>
        </button>
      </th>
    );
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-20">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-3xl font-heading">
          Invoices <span className="font-regular text-ink-muted tabular-nums">· {INVOICES.length}</span>
        </h1>
        <Button variant="primary">New invoice</Button>
      </header>

      {/* Toolbar or, while something is selected, the bulk action bar in its place */}
      <div className="mt-8 min-h-[5.5rem]">
        {selected.size === 0 ? (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex w-full max-w-sm flex-col gap-2">
              <label htmlFor="invoice-search" className="text-base font-semibold">
                Search
              </label>
              <input
                id="invoice-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Client or invoice number"
                className="h-control-md w-full rounded-control border border-border-strong bg-surface px-3 text-base placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-focus"
              />
            </div>
            <SegmentedControl
              label="Status"
              value={status}
              onValueChange={setStatus}
              options={[
                { value: "all", label: "All" },
                { value: "open", label: "Open" },
                { value: "overdue", label: "Overdue" },
                { value: "paid", label: "Paid" },
              ]}
            />
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-4 rounded-card bg-accent-subtle px-card py-3" role="region" aria-label="Bulk actions">
            <span className="font-semibold" aria-live="polite">{selected.size} selected</span>
            <Button size="sm">Send reminders</Button>
            <Button size="sm">Export</Button>
            <Button size="sm" variant="tertiary" onClick={() => setSelected(new Set())}>Clear selection</Button>
          </div>
        )}
      </div>

      {filtered ? (
        <p className="mt-2 text-sm text-ink-muted" aria-live="polite">
          {rows.length} of {INVOICES.length} invoices{" "}
          <Button variant="tertiary" size="sm" onClick={clearFilters}>Clear filters</Button>
        </p>
      ) : null}

      {rows.length === 0 ? (
        <EmptyState
          title={query ? `No invoices match “${query}”` : "No invoices with this status"}
          description="Check the spelling or remove a filter to see more."
          action={<Button onClick={clearFilters}>Clear filters</Button>}
        />
      ) : (
        <>
          {/* Desktop: table */}
          <div className="mt-4 hidden overflow-x-auto rounded-card border border-border bg-surface md:block">
            <table className="w-full text-left">
              <thead className="sticky top-0 border-b border-border bg-surface text-sm text-ink-muted">
                <tr>
                  <th scope="col" className="w-12 px-3">
                    <input type="checkbox" aria-label="Select all invoices on this page" checked={allSelected} onChange={toggleAll} className="size-6 accent-[var(--eu-color-accent)]" />
                  </th>
                  <SortHeader k="client">Client</SortHeader>
                  <SortHeader k="due">Due</SortHeader>
                  <SortHeader k="amount" align="right">Amount</SortHeader>
                  <th scope="col" className="px-3 py-2 font-regular">Status</th>
                  <th scope="col" className="px-3 py-2"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.no} className={cx(selected.has(r.no) && "bg-accent-subtle")}>
                    <td className="px-3">
                      <input type="checkbox" aria-label={`Select ${r.no}`} checked={selected.has(r.no)} onChange={() => toggle(r.no)} className="size-6 accent-[var(--eu-color-accent)]" />
                    </td>
                    <td className="px-3 py-3">
                      <a href={`#${r.no}`} className="font-semibold text-ink no-underline hover:underline">{r.client}</a>
                      <div className="text-sm text-ink-muted">{r.no}</div>
                    </td>
                    <td className="px-3 py-3 tabular-nums">{date(r.due)}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{money(r.amount)}</td>
                    <td className="px-3 py-3"><Badge tone={TONE[r.status]}>{r.status}</Badge></td>
                    <td className="px-3 py-3 text-right">
                      {r.status !== "Paid" ? <Button variant="tertiary" size="sm">Send reminder<span className="sr-only"> for {r.no}</span></Button> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phones: cards with the same information and actions */}
          <ul className="mt-4 flex flex-col gap-3 md:hidden">
            {rows.map((r) => (
              <li key={r.no} className="flex flex-col gap-2 rounded-card border border-border bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <a href={`#${r.no}`} className="font-semibold text-ink no-underline">{r.client}</a>
                  <span className="font-semibold tabular-nums">{money(r.amount)}</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-sm text-ink-muted">
                  <span>{r.no} · due {date(r.due)}</span>
                  <Badge tone={TONE[r.status]}>{r.status}</Badge>
                </div>
                {r.status !== "Paid" ? (
                  <div>
                    <Button variant="tertiary" size="sm" className="-ml-1.5">Send reminder<span className="sr-only"> for {r.no}</span></Button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>

          <nav aria-label="Pagination" className="mt-6 flex items-center justify-between gap-4">
            <p className="text-sm text-ink-muted tabular-nums">1–{rows.length} of {rows.length}</p>
            {/* With more than one page: <Button size="sm">Previous</Button> <Button size="sm">Next</Button>.
                Hide controls that can't do anything instead of disabling them. */}
          </nav>
        </>
      )}
    </main>
  );
}
