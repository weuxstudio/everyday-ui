// Blueprint: sign-up + first run. Copy into the project and adapt to the real product.
// Rules: patterns/signup-onboarding/README.md
import { useState, type FormEvent } from "react";
import { Button, Checkbox, EmptyState, ErrorSummary, Field, PasswordField, type ErrorSummaryItem } from "@everyday-ui/react";

const PRODUCT = "Atlas";

const PASSWORD_RULES = (email: string) => [
  { label: "At least 12 characters", test: (v: string) => v.length >= 12 },
  { label: "Not the same as your email address", test: (v: string) => v.length > 0 && v.toLowerCase() !== email.toLowerCase() },
];

export default function SignupOnboarding() {
  const [step, setStep] = useState<"signup" | "welcome">("signup");
  return step === "signup" ? <Signup onDone={() => setStep("welcome")} /> : <Welcome />;
}

function Signup({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ErrorSummaryItem[]>([]);
  const [busy, setBusy] = useState(false);
  const errorFor = (id: string) => errors.find((e) => e.fieldId === id)?.message;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: ErrorSummaryItem[] = [];
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.push({ fieldId: "signup-email", message: "Enter an email address, like mara@studio.com" });
    if (!PASSWORD_RULES(email).every((r) => r.test(password))) next.push({ fieldId: "signup-password", message: "Choose a password that meets both requirements" });
    setErrors(next);
    if (next.length === 0) {
      setBusy(true);
      setTimeout(onDone, 700);
    }
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-3xl font-heading">Create your {PRODUCT} account</h1>
      <p className="mt-2 text-lg text-ink-muted">Free for 30 days. No card needed.</p>

      <div className="mt-8 flex flex-col gap-3">
        <Button fullWidth>Continue with Google</Button>
        <Button fullWidth>Continue with Microsoft</Button>
      </div>

      <div className="my-8 flex items-center gap-4 text-sm text-ink-muted" role="separator" aria-label="or">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <form noValidate onSubmit={submit} className="flex flex-col gap-6">
        <ErrorSummary errors={errors} />
        <Field
          id="signup-email"
          label="Work email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errorFor("signup-email")}
        />
        <PasswordField
          id="signup-password"
          label="Password"
          purpose="new"
          rules={PASSWORD_RULES(email)}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errorFor("signup-password")}
        />
        <Checkbox label="Send me tips and product news (about once a month)" />
        <div className="flex flex-col gap-3">
          <Button type="submit" variant="primary" size="lg" fullWidth loading={busy}>
            Create account
          </Button>
          <p className="text-sm text-ink-muted">
            By creating an account you agree to the <a href="#terms">terms of service</a> and the <a href="#privacy">privacy policy</a>.
          </p>
        </div>
      </form>

      <p className="mt-12 text-base">
        Already have an account? <a href="#signin">Sign in</a>
      </p>
    </main>
  );
}

const SETUP = [
  { id: "account", label: "Create your account", done: true },
  { id: "project", label: "Create your first project", done: false },
  { id: "invite", label: "Invite your team", done: false, optional: true },
  { id: "bank", label: "Connect your bank account", done: false, optional: true },
];

function Welcome() {
  const [tasks, setTasks] = useState(SETUP);
  const [hidden, setHidden] = useState(false);
  const done = tasks.filter((t) => t.done).length;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
      <header>
        <h1 className="text-3xl font-heading">Welcome, Mara</h1>
        <p className="mt-2 text-lg text-ink-muted">Let's create your first project. It takes about two minutes.</p>
      </header>

      {!hidden ? (
        <section aria-labelledby="setup-title" className="mt-12 rounded-card border border-border bg-surface p-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="setup-title" className="text-lg font-heading">
                Get set up
              </h2>
              <p className="mt-1 text-sm text-ink-muted" aria-live="polite">
                {done} of {tasks.length} done
              </p>
            </div>
            <Button variant="tertiary" size="sm" onClick={() => setHidden(true)}>
              Hide checklist
            </Button>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sunken" aria-hidden="true">
            <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${(done / tasks.length) * 100}%` }} />
          </div>
          <ul className="mt-4 divide-y divide-border">
            {tasks.map((t) => (
              <li key={t.id} className="flex min-h-touch items-center justify-between gap-4 py-2">
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={
                      t.done
                        ? "grid size-6 place-items-center rounded-full bg-success-subtle text-sm font-semibold text-success"
                        : "size-6 rounded-full border-2 border-border-strong"
                    }
                  >
                    {t.done ? "✓" : null}
                  </span>
                  <span className={t.done ? "text-ink-muted line-through" : "text-ink"}>
                    {t.label}
                    {t.optional ? <span className="ml-1.5 text-ink-muted">(optional)</span> : null}
                    <span className="sr-only">{t.done ? " – done" : ""}</span>
                  </span>
                </span>
                {!t.done ? (
                  <Button size="sm" onClick={() => setTasks((all) => all.map((x) => (x.id === t.id ? { ...x, done: true } : x)))}>
                    Start
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="projects-title" className="mt-12">
        <h2 id="projects-title" className="text-xl font-heading">
          Projects
        </h2>
        <EmptyState
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6H9l2 2h8.5A1.5 1.5 0 0 1 21 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />
            </svg>
          }
          title="No projects yet"
          description="Projects keep a client's invoices, files and notes together. Start with the client you work with most."
          action={<Button variant="primary">Create first project</Button>}
          secondary={<a href="#import">Import projects from a spreadsheet</a>}
        />
      </section>
    </main>
  );
}
