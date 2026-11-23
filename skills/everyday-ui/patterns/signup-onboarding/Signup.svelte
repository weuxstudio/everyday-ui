<script lang="ts">
  import { Button, Checkbox, ErrorSummary, Field, PasswordField, type ErrorSummaryItem } from "@everyday-ui/svelte";
  import { PRODUCT, PASSWORD_RULES } from "./data";
  let { onDone }: { onDone: () => void } = $props();
  let email = $state("");
  let password = $state("");
  let submitAttempt = $state(0);
  let errors = $state<ErrorSummaryItem[]>([]);
  let busy = $state(false);
  const errorFor = (id: string) => errors.find((e) => e.fieldId === id)?.message;
  const submit = (e: SubmitEvent) => {
    e.preventDefault();
    const next: ErrorSummaryItem[] = [];
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      next.push({ fieldId: "signup-email", message: "Enter an email address, like mara@studio.com" });
    if (!PASSWORD_RULES(email).every((r) => r.test(password)))
      next.push({ fieldId: "signup-password", message: "Choose a password that meets both requirements" });
    submitAttempt = submitAttempt + 1;
    errors = next;
    if (next.length === 0) {
      busy = true;
      setTimeout(onDone, 700);
    }
  };
</script>

<main class="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
  <h1 class="text-3xl font-heading">Create your {PRODUCT} account</h1>
  <p class="mt-2 text-lg text-ink-muted">Free for 30 days. No card needed.</p>

  <div class="mt-8 flex flex-col gap-4">
    <Button fullWidth>Continue with Google</Button>
    <Button fullWidth>Continue with Microsoft</Button>
  </div>

  <div class="my-8 flex items-center gap-4 text-sm text-ink-muted" role="separator" aria-label="or">
    <span class="h-px flex-1 bg-border"></span>
    or
    <span class="h-px flex-1 bg-border"></span>
  </div>

  <form novalidate onsubmit={submit} class="flex flex-col gap-6">
    <ErrorSummary {submitAttempt} {errors} />
    <Field
      id="signup-email"
      label="Work email"
      type="email"
      autocomplete="email"
      bind:value={email}
      error={errorFor("signup-email")}
    />
    <PasswordField
      id="signup-password"
      label="Password"
      purpose="new"
      rules={PASSWORD_RULES(email)}
      bind:value={password}
      error={errorFor("signup-password")}
    />
    <Checkbox label="Send me tips and product news (about once a month)" />
    <div class="flex flex-col gap-4">
      <Button type="submit" variant="primary" size="lg" fullWidth loading={busy}>Create account</Button>
      <p class="text-sm text-ink-muted">
        By creating an account you agree to the <a href="#terms">terms of service</a> and the
        <a href="#privacy">privacy policy</a>.
      </p>
    </div>
  </form>

  <p class="mt-12 text-base">
    Already have an account? <a href="#signin">Sign in</a>
  </p>
</main>
