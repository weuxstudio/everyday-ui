<script lang="ts">
  import type { Snippet } from "svelte";
  import Text from "./lib/Text.svelte";
  import FieldHint from "./lib/FieldHint.svelte";
  import FieldError from "./lib/FieldError.svelte";
  import RequirementMark from "./lib/RequirementMark.svelte";
  type Content = string | Snippet;
  import type { RadioOption } from "./types";
  type Props = {
    legend: Content;
    name: string;
    options: RadioOption[];
    value?: string;
    onValueChange?: (value: string) => void;
    hint?: Content;
    error?: Content;
    required?: boolean;
    optional?: boolean;
    id?: string;
    class?: string;
  };
  let {
    legend,
    name,
    options,
    value = $bindable(),
    onValueChange,
    hint,
    error,
    required,
    optional,
    id,
    class: className,
  }: Props = $props();
  const uid = $props.id();
  const baseId = $derived(id ?? uid);
  const hintId = $derived(hint ? baseId + "-hint" : undefined);
  const errorId = $derived(error ? baseId + "-error" : undefined);
</script>

<fieldset
  role="radiogroup"
  aria-invalid={error ? true : undefined}
  class={["flex flex-col gap-1", className]}
  aria-describedby={[errorId, hintId].filter(Boolean).join(" ") || undefined}
>
  <legend class="mb-1 text-base font-semibold text-ink">
    <Text content={legend} />
    <RequirementMark {required} {optional} />
  </legend>
  {#if hint}<FieldHint id={hintId} content={hint} />{/if}
  {#if error}<FieldError id={errorId} content={error} />{/if}
  <div class="flex flex-col">
    {#each options as opt, i (opt.value)}
      {@const optId = i === 0 ? baseId : `${baseId}-${i}`}
      {@const optHint = opt.hint ? `${optId}-option-hint` : undefined}<label
        for={optId}
        class="flex min-h-touch cursor-pointer items-start gap-3 py-2.5"
      >
        <input
          id={optId}
          type="radio"
          {name}
          value={opt.value}
          bind:group={value}
          onchange={() => onValueChange?.(opt.value)}
          aria-describedby={optHint}
          class={[
            "mt-0.5 grid size-5 shrink-0 cursor-pointer appearance-none place-content-center rounded-full border-2 bg-surface",
            "before:size-2.5 before:scale-0 before:rounded-full before:bg-accent-ink before:transition-transform before:content-['']",
            "checked:border-accent checked:bg-accent checked:before:scale-100",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
            error ? "border-danger" : "border-border-strong",
          ]}
        />
        <span class="flex flex-col gap-0.5">
          <span class="text-base text-ink"><Text content={opt.label} /></span>
          {#if opt.hint}<span id={optHint} class="text-sm text-ink-muted">
              <Text content={opt.hint} />
            </span>{/if}
        </span>
      </label>
    {/each}
  </div>
</fieldset>
