<script lang="ts" generics="T">
  import type { Snippet } from "svelte";
  import { move, reveal } from "./transitions";
  let {
    items,
    getKey,
    renderItem,
    as = "ul",
    class: className,
    itemClass,
  }: {
    items: T[];
    getKey: (item: T) => string;
    renderItem: Snippet<[T]>;
    as?: "ul" | "ol";
    class?: string;
    itemClass?: string;
  } = $props();
</script>

<svelte:element this={as} class={className}>
  {#each items as item (getKey(item))}
    <li class={itemClass} animate:move in:reveal out:reveal={true}>{@render renderItem(item)}</li>
  {/each}
</svelte:element>
