# Anti-patterns: what makes UI look machine-made

Generic output is not ugly. It is *undecided*. Each item below is a default someone did
not choose. If you catch one, replace it with a decision from the project brief.

## Color

- Purple-to-blue (or teal-to-violet) gradients on heroes, buttons or text.
- Several competing accent colors. Use **one** accent, plus semantic colors for status.
- Low-contrast gray text on a gray or tinted background.
- Pure black (#000) on pure white for large areas; use the tokens' ink and paper.
- Dark mode made by inverting: shadows that vanish, saturated colors that glow.

## Layout

- Reflex structure: centered hero → three feature cards with icons → testimonial → CTA.
  Start from the content and the user's job instead.
- Every section in an identical rounded box with the same shadow.
- Uniform spacing everywhere. Rhythm needs contrast: tight inside groups, generous between.
- Everything centered. Left-aligned text is easier to read; center only short, isolated lines.
- Fake density: dashboards with charts that answer no question.
- Content width unlimited. Body text lines should stay around 45-75 characters.

## Type

- One font weight at many sizes, or many weights with no system.
- Headlines in Title Case With Every Word Capitalized (unless the brand demands it).
- Body text below 16 px on the web.
- Tight line-height on body text; loose line-height on large headlines. (Reverse both.)

## Shape and effects

- `rounded-2xl` on everything regardless of size. Radius scales with element size.
- Glassmorphism, glow and blur used as decoration rather than to show layering.
- Drop shadows on flat elements that do not float above anything.
- Gradient borders, animated gradients, "shimmer" on static content.

## Icons and imagery

- Emoji as UI icons.
- Icons without labels for anything but universal actions (close, search, menu).
- Mixed icon sets with different stroke widths.
- Abstract 3D blobs or stock illustrations that say nothing about the product.

## Copy

- "Unlock the power of…", "Seamless", "Revolutionize", "Elevate your workflow".
- Button labels like "Submit", "OK", "Click here". Use the verb of the outcome.
- Error messages that blame ("Invalid input") instead of help ("Enter a date like 24.12.2026").
- Placeholder text as the only label.

## Interaction

- Hover-only reveals for important actions.
- Animations longer than ~300 ms on frequent interactions, or motion with no meaning.
- Modals for things that could be inline. Modals opening modals.
- Toasts for errors that need action (they disappear before people can act).
- Spinners for content whose shape is known; use a skeleton or keep previous content.

## Replace with

| Instead of | Decide |
| --- | --- |
| Gradient hero | One real product visual or real content, one accent color |
| Card grid by reflex | The structure the content needs: list, table, steps, prose |
| Generic icons | Labels, or icons from one set with consistent stroke |
| Marketing filler | Specific, concrete copy about what the user gets |
| Uniform spacing | The spacing scale with deliberate contrast |
