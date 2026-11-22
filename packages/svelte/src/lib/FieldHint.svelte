<!-- Between label and input: read before typing, never hidden by autofill. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import Text from "./Text.svelte";
  let { id, content }: { id?: string; content: string | Snippet } = $props();
</script>

<p {id} class="text-sm text-ink-muted"><Text {content} /></p>
