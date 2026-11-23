<script lang="ts">
  import type { Snippet } from "svelte";
  import { Button } from "@everyday-ui/svelte";
  let { title, children, onChange }: { title: string; children: Snippet; onChange: () => void } = $props();
</script>

<div class="flex items-start justify-between gap-4 border-b border-border pb-4">
  <div>
    <h3 class="font-semibold">{title}</h3>
    <p class="mt-1 text-ink-muted">{@render children()}</p>
  </div>
  <Button variant="tertiary" size="sm" onclick={onChange}>
    Change<span class="sr-only"> {title.toLowerCase()}</span>
  </Button>
</div>
