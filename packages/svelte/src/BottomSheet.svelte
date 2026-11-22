<!--
  Bottom sheet for short, contextual tasks (pick, filter, quick add). Native <dialog>:
  focus trap, Escape, inert page and focus return from the browser. While open it is a history
  entry, so Android back / browser back closes the sheet instead of leaving the screen.
  Max 90 % height, grab handle AND close button, content scrolls inside, safe-area padding.
  Long forms and multi-step tasks belong on their own screen.
-->
<script lang="ts">
  import type { Snippet } from "svelte";
  import Text from "./lib/Text.svelte";

  type Props = {
    open?: boolean;
    /** Called for every way out: close button, Escape, scrim, system/browser back. */
    onclose?: () => void;
    title: string | Snippet;
    description?: string | Snippet;
    children?: Snippet;
    /** Sticky action bar: one primary action, full width. */
    footer?: Snippet;
    /** Push a history entry while open so back closes the sheet (default true). Off if your router models the sheet as a route. */
    closeOnBack?: boolean;
    /** Tap on the scrim closes. Turn off when closing would lose input. */
    dismissible?: boolean;
    closeLabel?: string;
    class?: string;
  };
  let {
    open = $bindable(false),
    onclose,
    title,
    description,
    children,
    footer,
    closeOnBack = true,
    dismissible = true,
    closeLabel = "Close",
    class: className,
  }: Props = $props();

  const uid = $props.id();
  let el: HTMLDialogElement | undefined = $state();
  let heading: HTMLHeadingElement | undefined = $state();
  let pushed = false;

  $effect(() => {
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      heading?.focus();
      if (closeOnBack) {
        history.pushState({ ...(history.state ?? {}), euSheet: true }, "");
        pushed = true;
      }
    }
    if (!open && el.open) {
      el.close();
      // Closed by the app, not by back: remove our history entry.
      if (pushed) {
        pushed = false;
        history.back();
      }
    }
  });

  $effect(() => {
    if (!closeOnBack) return;
    const onPop = () => {
      if (pushed && !history.state?.euSheet) {
        pushed = false;
        open = false;
        onclose?.();
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
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
  onclick={(e) => {
    if (dismissible && e.target === e.currentTarget) close();
  }}
  class={[
    "eu-sheet fixed inset-x-0 bottom-0 top-auto m-0 mx-auto flex-col p-0 open:flex",
    "max-h-[90dvh] w-full max-w-[40rem] overscroll-contain rounded-t-dialog border border-b-0 border-border bg-surface text-ink shadow-lg",
    className,
  ]}
>
  <div aria-hidden="true" class="mx-auto mt-2 h-[0.3125rem] w-9 shrink-0 rounded-full bg-border-strong"></div>
  <div class="flex shrink-0 items-start gap-4 py-2 pl-6 pr-4">
    <div class="flex flex-1 flex-col gap-1 pt-2">
      <h2 bind:this={heading} id="{uid}-title" tabindex="-1" class="text-xl font-heading outline-none"><Text content={title} /></h2>
      {#if description}<p id="{uid}-desc" class="text-base text-ink-muted"><Text content={description} /></p>{/if}
    </div>
    <button
      type="button"
      aria-label={closeLabel}
      onclick={close}
      class="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full text-ink hover:bg-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
    </button>
  </div>
  {#if children}
    <div class={["overflow-y-auto overscroll-contain px-6", footer ? "pb-4" : "pb-[calc(env(safe-area-inset-bottom)+1.5rem)]"]}>{@render children()}</div>
  {/if}
  {#if footer}
    <footer class="flex shrink-0 flex-col gap-3 border-t border-border px-6 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] [&>*]:w-full">{@render footer()}</footer>
  {/if}
</dialog>
