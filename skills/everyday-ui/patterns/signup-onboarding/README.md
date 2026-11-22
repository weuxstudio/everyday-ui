# Sign-up and onboarding

**Job:** get a new person from "curious" to "first success" with as little effort and doubt as
possible. Every extra field and screen before that first success loses people.

## Structure

**Sign-up (one screen)**
1. Heading that names the outcome ("Create your Atlas account"), one line on what they get.
2. Single-sign-on buttons if offered (equal secondary buttons, provider name in the label:
   "Continue with Google"), then a divider "or".
3. Email, password (with visible requirements). Nothing else unless the service can't work
   without it.
4. Opt-ins as unchecked checkboxes (newsletter). Terms as a sentence with links next to the
   button, not a checkbox, unless your legal setup requires explicit acceptance.
5. Primary button with the outcome: "Create account".
6. Secondary path for existing users: "Already have an account? Sign in" (a link).

**First run (after sign-up)**
1. Welcome that names the next step, not a feature tour.
2. A short setup checklist (3–5 tasks), each a link to where the task is done, with progress
   ("2 of 4 done"). Optional tasks marked; the list can be dismissed.
3. Empty states in the product that teach and offer the first action.
4. Profile details, team invites, integrations: later, when they're needed.

## Rules

1. **Ask for the minimum.** Name, company, role and phone can wait. Each field needs a reason now.
2. **No confirm-password field.** A show/hide toggle lets people check; password managers work.
3. **Show password rules before typing**, tick them off live as neutral guidance, not as errors.
   Prefer length over composition rules (a long passphrase beats "1 uppercase, 1 symbol").
4. **Never block paste**, and set `autocomplete="email"` and `"new-password"`.
5. **Validate on submit**, except the live password rules and "email already registered" (which
   should offer "Sign in instead" and a password-reset link).
6. **Verify email without blocking.** Let people in; remind them to verify; restrict only what
   truly needs a verified address.
7. **Get to value first.** The first screen after sign-up should let people do the core thing
   (create the first project, import data) within a minute. Tours are skippable and short.
8. **Make progress visible** in multi-step setup (step indicator, checklist count) and say how long
   it takes ("About 2 minutes").
9. **Consent is opt-in.** Marketing checkboxes unchecked; separate from terms (GDPR).
10. **Sign-in and sign-up look alike** and link to each other; error messages for sign-in don't
    reveal whether an email exists ("Email or password is incorrect").

## States

- Submitting: button loading, form disabled from double submit.
- Email taken: message at the field with "Sign in instead" and "Reset password".
- SSO cancelled or failed: back on the form, message at the top, nothing lost.
- Verification pending: banner in the app, resend link, change-email link.
- Checklist complete: brief celebration, then the checklist gets out of the way.

## Copy

- Button: "Create account", not "Sign up now!" or "Submit".
- Password rules as plain requirements: "At least 12 characters".
- Welcome: "Welcome, Mara. Let's create your first project." not "Welcome aboard! 🎉"

## Avoid

- Mandatory tours, carousels before sign-up, "Tell us about yourself" surveys before value.
- Phone number "for security" without real use. Captchas before any suspicious signal.
- Disabled "Create account" until everything is valid.
- Pre-checked newsletter boxes; terms acceptance hidden in a marketing checkbox.

## Blueprint

`SignupOnboarding.tsx` and `SignupOnboarding.svelte` – sign-up form with SSO, password rules and opt-in, then a first-run
screen with a setup checklist and an empty state. Adapt: product name, providers, checklist
tasks, the first action.
