<script lang="ts">
  import { Badge, Button, EmptyState, SegmentedControl } from "@everyday-ui/svelte";
  import { money, date, type Status, INVOICES, TONE, type SortKey } from "./data";
  let query = $state("");
  let status = $state("all");
  let sort = $state<{ key: SortKey; dir: 1 | -1 }>({ key: "due", dir: 1 });
  let selected = $state<Set<string>>(new Set());
  const rows = $derived.by(() => {
    const q = query.trim().toLowerCase();
    return INVOICES.filter(
      (i) =>
        (status === "all" || i.status.toLowerCase() === status) &&
        (!q || `${i.client} ${i.no}`.toLowerCase().includes(q)),
    ).sort((a, b) => (a[sort.key] < b[sort.key] ? -1 : a[sort.key] > b[sort.key] ? 1 : 0) * sort.dir);
  });
  const filtered = $derived(query.trim() !== "" || status !== "all");
  const allSelected = $derived(rows.length > 0 && rows.every((r) => selected.has(r.no)));
  function toggle(no: string) {
    const next = new Set(selected);
    if (next.has(no)) next.delete(no);
    else next.add(no);
    selected = next;
  }
  const toggleAll = () => (selected = allSelected ? new Set() : new Set(rows.map((r) => r.no)));
  const clearFilters = () => {
    query = "";
    status = "all";
  };
</script>

{#snippet sortHeader(k: SortKey, children: string, align: "left" | "right" = "left")}{@const active = sort.key === k}<th
    scope="col"
    aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : "none"}
    class={["px-3 py-2 font-regular", align === "right" && "text-right"]}
  >
    <button
      type="button"
      onclick={() => (sort = { key: k, dir: active ? (sort.dir === 1 ? -1 : 1) : 1 })}
      class={[
        "inline-flex min-h-touch items-center gap-1 rounded-control hover:text-ink focus-visible:outline-2 focus-visible:outline-focus",
        active && "font-semibold text-ink",
      ]}
    >
      {children}
      <span aria-hidden="true" class={active ? "" : "opacity-40"}>{active && sort.dir === -1 ? "↓" : "↑"}</span>
    </button>
  </th>{/snippet}
<main class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-20">
  <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <h1 class="text-3xl font-heading">
      Invoices <span class="font-regular text-ink-muted tabular-nums">· {INVOICES.length}</span>
    </h1>
    <Button variant="primary">New invoice</Button>
  </header>

  <div class="mt-8 min-h-[5.5rem]">
    {#if selected.size === 0}<div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div class="flex w-full max-w-sm flex-col gap-2">
          <label for="invoice-search" class="text-base font-semibold"> Search </label>
          <input
            id="invoice-search"
            type="search"
            bind:value={query}
            placeholder="Client or invoice number"
            class="h-control-md w-full rounded-control border border-border-strong bg-surface px-3 text-base placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-focus"
          />
        </div>
        <SegmentedControl
          label="Status"
          value={status}
          onValueChange={(value) => (status = value)}
          options={[
            { value: "all", label: "All" },
            { value: "open", label: "Open" },
            { value: "overdue", label: "Overdue" },
            { value: "paid", label: "Paid" },
          ]}
        />
      </div>{:else}<div
        class="flex flex-wrap items-center gap-4 rounded-card bg-accent-subtle px-card py-3"
        role="region"
        aria-label="Bulk actions"
      >
        <span class="font-semibold" aria-live="polite">{selected.size} selected</span>
        <Button size="sm">Send reminders</Button>
        <Button size="sm">Export</Button>
        <Button size="sm" variant="tertiary" onclick={() => (selected = new Set())}>Clear selection</Button>
      </div>{/if}
  </div>

  {#if filtered}<p class="mt-2 text-sm text-ink-muted" aria-live="polite">
      {rows.length} of {INVOICES.length} invoices{" "}
      <Button variant="tertiary" size="sm" onclick={clearFilters}>Clear filters</Button>
    </p>{/if}

  {#if rows.length === 0}<EmptyState
      title={query ? `No invoices match “${query}”` : "No invoices with this status"}
      description="Check the spelling or remove a filter to see more."
    >
      {#snippet action()}<Button onclick={clearFilters}>Clear filters</Button>{/snippet}
    </EmptyState>{:else}
    <div class="mt-4 hidden overflow-x-auto rounded-card border border-border bg-surface md:block">
      <table class="w-full text-left">
        <thead class="sticky top-0 border-b border-border bg-surface text-sm text-ink-muted">
          <tr>
            <th scope="col" class="w-12 px-3">
              <input
                type="checkbox"
                aria-label="Select all invoices on this page"
                checked={allSelected}
                onchange={toggleAll}
                class="size-6 accent-[var(--eu-color-accent)]"
              />
            </th>
            {@render sortHeader("client", "Client")}
            {@render sortHeader("due", "Due")}
            {@render sortHeader("amount", "Amount", "right")}
            <th scope="col" class="px-3 py-2 font-regular">Status</th>
            <th scope="col" class="px-3 py-2"><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          {#each rows as r (r.no)}
            <tr class:bg-accent-subtle={selected.has(r.no)}>
              <td class="px-3">
                <input
                  type="checkbox"
                  aria-label={`Select ${r.no}`}
                  checked={selected.has(r.no)}
                  onchange={() => toggle(r.no)}
                  class="size-6 accent-[var(--eu-color-accent)]"
                />
              </td>
              <td class="px-3 py-3">
                <a href={`#${r.no}`} class="font-semibold text-ink no-underline hover:underline">{r.client}</a>
                <div class="text-sm text-ink-muted">{r.no}</div>
              </td>
              <td class="px-3 py-3 tabular-nums">{date(r.due)}</td>
              <td class="px-3 py-3 text-right tabular-nums">{money(r.amount)}</td>
              <td class="px-3 py-3"><Badge tone={TONE[r.status]}>{r.status}</Badge></td>
              <td class="px-3 py-3 text-right">
                {#if r.status !== "Paid"}<Button variant="tertiary" size="sm">
                    Send reminder<span class="sr-only"> for {r.no}</span>
                  </Button>{/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <ul class="mt-4 flex flex-col gap-3 md:hidden">
      {#each rows as r (r.no)}
        <li class="flex flex-col gap-2 rounded-card border border-border bg-surface p-4">
          <div class="flex items-start justify-between gap-3">
            <a href={`#${r.no}`} class="font-semibold text-ink no-underline">{r.client}</a>
            <span class="font-semibold tabular-nums">{money(r.amount)}</span>
          </div>
          <div class="flex items-center justify-between gap-3 text-sm text-ink-muted">
            <span>{r.no} · due {date(r.due)}</span>
            <Badge tone={TONE[r.status]}>{r.status}</Badge>
          </div>
          {#if r.status !== "Paid"}<div>
              <Button variant="tertiary" size="sm" class="-ml-1.5">
                Send reminder<span class="sr-only"> for {r.no}</span>
              </Button>
            </div>{/if}
        </li>
      {/each}
    </ul>

    <nav aria-label="Pagination" class="mt-6 flex items-center justify-between gap-4">
      <p class="text-sm text-ink-muted tabular-nums">1–{rows.length} of {rows.length}</p>
    </nav>
  {/if}
</main>
