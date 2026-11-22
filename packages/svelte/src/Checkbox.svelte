<!--
  Positive phrasing ("Send me product updates"); read it as "Yes, <label>".
  Checkbox = takes effect on submit. For immediate effect use Switch.
-->
<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";
  import Text from "./lib/Text.svelte";
  import FieldError from "./lib/FieldError.svelte";

  type Props = Omit<HTMLInputAttributes, "type"> & { label: string | Snippet; hint?: string | Snippet; error?: string | Snippet };
  let { label, hint, error, id, class: className, checked = $bindable(false), ...rest }: Props = $props();

  const uid = $props.id();
  const inputId = $derived(id ?? `${uid}-checkbox`);
  const hintId = $derived(hint ? `${inputId}-hint` : undefined);
  const errorId = $derived(error ? `${inputId}-error` : undefined);
</script>

<div class={["flex flex-col gap-1", className]}>
  {#if error}<FieldError id={errorId} content={error} />{/if}
  <label for={inputId} class="flex min-h-touch cursor-pointer items-start gap-3 py-2.5">
    <span class="relative mt-0.5 grid size-5 shrink-0 place-items-center">
      <input
        id={inputId}
        type="checkbox"
        bind:checked
        aria-invalid={error ? true : undefined}
        aria-describedby={[errorId, hintId].filter(Boolean).join(" ") || undefined}
        class={[
          "peer size-5 cursor-pointer appearance-none rounded-check border-2 bg-surface transition-colors",
          "checked:border-accent checked:bg-accent",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
          "disabled:cursor-not-allowed disabled:bg-sunken",
          error ? "border-danger" : "border-border-strong",
        ]}
        {...rest}
      />
      <svg aria-hidden="true" viewBox="0 0 16 16" class="pointer-events-none absolute size-3.5 text-accent-ink opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
      </svg>
    </span>
    <span class="flex flex-col gap-0.5">
      <span class="text-base text-ink"><Text content={label} /></span>
      {#if hint}<span id={hintId} class="text-sm text-ink-muted"><Text content={hint} /></span>{/if}
    </span>
  </label>
</div>
