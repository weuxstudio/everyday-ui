<script lang="ts">
  import type { Snippet } from "svelte";
  import Text from "./lib/Text.svelte";
  type Content = string | Snippet;
  let {
    steps,
    current,
    onStepClick,
    class: className,
  }: { steps: Content[]; current: number; onStepClick?: (index: number) => void; class?: string } = $props();
  const total = $derived(steps.length);
</script>

<nav aria-label="Progress" class={["flex flex-col gap-2", className]}>
  <p class="text-sm text-ink-muted sm:hidden">
    Step {current + 1} of {total}: <span class="font-semibold text-ink"><Text content={steps[current]} /></span>
  </p>
  <div class="h-1.5 overflow-hidden rounded-full bg-sunken sm:hidden" aria-hidden="true">
    <div
      class="h-full rounded-full bg-accent transition-[width]"
      style:width={`${((current + 1) / total) * 100}%`}
    ></div>
  </div>
  <ol class="hidden items-center gap-2 sm:flex">
    {#each steps as step, i (i)}
      {@const done = i < current}
      {@const isCurrent = i === current}{#snippet marker()}<span
          class={[
            "grid size-7 shrink-0 place-items-center rounded-full border-2 text-sm font-semibold tabular-nums",
            done && "border-accent bg-accent text-accent-ink",
            isCurrent && "border-accent text-accent",
            !done && !isCurrent && "border-border-strong text-ink-muted",
          ]}
          aria-hidden="true"
        >
          {done ? "✓" : i + 1}
        </span>

        <span class={["text-sm", isCurrent ? "font-semibold text-ink" : done ? "text-ink" : "text-ink-muted"]}>
          <Text content={step} />
          <span class="sr-only">{done ? " (completed)" : isCurrent ? " (current step)" : ""}</span>
        </span>{/snippet}
      <li class="flex items-center gap-2" aria-current={isCurrent ? "step" : undefined}>
        {#if done && onStepClick}<button
            type="button"
            onclick={() => onStepClick?.(i)}
            class="flex items-center gap-2 rounded-control underline-offset-[0.2em] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {@render marker()}
          </button>{:else}<span class="flex items-center gap-2"> {@render marker()}</span>{/if}
        {#if i < total - 1}<span
            aria-hidden="true"
            class={["mx-1 h-px w-8 lg:w-12", done ? "bg-accent" : "bg-border-strong"]}
          ></span>{/if}
      </li>
    {/each}
  </ol>
</nav>
