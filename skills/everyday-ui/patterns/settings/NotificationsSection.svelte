<script lang="ts">
  import { Switch } from "@everyday-ui/svelte";
  let saved = $state<string | null>(null);
  let timer: number | undefined;
  const announceSaved = (what: string) => {
    saved = what;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => (saved = null), 2500);
  };
</script>

<section aria-labelledby="notifications" class="flex flex-col gap-4">
  <header>
    <h2 id="notifications" class="text-xl font-heading">Notifications</h2>
    <p class="mt-1 text-ink-muted">Changes apply right away.</p>
  </header>
  <div class="divide-y divide-border rounded-card border border-border bg-surface px-card">
    <Switch
      class="py-3"
      label="Email me when an invoice is paid"
      checked
      onCheckedChange={() => announceSaved("payment emails")}
    />
    <Switch
      class="py-3"
      label="Email me when an invoice becomes overdue"
      checked
      onCheckedChange={() => announceSaved("overdue emails")}
    />
    <Switch
      class="py-3"
      label="Weekly summary every Monday"
      hint="Revenue, open invoices and what needs attention"
      onCheckedChange={() => announceSaved("weekly summary")}
    />
  </div>
  <p class="min-h-[1.5em] text-sm text-success" role="status">
    {saved ? `✓ Saved: ${saved}` : ""}
  </p>
</section>
