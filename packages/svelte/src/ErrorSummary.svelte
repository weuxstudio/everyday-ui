<!--
  Validate on submit, then show this at the top of the form. It takes focus so keyboard and
  screen-reader users land on it; each item jumps to its field.
-->
<script lang="ts">
  import { untrack } from "svelte";
  import ErrorIcon from "./lib/ErrorIcon.svelte";
  import type { ErrorSummaryItem } from "./types";

  let { errors, submitAttempt, title = "Check the highlighted fields" }: { errors: ErrorSummaryItem[]; submitAttempt?: number; title?: string } = $props();
  let box: HTMLDivElement | undefined = $state();
  const count = $derived(errors.length);

  $effect(() => {
    // With an explicit attempt, editing the errors should leave focus at the field.
    void (submitAttempt ?? count);
    untrack(() => box?.focus());
  });

  function jump(e: MouseEvent, fieldId: string) {
    const el = document.getElementById(fieldId);
    if (!el) return;
    e.preventDefault();
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
</script>

{#if count > 0}
  <div
    bind:this={box}
    tabindex="-1"
    role="alert"
    class="rounded-card border-2 border-danger bg-danger-subtle p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:p-6"
  >
    <p class="flex items-center gap-2 text-lg font-semibold text-danger">
      <ErrorIcon class="size-5 shrink-0" />
      {title}
    </p>
    <!-- everyday-lint-ignore-next-line spacing -- aligns the list with the title text after the 20 px icon + 8 px gap -->
    <ul class="mt-2 flex flex-col gap-1 pl-7">
      {#each errors as e (e.fieldId)}
        <li><a href="#{e.fieldId}" class="text-danger" onclick={(ev) => jump(ev, e.fieldId)}>{e.message}</a></li>
      {/each}
    </ul>
  </div>
{/if}
