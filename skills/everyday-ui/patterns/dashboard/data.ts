const LOCALE = "en-IE";

export const money = (n: number, compact = false) =>
  new Intl.NumberFormat(LOCALE, { style: "currency", currency: "EUR", notation: compact ? "compact" : "standard", maximumFractionDigits: compact ? 1 : 0 }).format(n);

export const pct = (n: number) => new Intl.NumberFormat(LOCALE, { style: "percent", maximumFractionDigits: 0, signDisplay: "exceptZero" }).format(n);

export const NAV = ["Overview", "Invoices", "Clients", "Projects", "Reports", "Settings"];

export const METRICS = [
  { label: "Revenue", value: money(48210, true), change: 0.12, better: "up", detail: "View revenue" },
  { label: "Outstanding", value: money(12940, true), change: -0.08, better: "down", detail: "View open invoices" },
  { label: "Overdue", value: money(3120, true), change: 0.21, better: "down", detail: "View overdue invoices" },
  { label: "Avg. days to payment", value: "18 days", change: -0.1, better: "down", detail: "View payment times" },
] as const;

export const MONTHS = [
  ["Jun", 31200], ["Jul", 35800], ["Aug", 29400], ["Sep", 41000], ["Oct", 44700], ["Nov", 48210],
] as const;

export const ATTENTION = [
  { text: "3 invoices are more than 14 days overdue", amount: money(3120), action: "Send reminders" },
  { text: "Quote for Nordlicht GmbH expires tomorrow", amount: money(8400), action: "Follow up" },
];

export const RECENT = [
  { no: "INV-0212", client: "Nordlicht GmbH", date: "20 Nov 2026", amount: 4200, status: "Paid" },
  { no: "INV-0211", client: "Studio Krone", date: "18 Nov 2026", amount: 1850, status: "Open" },
  { no: "INV-0210", client: "Hafen & Söhne", date: "02 Nov 2026", amount: 960, status: "Overdue" },
  { no: "INV-0209", client: "Lumen Labs", date: "30 Oct 2026", amount: 7300, status: "Paid" },
];

export const TONE = { Paid: "success", Open: "neutral", Overdue: "danger" } as const;
