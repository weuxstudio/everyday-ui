<script lang="ts">
  import { Button, Dialog, Field } from "@everyday-ui/svelte";
  import { WORKSPACE } from "./data";
  let open = $state(false);
  let typed = $state("");
  let error = $state<string | undefined>();
  const close = () => {
    open = false;
    typed = "";
    error = undefined;
  };
</script>

<section aria-labelledby="danger" class="flex flex-col gap-4 border-t border-border pt-12">
  <h2 id="danger" class="text-xl font-heading">Delete workspace</h2>
  <p class="text-ink-muted">
    Permanently removes all projects, invoices and files for every member. Export your data first if you need it.
  </p>
  <div>
    <Button onclick={() => (open = true)}>Delete workspace…</Button>
  </div>
  <Dialog
    {open}
    onclose={close}
    title={`Delete ${WORKSPACE}?`}
    description="14 projects and 212 invoices are deleted for all 3 members. This can't be undone."
  >
    {#snippet footer()}
      <Button
        variant="danger"
        onclick={() => (typed.trim() === WORKSPACE ? close() : (error = `Type ${WORKSPACE} exactly as shown`))}
      >
        Delete workspace
      </Button>
      <Button onclick={close} autofocus>Keep workspace</Button>
    {/snippet}
    <Field label={`Type “${WORKSPACE}” to confirm`} bind:value={typed} {error} autocomplete="off" />
  </Dialog>
</section>
