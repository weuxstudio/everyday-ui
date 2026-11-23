<script lang="ts">
  import {
    Button,
    Checkbox,
    ErrorSummary,
    Field,
    ProgressSteps,
    RadioGroup,
    type ErrorSummaryItem,
  } from "@everyday-ui/svelte";
  import { money, ITEMS, SHIPPING, STEPS, type Data } from "./data";
  import Summary from "./Summary.svelte";
  import ReviewBlock from "./ReviewBlock.svelte";
  import Confirmation from "./Confirmation.svelte";
  let step = $state(0);
  let data = $state<Data>({
    email: "",
    name: "",
    street: "",
    postcode: "",
    city: "",
    shipping: "standard",
    payment: "card",
  });
  let submitAttempt = $state(0);
  let errors = $state<ErrorSummaryItem[]>([]);
  let placing = $state(false);
  const err = (id: string) => errors.find((e) => e.fieldId === id)?.message;
  const subtotal = $derived(ITEMS.reduce((s, i) => s + i.qty * i.price, 0));
  const total = $derived(subtotal + SHIPPING[data.shipping]);
  const next = (e: SubmitEvent) => {
    e.preventDefault();
    const list: ErrorSummaryItem[] = [];
    if (step === 0) {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email))
        list.push({ fieldId: "co-email", message: "Enter an email address for your receipt" });
      if (!data.name.trim()) list.push({ fieldId: "co-name", message: "Enter the recipient's full name" });
      if (!data.street.trim()) list.push({ fieldId: "co-street", message: "Enter a street and house number" });
      if (!/^\d{5}$/.test(data.postcode.replace(/\s/g, "")))
        list.push({ fieldId: "co-postcode", message: "Enter a 5-digit postcode" });
      if (!data.city.trim()) list.push({ fieldId: "co-city", message: "Enter a town or city" });
    }
    submitAttempt = submitAttempt + 1;
    errors = list;
    if (list.length) return;
    if (step < 2) step = step + 1;
    else {
      placing = true;
      setTimeout(() => (step = 3), 900);
    }
  };
</script>

{#if step === 3}<Confirmation email={data.email} {total} />{:else}<div class="min-h-dvh">
    <header class="border-b border-border bg-surface">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <span class="font-heading text-lg">Atlas Paper Co.</span>
        <span class="text-sm text-ink-muted">
          Secure checkout<span class="hidden sm:inline">
            · Questions? <a href="tel:+49401234567">+49 40 1234 567</a>
          </span>
        </span>
      </div>
    </header>

    <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:grid lg:grid-cols-[1fr_22rem] lg:gap-12 lg:py-12">
      <details class="mb-8 rounded-card border border-border bg-surface lg:hidden">
        <summary class="flex min-h-touch cursor-pointer list-none items-center justify-between px-4 font-semibold">
          <span class="text-accent underline decoration-from-font underline-offset-[0.2em]">Show order summary</span>
          <span class="tabular-nums">{money(total)}</span>
        </summary>
        <div class="px-4 pb-4">
          <Summary shipping={SHIPPING[data.shipping]} {subtotal} {total} />
        </div>
      </details>

      <main>
        <h1 class="text-3xl font-heading">Checkout</h1>
        <ProgressSteps class="mt-6" steps={STEPS} current={step} onStepClick={(value) => (step = value)} />

        <form novalidate onsubmit={next} class="mt-12 flex max-w-xl flex-col gap-6">
          <ErrorSummary {submitAttempt} {errors} />

          {#if step === 0}
            <h2 class="text-xl font-heading">Delivery</h2>
            <Field
              id="co-email"
              label="Email"
              hint="For your receipt and delivery updates"
              type="email"
              autocomplete="email"
              bind:value={data.email}
              error={err("co-email")}
            />
            <Field
              id="co-name"
              label="Full name"
              autocomplete="shipping name"
              bind:value={data.name}
              error={err("co-name")}
            />
            <Field
              id="co-street"
              label="Street and house number"
              autocomplete="shipping street-address"
              bind:value={data.street}
              error={err("co-street")}
            />
            <div class="flex gap-4">
              <Field
                id="co-postcode"
                label="Postcode"
                chars={5}
                inputmode="numeric"
                autocomplete="shipping postal-code"
                bind:value={data.postcode}
                error={err("co-postcode")}
                class="w-32 shrink-0"
              />
              <Field
                id="co-city"
                label="Town or city"
                autocomplete="shipping address-level2"
                bind:value={data.city}
                error={err("co-city")}
                class="flex-1"
              />
            </div>
            <RadioGroup
              legend="Delivery"
              name="shipping"
              value={data.shipping}
              onValueChange={(v) => (data = { ...data, shipping: v as Data["shipping"] })}
              options={[
                { value: "standard", label: "Standard · free", hint: "Arrives Wed 25 – Fri 27 November" },
                {
                  value: "express",
                  label: `Express · ${money(SHIPPING.express)}`,
                  hint: "Arrives tomorrow, Mon 23 November",
                },
              ]}
            />
          {/if}

          {#if step === 1}
            <h2 class="text-xl font-heading">Payment</h2>
            <RadioGroup
              legend="Payment method"
              name="payment"
              value={data.payment}
              onValueChange={(v) => (data = { ...data, payment: v })}
              options={[
                { value: "card", label: "Credit or debit card", hint: "Visa, Mastercard, American Express" },
                { value: "paypal", label: "PayPal", hint: "You'll confirm in PayPal after reviewing your order" },
                { value: "invoice", label: "Invoice", hint: "Pay within 14 days of delivery" },
              ]}
            />
            {#if data.payment === "card"}<div
                class="flex flex-col gap-6 rounded-card border border-border bg-surface p-card"
              >
                <Field
                  label="Card number"
                  inputmode="numeric"
                  autocomplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                />
                <div class="flex gap-4">
                  <Field
                    label="Expiry date"
                    hint="MM / YY"
                    autocomplete="cc-exp"
                    inputmode="numeric"
                    chars={7}
                    class="w-36 shrink-0"
                  />
                  <Field
                    label="Security code"
                    hint="3 digits on the back"
                    autocomplete="cc-csc"
                    inputmode="numeric"
                    chars={4}
                    class="flex-1"
                  />
                </div>
                <p class="text-sm text-ink-muted">
                  Card details are encrypted and sent directly to our payment provider; we never store them.
                </p>
              </div>{/if}
            <Checkbox label="Billing address is the same as delivery address" checked />
          {/if}

          {#if step === 2}
            <h2 class="text-xl font-heading">Review your order</h2>
            <ReviewBlock title="Delivery" onChange={() => (step = 0)}>
              {data.name}, {data.street}, {data.postcode}
              {data.city}
              <br />
              {data.shipping === "express"
                ? "Express – arrives tomorrow"
                : "Standard – arrives Wed 25 – Fri 27 November"}
            </ReviewBlock>
            <ReviewBlock title="Payment" onChange={() => (step = 1)}>
              {{ card: "Credit or debit card", paypal: "PayPal", invoice: "Invoice (14 days)" }[data.payment]}
            </ReviewBlock>
            <ReviewBlock title="Receipt to" onChange={() => (step = 0)}>
              {data.email}
            </ReviewBlock>
            <p class="text-sm text-ink-muted">
              By placing the order you agree to our <a href="#terms">terms</a>. You can withdraw within 14 days (<a
                href="#withdrawal"
              >
                withdrawal policy
              </a>).
            </p>
          {/if}

          <div class="flex flex-col gap-3">
            <Button type="submit" variant="primary" size="lg" fullWidth="mobile" loading={placing}>
              {step === 0
                ? "Continue to payment"
                : step === 1
                  ? "Continue to review"
                  : `Order with obligation to pay · ${money(total)}`}
            </Button>
          </div>
        </form>
      </main>

      <aside aria-label="Order summary" class="hidden lg:block">
        <div class="sticky top-8 rounded-card border border-border bg-surface p-card">
          <h2 class="text-lg font-heading">Order summary</h2>
          <Summary shipping={SHIPPING[data.shipping]} {subtotal} {total} />
          <p class="mt-4 text-sm text-ink-muted">Free returns within 30 days.</p>
        </div>
      </aside>
    </div>
  </div>{/if}
