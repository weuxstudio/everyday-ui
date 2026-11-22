<!--
  Label above (always visible), hint between label and input, error above the input with icon.
  aria-describedby links error and hint. Width can match the expected input (chars).
-->
<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";
  import Text from "./lib/Text.svelte";
  import RequirementMark from "./lib/RequirementMark.svelte";
  import FieldHint from "./lib/FieldHint.svelte";
  import FieldError from "./lib/FieldError.svelte";

  type Props = Omit<HTMLInputAttributes, "size"> & {
    label: string | Snippet;
    hint?: string | Snippet;
    /** What went wrong and how to fix it. Switches the field to its error state. */
    error?: string | Snippet;
    required?: boolean;
    /** Marked with "(optional)". Prefer an opt-in checkbox that reveals a required field. */
    optional?: boolean;
    /** Width matched to the expected input, in characters (e.g. 5 for a German postcode). */
    chars?: number;
  };

  let { label, hint, error, required, optional, chars, id, class: className, style, disabled, value = $bindable(), ...rest }: Props = $props();

  const uid = $props.id();
  const inputId = $derived(id ?? `${uid}-input`);
  const hintId = $derived(hint ? `${inputId}-hint` : undefined);
  const errorId = $derived(error ? `${inputId}-error` : undefined);
  const describedBy = $derived([errorId, hintId].filter(Boolean).join(" ") || undefined);
  const widthStyle = $derived([chars ? `max-width: calc(${chars}ch + 2rem)` : "", style ?? ""].filter(Boolean).join("; ") || undefined);
</script>

<div class={["flex flex-col gap-2", className]}>
  <div class="flex flex-col gap-1">
    <label for={inputId} class="text-base font-semibold text-ink">
      <Text content={label} /><RequirementMark {required} {optional} />
    </label>
    {#if hint}<FieldHint id={hintId} content={hint} />{/if}
    {#if error}<FieldError id={errorId} content={error} />{/if}
  </div>
  <input
    id={inputId}
    {disabled}
    bind:value
    aria-required={required || undefined}
    aria-invalid={error ? true : undefined}
    aria-describedby={describedBy}
    style={widthStyle}
    class={[
      "h-control-md w-full rounded-control bg-surface px-3 text-base text-ink transition-[border-color]",
      "placeholder:text-ink-muted",
      "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-focus",
      "disabled:cursor-not-allowed disabled:bg-sunken disabled:text-ink-muted",
      error ? "border-2 border-danger bg-danger-subtle" : "border border-border-strong hover:border-ink-muted",
    ]}
    {...rest}
  />
</div>
