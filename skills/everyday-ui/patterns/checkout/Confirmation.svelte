<script lang="ts">
  import { Button, PasswordField } from "@everyday-ui/svelte";
  import { money } from "./data";
  let { email, total }: { email: string; total: number } = $props();
</script>

<main class="mx-auto max-w-2xl px-4 py-20 sm:px-6">
  <p class="text-sm font-semibold uppercase tracking-[0.08em] text-success">Order placed</p>
  <h1 class="mt-2 text-3xl font-heading">Thank you, your order is on its way</h1>
  <p class="mt-3 text-lg text-ink-muted">
    Order <strong class="text-ink">AP-48213</strong> · {money(total)}. A receipt is on its way to {email ||
      "your email"}.
  </p>
  <ol class="mt-12 flex flex-col gap-4 rounded-card border border-border bg-surface p-card">
    <li><strong>Today:</strong> we pack your order and send you the tracking link.</li>
    <li><strong>Wed 25 – Fri 27 November:</strong> delivery to your door.</li>
    <li><strong>Within 30 days:</strong> free returns if anything isn't right.</li>
  </ol>
  <section aria-labelledby="save-details" class="mt-12 flex flex-col gap-4">
    <h2 id="save-details" class="text-xl font-heading">Save your details for next time</h2>
    <p class="text-ink-muted">Just add a password; we'll use the email from this order.</p>
    <PasswordField
      label="Password"
      purpose="new"
      rules={[{ label: "At least 12 characters", test: (v) => v.length >= 12 }]}
    />
    <div>
      <Button variant="primary" fullWidth="mobile">Create account</Button>
    </div>
  </section>
</main>
