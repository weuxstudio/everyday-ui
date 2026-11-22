# Forms

Forms are where intent meets friction. Every field is work, a chance for error, and a reason
to abandon. Ask less, make the expected input obvious, and help people recover.

## Before adding a field

- Is it essential for the service right now? If not, remove it or ask later. Explain why you ask
  for anything personal.
- Could the system know it (postcode → city, card number → card type)?
- Could it be an opt-in? Instead of an optional "Mobile number" field, a checkbox "Send updates
  by text message" that reveals a **required** mobile field only when checked.

## Layout

- **One column.** Top to bottom, one field after another. Multi-column forms cause skipped fields
  (especially with screen magnifiers) and zig-zag reading.
- Exception: short fields that belong together may share a row inside the column (expiry date +
  security code, first + last name if short).
- **Labels above inputs**, close to them (4–8 px), clearly farther from the previous field
  (16–24 px). Left-side labels create a jagged edge, break on mobile and slow people down.
- Stack checkboxes and radio buttons vertically.
- Group related fields under headings ("Billing address", "Contact details"). For long forms,
  split into steps instead (see below).
- **Match field width to the expected input**: a German postcode is 5 characters wide, a year 4,
  a street address full width. Width signals what's expected. (`<Field chars={5}>`.)

## Labels, hints, placeholders

- Every input has a visible label. Placeholder text is never the label: it disappears while
  typing, looks like a filled value, and is low-contrast by design.
- Placeholders are acceptable only as examples, or in single-field patterns like search (with a
  visually hidden label and ≥ 4.5:1 placeholder contrast).
- **Hints go between label and input**, so they're read before typing and aren't covered by
  autofill menus or the keyboard. Keep critical hints visible, not in tooltips.
- Mark **both** required and optional fields: required with an asterisk (`*`, neutral color, not
  red) plus a note at the top "Required fields are marked with an asterisk *"; optional with the
  word "(optional)". You may skip marks in short, familiar forms (sign-in, newsletter) or when every
  field in the product is required.

## Choosing the control

| Situation | Use |
| --- | --- |
| One choice from ≤ ~10 options | Radio buttons (visible, one press) |
| One choice from many known options (country, product) | Autocomplete / combobox, ≤ ~10 suggestions, highlight the differing part |
| Many unfamiliar options (occupation) | Split into two steps (industry → occupation) |
| Small numbers (guests, quantity) | Stepper: − and + side by side, 48 px buttons, typable middle |
| Large or precise numbers | Text input with `inputmode="numeric"` and formatting |
| Yes/no that applies on submit | Single checkbox, positively phrased |
| On/off that applies immediately | Switch |
| Dates | Three fields or a text field with a clear format for known dates (birthday); a calendar picker for nearby dates (bookings) |
| Long text | Textarea sized to the expected length; show a character count only if there is a limit |

Dropdowns are compact but cost several precise interactions, hide options and can look already
filled. Use them when space truly matters.

Keep conventional appearances: inputs are bordered rectangles with labels above, checkboxes are
squares with a tick, radios are circles. A custom design must keep these iconic cues, or people
can't tell how it behaves.

## Input help

- Set `type`, `inputmode` and `autocomplete` on every field (`email`, `tel`, `postal-code`,
  `cc-number`, `one-time-code` …). Autofill is the biggest time saver in any form.
- Accept input in any reasonable format and normalize it yourself (spaces in IBAN or phone
  numbers, upper/lower case, trailing spaces).
- Don't disable paste, not even in password or confirmation fields.
- Password fields get a show/hide toggle.

## Validation

- **Validate on submit.** Live validation while typing interrupts people who aren't done yet
  ("Invalid email" after the first letter).
- Exceptions where live feedback helps: password strength rules, character limits, username
  availability. Show these as neutral guidance, not errors, until the user leaves the field.
- On submit with errors:
  1. Show an **error summary** at the top of the form, focused, listing each problem as a link
     that moves focus to the field (`<ErrorSummary>`).
  2. Mark each invalid field: message **above** the input (with icon), thicker border in `danger`,
     tinted background, `aria-invalid` and `aria-describedby`.
  3. Keep everything the user typed.
- Error messages say how to fix it: "Enter a 5-digit postcode", not "Invalid input".
- Don't disable the submit button until the form is valid; people get stuck without knowing why.
  Let them submit and tell them what's missing.

## Long forms

- Split into steps of related questions (e.g. 30 questions → 6 steps of 5, not 30 steps).
- Say upfront how long it takes and what people need to have at hand.
- Easiest questions first; show progress ("Step 2 of 4"); motivation rises near the end.
- "Back" sits top-left as a tertiary link; the primary "Continue" stays left-aligned under the
  fields. A prominent Back button next to Next gets pressed by mistake.
- End with a review step where every answer can be changed, then a confirmation that says what
  happens next.
- Save progress for long or interruptible flows.

## After submit

- Show progress on the button (loading state), keep its width, block double submits.
- Success: confirm in place or on the next screen, say what happens next.
- Failure from the server: keep the input, explain in plain language, offer a retry.
