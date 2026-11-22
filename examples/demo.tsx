import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Button, Card, Dialog, Field } from "@everyday-ui/react";

function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const save = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1200);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-ink-muted">Workspace · Atlas Studio</p>
          <h1 className="mt-1 text-3xl font-semibold">Settings</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost">Discard</Button>
          <Button variant="primary" loading={saving} onClick={save}>
            Save changes
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        <Card title="Profile" description="Shown on invoices and in emails to your clients.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Studio name" defaultValue="Atlas Studio" autoComplete="organization" />
            <Field
              label="Billing email"
              type="email"
              defaultValue="hello@atlas"
              error="Enter a full address, like hello@atlas-studio.com"
              autoComplete="email"
            />
            <Field
              className="sm:col-span-2"
              label="Website"
              optional
              placeholder="atlas-studio.com"
              hint="Without https:// – we add it for you."
              inputMode="url"
            />
          </div>
        </Card>

        <Card
          title="Members"
          description="People who can open and edit this workspace."
          actions={<Button size="sm">Invite</Button>}
        >
          <ul className="divide-y divide-border">
            {[
              ["Mara Lindqvist", "Owner"],
              ["Jonas Weber", "Editor"],
              ["Priya Raman", "Viewer · invited 2 days ago"],
            ].map(([name, role]) => (
              <li key={name} className="flex items-center justify-between gap-4 py-3">
                <span className="font-medium">{name}</span>
                <span className="text-sm text-ink-muted">{role}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Delete workspace" description="Removes all projects, invoices and files for everyone in Atlas Studio.">
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>
            Delete workspace…
          </Button>
        </Card>
      </div>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete Atlas Studio?"
        description="This permanently removes 14 projects and 212 invoices for all 3 members. It cannot be undone."
        footer={
          <>
            <Button onClick={() => setConfirmOpen(false)} autoFocus>
              Keep workspace
            </Button>
            <Button variant="danger" onClick={() => setConfirmOpen(false)}>
              Delete workspace
            </Button>
          </>
        }
      />
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SettingsPage />
  </StrictMode>,
);
