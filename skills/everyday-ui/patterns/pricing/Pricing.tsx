// Blueprint: pricing. Copy into the project and adapt plans, limits, currency and tax note.
// Rules: patterns/pricing/README.md
import { useState } from "react";
import { Badge, Button, SegmentedControl, cx } from "@everyday-ui/react";

 // e.g. "de-DE" for German formatting

import { money, PLANS, INCLUDED, FAQ } from "./data";

export default function Pricing() {
  const [period, setPeriod] = useState("yearly");
  const yearly = period === "yearly";

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-heading">Plans for every team size</h1>
        <p className="mt-3 text-lg text-ink-muted">Every plan starts with a 30-day free trial. No card needed.</p>
      </header>

      <div className="mt-12">
        <SegmentedControl
          label="Billing period"
          hideLabel
          value={period}
          onValueChange={setPeriod}
          options={[
            { value: "monthly", label: "Monthly" },
            { value: "yearly", label: "Yearly · save up to 22%" },
          ]}
        />
      </div>

      <ul className="mt-8 grid gap-6 lg:grid-cols-3">
        {PLANS.map((p) => {
          const perMonth = yearly ? p.yearly : p.monthly;
          return (
            <li
              key={p.id}
              className={cx(
                "flex flex-col rounded-card bg-surface p-card",
                p.popular ? "border-2 border-accent shadow-md" : "border border-border",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-heading">{p.name}</h2>
                {p.popular ? <Badge>Most popular</Badge> : null}
              </div>
              <p className="mt-1 text-ink-muted">{p.audience}</p>

              <p className="mt-6 flex items-baseline gap-1.5" aria-live="polite">
                <span className="text-4xl font-heading tabular-nums">{money(perMonth)}</span>
                <span className="text-ink-muted">/ month</span>
              </p>
              <p className="mt-1 min-h-[1.5em] text-sm text-ink-muted">
                {yearly ? `Billed ${money(p.yearly * 12)} yearly, excl. VAT` : "Billed monthly, excl. VAT"}
              </p>

              <Button className="mt-6" variant={p.popular ? "primary" : "secondary"} fullWidth>
                {p.cta}
              </Button>

              <ul className="mt-6 flex flex-col gap-2 border-t border-border pt-6">
                {[...p.limits, ...p.features].map((f, i) => (
                  <li key={f} className={cx("flex gap-2", i < p.limits.length && "font-semibold")}>
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-success" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>

      <section aria-labelledby="included" className="mt-12 rounded-card bg-sunken p-card">
        <h2 id="included" className="text-lg font-heading">
          All plans include
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {INCLUDED.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <p className="mt-6 text-base">
        More than 50 people or special requirements? <a href="#contact">Talk to our team</a>
      </p>

      <section aria-labelledby="faq" className="mt-20 max-w-measure">
        <h2 id="faq" className="text-2xl font-heading">
          Questions about billing
        </h2>
        <div className="mt-6 divide-y divide-border border-y border-border">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="flex min-h-touch cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {q}
                <span aria-hidden="true" className="text-xl text-accent transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="pb-2 text-ink-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
