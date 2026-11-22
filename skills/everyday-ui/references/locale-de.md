# German locale (de-DE, de-AT, de-CH)

Read this whenever the interface is in German. `copy.md` and `typography.md` are written for
English; German changes word length, capitalisation, address, dates, numbers and punctuation.
Every rule here is checkable in a screenshot or with `Intl` output.

Default target is de-DE. Austria and Switzerland differ in a few places (noted).

## 1. Decide once, in `everyday.md`

| Decision | Options | Rule |
| --- | --- | --- |
| Address | **du** or **Sie** | Never mixed: UI, emails, push notifications, error messages, legal notes in the product's voice. *Sie, Ihr, Ihnen* always capitalised; *du, dein* lowercase in UI. |
| Inclusive language | neutral forms, or a marker (`:` / `*`) | Prefer neutral wording ("Teilnehmende", "Team", "Kundschaft", "alle, die …"); it reads well and screen readers don't stumble. If a marker is used, use one and the same everywhere. |
| Anglicisms | glossary | Decide per term and keep it: "Anmelden" or "Login", "Konto" or "Account", "Einstellungen" (not "Settings"). Prefer the German word when users know it. |
| Variant | de-DE · de-AT · de-CH | de-CH writes "ss" instead of "ß" and uses an apostrophe as thousands separator in many contexts (`1'000`); de-AT says "Jänner" in dates. Let `Intl` with the right locale tag decide. |

## 2. Length: plan for German strings

- Budget **+30 % length** against English for sentences and **up to double** for short labels
  ("Save" → "Speichern", "Edit" → "Bearbeiten", "Settings" → "Einstellungen").
- Layouts must let text wrap: no fixed widths on buttons, tabs, table headers or badges; no
  `white-space: nowrap` on anything longer than one short word, except where truncation has a
  way to see the full text.
- **Test strings** for every screen with labels, headings, buttons and tabs:
  "Einverständniserklärung", "Benachrichtigungseinstellungen", "Datenschutzerklärung",
  "Kündigungsbestätigung herunterladen", "Rechnungsadresse ändern".
- At 375 px, a tab bar label longer than ~10 characters needs a shorter word, not a smaller font.

## 3. Compounds and hyphenation

- Set `lang="de"` (or `de-DE`, `de-AT`, `de-CH`) on `<html>`; without it, browsers can't
  hyphenate German and screen readers use the wrong voice. Mixed-language content gets its own
  `lang` attribute.
- Body text and headings: `hyphens: auto` works well in German; set `hyphenate-limit-chars:
  10 4 4` where supported so short words aren't broken.
- Long known words in narrow places (labels, cards, table headers): insert a soft hyphen
  (`&shy;` / `­`) at the joint: "Benachrichtigungs&shy;einstellungen".
- **Buttons and navigation never hyphenate.** Rephrase ("Einstellungen" instead of
  "Benachrichtigungseinstellungen" when the context makes it clear) or let the label wrap to two
  lines.
- `overflow-wrap: anywhere` only for user content that has no break points (URLs, email
  addresses, IBANs in display), never as a fix for normal words.
- **No UPPERCASE headings or buttons.** Capitals hide the noun capitalisation that German readers
  use to parse sentences, make compounds very hard to read and turn "ß" into "SS". Short
  overlines in uppercase are acceptable with extra letter spacing.

## 4. Capitalisation and sentence case

German capitalises nouns anyway; "sentence case" means: first word plus nouns, nothing else.

- "Neues Projekt anlegen", not "Neues Projekt Anlegen".
- "Zuletzt bearbeitet", not "Zuletzt Bearbeitet".
- Adjectives in fixed names stay as named ("Deutsche Bahn"); colours and adjectives otherwise lowercase.

## 5. Buttons, labels and messages

- **Buttons and menu items: infinitive verb, optionally with object**: "Speichern",
  "Quelle löschen", "Termin absagen", "Rechnung herunterladen". Not nouns ("Speicherung"), not
  imperative ("Speichere") – the infinitive is the established German UI convention.
- **Labels: nouns** ("E-Mail-Adresse", "Postleitzahl"), not instructions ("Geben Sie Ihre
  E-Mail-Adresse ein").
- **Hints and errors** address the user in the chosen form, say how to fix: "Gib eine
  E-Mail-Adresse wie name@beispiel.de ein." / "Geben Sie eine E-Mail-Adresse wie
  name@beispiel.de ein." No "Bitte" in every sentence, no "Hoppla".
- **Confirmations**: title as question, buttons as outcomes: "Termin absagen?" →
  "Termin absagen" / "Termin behalten". Never "Ja" / "Nein" / "OK".
- **Abbreviations** like "z. B.", "ggf.", "inkl.", "bzgl." are written out in UI text
  ("zum Beispiel", "falls nötig"). Where they must stay, a non-breaking space keeps
  "z. B." together.
- Spelling of common terms: "E-Mail" (capital E, hyphen), "Online-Banking", "WLAN",
  "Passwort" (or "Kennwort", but one of them).
- **Plurals** with `Intl.PluralRules` or the i18n library; never "1 Datei(en)".

## 6. Dates and times

| Use | Format | Example |
| --- | --- | --- |
| Date, numeric | DD.MM.YYYY | 18.11.2026 |
| Date in lists, this year | weekday + day + month, no year | Mi., 18.11. |
| Date in text | day + month name | 18. November 2026 |
| Time | 24-hour clock, hour without leading zero in text | 8:00 Uhr · 14:30 Uhr |
| Time in aligned columns | tabular numerals, right-aligned (or leading zero) | 08:00 / 14:30 |
| Time range | en dash, no spaces, "Uhr" once | 14:00–15:30 Uhr |
| Date range | en dash | 18.–20.11.2026 |
| Week | Monday first; "KW 47" only in business contexts | |

- **Weekday with date** whenever people plan ("Mi., 18.11., 8:00 Uhr"): the weekday is what they
  check against their week.
- Relative words ("heute", "morgen", "gestern", "vor 2 Stunden") **in addition to** the date
  for plans, alone only for recent past events.
- Format with `Intl.DateTimeFormat("de-DE", …)`; don't concatenate date strings by hand.
- Input: accept "18.11.2026", "18.11.26" and "18.11."; show the format in the hint
  ("Format: TT.MM.JJJJ"). Three separate fields (Tag, Monat, Jahr) for birthdays.

## 7. Numbers, currency, units

- **Decimal comma, thousands point**: 1.234,50. Use `Intl.NumberFormat("de-DE")`, which also
  handles de-AT and de-CH differences.
- **Currency after the amount with a non-breaking space**: `12,90 €`. Prices ending in ,00 may
  drop the decimals in marketing ("29 €"), never in invoices or checkout.
- **Percent with a (narrow) non-breaking space**: `5 %`. Units the same: `3 km`, `10 MB`, `21 °C`.
- Number inputs with decimals: `type="text"` + `inputmode="decimal"`, accept both comma and
  point, parse locale-aware. `type="number"` rejects or mangles the comma in some browsers.
- Phone numbers in display: `+49 30 1234567` (spaces between country code, area code and number).
- Postcode: 5 digits (DE), 4 digits (AT, CH); field width to match (`chars={5}`).
- Address order: street and house number, then postcode and city: "Hauptstraße 5, 10115 Berlin".

## 8. Punctuation and typography

- **German quotes** „…“ (de-CH: «…»), inner quotes ‚…‘. Apostrophe ’, never ´ or `.
- **Gedankenstrich**: en dash with spaces – like this. Ranges: en dash without spaces (9–17 Uhr).
  Hyphen only in compounds (E-Mail-Adresse).
- Ellipsis as one character (…), with a space before it when it replaces whole words.
- Non-breaking spaces between number and unit, in "z. B.", and between "§" and the number.
- Sorting with `Intl.Collator("de")` or `localeCompare(…, "de")` so "Ä" sorts with "A".

## 9. Legal and conventions

- Footer links "Impressum" and "Datenschutz" are expected on German sites (product decision,
  not a design flourish). Cookie consent: "Ablehnen" as visible and as easy as "Akzeptieren".
- Checkout: the final button must make the payment obligation clear ("Zahlungspflichtig
  bestellen", see `patterns/checkout`).

## Checklist (when the UI is in German)

- [ ] `lang` set; address form (du/Sie) consistent everywhere, including emails and notifications.
- [ ] Test strings ("Einverständniserklärung", "Benachrichtigungseinstellungen") fit at 375 px without overflow.
- [ ] No uppercase headings or buttons; buttons don't hyphenate; body text uses `hyphens: auto`.
- [ ] Buttons are infinitives ("Termin absagen"); labels are nouns; no "OK"/"Ja"/"Nein".
- [ ] Dates DD.MM.YYYY or with weekday ("Mi., 18.11."); 24-hour times; ranges with en dash.
- [ ] Decimal comma; `12,90 €` and `5 %` with non-breaking space; decimal inputs accept the comma.
- [ ] German quotes „…“; en dash for ranges and as Gedankenstrich; no abbreviations like "z. B." in UI.
- [ ] Glossary decisions (anglicisms, inclusive wording) followed.

## Sources

Paraphrased from the Duden spelling and typography rules and DIN 5008 (writing and formatting
rules for dates, times, numbers and phone numbers), plus the Unicode CLDR locale data that
`Intl` uses. No text from these sources is reproduced.
