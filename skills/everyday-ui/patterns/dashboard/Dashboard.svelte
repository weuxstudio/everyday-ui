<script lang="ts">
  import { Badge, Button, SegmentedControl } from "@everyday-ui/svelte";
  import { money, pct, NAV, METRICS, ATTENTION, RECENT, TONE } from "./data";
  import RevenueChart from "./RevenueChart.svelte";
  let range = $state("30d");
</script>

<div class="min-h-dvh lg:grid lg:grid-cols-[15rem_1fr]">
  <nav
    aria-label="Main"
    class="border-b border-border bg-surface px-4 py-3 lg:min-h-dvh lg:border-b-0 lg:border-r lg:px-4 lg:py-8"
  >
    <p class="px-3 pb-2 font-heading text-lg lg:pb-6">Atlas</p>
    <ul class="flex gap-1 overflow-x-auto lg:flex-col">
      {#each NAV as n, i (n)}
        <li>
          <a
            href={`#${n.toLowerCase()}`}
            aria-current={i === 0 ? "page" : undefined}
            class={[
              "flex min-h-touch items-center whitespace-nowrap rounded-control px-3 no-underline",
              i === 0 ? "bg-accent-subtle font-semibold text-accent" : "text-ink hover:bg-sunken",
            ]}
          >
            {n}
          </a>
        </li>
      {/each}
    </ul>
  </nav>

  <main class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-12 lg:py-12">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm text-ink-muted">Sunday, 22 November</p>
        <h1 class="mt-1 text-3xl font-heading">Overview</h1>
      </div>
      <div class="flex flex-wrap items-end gap-4">
        <SegmentedControl
          label="Time range"
          hideLabel
          value={range}
          onValueChange={(value) => (range = value)}
          options={[
            { value: "7d", label: "7 days" },
            { value: "30d", label: "30 days" },
            { value: "12m", label: "12 months" },
          ]}
        />
        <Button variant="primary">New invoice</Button>
      </div>
    </header>

    <section aria-labelledby="attention" class="mt-12 rounded-card border border-warning bg-warning-subtle p-card">
      <h2 id="attention" class="text-lg font-heading">Needs your attention</h2>
      <ul class="mt-2 divide-y divide-border">
        {#each ATTENTION as a (a.text)}
          <li class="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {a.text} <span class="font-semibold tabular-nums">· {a.amount}</span>
            </span>
            <Button size="sm">{a.action}</Button>
          </li>
        {/each}
      </ul>
    </section>

    <section aria-label="Key numbers" class="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {#each METRICS as m (m.label)}
        {@const good = (m.change > 0 && m.better === "up") || (m.change < 0 && m.better === "down")}<a
          href="#detail"
          class="group flex flex-col gap-1 rounded-card border border-border bg-surface p-card text-ink no-underline hover:border-border-strong"
        >
          <span class="text-sm text-ink-muted">{m.label}</span>
          <span class="text-2xl font-heading tabular-nums">{m.value}</span>
          <span class="text-sm">
            <span class={["font-semibold", good ? "text-success" : "text-danger"]}>
              <span aria-hidden="true">{m.change > 0 ? "▲ " : "▼ "}</span>
              {pct(m.change)}
            </span>{" "}
            <span class="text-ink-muted">vs. previous 30 days</span>
          </span>
          <span
            class="mt-2 text-sm text-accent underline decoration-from-font underline-offset-[0.2em] group-hover:text-accent-hover"
          >
            {m.detail}
          </span>
        </a>
      {/each}
    </section>

    <div class="mt-8 grid gap-6 xl:grid-cols-[3fr_2fr]">
      <RevenueChart />
      <section aria-labelledby="recent" class="rounded-card border border-border bg-surface p-card">
        <div class="flex items-baseline justify-between gap-4">
          <h2 id="recent" class="text-lg font-heading">Latest invoices</h2>
          <a href="#invoices">View all</a>
        </div>
        <table class="mt-4 w-full text-left">
          <thead class="text-sm text-ink-muted">
            <tr>
              <th class="py-2 font-regular">Client</th>
              <th class="py-2 text-right font-regular">Amount</th>
              <th class="py-2 pl-4 font-regular">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            {#each RECENT as r (r.no)}
              <tr>
                <td class="py-3">
                  <a href={`#${r.no}`} class="font-semibold text-ink no-underline hover:underline">
                    {r.client}
                  </a>
                  <div class="text-sm text-ink-muted">{r.no} · {r.date}</div>
                </td>
                <td class="py-3 text-right tabular-nums">{money(r.amount)}</td>
                <td class="py-3 pl-4">
                  <Badge tone={TONE[r.status as keyof typeof TONE]}>{r.status}</Badge>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </section>
    </div>
  </main>
</div>
