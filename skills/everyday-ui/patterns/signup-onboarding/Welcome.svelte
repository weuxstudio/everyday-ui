<script lang="ts">
  import { Button, EmptyState } from "@everyday-ui/svelte";
  import { SETUP } from "./data";
  let tasks = $state(SETUP);
  let hidden = $state(false);
  const done = $derived(tasks.filter((t) => t.done).length);
</script>

<main class="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
  <header>
    <h1 class="text-3xl font-heading">Welcome, Mara</h1>
    <p class="mt-2 text-lg text-ink-muted">Let's create your first project. It takes about two minutes.</p>
  </header>

  {#if !hidden}<section aria-labelledby="setup-title" class="mt-12 rounded-card border border-border bg-surface p-card">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 id="setup-title" class="text-lg font-heading">Get set up</h2>
          <p class="mt-1 text-sm text-ink-muted" aria-live="polite">
            {done} of {tasks.length} done
          </p>
        </div>
        <Button variant="tertiary" size="sm" onclick={() => (hidden = true)}>Hide checklist</Button>
      </div>
      <div class="mt-4 h-1.5 overflow-hidden rounded-full bg-sunken" aria-hidden="true">
        <div
          class="h-full rounded-full bg-accent transition-[width]"
          style:width={`${(done / tasks.length) * 100}%`}
        ></div>
      </div>
      <ul class="mt-4 divide-y divide-border">
        {#each tasks as t (t.id)}
          <li class="flex min-h-touch items-center justify-between gap-4 py-2">
            <span class="flex items-center gap-4">
              <span
                aria-hidden="true"
                class={t.done
                  ? "grid size-6 place-items-center rounded-full bg-success-subtle text-sm font-semibold text-success"
                  : "size-6 rounded-full border-2 border-border-strong"}
              >
                {t.done ? "✓" : null}
              </span>
              <span class={t.done ? "text-ink-muted line-through" : "text-ink"}>
                {t.label}
                {#if t.optional}<span class="ml-1 text-ink-muted">(optional)</span>{/if}
                <span class="sr-only">{t.done ? " – done" : ""}</span>
              </span>
            </span>
            {#if !t.done}<Button
                size="sm"
                onclick={() => (tasks = tasks.map((x) => (x.id === t.id ? { ...x, done: true } : x)))}
              >
                Start
              </Button>{/if}
          </li>
        {/each}
      </ul>
    </section>{/if}

  <section aria-labelledby="projects-title" class="mt-12">
    <h2 id="projects-title" class="text-xl font-heading">Projects</h2>
    <EmptyState
      title="No projects yet"
      description="Projects keep a client's invoices, files and notes together. Start with the client you work with most."
    >
      {#snippet icon()}<svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M3 7.5A1.5 1.5 0 0 1 4.5 6H9l2 2h8.5A1.5 1.5 0 0 1 21 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z"
          ></path>
        </svg>{/snippet}
      {#snippet action()}<Button variant="primary">Create first project</Button>{/snippet}
      {#snippet secondary()}<a href="#import">Import projects from a spreadsheet</a>{/snippet}
    </EmptyState>
  </section>
</main>
