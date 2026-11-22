# Checkout

**Job:** turn the decision to buy into a completed order with zero surprises. Every doubt,
unexpected cost or extra field here costs a sale.

## Structure

1. Focused frame: logo, secure-checkout note, help contact. No main navigation, no promotions.
2. Steps: **Delivery → Payment → Review**, shown with a step indicator. (Guest checkout first;
   sign-in optional.)
3. Order summary always visible: right column on desktop, collapsible "Show order summary
   (€84.90)" at the top on phones. Items, quantities, subtotal, shipping, VAT, **total**.
4. Delivery: email (for the receipt), name, address (autocomplete), delivery options with price
   and date.
5. Payment: methods as radio cards with name and logo, details only for the chosen one, billing
   address "same as delivery" (checked by default).
6. Review: everything on one page with "Change" links per block, terms note, final button.
7. Confirmation: order number, what happens next, delivery estimate, receipt sent to (email),
   account creation offer for guests (password only).

## Rules

1. **Guest checkout by default.** Offer account creation after the order, when it's one field.
2. **Total cost early and constant.** Shipping and taxes visible before the payment step; the
   total never jumps at the end.
3. **Ask once.** Billing equals delivery by default; reuse the email; autofill everything
   (`autocomplete="shipping street-address"`, `cc-number`, `cc-exp`, `cc-csc`).
4. **Format and validate kindly**: accept spaces in card numbers, detect the card type, validate on
   submit per step, keep all entries on error.
5. **Payment failures explain the next step** ("Your bank declined the payment. Try another card or
   pay with PayPal.") and never empty the form.
6. **The final button states the obligation.** In Germany and the EU, the order button must say
   that the order costs money: "Zahlungspflichtig bestellen" / "Order with obligation to pay" (or
   "Buy now"). "Continue" or "Submit" is not allowed for the final step.
7. **Make every step reversible** until the final press: steps are clickable once done, "Change"
   links in review.
8. **Trust at the point of doubt**: security note at the payment fields, return policy and delivery
   date near the total, a support contact.
9. **One column of fields**, generous targets, the primary button full width on phones.

## States

- Out of stock / price changed between cart and checkout: explain at the top, update the summary,
  let them confirm.
- Address can't be validated: suggest the corrected address, let them keep theirs.
- 3-D Secure / bank app redirect: say it will happen, keep the order on return.
- Double press on the final button: one order only (idempotent), loading state.

## Avoid

- Forced account creation, coupon fields that dominate the page (keep "Add a discount code" as a
  link), surprise fees, pre-checked add-ons or insurance, newsletter pre-ticked.
- Losing data on back navigation. Timers and fake scarcity.

## Blueprint

`Checkout.tsx` – step indicator, delivery form with autocomplete, delivery options, payment radio
cards, review with change links, sticky order summary, legally correct final button, and a
confirmation screen. Adapt: products, methods, legal texts for the market.
