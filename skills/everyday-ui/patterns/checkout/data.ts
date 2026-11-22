const LOCALE = "en-IE";

export const money = (n: number) => new Intl.NumberFormat(LOCALE, { style: "currency", currency: "EUR" }).format(n);

export const ITEMS = [
  { name: "Linen notebook, A5", variant: "Sand", qty: 2, price: 24.5 },
  { name: "Brass pen", variant: "Fine nib", qty: 1, price: 29.0 },
];

export const SHIPPING = { standard: 0, express: 9.9 };

export const STEPS = ["Delivery", "Payment", "Review"];

export type Data = { email: string; name: string; street: string; postcode: string; city: string; shipping: keyof typeof SHIPPING; payment: string };
