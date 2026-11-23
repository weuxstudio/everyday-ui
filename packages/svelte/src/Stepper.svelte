<script lang="ts">
  import type { Snippet } from "svelte";
  import Text from "./lib/Text.svelte";
  import FieldHint from "./lib/FieldHint.svelte";
  type Content = string | Snippet;
  type Props = {
    label: Content;
    hint?: Content;
    value?: number;
    onValueChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    class?: string;
  };
  let {
    label,
    hint,
    value = $bindable(0),
    onValueChange,
    min = 0,
    max = 99,
    step = 1,
    class: className,
  }: Props = $props();
  const id = $props.id();
  const hintId = $derived(hint ? id + "-hint" : undefined);
  function set(n: number) {
    value = Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));
    onValueChange?.(value);
  }
  const btn =
    "grid size-touch shrink-0 place-items-center rounded-control border border-accent bg-surface text-accent text-xl font-semibold " +
    "hover:bg-accent-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus " +
    "aria-disabled:cursor-not-allowed aria-disabled:border-border-strong aria-disabled:bg-sunken aria-disabled:text-ink-muted";
</script>

<div role="group" aria-labelledby={`${id}-label`} class={["flex items-center justify-between gap-4", className]}>
  <div class="flex flex-col gap-0.5">
    <label id={`${id}-label`} for={id} class="text-base font-semibold text-ink">
      <Text content={label} />
    </label>
    {#if hint}<FieldHint id={hintId} content={hint} />{/if}
  </div>
  <div class="flex items-center gap-2">
    <button
      type="button"
      class={btn}
      aria-label="Decrease"
      aria-controls={id}
      aria-disabled={value <= min || undefined}
      onclick={() => value > min && set(value - step)}
    >
      <span aria-hidden="true">−</span>
    </button>
    <input
      {id}
      inputmode="numeric"
      aria-describedby={hintId}
      {value}
      oninput={(e) => set(parseInt(e.currentTarget.value.replace(/\D/g, ""), 10))}
      class="h-touch w-14 rounded-control border border-border-strong bg-surface text-center text-base tabular-nums text-ink focus-visible:outline-2 focus-visible:outline-focus"
    />
    <button
      type="button"
      class={btn}
      aria-label="Increase"
      aria-controls={id}
      aria-disabled={value >= max || undefined}
      onclick={() => value < max && set(value + step)}
    >
      <span aria-hidden="true">+</span>
    </button>
  </div>
</div>
