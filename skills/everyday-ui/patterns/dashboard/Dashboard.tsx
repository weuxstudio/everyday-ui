// Blueprint: dashboard. Copy into the project; start from the questions your users bring.
// Rules: patterns/dashboard/README.md
import { useState } from "react";
import { Badge, Button, SegmentedControl, cx } from "@everyday-ui/react";

const LOCALE = "en-IE";
const money = (n: number, compact = false) =>
  new Intl.NumberFormat(LOCALE, { style: "currency", currency: "EUR", notation: compact ? "compact" : "standard", maximumFractionDigits: compact ? 1 : 0 }).format(n);
const pct = (n: number) => new Intl.NumberFormat(LOCALE, { style: "percent", maximumFractionDigits: 0, signDisplay: "exceptZero" }).format(n);

const NAV = ["Overview", "Invoices", "Clients", "Projects", "Reports", "Settings"];

const METRICS = [
  { label: "Revenue", value: money(48210, true), change: 0.12, better: "up", detail: "View revenue" },
  { label: "Outstanding", value: money(12940, true), change: -0.08, better: "down", detail: "View open invoices" },
  { label: "Overdue", value: money(3120, true), change: 0.21, better: "down", detail: "View overdue invoices" },
  { label: "Avg. days to payment", value: "18 days", change: -0.1, better: "down", detail: "View payment times" },
] as const;

const MONTHS = [
  ["Jun", 31200], ["Jul", 35800], ["Aug", 29400], ["Sep", 41000], ["Oct", 44700], ["Nov", 48210],
] as const;

const ATTENTION = [
  { text: "3 invoices are more than 14 days overdue", amount: money(3120), action: "Send reminders" },
  { text: "Quote for Nordlicht GmbH expires tomorrow", amount: money(8400), action: "Follow up" },
];

const RECENT = [
  { no: "INV-0212", client: "Nordlicht GmbH", date: "20 Nov 2026", amount: 4200, status: "Paid" },
  { no: "INV-0211", client: "Studio Krone", date: "18 Nov 2026", amount: 1850, status: "Open" },
  { no: "INV-0210", client: "Hafen & Söhne", date: "02 Nov 2026", amount: 960, status: "Overdue" },
  { no: "INV-0209", client: "Lumen Labs", date: "30 Oct 2026", amount: 7300, status: "Paid" },
];
const TONE = { Paid: "success", Open: "neutral", Overdue: "danger" } as const;

export default function Dashboard() {
  const [range, setRange] = useState("30d");
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[15rem_1fr]">
      <nav aria-label="Main" className="border-b border-border bg-surface px-4 py-3 lg:min-h-dvh lg:border-b-0 lg:border-r lg:px-4 lg:py-8">
        <p className="px-3 pb-2 font-heading text-lg lg:pb-6">Atlas</p>
        <ul className="flex gap-1 overflow-x-auto lg:flex-col">
          {NAV.map((n, i) => (
            <li key={n}>
              <a
                href={`#${n.toLowerCase()}`}
                aria-current={i === 0 ? "page" : undefined}
                className={cx(
                  "flex min-h-touch items-center whitespace-nowrap rounded-control px-3 no-underline",
                  i === 0 ? "bg-accent-subtle font-semibold text-accent" : "text-ink hover:bg-sunken",
                )}
              >
                {n}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-ink-muted">Sunday, 22 November</p>
            <h1 className="mt-1 text-3xl font-heading">Overview</h1>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <SegmentedControl
              label="Time range"
              hideLabel
              value={range}
              onValueChange={setRange}
              options={[
                { value: "7d", label: "7 days" },
                { value: "30d", label: "30 days" },
                { value: "12m", label: "12 months" },
              ]}
            />
            <Button variant="primary">New invoice</Button>
          </div>
        </header>

        <section aria-labelledby="attention" className="mt-10 rounded-card border border-warning bg-warning-subtle p-card">
          <h2 id="attention" className="text-lg font-heading">
            Needs your attention
          </h2>
          <ul className="mt-2 divide-y divide-border">
            {ATTENTION.map((a) => (
              <li key={a.text} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  {a.text} <span className="font-semibold tabular-nums">· {a.amount}</span>
                </span>
                <Button size="sm">{a.action}</Button>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Key numbers" className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {METRICS.map((m) => {
            const good = (m.change > 0 && m.better === "up") || (m.change < 0 && m.better === "down");
            return (
              <a key={m.label} href="#detail" className="group flex flex-col gap-1 rounded-card border border-border bg-surface p-card text-ink no-underline hover:border-border-strong">
                <span className="text-sm text-ink-muted">{m.label}</span>
                <span className="text-2xl font-heading tabular-nums">{m.value}</span>
                <span className="text-sm">
                  <span className={cx("font-semibold", good ? "text-success" : "text-danger")}>
                    <span aria-hidden="true">{m.change > 0 ? "▲ " : "▼ "}</span>
                    {pct(m.change)}
                  </span>{" "}
                  <span className="text-ink-muted">vs. previous 30 days</span>
                </span>
                <span className="mt-2 text-sm text-accent underline decoration-from-font underline-offset-[0.2em] group-hover:text-accent-hover">{m.detail}</span>
              </a>
            );
          })}
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[3fr_2fr]">
          <RevenueChart />
          <section aria-labelledby="recent" className="rounded-card border border-border bg-surface p-card">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="recent" className="text-lg font-heading">
                Latest invoices
              </h2>
              <a href="#invoices">View all</a>
            </div>
            <table className="mt-4 w-full text-left">
              <thead className="text-sm text-ink-muted">
                <tr>
                  <th className="py-2 font-regular">Client</th>
                  <th className="py-2 text-right font-regular">Amount</th>
                  <th className="py-2 pl-4 font-regular">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {RECENT.map((r) => (
                  <tr key={r.no}>
                    <td className="py-3">
                      <a href={`#${r.no}`} className="font-semibold text-ink no-underline hover:underline">
                        {r.client}
                      </a>
                      <div className="text-sm text-ink-muted">{r.no} · {r.date}</div>
                    </td>
                    <td className="py-3 text-right tabular-nums">{money(r.amount)}</td>
                    <td className="py-3 pl-4">
                      <Badge tone={TONE[r.status as keyof typeof TONE]}>{r.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </div>
  );
}

function RevenueChart() {
  const max = Math.max(...MONTHS.map(([, v]) => v));
  const W = 560, H = 220, pad = 28, bw = 56;
  const gap = (W - pad * 2 - bw * MONTHS.length) / (MONTHS.length - 1);
  return (
    <figure className="m-0 rounded-card border border-border bg-surface p-card">
      <figcaption>
        <h2 className="text-lg font-heading">Revenue by month</h2>
        <p className="text-sm text-ink-muted">Growing for three months in a row; November is the best month this year.</p>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H + 40}`} className="mt-4 w-full" role="img" aria-labelledby="chart-desc">
        <desc id="chart-desc">Bar chart of monthly revenue from June to November; values in the table below.</desc>
        <line x1={pad} x2={W - pad} y1={H} y2={H} stroke="var(--eu-color-border-strong)" />
        {MONTHS.map(([m, v], i) => {
          const h = (v / max) * (H - 36);
          const x = pad + i * (bw + gap);
          const current = i === MONTHS.length - 1;
          return (
            <g key={m}>
              <rect x={x} y={H - h} width={bw} height={h} rx="4" fill={current ? "var(--eu-color-accent)" : "var(--eu-color-border-strong)"} />
              <text x={x + bw / 2} y={H - h - 8} textAnchor="middle" fontSize="13" fontWeight={current ? 600 : 400} fill="var(--eu-color-ink)">
                {money(v, true)}
              </text>
              <text x={x + bw / 2} y={H + 22} textAnchor="middle" fontSize="13" fill="var(--eu-color-ink-muted)">
                {m}
              </text>
            </g>
          );
        })}
      </svg>
      <table className="sr-only">
        <caption>Revenue by month</caption>
        <tbody>
          {MONTHS.map(([m, v]) => (
            <tr key={m}>
              <th scope="row">{m}</th>
              <td>{money(v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
