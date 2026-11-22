# Copy (UX writing)

Words are interface. Most users scan; many read in a second language; screen-reader users often
navigate by headings, links and buttons alone. Write for all three.

## Say less

- Every word earns its place. Cut filler ("actually", "simply", "just", "basically"), throat-
  clearing ("Would you like to…", "In order to…", "Are you sure you want to…") and redundant
  articles in labels.
- Sentences under ~20 words. Short words over long ones.
- Short UI strings (labels, buttons, headings, list items) get no full stop. Full sentences in
  body text do. Be consistent across siblings.

## Plain language

- Write for a smart reader who doesn't know the topic: no jargon, no slang, no internal terms.
- Abbreviations and acronyms slow people down; spell them out ("Apartment number", not
  "Apt. no."). If one is unavoidable, expand it on first use.
- Contractions sound human in English ("you're", "can't"). In German, choose **du** or **Sie**
  per product, record it in `everyday.md`, and never mix.
- **German UI:** also read `locale-de.md` (length budget, compounds, infinitive buttons,
  dates, numbers, quotes).

## Structure for scanning

- **Front-load**: the key word or benefit first ("30 % off when you sign up today", not "Sign up
  today to get 30 % off").
- **Inverted pyramid**: the most important point first, supporting detail next, background last
  (or behind a link).
- Break long text into short sections with **descriptive headings** (they must make sense out of
  context in a screen reader's heading list) and bullet lists.
- Sibling elements in a row (feature cards, plan descriptions) get similar text length so they
  align.

## Case

- **Sentence case** everywhere: headings, buttons, labels, menu items ("Save draft", not "Save
  Draft"). It is easier to read and has no ambiguous rules.
- UPPERCASE only for very short labels (overlines, tags), small, bold, with extra tracking.

## Consistent vocabulary

- One concept, one word, across the whole product: pick "cart" or "bag", "sign in" or "log in",
  "delete" or "remove" (and give them different meanings only on purpose: remove = from a list,
  delete = gone). Keep a glossary in `everyday.md`.
- Don't use "my" in labels ("My email" sounds like the system's email). Usually no possessive is
  needed at all ("Email").

## Numbers, dates, units

- Numerals, not words: "899 designers", not "eight hundred ninety-nine".
- Group digits and format per locale with `Intl.NumberFormat` / `Intl.DateTimeFormat`
  (en: 1,000.50 · de: 1.000,50). Large numbers abbreviated where precision doesn't matter
  ("1.2 million", "1,2 Mio.").
- Units and currency per locale (de: `12,90 €`; en-US: `$12.90`), with a non-breaking space
  where the locale uses a space. German date, time and number formats: `locale-de.md`.
- Relative dates for recent events ("2 hours ago"), absolute dates with year for older ones; the
  full timestamp on hover/focus.

## Links and buttons

- **Buttons** name the action: verb + object ("Save post", "Send invite", "Delete workspace").
  Never "OK", "Yes", "Submit", "Click here".
- **Links** name the destination ("Pricing for teams", "Email marketing features"), so a list of
  links makes sense on its own. No "Learn more" ×3, no "click here" (people tap, type, speak).
  Alternatively, make the heading itself the link.
- The label on the action and the title of what it opens match ("Add domain" → "Add domain").

## Messages

**Errors** say what happened, why if useful, and how to fix it, in that order:
- Specific and calm: "Payment failed. Update your card details and try again" with a button
  "Update payment details", not "Oops! Something went wrong".
- Never blame ("You entered an invalid date"); describe the fix ("Enter a date like 24.12.2026").
- No "please", "sorry", "oops" padding; no codes without explanation.

**Empty states**: what will appear here, why it's empty, and the action that fills it.

**Confirmations**: title is the question in the user's words ("Delete 3 files?"), body names the
consequence, buttons name the outcomes ("Delete files" / "Keep files").

**Success**: confirm what happened and what comes next ("Invite sent. Priya will get an email in
a few minutes").

## Forms

- Labels are nouns ("Email", "Postcode"), not instructions ("Enter your email here").
- Checkbox labels are phrased positively: read the label after "Yes," — "Yes, send me updates"
  works; "Yes, don't send me updates" doesn't.
- Ask only for what is needed, and say why for anything personal.
