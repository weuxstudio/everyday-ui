<!-- Required: neutral asterisk (explained once at the top of the form). Optional: the word. -->
<script lang="ts">
  let { required = false, optional = false }: { required?: boolean; optional?: boolean } = $props();
</script>

{#if required}<span aria-hidden="true" class="ml-0.5 text-ink-muted">*</span>{:else if optional}<span class="ml-1.5 font-regular text-ink-muted">(optional)</span>{/if}
