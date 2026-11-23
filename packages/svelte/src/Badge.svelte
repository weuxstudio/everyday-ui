<script lang="ts">
  import type { Snippet } from "svelte";

  import type { HTMLAttributes } from "svelte/elements";
  import type { BadgeTone } from "./types";
  let {
    tone = "neutral",
    icon,
    class: className,
    children,
    ...rest
  }: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone; icon?: Snippet } = $props();
  const tones: Record<BadgeTone, string> = {
    neutral: "bg-sunken text-ink-muted",
    success: "bg-success-subtle text-success",
    warning: "bg-warning-subtle text-warning",
    danger: "bg-danger-subtle text-danger",
  };
</script>

<span
  class={["inline-flex items-center gap-1 rounded-badge px-2.5 py-0.5 text-sm font-semibold", tones[tone], className]}
  {...rest}
>
  {#if icon}<span aria-hidden="true" class="inline-flex size-3.5">{@render icon?.()}</span>{/if}
  {@render children?.()}
</span>
