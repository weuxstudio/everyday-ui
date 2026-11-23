<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import { reveal } from "./transitions";
  let {
    show,
    children,
    appear = false,
    class: className,
  }: { show: boolean; children: Snippet; appear?: boolean; class?: string } = $props();
  let ready = $state(false);
  onMount(() => {
    ready = true;
  });
</script>

{#if show && (!appear || ready)}
  <div class={className} in:reveal out:reveal={true}>{@render children()}</div>
{/if}
