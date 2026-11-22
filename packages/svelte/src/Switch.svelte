<!--
  Takes effect immediately. If the change needs Save/Submit, use a Checkbox instead.
  The label describes what is true when the switch is on.
-->
<script lang="ts">
  import type { Snippet } from "svelte";
  import Text from "./lib/Text.svelte";

  type Props = {
    label: string | Snippet;
    hint?: string | Snippet;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    class?: string;
  };
  let { label, hint, checked = $bindable(false), onCheckedChange, class: className }: Props = $props();

  const uid = $props.id();
  function toggle() {
    checked = !checked;
    onCheckedChange?.(checked);
  }
</script>

<div class={["flex min-h-touch items-center justify-between gap-4", className]}>
  <span class="flex flex-col gap-0.5">
    <span id="{uid}-label" class="text-base text-ink"><Text content={label} /></span>
    {#if hint}<span id="{uid}-hint" class="text-sm text-ink-muted"><Text content={hint} /></span>{/if}
  </span>
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-labelledby="{uid}-label"
    aria-describedby={hint ? `${uid}-hint` : undefined}
    onclick={toggle}
    class={[
      "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors",
      "after:absolute after:-inset-y-2.5 after:inset-x-0 after:content-['']",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
      checked ? "border-accent bg-accent" : "border-border-strong bg-sunken",
    ]}
  >
    <span
      aria-hidden="true"
      class={["size-5 rounded-full shadow-sm transition-transform", checked ? "translate-x-[1.375rem] bg-accent-ink" : "translate-x-0.5 bg-border-strong"]}
    ></span>
  </button>
</div>
