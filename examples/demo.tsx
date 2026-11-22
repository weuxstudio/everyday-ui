import { StrictMode, useState, type FormEvent } from "react";
import { createRoot } from "react-dom/client";
import {
  Badge, Button, Card, Checkbox, Dialog, ErrorSummary, Field, RadioGroup, Stepper, Switch,
  type ErrorSummaryItem,
} from "@everyday-ui/react";

function SettingsPage() {
  const [email, setEmail] = useState("hello@atlas");
  const [postcode, setPostcode] = useState("");
  const [sms, setSms] = useState(false);
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState<ErrorSummaryItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [confirmError, setConfirmError] = useState(false);

  const errorFor = (id: string) => errors.find((e) => e.fieldId === id)?.message;

  // Validate on submit, not while typing.
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: ErrorSummaryItem[] = [];
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.push({ fieldId: "email", message: "Enter a full email address, like hello@atlas-studio.com" });
    if (!/^\d{5}$/.test(postcode)) next.push({ fieldId: "postcode", message: "Enter a 5-digit postcode" });
    if (sms && !mobile.trim()) next.push({ fieldId: "mobile", message: "Enter a mobile number for text messages" });
    setErrors(next);
    if (next.length === 0) {
      setSaving(true);
      setTimeout(() => setSaving(false), 1200);
    }
  };

  const deleteWorkspace = () => {
    if (!confirmChecked) {
      setConfirmError(true);
      return;
    }
    setConfirmOpen(false);
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-20">
      <header className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-ink-muted">Atlas Studio</p>
        <h1 className="mt-2 text-3xl font-semibold">Workspace settings</h1>
      </header>

      <form noValidate onSubmit={submit} className="flex flex-col gap-12">
        <ErrorSummary errors={errors} />
        <p className="text-sm text-ink-muted">Required fields are marked with an asterisk *</p>

        <section aria-labelledby="billing" className="flex flex-col gap-6">
          <h2 id="billing" className="text-xl font-semibold">Billing details</h2>
          <Field id="studio" label="Studio name" required defaultValue="Atlas Studio" autoComplete="organization" />
          <Field
            id="email"
            label="Billing email"
            required
            hint="Invoices and payment receipts are sent here"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errorFor("email")}
          />
          <Field
            id="postcode"
            label="Postcode"
            required
            chars={5}
            inputMode="numeric"
            autoComplete="postal-code"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            error={errorFor("postcode")}
          />
        </section>

        <section aria-labelledby="plan" className="flex flex-col gap-6">
          <h2 id="plan" className="text-xl font-semibold">Plan</h2>
          <RadioGroup
            id="plan-choice"
            legend="Choose a plan"
            name="plan"
            defaultValue="studio"
            options={[
              { value: "solo", label: "Solo", hint: "1 person · 10 projects" },
              { value: "studio", label: "Studio", hint: "Up to 10 people · unlimited projects" },
              { value: "agency", label: "Agency", hint: "Unlimited people · client workspaces" },
            ]}
          />
          <Stepper label="Seats" hint="€12 per seat and month" defaultValue={3} min={1} max={10} />
          <Switch label="Bill annually" hint="Saves 2 months – applies right away" defaultChecked />
          <div className="flex flex-col gap-2">
            <Checkbox label="Send me billing reminders by text message" checked={sms} onChange={(e) => setSms(e.target.checked)} />
            {sms ? (
              <Field
                id="mobile"
                label="Mobile number"
                required
                type="tel"
                autoComplete="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                error={errorFor("mobile")}
                className="pl-8"
              />
            ) : null}
          </div>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button type="submit" variant="primary" size="lg" loading={saving} fullWidth="mobile">
            Save settings
          </Button>
          <Button variant="tertiary" size="lg" fullWidth="mobile">
            Discard changes
          </Button>
        </div>
      </form>

      <div className="mt-20 flex flex-col gap-6">
        <Card
          title="Members"
          description="People who can open and edit this workspace"
          actions={<Button size="sm">Invite member</Button>}
        >
          <ul className="divide-y divide-border">
            {[
              ["Mara Lindqvist", "Owner", null],
              ["Jonas Weber", "Editor", null],
              ["Priya Raman", "Viewer", "Invite pending"],
            ].map(([name, role, status]) => (
              <li key={name} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
                <span className="flex flex-col">
                  <span className="font-semibold">{name}</span>
                  <span className="text-sm text-ink-muted">{role}</span>
                </span>
                <span className="flex items-center gap-3">
                  {status ? <Badge tone="warning">{status}</Badge> : null}
                  {role !== "Owner" ? (
                    <Button variant="tertiary" size="sm">
                      Remove
                    </Button>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Delete workspace" description="Removes all projects, invoices and files for everyone in Atlas Studio">
          {/* Initial friction: the trigger is quiet, not red. Red appears only in the confirmation. */}
          <Button variant="secondary" onClick={() => setConfirmOpen(true)}>
            Delete workspace…
          </Button>
        </Card>
      </div>

      <Dialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setConfirmError(false);
          setConfirmChecked(false);
        }}
        title="Delete Atlas Studio?"
        description="14 projects and 212 invoices are deleted for all 3 members. This can't be undone."
        footer={
          <>
            <Button variant="danger" onClick={deleteWorkspace}>
              Delete workspace
            </Button>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)} autoFocus>
              Keep workspace
            </Button>
          </>
        }
      >
        {/* Heavy friction for heavy loss: an explicit confirmation, validated on press. */}
        <Checkbox
          label="I understand that everything in Atlas Studio is deleted"
          checked={confirmChecked}
          onChange={(e) => {
            setConfirmChecked(e.target.checked);
            setConfirmError(false);
          }}
          error={confirmError ? "Confirm that you want to delete everything" : undefined}
        />
      </Dialog>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SettingsPage />
  </StrictMode>,
);
