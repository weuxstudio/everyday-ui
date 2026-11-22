<!-- Icon + colour + text (never colour alone), placed above the input. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import Text from "./Text.svelte";
  import ErrorIcon from "./ErrorIcon.svelte";
  let { id, content, class: className = "" }: { id?: string; content: string | Snippet; class?: string } = $props();
</script>

<p {id} class={["flex items-start gap-1.5 text-sm font-semibold text-danger", className]}>
  <ErrorIcon class="mt-0.5 size-4 shrink-0" />
  <span><Text {content} /></span>
</p>
