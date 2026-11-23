<script lang="ts">
  import { Badge, Button, SegmentedControl } from "@everyday-ui/svelte";
  import { money, PLANS, INCLUDED, FAQ } from "./data";
  let period = $state("yearly");
  const yearly = $derived(period === "yearly");
</script>

<main class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
  <header class="max-w-2xl">
    <h1 class="text-4xl font-heading">Plans for every team size</h1>
    <p class="mt-3 text-lg text-ink-muted">Every plan starts with a 30-day free trial. No card needed.</p>
  </header>

  <div class="mt-12">
    <SegmentedControl
      label="Billing period"
      hideLabel
      value={period}
      onValueChange={(value) => (period = value)}
      options={[
        { value: "monthly", label: "Monthly" },
        { value: "yearly", label: "Yearly · save up to 22%" },
      ]}
    />
  </div>

  <ul class="mt-8 grid gap-6 lg:grid-cols-3">
    {#each PLANS as p (p.id)}
      {@const perMonth = yearly ? p.yearly : p.monthly}
      <li
        class={[
          "flex flex-col rounded-card bg-surface p-card",
          p.popular ? "border-2 border-accent shadow-md" : "border border-border",
        ]}
      >
        <div class="flex items-center justify-between gap-2">
          <h2 class="text-xl font-heading">{p.name}</h2>
          {#if p.popular}<Badge>Most popular</Badge>{/if}
        </div>
        <p class="mt-1 text-ink-muted">{p.audience}</p>

        <p class="mt-6 flex items-baseline gap-1.5" aria-live="polite">
          <span class="text-4xl font-heading tabular-nums">{money(perMonth)}</span>
          <span class="text-ink-muted">/ month</span>
        </p>
        <p class="mt-1 min-h-[1.5em] text-sm text-ink-muted">
          {yearly ? `Billed ${money(p.yearly * 12)} yearly, excl. VAT` : "Billed monthly, excl. VAT"}
        </p>

        <Button class="mt-6" variant={p.popular ? "primary" : "secondary"} fullWidth>
          {p.cta}
        </Button>

        <ul class="mt-6 flex flex-col gap-2 border-t border-border pt-6">
          {#each [...p.limits, ...p.features] as f, i (f)}
            <li class={["flex gap-2", i < p.limits.length && "font-semibold"]}>
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                class="mt-1 size-4 shrink-0 text-success"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3.5 8.5 6.5 11.5 12.5 4.5"></path>
              </svg>
              {f}
            </li>
          {/each}
        </ul>
      </li>
    {/each}
  </ul>

  <section aria-labelledby="included" class="mt-12 rounded-card bg-sunken p-card">
    <h2 id="included" class="text-lg font-heading">All plans include</h2>
    <ul class="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {#each INCLUDED as f (f)}
        <li>{f}</li>
      {/each}
    </ul>
  </section>

  <p class="mt-6 text-base">
    More than 50 people or special requirements? <a href="#contact">Talk to our team</a>
  </p>

  <section aria-labelledby="faq" class="mt-20 max-w-measure">
    <h2 id="faq" class="text-2xl font-heading">Questions about billing</h2>
    <div class="mt-6 divide-y divide-border border-y border-border">
      {#each FAQ as [q, a] (q)}
        <details class="group py-4">
          <summary class="flex min-h-touch cursor-pointer list-none items-center justify-between gap-4 font-semibold">
            {q}
            <span aria-hidden="true" class="text-xl text-accent transition-transform group-open:rotate-45"> + </span>
          </summary>
          <p class="pb-2 text-ink-muted">{a}</p>
        </details>
      {/each}
    </div>
  </section>
</main>
