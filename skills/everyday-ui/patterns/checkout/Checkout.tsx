// Blueprint: checkout. Copy into the project; adapt products, methods and legal texts per market.
// Rules: patterns/checkout/README.md
import { useState, type FormEvent, type ReactNode } from "react";
import { Button, Checkbox, ErrorSummary, Field, PasswordField, ProgressSteps, RadioGroup, type ErrorSummaryItem } from "@everyday-ui/react";

import { money, ITEMS, SHIPPING, STEPS, type Data } from "./data";

export default function Checkout() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>({ email: "", name: "", street: "", postcode: "", city: "", shipping: "standard", payment: "card" });
  const [submitAttempt, setSubmitAttempt] = useState(0);
  const [errors, setErrors] = useState<ErrorSummaryItem[]>([]);
  const [placing, setPlacing] = useState(false);
  const set = (k: keyof Data) => (e: { target: { value: string } }) => setData((d) => ({ ...d, [k]: e.target.value }));
  const err = (id: string) => errors.find((e) => e.fieldId === id)?.message;

  const subtotal = ITEMS.reduce((s, i) => s + i.qty * i.price, 0);
  const total = subtotal + SHIPPING[data.shipping];

  const next = (e: FormEvent) => {
    e.preventDefault();
    const list: ErrorSummaryItem[] = [];
    if (step === 0) {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) list.push({ fieldId: "co-email", message: "Enter an email address for your receipt" });
      if (!data.name.trim()) list.push({ fieldId: "co-name", message: "Enter the recipient's full name" });
      if (!data.street.trim()) list.push({ fieldId: "co-street", message: "Enter a street and house number" });
      if (!/^\d{5}$/.test(data.postcode.replace(/\s/g, ""))) list.push({ fieldId: "co-postcode", message: "Enter a 5-digit postcode" });
      if (!data.city.trim()) list.push({ fieldId: "co-city", message: "Enter a town or city" });
    }
    setSubmitAttempt((attempt) => attempt + 1);
    setErrors(list);
    if (list.length) return;
    if (step < 2) setStep(step + 1);
    else {
      setPlacing(true);
      setTimeout(() => setStep(3), 900);
    }
  };

  if (step === 3) return <Confirmation email={data.email} total={total} />;

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <span className="font-heading text-lg">Atlas Paper Co.</span>
          <span className="text-sm text-ink-muted">Secure checkout<span className="hidden sm:inline"> · Questions? <a href="tel:+49401234567">+49 40 1234 567</a></span></span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:grid lg:grid-cols-[1fr_22rem] lg:gap-12 lg:py-12">
        {/* Phones: summary collapsed at the top, total always visible */}
        <details className="mb-8 rounded-card border border-border bg-surface lg:hidden">
          <summary className="flex min-h-touch cursor-pointer list-none items-center justify-between px-4 font-semibold">
            <span className="text-accent underline decoration-from-font underline-offset-[0.2em]">Show order summary</span>
            <span className="tabular-nums">{money(total)}</span>
          </summary>
          <div className="px-4 pb-4">
            <Summary shipping={SHIPPING[data.shipping]} subtotal={subtotal} total={total} />
          </div>
        </details>

        <main>
          <h1 className="text-3xl font-heading">Checkout</h1>
          <ProgressSteps className="mt-6" steps={STEPS} current={step} onStepClick={setStep} />

          <form noValidate onSubmit={next} className="mt-12 flex max-w-xl flex-col gap-6">
            <ErrorSummary submitAttempt={submitAttempt} errors={errors} />

            {step === 0 ? (
              <>
                <h2 className="text-xl font-heading">Delivery</h2>
                <Field id="co-email" label="Email" hint="For your receipt and delivery updates" type="email" autoComplete="email" value={data.email} onChange={set("email")} error={err("co-email")} />
                <Field id="co-name" label="Full name" autoComplete="shipping name" value={data.name} onChange={set("name")} error={err("co-name")} />
                <Field id="co-street" label="Street and house number" autoComplete="shipping street-address" value={data.street} onChange={set("street")} error={err("co-street")} />
                <div className="flex gap-4">
                  <Field id="co-postcode" label="Postcode" chars={5} inputMode="numeric" autoComplete="shipping postal-code" value={data.postcode} onChange={set("postcode")} error={err("co-postcode")} className="w-32 shrink-0" />
                  <Field id="co-city" label="Town or city" autoComplete="shipping address-level2" value={data.city} onChange={set("city")} error={err("co-city")} className="flex-1" />
                </div>
                <RadioGroup
                  legend="Delivery"
                  name="shipping"
                  value={data.shipping}
                  onValueChange={(v) => setData((d) => ({ ...d, shipping: v as Data["shipping"] }))}
                  options={[
                    { value: "standard", label: "Standard · free", hint: "Arrives Wed 25 – Fri 27 November" },
                    { value: "express", label: `Express · ${money(SHIPPING.express)}`, hint: "Arrives tomorrow, Mon 23 November" },
                  ]}
                />
              </>
            ) : null}

            {step === 1 ? (
              <>
                <h2 className="text-xl font-heading">Payment</h2>
                <RadioGroup
                  legend="Payment method"
                  name="payment"
                  value={data.payment}
                  onValueChange={(v) => setData((d) => ({ ...d, payment: v }))}
                  options={[
                    { value: "card", label: "Credit or debit card", hint: "Visa, Mastercard, American Express" },
                    { value: "paypal", label: "PayPal", hint: "You'll confirm in PayPal after reviewing your order" },
                    { value: "invoice", label: "Invoice", hint: "Pay within 14 days of delivery" },
                  ]}
                />
                {data.payment === "card" ? (
                  <div className="flex flex-col gap-6 rounded-card border border-border bg-surface p-card">
                    <Field label="Card number" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" />
                    <div className="flex gap-4">
                      <Field label="Expiry date" hint="MM / YY" autoComplete="cc-exp" inputMode="numeric" chars={7} className="w-36 shrink-0" />
                      <Field label="Security code" hint="3 digits on the back" autoComplete="cc-csc" inputMode="numeric" chars={4} className="flex-1" />
                    </div>
                    <p className="text-sm text-ink-muted">Card details are encrypted and sent directly to our payment provider; we never store them.</p>
                  </div>
                ) : null}
                <Checkbox label="Billing address is the same as delivery address" defaultChecked />
              </>
            ) : null}

            {step === 2 ? (
              <>
                <h2 className="text-xl font-heading">Review your order</h2>
                <ReviewBlock title="Delivery" onChange={() => setStep(0)}>
                  {data.name}, {data.street}, {data.postcode} {data.city}
                  <br />
                  {data.shipping === "express" ? "Express – arrives tomorrow" : "Standard – arrives Wed 25 – Fri 27 November"}
                </ReviewBlock>
                <ReviewBlock title="Payment" onChange={() => setStep(1)}>
                  {{ card: "Credit or debit card", paypal: "PayPal", invoice: "Invoice (14 days)" }[data.payment]}
                </ReviewBlock>
                <ReviewBlock title="Receipt to" onChange={() => setStep(0)}>
                  {data.email}
                </ReviewBlock>
                <p className="text-sm text-ink-muted">
                  By placing the order you agree to our <a href="#terms">terms</a>. You can withdraw within 14 days (<a href="#withdrawal">withdrawal policy</a>).
                </p>
              </>
            ) : null}

            <div className="flex flex-col gap-3">
              {/* Final step: the label must state the payment obligation (EU / German "Button-Lösung"). German: "Zahlungspflichtig bestellen". */}
              <Button type="submit" variant="primary" size="lg" fullWidth="mobile" loading={placing}>
                {step === 0 ? "Continue to payment" : step === 1 ? "Continue to review" : `Order with obligation to pay · ${money(total)}`}
              </Button>
            </div>
          </form>
        </main>

        <aside aria-label="Order summary" className="hidden lg:block">
          <div className="sticky top-8 rounded-card border border-border bg-surface p-card">
            <h2 className="text-lg font-heading">Order summary</h2>
            <Summary shipping={SHIPPING[data.shipping]} subtotal={subtotal} total={total} />
            <p className="mt-4 text-sm text-ink-muted">Free returns within 30 days.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Summary({ subtotal, shipping, total }: { subtotal: number; shipping: number; total: number }) {
  return (
    <>
      <ul className="mt-4 flex flex-col gap-3">
        {ITEMS.map((i) => (
          <li key={i.name} className="flex justify-between gap-4">
            <span>
              {i.name}
              <span className="block text-sm text-ink-muted">
                {i.variant} · Qty {i.qty}
              </span>
            </span>
            <span className="tabular-nums">{money(i.qty * i.price)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 flex flex-col gap-2 border-t border-border pt-4 tabular-nums">
        <div className="flex justify-between">
          <dt className="text-ink-muted">Subtotal</dt>
          <dd>{money(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-muted">Shipping</dt>
          <dd>{shipping ? money(shipping) : "Free"}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-2 text-lg font-semibold">
          <dt>Total</dt>
          <dd>{money(total)}</dd>
        </div>
        <p className="text-sm text-ink-muted">Includes {money((total / 1.19) * 0.19)} VAT</p>
      </dl>
      <p className="mt-4">
        <a href="#discount">Add a discount code</a>
      </p>
    </>
  );
}

function ReviewBlock({ title, children, onChange }: { title: string; children: ReactNode; onChange: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-ink-muted">{children}</p>
      </div>
      <Button variant="tertiary" size="sm" onClick={onChange}>
        Change<span className="sr-only"> {title.toLowerCase()}</span>
      </Button>
    </div>
  );
}

function Confirmation({ email, total }: { email: string; total: number }) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-success">Order placed</p>
      <h1 className="mt-2 text-3xl font-heading">Thank you, your order is on its way</h1>
      <p className="mt-3 text-lg text-ink-muted">
        Order <strong className="text-ink">AP-48213</strong> · {money(total)}. A receipt is on its way to {email || "your email"}.
      </p>
      <ol className="mt-12 flex flex-col gap-4 rounded-card border border-border bg-surface p-card">
        <li><strong>Today:</strong> we pack your order and send you the tracking link.</li>
        <li><strong>Wed 25 – Fri 27 November:</strong> delivery to your door.</li>
        <li><strong>Within 30 days:</strong> free returns if anything isn't right.</li>
      </ol>
      <section aria-labelledby="save-details" className="mt-12 flex flex-col gap-4">
        <h2 id="save-details" className="text-xl font-heading">
          Save your details for next time
        </h2>
        <p className="text-ink-muted">Just add a password; we'll use the email from this order.</p>
        <PasswordField label="Password" purpose="new" rules={[{ label: "At least 12 characters", test: (v) => v.length >= 12 }]} />
        <div>
          <Button variant="primary" fullWidth="mobile">Create account</Button>
        </div>
      </section>
    </main>
  );
}
