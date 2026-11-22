# Legal notes

Not legal advice. A checklist of what this project relies on and what to keep in mind
before publishing or selling it.

## What this project contains

- **Original text and code**, MIT-licensed (see `LICENSE`).
- **Design principles** are summarized in our own words. Ideas and principles are not protected
  by copyright; the specific wording of books and articles is. Do not paste passages from
  *The Design of Everyday Things* or other sources into this repository; cite them instead.
- **No code or text copied from other skills.** If you incorporate MIT-licensed material from
  other repositories (e.g. `Leonxlnx/taste-skill`, `emilkowalski/skills`), keep their copyright
  and license notice in a `THIRD_PARTY_NOTICES.md` file. Repositories without a license may not
  be copied.
- **Rules derived from books** (e.g. *The Design of Everyday Things*, *Practical UI*) are restated
  in our own words, reorganized by topic, combined with other sources, and credited in
  `references/principles.md`. Never add the books themselves (PDFs, page scans, screenshots of
  their examples) to this repository, and never paste passages from them: a purchased copy is
  licensed for personal reading, not redistribution.

## Dependencies

- `motion` (motion.dev), MIT license, used by the optional `@everyday-ui/react/motion` entry.
  The optional paid Motion+ add-on is not used.
- `svelte` (MIT) is a peer dependency of `@everyday-ui/svelte`; `svelte-check` (MIT) is a dev tool.
- `playwright` (Apache-2.0) is an optional peer of `@everyday-ui/shots`, resolved from the
  user's project; nothing of it is bundled.
- `everyday-lint` has no dependencies.
- The mobile, notification and German locale guides paraphrase public platform guidelines
  (Apple HIG, Material Design) and Duden / DIN 5008 conventions; no text or images from them
  are reproduced, and no platform assets (icons, SF Symbols, Material Symbols) are included.
- GSAP is deliberately not a dependency: its free "Standard No Charge" license is not open
  source and prohibits visual no-code animation tools that compete with Webflow. Projects may
  add it themselves for marketing pages.

## Fonts and assets

- Hanken Grotesk and JetBrains Mono: SIL Open Font License 1.1 (free to use, embed and
  bundle; the fonts may not be sold on their own).
- The single icon in `Field` is original.

## Name

"Everyday UI" refers descriptively to everyday interfaces. Before commercial use, search the
trademark registers (DPMA, EUIPO, WIPO) in the relevant classes (9 and 42). Do not use
third-party marks (e.g. "Norman", "Vercel") in product names.

## If you offer it as a paid service (Germany / EU)

- Business registration (Gewerbeanmeldung) and tax registration.
- Impressum and privacy policy (GDPR) for any website or hosted service.
- Terms of service with liability limitations; consumer withdrawal rights if selling to consumers.
- If the service calls an AI API, that provider's terms apply in addition (usage policy,
  restrictions on reselling).
- The EU Accessibility Act (applicable since June 2025) may apply to services you sell to
  consumers; this project's WCAG focus helps.
