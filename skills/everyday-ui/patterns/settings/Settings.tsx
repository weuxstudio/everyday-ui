// Blueprint: settings. Copy into the project and adapt sections and settings.
// Rules: patterns/settings/README.md
import { useRef, useState, type FormEvent } from "react";
import { Badge, Button, Dialog, ErrorSummary, Field, Switch, cx, type ErrorSummaryItem } from "@everyday-ui/react";

import { SECTIONS, WORKSPACE } from "./data";

export default function Settings() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:grid lg:grid-cols-[13rem_1fr] lg:gap-12 lg:py-20">
      <nav aria-label="Settings" className="mb-8 lg:mb-0">
        <h1 className="px-3 text-2xl font-heading">Settings</h1>
        <ul className="mt-4 flex gap-1 overflow-x-auto lg:flex-col">
          {SECTIONS.map((s, i) => (
            <li key={s}>
              <a
                href={`#${s.toLowerCase()}`}
                aria-current={i === 0 ? "page" : undefined}
                className={cx(
                  "flex min-h-touch items-center whitespace-nowrap rounded-control px-3 no-underline",
                  i === 0 ? "bg-accent-subtle font-semibold text-accent" : "text-ink hover:bg-sunken",
                )}
              >
                {s}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className="flex max-w-2xl flex-col gap-20">
        <ProfileSection />
        <NotificationsSection />
        <MembersSection />
        <DangerZone />
      </main>
    </div>
  );
}

/** Explicit save: several fields that belong together. */
function ProfileSection() {
  const [email, setEmail] = useState("mara@atlas");
  const [submitAttempt, setSubmitAttempt] = useState(0);
  const [errors, setErrors] = useState<ErrorSummaryItem[]>([]);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? [] : [{ fieldId: "profile-email", message: "Enter a full email address, like mara@atlas-studio.com" }];
    setSubmitAttempt((attempt) => attempt + 1);
    setErrors(next);
    if (next.length) return;
    setState("saving");
    setTimeout(() => setState("saved"), 700);
  };

  return (
    <section aria-labelledby="profile" className="flex flex-col gap-6">
      <header>
        <h2 id="profile" className="text-xl font-heading">
          Profile
        </h2>
        <p className="mt-1 text-ink-muted">Shown to your team and on invoices you send.</p>
      </header>
      <form noValidate onSubmit={submit} onChange={() => state === "saved" && setState("idle")} className="flex flex-col gap-6">
        <ErrorSummary submitAttempt={submitAttempt} errors={errors} />
        <Field id="profile-name" label="Name" defaultValue="Mara Lindqvist" autoComplete="name" />
        <Field
          id="profile-email"
          label="Email"
          hint="We'll send a confirmation link to the new address. The old one stays active until then."
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.find((x) => x.fieldId === "profile-email")?.message}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" variant="primary" loading={state === "saving"} fullWidth="mobile">
            Save profile
          </Button>
          <p className="text-sm text-success" role="status">
            {state === "saved" ? "✓ Profile saved" : ""}
          </p>
        </div>
      </form>
    </section>
  );
}

/** Immediate effect: each switch applies on its own, confirmed in place. */
function NotificationsSection() {
  const [saved, setSaved] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const announceSaved = (what: string) => {
    setSaved(what);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setSaved(null), 2500);
  };

  return (
    <section aria-labelledby="notifications" className="flex flex-col gap-4">
      <header>
        <h2 id="notifications" className="text-xl font-heading">
          Notifications
        </h2>
        <p className="mt-1 text-ink-muted">Changes apply right away.</p>
      </header>
      <div className="divide-y divide-border rounded-card border border-border bg-surface px-card">
        <Switch className="py-3" label="Email me when an invoice is paid" defaultChecked onCheckedChange={() => announceSaved("payment emails")} />
        <Switch className="py-3" label="Email me when an invoice becomes overdue" defaultChecked onCheckedChange={() => announceSaved("overdue emails")} />
        <Switch className="py-3" label="Weekly summary every Monday" hint="Revenue, open invoices and what needs attention" onCheckedChange={() => announceSaved("weekly summary")} />
      </div>
      <p className="min-h-[1.5em] text-sm text-success" role="status">
        {saved ? `✓ Saved: ${saved}` : ""}
      </p>
    </section>
  );
}

function MembersSection() {
  const members = [
    { name: "Mara Lindqvist", email: "mara@atlas-studio.com", role: "Owner" },
    { name: "Jonas Weber", email: "jonas@atlas-studio.com", role: "Editor" },
    { name: "Priya Raman", email: "priya@atlas-studio.com", role: "Viewer", pending: true },
  ];
  return (
    <section aria-labelledby="members" className="flex flex-col gap-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="members" className="text-xl font-heading">
            Members
          </h2>
          <p className="mt-1 text-ink-muted">People who can open and edit this workspace.</p>
        </div>
        <Button>Invite member</Button>
      </header>
      <ul className="divide-y divide-border rounded-card border border-border bg-surface px-card">
        {members.map((m) => (
          <li key={m.email} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
            <span className="flex min-w-0 flex-col">
              <span className="font-semibold">{m.name}</span>
              <span className="truncate text-sm text-ink-muted">{m.email}</span>
            </span>
            <span className="flex items-center gap-3">
              {m.pending ? <Badge tone="warning">Invite pending</Badge> : null}
              <span className="text-sm text-ink-muted">{m.role}</span>
              {m.role !== "Owner" ? (
                <Button variant="tertiary" size="sm">
                  Remove
                </Button>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-ink-muted">Only owners can change roles or billing.</p>
    </section>
  );
}

/** Severe loss → heavy friction: type the name to confirm. Validated on press, never a disabled button. */
function DangerZone() {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<string | undefined>();
  const close = () => {
    setOpen(false);
    setTyped("");
    setError(undefined);
  };
  return (
    <section aria-labelledby="danger" className="flex flex-col gap-4 border-t border-border pt-12">
      <h2 id="danger" className="text-xl font-heading">
        Delete workspace
      </h2>
      <p className="text-ink-muted">Permanently removes all projects, invoices and files for every member. Export your data first if you need it.</p>
      <div>
        <Button onClick={() => setOpen(true)}>Delete workspace…</Button>
      </div>
      <Dialog
        open={open}
        onClose={close}
        title={`Delete ${WORKSPACE}?`}
        description="14 projects and 212 invoices are deleted for all 3 members. This can't be undone."
        footer={
          <>
            <Button
              variant="danger"
              onClick={() => (typed.trim() === WORKSPACE ? close() : setError(`Type ${WORKSPACE} exactly as shown`))}
            >
              Delete workspace
            </Button>
            <Button onClick={close} autoFocus>
              Keep workspace
            </Button>
          </>
        }
      >
        <Field label={`Type “${WORKSPACE}” to confirm`} value={typed} onChange={(e) => setTyped(e.target.value)} error={error} autoComplete="off" />
      </Dialog>
    </section>
  );
}
