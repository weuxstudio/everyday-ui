// Motion showcase: each technique once, all timed by the theme's motion tokens.
import { useState } from "react";
import { Button, Card, Checkbox, Dialog, Field, SegmentedControl } from "@everyday-ui/react";
import { AnimatedList, Collapse, MotionProvider, Reveal, useViewTransition } from "@everyday-ui/react/motion";

const START = ["Send invoice to Nordlicht", "Approve quote for Studio Krone", "Chase Hafen & Söhne"];

export default function MotionShowcase() {
  return (
    <MotionProvider>
      <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12 sm:px-6">
        <header>
          <h1 className="text-3xl font-heading">Motion</h1>
          <p className="mt-2 text-lg text-ink-muted">Every animation here follows the theme's motion tokens and stops under reduced motion.</p>
        </header>
        <RevealDemo />
        <ListDemo />
        <CollapseDemo />
        <ViewTransitionDemo />
        <DialogDemo />
      </main>
    </MotionProvider>
  );
}

function RevealDemo() {
  const [sms, setSms] = useState(false);
  return (
    <Card title="Reveal" description="An opt-in reveals the field it needs.">
      <Checkbox label="Send me reminders by text message" checked={sms} onChange={(e) => setSms(e.target.checked)} />
      <Reveal show={sms}>
        <Field label="Mobile number" type="tel" autoComplete="tel" className="mt-2 pl-8" />
      </Reveal>
    </Card>
  );
}

function ListDemo() {
  const [items, setItems] = useState(START);
  const [n, setN] = useState(1);
  return (
    <Card
      title="List changes"
      description="New items fade in, removed ones fade out, neighbours slide into place."
      actions={
        <>
          <Button size="sm" onClick={() => setItems((xs) => [...xs].sort((a, b) => a.localeCompare(b)))}>
            Sort A–Z
          </Button>
          <Button size="sm" onClick={() => { setItems((xs) => [`New task ${n}`, ...xs]); setN(n + 1); }}>
            Add task
          </Button>
        </>
      }
    >
      <AnimatedList
        items={items}
        getKey={(x) => x}
        className="flex flex-col gap-2"
        itemClassName="flex min-h-touch items-center justify-between gap-4 rounded-control border border-border bg-paper px-4"
        renderItem={(x) => (
          <>
            <span>{x}</span>
            <Button variant="tertiary" size="sm" aria-label={`Mark “${x}” as done`} onClick={() => setItems((xs) => xs.filter((y) => y !== x))}>
              Done
            </Button>
          </>
        )}
      />
    </Card>
  );
}

function CollapseDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Card title="Expand and collapse" description="Content opens to its natural height.">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="advanced"
        onClick={() => setOpen(!open)}
        className="flex min-h-touch items-center gap-2 font-semibold text-accent"
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 transition-transform" style={{ transform: open ? "rotate(90deg)" : "none" }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3.5 10.5 8 6 12.5" />
        </svg>
        <span className="underline decoration-from-font underline-offset-[0.2em]">Advanced invoice settings</span>
      </button>
      <Collapse open={open} id="advanced">
        <div className="flex flex-col gap-4 pt-4">
          <Field label="Payment terms" hint="Days until an invoice is due" defaultValue="14" chars={3} inputMode="numeric" />
          <Field label="Invoice number prefix" defaultValue="INV-" chars={8} />
        </div>
      </Collapse>
    </Card>
  );
}

function ViewTransitionDemo() {
  const [range, setRange] = useState("month");
  const transition = useViewTransition();
  const data = range === "month" ? ["€48,210", "+12% vs. October"] : ["€431,900", "+31% vs. 2025"];
  return (
    <Card title="View transition" description="Switching views cross-fades instead of jumping.">
      <SegmentedControl
        label="Range"
        hideLabel
        value={range}
        onValueChange={(v) => transition(() => setRange(v))}
        options={[
          { value: "month", label: "This month" },
          { value: "year", label: "This year" },
        ]}
      />
      <div className="mt-4" style={{ viewTransitionName: "revenue" }}>
        <p className="text-sm text-ink-muted">Revenue</p>
        <p className="text-3xl font-heading tabular-nums">{data[0]}</p>
        <p className="text-sm font-semibold text-success">{data[1]}</p>
      </div>
    </Card>
  );
}

function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Card title="Dialog" description="Enter and exit with CSS only (@starting-style), no library.">
      <div>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Send 3 reminders?"
        description="Nordlicht GmbH, Studio Krone and Hafen & Söhne get a friendly reminder email."
        footer={
          <>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Send reminders
            </Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </>
        }
      />
    </Card>
  );
}
