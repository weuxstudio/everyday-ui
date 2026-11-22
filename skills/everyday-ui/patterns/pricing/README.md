# Pricing

**Job:** help people find the plan that fits them and feel safe choosing it. Pricing is a
comparison task; the layout must make comparing effortless.

## Structure

1. Heading that speaks to the decision ("Plans for every team size"), one line on what all plans
   include (trial, cancel anytime).
2. Billing period switch (segmented control: Monthly / Yearly) if both exist, showing the saving
   in words ("Yearly – 2 months free").
3. Two to four plan columns, same structure in each: name → one-line audience ("For freelancers")
   → price with period → primary or secondary action → key limits → features.
4. One recommended plan, highlighted by a label ("Most popular") and a stronger border or
   primary button, not by a different layout.
5. Full feature comparison table below for people who want detail (optional, collapsible on
   phones).
6. FAQ on billing, cancellation, refunds, invoices, taxes. Contact for enterprise.

## Rules

1. **Same structure, same order, aligned rows** in every plan. Feature lists of similar length;
   phrase features the same way across plans so differences stand out.
2. **One recommended plan, at most.** Highlight with one or two cues; the rest stay equal.
3. **Price is the largest number on the card**, with currency and period next to it on the
   baseline ("€29 /month"). Say clearly whether VAT is included. Use the locale's formatting.
4. **Show what changes between plans first** (seats, projects, limits); list shared features once
   ("All plans include …") instead of repeating them.
5. **Action labels name the plan or outcome:** "Start with Studio", "Talk to sales". The
   recommended plan gets the primary button; others secondary. Free plan: "Start for free".
6. **No surprise costs later.** Per-seat pricing shows the total for a realistic team size or has a
   calculator; add-ons are named here.
7. **The yearly toggle updates prices in place** without layout jump; announce changes to screen
   readers (`aria-live`).
8. **Phones:** stack plans with the recommended one first or clearly marked; keep the comparison
   table horizontally scrollable with the feature column sticky, or switch to per-plan lists.
9. **Use checkmarks with text**, not color alone; for "not included" show an em dash with
   `sr-only` text "Not included", or omit the row.

## States

- Current plan (for signed-in users): "Current plan" badge, action becomes "Manage plan".
- Region or currency switch if relevant.
- Discount or trial: state the end date and the price after.

## Avoid

- Different card heights and feature orders. Decoy plans. Hidden fees.
- Toggles defaulting to yearly without saying so. Prices like "€29*" with fine print.
- More than four plans side by side.

## Blueprint

`Pricing.tsx` – segmented billing period, three aligned plan cards with one highlighted, shared
features listed once, and a compact FAQ. Adapt: plans, limits, currency and VAT note.
