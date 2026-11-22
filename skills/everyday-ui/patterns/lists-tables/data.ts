const LOCALE = "en-IE";

export const money = (n: number) => new Intl.NumberFormat(LOCALE, { style: "currency", currency: "EUR" }).format(n);

export const date = (iso: string) => new Intl.DateTimeFormat(LOCALE, { day: "2-digit", month: "short", year: "numeric" }).format(new Date(iso));

export type Status = "Paid" | "Open" | "Overdue";

type Invoice = { no: string; client: string; issued: string; due: string; amount: number; status: Status };

export const INVOICES: Invoice[] = [
  { no: "INV-0212", client: "Nordlicht GmbH", issued: "2026-11-20", due: "2026-12-04", amount: 4200, status: "Open" },
  { no: "INV-0211", client: "Studio Krone", issued: "2026-11-18", due: "2026-12-02", amount: 1850, status: "Open" },
  { no: "INV-0210", client: "Hafen & Söhne", issued: "2026-11-02", due: "2026-11-16", amount: 960, status: "Overdue" },
  { no: "INV-0209", client: "Lumen Labs", issued: "2026-10-30", due: "2026-11-13", amount: 7300, status: "Paid" },
  { no: "INV-0208", client: "Berliner Bäckerei Kollektiv", issued: "2026-10-28", due: "2026-11-11", amount: 1240.5, status: "Overdue" },
  { no: "INV-0207", client: "Nordlicht GmbH", issued: "2026-10-15", due: "2026-10-29", amount: 3800, status: "Paid" },
  { no: "INV-0206", client: "Atelier Morgen", issued: "2026-10-09", due: "2026-10-23", amount: 2150, status: "Paid" },
];

export const TONE = { Paid: "success", Open: "neutral", Overdue: "danger" } as const;

export type SortKey = "client" | "due" | "amount";
