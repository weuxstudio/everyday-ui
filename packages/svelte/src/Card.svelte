<script lang="ts">
  import type { Snippet } from "svelte";
  import Text from "./lib/Text.svelte";
  type Content = string | Snippet;
  import type { HTMLAttributes } from "svelte/elements";
  type Props = Omit<HTMLAttributes<HTMLElement>, "title"> & {
    as?: "div" | "section" | "article" | "li";
    title?: Content;
    description?: Content;
    actions?: Snippet;
    elevation?: "flat" | "raised";
  };
  let {
    as: Tag = "section",
    title,
    description,
    actions,
    elevation = "flat",
    class: className,
    children,
    id,
    ...rest
  }: Props = $props();
  const uid = $props.id();
  const headingId = $derived(title ? (id ?? uid) + "-title" : undefined);
</script>

<svelte:element
  this={Tag}
  {id}
  aria-labelledby={headingId}
  class={["rounded-card border border-border bg-surface p-card", elevation === "raised" && "shadow-md", className]}
  {...rest}
>
  {#if title || actions}<header class="mb-4 flex items-start justify-between gap-4">
      <div class="min-w-0">
        {#if title}<h2 id={headingId} class="text-lg font-heading text-ink">
            <Text content={title} />
          </h2>{/if}
        {#if description}<p class="mt-1 text-sm text-ink-muted"><Text content={description} /></p>{/if}
      </div>
      {#if actions}<div class="flex shrink-0 items-center gap-2">{@render actions?.()}</div>{/if}
    </header>{/if}
  {@render children?.()}
</svelte:element>
