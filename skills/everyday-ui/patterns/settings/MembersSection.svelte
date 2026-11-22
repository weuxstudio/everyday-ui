<script lang="ts">
  import { Badge, Button } from "@everyday-ui/svelte";
  const members = [
    { name: "Mara Lindqvist", email: "mara@atlas-studio.com", role: "Owner" },
    { name: "Jonas Weber", email: "jonas@atlas-studio.com", role: "Editor" },
    { name: "Priya Raman", email: "priya@atlas-studio.com", role: "Viewer", pending: true },
  ];
</script>

<section aria-labelledby="members" class="flex flex-col gap-4">
  <header class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h2 id="members" class="text-xl font-heading">Members</h2>
      <p class="mt-1 text-ink-muted">People who can open and edit this workspace.</p>
    </div>
    <Button>Invite member</Button>
  </header>
  <ul class="divide-y divide-border rounded-card border border-border bg-surface px-card">
    {#each members as m (m.email)}
      <li class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
        <span class="flex min-w-0 flex-col">
          <span class="font-semibold">{m.name}</span>
          <span class="truncate text-sm text-ink-muted">{m.email}</span>
        </span>
        <span class="flex items-center gap-3">
          {#if m.pending}<Badge tone="warning">Invite pending</Badge>{/if}
          <span class="text-sm text-ink-muted">{m.role}</span>
          {#if m.role !== "Owner"}<Button variant="tertiary" size="sm">Remove</Button>{/if}
        </span>
      </li>
    {/each}
  </ul>
  <p class="text-sm text-ink-muted">Only owners can change roles or billing.</p>
</section>
