const LOCALE = "en-IE";

export const money = (n: number) => new Intl.NumberFormat(LOCALE, { style: "currency", currency: "EUR", maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);

type Plan = { id: string; name: string; audience: string; monthly: number; yearly: number; limits: string[]; features: string[]; cta: string; popular?: boolean };

export const PLANS: Plan[] = [
  { id: "solo", name: "Solo", audience: "For freelancers", monthly: 9, yearly: 7, limits: ["1 person", "10 active projects"], features: ["Invoices and quotes", "Payment reminders"], cta: "Start with Solo" },
  { id: "studio", name: "Studio", audience: "For small teams", monthly: 29, yearly: 24, limits: ["Up to 10 people", "Unlimited projects"], features: ["Everything in Solo", "Shared client library", "Approval workflows"], cta: "Start with Studio", popular: true },
  { id: "agency", name: "Agency", audience: "For agencies with many clients", monthly: 79, yearly: 65, limits: ["Unlimited people", "Client workspaces"], features: ["Everything in Studio", "Client portal", "Priority support"], cta: "Start with Agency" },
];

export const INCLUDED = ["30-day free trial", "Cancel anytime", "Bank-grade encryption", "Export your data anytime"];

export const FAQ = [
  ["Can I change plans later?", "Yes. Upgrades apply immediately and are charged pro rata. Downgrades apply at the end of the billing period."],
  ["Is VAT included?", "Prices shown exclude VAT. VAT is added at checkout based on your country; businesses with a valid VAT ID are not charged VAT."],
  ["What happens after the trial?", "We remind you 3 days before the trial ends. Without a payment method your account switches to read-only; nothing is deleted."],
];
