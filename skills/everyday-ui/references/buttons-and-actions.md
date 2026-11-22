# Buttons and actions

## Three weights

| Weight | Look | Use |
| --- | --- | --- |
| **Primary** | Filled accent, light text | The single most important action in the view. At most one per view (per dialog, per form). |
| **Secondary** | Accent outline + accent text on surface | Alternatives to the primary; several actions of equal importance (they then all look the same, so none is favored). |
| **Tertiary** | Underlined accent text | Least important or repeated actions ("Remove" on every row, "Cancel", "Back"). |
| Danger | Filled red | Only for the final confirmation of a destructive action. |

Rules:
- The hierarchy must survive without color: fill vs. outline vs. underline differ in shape, not
  just hue.
- Button shapes contrast ≥ 3:1 with the background; label text ≥ 4.5:1.
- Avoid light gray buttons: they read as disabled.
- No two adjacent buttons with the same style but different colors.
- All buttons share one shape (radius, height per size). Different shapes imply different
  functions.
- If there is no single most important action, use no primary.
- A row of identical actions ("Follow" ×10) uses secondary or tertiary, never ten primaries.

## Size and spacing

- Default height 44 px (`md`), 48 px (`lg`) for touch-first screens and main calls to action;
  36 px (`sm`) only in dense desktop UIs, with the hit area extended to 44 px.
- At least 8 px between buttons, 16 px is safer.
- Full width on phones for the main actions (`fullWidth="mobile"`), stacked most important first.

## Order and alignment

- Left-aligned, most important first: it's where reading starts, where screen-magnifier users
  look, and closest to the fields above.
- On phones, stack vertically, most important on top.
- Apply the same order in dialogs, for consistency with forms. (Right-aligned dialog buttons are a
  macOS convention; if a project follows it, follow it everywhere.)
- Multi-step forms: primary "Continue" left under the fields; "Back" as a tertiary link at the top
  left, not next to Continue.
- Single-field forms (search, newsletter) may attach the button to the right of the field.

## Labels

- Verb + noun that names the outcome: "Save post", "Send invite", "Delete workspace".
- The label still makes sense out of context (screen readers list buttons).
- Icons support labels; icon-only buttons are reserved for universal actions (close, search,
  menu) and still need `aria-label`.
- Balance icon and text: same stroke weight as the text, similar size (~1.15em); if the icon is
  heavier, lower its contrast.

## Disabled actions

Disabled buttons don't say why, are hard to see, and are often unreachable by keyboard. In
order of preference:

1. **Enable it and validate on press** (forms: show what's missing).
2. **Remove** unavailable actions and explain why in text ("Follow Cody to send messages").
3. **Lock** them: keep the button, add a lock icon, explain what unlocks it (premium features).
4. If it must be disabled: keep it focusable (`aria-disabled`, which `Button` does), keep its text
   readable, and put the reason right next to it.

## Destructive actions: friction proportional to loss

Better than any friction: **undo**. Delete immediately, then offer "Restore" in a toast or banner
for a reasonable time.

When undo isn't possible, scale the friction:

| Loss | Friction |
| --- | --- |
| Any | **Initial**: the trigger is low-key (tertiary or secondary, not red), placed away from frequent actions, possibly behind a menu. |
| Small (one message) | **Light**: a confirmation dialog naming the object. |
| Significant (an article, a project) | **Medium**: confirmation with a red primary button and a warning icon; say it can't be recovered. |
| Severe (account, workspace, all data) | **Heavy**: additionally require an explicit act: a checkbox "I understand…" or typing the name. Validate it on press, don't disable the button. |

Confirmation dialogs:
- Title is the question with the object ("Delete Atlas Studio?").
- Body names the concrete consequence with numbers ("14 projects and 212 invoices for all 3
  members").
- Buttons name both outcomes ("Delete workspace" / "Keep workspace"). Focus starts on the safe
  option.

## Feedback on press

- Visible pressed state immediately (< 100 ms).
- Work longer than ~1 s: loading state on the button (keeps width, blocks repeat presses).
- Success or failure shown where the user is looking; don't make them hunt for a toast.
