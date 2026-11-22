<!-- An empty area is a moment to teach, not a dead end. Centered: a short, isolated block. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import Text from "./lib/Text.svelte";

  type Props = {
    /** Simple line icon hinting at the content type. Decorative. */
    icon?: Snippet;
    /** What will appear here ("No invoices yet") or what happened ("No results for “berlin”"). */
    title: string | Snippet;
    /** Why it's empty and what the user gains by acting. */
    description?: string | Snippet;
    /** The action that fills it: usually one primary Button. */
    action?: Snippet;
    secondary?: Snippet;
    class?: string;
  };
  let { icon, title, description, action, secondary, class: className }: Props = $props();
</script>

<div class={["mx-auto flex max-w-md flex-col items-center gap-2 px-4 py-12 text-center", className]}>
  {#if icon}
    <div aria-hidden="true" class="mb-2 grid size-12 place-items-center rounded-card bg-accent-subtle text-accent [&>svg]:size-6">{@render icon()}</div>
  {/if}
  <h3 class="text-lg font-heading text-ink"><Text content={title} /></h3>
  {#if description}<p class="text-base text-ink-muted"><Text content={description} /></p>{/if}
  {#if action || secondary}
    <div class="mt-4 flex flex-col items-center gap-3">
      {@render action?.()}
      {@render secondary?.()}
    </div>
  {/if}
</div>
