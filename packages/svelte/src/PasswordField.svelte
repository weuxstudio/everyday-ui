<script lang="ts">
  import type { Snippet } from "svelte";
  import Text from "./lib/Text.svelte";
  import FieldHint from "./lib/FieldHint.svelte";
  import FieldError from "./lib/FieldError.svelte";
  import RequirementMark from "./lib/RequirementMark.svelte";
  type Content = string | Snippet;
  import type { HTMLInputAttributes } from "svelte/elements";
  import type { PasswordRule } from "./types";
  type Props = Omit<HTMLInputAttributes, "type" | "size" | "value"> & {
    label: Content;
    hint?: Content;
    error?: Content;
    rules?: PasswordRule[];
    purpose?: "new" | "current";
    value?: string;
  };
  let {
    label,
    hint,
    error,
    required,
    rules,
    purpose = "new",
    id,
    class: className,
    value = $bindable(""),
    ...rest
  }: Props = $props();
  const uid = $props.id();
  const inputId = $derived(id ?? uid);
  let visible = $state(false);
  const hintId = $derived(hint ? inputId + "-hint" : undefined);
  const errorId = $derived(error ? inputId + "-error" : undefined);
  const rulesId = $derived(rules?.length ? inputId + "-rules" : undefined);
</script>

<div class={["flex flex-col gap-2", className]}>
  <div class="flex flex-col gap-1">
    <label for={inputId} class="text-base font-semibold text-ink">
      <Text content={label} />
      <RequirementMark required={Boolean(required)} />
    </label>
    {#if hint}<FieldHint id={hintId} content={hint} />{/if}
    {#if rules?.length}<ul id={rulesId} class="flex flex-col gap-0.5 text-sm" aria-live="polite">
        {#each rules as r, i (i)}
          {@const met = r.test(value)}
          <li class={["flex items-center gap-1.5", met ? "text-success" : "text-ink-muted"]}>
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              class="size-4 shrink-0"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              {#if met}<path d="M3.5 8.5 6.5 11.5 12.5 4.5"></path>{:else}<circle cx="8" cy="8" r="5"></circle>{/if}
            </svg>
            <span>
              <Text content={r.label} />
              <span class="sr-only">{met ? " – done" : " – not yet"}</span>
            </span>
          </li>
        {/each}
      </ul>{/if}
    {#if error}<FieldError id={errorId} content={error} />{/if}
  </div>
  <div class="relative">
    <input
      id={inputId}
      type={visible ? "text" : "password"}
      autocomplete={purpose === "new" ? "new-password" : "current-password"}
      spellcheck={false}
      autocapitalize="none"
      aria-required={required || undefined}
      aria-invalid={error ? true : undefined}
      aria-describedby={[errorId, rulesId, hintId].filter(Boolean).join(" ") || undefined}
      bind:value
      class={[
        "h-control-md w-full rounded-control bg-surface pl-3 pr-20 text-base text-ink",
        "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-focus",
        error ? "border-2 border-danger bg-danger-subtle" : "border border-border-strong hover:border-ink-muted",
      ]}
      {...rest}
    />
    <button
      type="button"
      onclick={() => (visible = !visible)}
      aria-controls={inputId}
      aria-pressed={visible}
      class="absolute inset-y-0 right-0 my-auto mr-1 h-[calc(100%-0.5rem)] rounded-control px-3 text-sm font-semibold text-accent underline decoration-from-font underline-offset-[0.2em] hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-focus"
    >
      {visible ? "Hide" : "Show"}
      <span class="sr-only"> password</span>
    </button>
  </div>
</div>
