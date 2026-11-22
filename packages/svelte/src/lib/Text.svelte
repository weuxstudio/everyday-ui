<!-- Renders a prop that may be plain text or a snippet. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  let { content }: { content: string | Snippet } = $props();
</script>

{#if typeof content === "function"}{@render content()}{:else}{content}{/if}
