<!--
  Modal dialog on the native <dialog>: focus trap, Escape, inert background and focus return come
  from the browser. Title = short question, description = the consequence, footer = buttons named
  by outcome, most important first, left-aligned, stacked full width on phones.
-->
<script lang="ts">
  import type { Snippet } from "svelte";
  import Text from "./lib/Text.svelte";

  type Props = {
    open?: boolean;
    onclose?: () => void;
    title: string | Snippet;
    description?: string | Snippet;
    children?: Snippet;
    footer?: Snippet;
    class?: string;
  };
  let { open = $bindable(false), onclose, title, description, children, footer, class: className }: Props = $props();

  const uid = $props.id();
  let el: HTMLDialogElement | undefined = $state();

  $effect(() => {
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  });

  function close() {
    if (!open) return;
    open = false;
    onclose?.();
  }
</script>

<dialog
  bind:this={el}
  aria-labelledby="{uid}-title"
  aria-describedby={description ? `${uid}-desc` : undefined}
  oncancel={(e) => {
    e.preventDefault();
    close();
  }}
  onclose={close}
  onclick={(e) => {
    if (e.target === e.currentTarget) close();
  }}
  class={[
    "eu-dialog m-auto w-[min(32rem,calc(100vw-2rem))] rounded-dialog border border-border bg-overlay p-0 text-ink shadow-lg backdrop-blur-overlay backdrop-saturate-150",
    className,
  ]}
>
  <div class="flex flex-col gap-2 p-6">
    <h2 id="{uid}-title" class="text-xl font-heading"><Text content={title} /></h2>
    {#if description}<p id="{uid}-desc" class="text-base text-ink-muted"><Text content={description} /></p>{/if}
    {#if children}<div class="mt-2">{@render children()}</div>{/if}
  </div>
  {#if footer}
    <footer class="flex flex-col gap-3 px-6 pb-6 sm:flex-row [&>*]:w-full sm:[&>*]:w-auto">{@render footer()}</footer>
  {/if}
</dialog>
