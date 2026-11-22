<!--
  Two to four mutually exclusive views or modes that switch immediately (billing period, range,
  list/grid). Native radios: arrow keys, form submit and screen readers work without custom code.
-->
<script lang="ts">
  import type { Snippet } from "svelte";
  import Text from "./lib/Text.svelte";
  import type { SegmentOption } from "./types";
  type Props = {
    label: string | Snippet;
    hideLabel?: boolean;
    options: SegmentOption[];
    value?: string;
    onValueChange?: (value: string) => void;
    name?: string;
    class?: string;
  };
  let { label, hideLabel = false, options, value = $bindable(), onValueChange, name, class: className }: Props = $props();

  const uid = $props.id();
  const current = $derived(value ?? options[0]?.value);
</script>

<div class={["flex flex-col gap-2", className]}>
  <span id="{uid}-label" class={["text-base font-semibold text-ink", hideLabel && "sr-only"]}><Text content={label} /></span>
  <div role="radiogroup" aria-labelledby="{uid}-label" class="inline-flex w-fit rounded-control border border-border-strong bg-sunken p-1">
    {#each options as o (o.value)}
      <label
        class={[
          "relative flex h-[calc(var(--eu-size-control-md)-0.625rem)] cursor-pointer select-none items-center rounded-control px-4 text-sm font-semibold transition-colors",
          "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-focus",
          current === o.value ? "bg-surface text-ink shadow-sm" : "text-ink-muted hover:text-ink",
        ]}
      >
        <input
          type="radio"
          name={name ?? `${uid}-segments`}
          value={o.value}
          checked={current === o.value}
          onchange={() => {
            value = o.value;
            onValueChange?.(o.value);
          }}
          class="sr-only"
        />
        <Text content={o.label} />
      </label>
    {/each}
  </div>
</div>
