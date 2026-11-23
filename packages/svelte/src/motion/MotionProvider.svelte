<script lang="ts">
  import type { Snippet } from "svelte";
  let { children, style = "" }: { children: Snippet; style?: string } = $props();
</script>

<div style={"display: contents; " + style}>{@render children()}</div>
