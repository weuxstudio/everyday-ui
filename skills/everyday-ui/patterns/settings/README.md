# Settings

**Job:** let people find one setting quickly, change it confidently, and know it took effect.
Settings are visited rarely, so they must be self-explanatory every time.

## Structure

1. Settings navigation by topic: "Profile", "Workspace", "Members", "Billing", "Notifications",
   "Security". Sidebar on desktop; on phones a list that opens each section as its own page.
2. Each section: heading, one-line description, then groups of related settings with group
   headings.
3. Each setting: label, current value, and help text where the effect isn't obvious.
4. Dangerous settings (delete, transfer ownership) last, in their own group, with an explanation.

## Rules

1. **Pick one save model per section and make it obvious:**
   - *Immediate* (switches, single selects): change applies at once, confirm subtly in place
     ("Saved"), offer undo for impactful changes.
   - *Explicit save* (forms with several fields, anything that affects others): a "Save changes"
     button under the group; warn on leaving with unsaved changes.
   Don't mix them inside one group.
2. **Use the words people search for.** Group by user goals, not by internal architecture. Large
   products add a search field for settings.
3. **Labels describe the state**: "Email me when an invoice is paid" (switch), not "Payment
   notifications".
4. **Show consequences**: "Members lose access immediately", "Applies to new invoices only".
5. **Defaults are decisions.** Choose safe, privacy-friendly defaults; never pre-enable sharing or
   marketing.
6. **Destructive actions** follow the friction rules (buttons-and-actions.md): quiet trigger,
   confirmation proportional to loss, undo where possible.
7. **Permissions:** settings the user can't change are shown read-only with who can ("Only owners
   can change billing"), not hidden.
8. **Deep-linkable**: every section has a URL, so support can send people straight there.

## States

- Saved (in place, brief), save failed (keep value, explain, retry), unsaved changes on leave
  (dialog with "Save changes" / "Discard changes").
- Pending verification (new email): show both old and new until confirmed.

## Avoid

- One endless page with 60 switches. Saving everything with one button at the very bottom.
- Toasts as the only proof a setting saved. Switches that need a separate "Save".
- Vague labels ("Enable advanced mode").

## Blueprint

`Settings.tsx` and `Settings.svelte` – section navigation, an explicit-save profile form with error summary, an
immediate-effect notifications group with switches and in-place "Saved" feedback, members with
roles, and a danger zone with a heavy-friction confirmation. Adapt: sections and settings.
