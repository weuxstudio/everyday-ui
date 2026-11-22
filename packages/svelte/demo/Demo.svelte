<!-- Svelte adapter demo at phone width: a short form with validation on submit, a switch,
     a segmented control, a dialog and a bottom sheet that closes on back. -->
<script lang="ts">
  import { BottomSheet, Button, Checkbox, Dialog, EmptyState, ErrorSummary, Field, SegmentedControl, Switch } from "../src/index";
  import type { ErrorSummaryItem } from "../src/index";

  let name = $state("");
  let email = $state("");
  let terms = $state(false);
  let errors: ErrorSummaryItem[] = $state([]);
  let saving = $state(false);
  let reminders = $state(true);
  let period = $state("week");
  let confirmOpen = $state(false);
  let sheetOpen = $state(false);
  let status = $state("");

  function submit(e: SubmitEvent) {
    e.preventDefault();
    const next: ErrorSummaryItem[] = [];
    if (!name.trim()) next.push({ fieldId: "name", message: "Enter your full name" });
    if (!/^\S+@\S+\.\S+$/.test(email)) next.push({ fieldId: "email", message: "Enter an email address like name@example.com" });
    if (!terms) next.push({ fieldId: "terms", message: "Agree to the terms to create an account" });
    errors = next;
    if (next.length === 0) {
      saving = true;
      setTimeout(() => {
        saving = false;
        status = "Account created";
      }, 600);
    }
  }
  const errorFor = (id: string) => errors.find((x) => x.fieldId === id)?.message;
</script>

<main class="mx-auto flex max-w-2xl flex-col gap-12 px-4 py-8">
  <header class="flex flex-col gap-2">
    <p class="text-sm font-semibold text-ink-muted">Everyday UI · Svelte adapter</p>
    <h1 class="text-3xl font-heading">Create your account</h1>
    <p class="text-ink-muted">Required fields are marked with an asterisk *</p>
  </header>

  <form class="flex flex-col gap-6" novalidate onsubmit={submit}>
    <ErrorSummary {errors} />
    <Field id="name" label="Full name" required autocomplete="name" bind:value={name} error={errorFor("name")} />
    <Field id="email" label="Email" type="email" inputmode="email" required autocomplete="email" hint="We'll send a confirmation link" bind:value={email} error={errorFor("email")} />
    <Field id="postcode" label="Postcode" optional chars={5} inputmode="numeric" autocomplete="postal-code" />
    <Checkbox id="terms" label="I agree to the terms of service" required bind:checked={terms} error={errorFor("terms")} />
    <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <Button type="submit" variant="primary" loading={saving} fullWidth="mobile">Create account</Button>
      <Button variant="tertiary" onclick={() => (sheetOpen = true)}>More sign-up options</Button>
    </div>
    <p role="status" class="text-success">{status}</p>
  </form>

  <section class="flex flex-col gap-4" aria-labelledby="prefs">
    <h2 id="prefs" class="text-xl font-heading">Preferences</h2>
    <div class="rounded-card border border-border bg-surface px-card">
      <Switch label="Appointment reminders" hint="A push message one hour before" bind:checked={reminders} />
    </div>
    <SegmentedControl label="Summary email" options={[{ value: "day", label: "Daily" }, { value: "week", label: "Weekly" }, { value: "never", label: "Never" }]} bind:value={period} />
    <div><Button variant="secondary" onclick={() => (confirmOpen = true)}>Delete account</Button></div>
  </section>

  <section class="rounded-card border border-border bg-surface">
    <EmptyState title="No appointments yet" description="Appointments you book or receive appear here, grouped by day.">
      {#snippet icon()}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16" /></svg>{/snippet}
      {#snippet action()}<Button variant="primary">Book an appointment</Button>{/snippet}
    </EmptyState>
  </section>
</main>

<Dialog bind:open={confirmOpen} title="Delete your account?" description="Your appointments and notes will be deleted. This can't be undone.">
  {#snippet footer()}
    <Button variant="danger" onclick={() => { confirmOpen = false; status = "Account deleted"; }}>Delete account</Button>
    <Button variant="secondary" onclick={() => (confirmOpen = false)}>Keep account</Button>
  {/snippet}
</Dialog>

<BottomSheet bind:open={sheetOpen} title="More sign-up options" description="Use an account you already have.">
  <div class="flex flex-col gap-4 pb-2">
    <Button fullWidth onclick={() => (sheetOpen = false)}>Continue with a passkey</Button>
    <Button fullWidth onclick={() => (sheetOpen = false)}>Continue with your work email</Button>
  </div>
</BottomSheet>
