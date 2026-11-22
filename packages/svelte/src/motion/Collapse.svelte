<script lang="ts">
  import type { Snippet } from "svelte";
  import { collapse } from "./transitions";
  let {
    open,
    children,
    id,
    class: className,
  }: { open: boolean; children: Snippet; id?: string; class?: string } = $props();
</script>

{#if open}
  <div {id} class={className} in:collapse out:collapse={true}>{@render children()}</div>
{/if}
