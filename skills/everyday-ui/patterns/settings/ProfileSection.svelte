<script lang="ts">
  import { Button, ErrorSummary, Field, type ErrorSummaryItem } from "@everyday-ui/svelte";
  let email = $state("mara@atlas");
  let submitAttempt = $state(0);
  let errors = $state<ErrorSummaryItem[]>([]);
  let saveState = $state<"idle" | "saving" | "saved">("idle");
  const submit = (e: SubmitEvent) => {
    e.preventDefault();
    const next = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
      ? []
      : [{ fieldId: "profile-email", message: "Enter a full email address, like mara@atlas-studio.com" }];
    submitAttempt = submitAttempt + 1;
    errors = next;
    if (next.length) return;
    saveState = "saving";
    setTimeout(() => (saveState = "saved"), 700);
  };
</script>

<section aria-labelledby="profile" class="flex flex-col gap-6">
  <header>
    <h2 id="profile" class="text-xl font-heading">Profile</h2>
    <p class="mt-1 text-ink-muted">Shown to your team and on invoices you send.</p>
  </header>
  <form
    novalidate
    onsubmit={submit}
    oninput={() => saveState === "saved" && (saveState = "idle")}
    class="flex flex-col gap-6"
  >
    <ErrorSummary {submitAttempt} {errors} />
    <Field id="profile-name" label="Name" value="Mara Lindqvist" autocomplete="name" />
    <Field
      id="profile-email"
      label="Email"
      hint="We'll send a confirmation link to the new address. The old one stays active until then."
      type="email"
      autocomplete="email"
      bind:value={email}
      error={errors.find((x) => x.fieldId === "profile-email")?.message}
    />
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Button type="submit" variant="primary" loading={saveState === "saving"} fullWidth="mobile">Save profile</Button>
      <p class="text-sm text-success" role="status">
        {saveState === "saved" ? "✓ Profile saved" : ""}
      </p>
    </div>
  </form>
</section>
