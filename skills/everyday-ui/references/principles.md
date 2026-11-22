# Principles

Human-centered design starts from how people perceive, think and act, then shapes the
interface to fit. These principles are summarized in our own words from established
design literature (sources at the end). Each one ends with rules you can check.

---

## 1. Discoverability

People should be able to work out what actions are possible and how to perform them just
by looking. Nobody reads a manual for a web form.

- Every interactive element is visually distinct from static content in at least two ways
  (e.g. color + shape, underline + color).
- No functionality is reachable only by hover, long-press, swipe or a keyboard shortcut
  without a visible alternative.
- Empty states explain what will appear here and offer the action that fills it.

## 2. Affordances and signifiers

An *affordance* is a relationship between a thing and a person: a button affords pressing.
A *signifier* is the cue that communicates that the affordance exists. On screens, almost
everything is a signifier, so it has to be designed on purpose.

- Buttons look pressable: filled or outlined, adequate padding, label that is a verb.
- Links in body text are underlined or otherwise unmistakable, not color alone.
- Inputs look like places to type: a visible boundary, a label above, not a placeholder
  pretending to be a label.
- Draggable, resizable or scrollable regions show it (handle, edge shadow, partial item).
- Remove false signifiers: things that look clickable but are not (colored headings,
  boxed static text, chevrons that do nothing).

## 3. Mapping

The relationship between controls and their effects should be natural: spatial, cultural or
logical.

- Controls sit next to what they affect. A filter belongs above the list it filters.
- Order mirrors reality: chronological lists, left-to-right progress, up means more.
- Toggle labels describe the state they produce, not an ambiguous noun.
- Group related controls; separate unrelated ones (proximity carries meaning).

## 4. Feedback

Every action needs an immediate, informative response. Silence makes people click again.

- Visible response within 100 ms (pressed state, spinner, optimistic update).
- Anything over 1 s shows progress; over 10 s shows progress with an estimate or allows
  leaving.
- Results are announced where the user is looking, and to screen readers (`aria-live`).
- Errors say what happened, why, and how to fix it, next to the field that caused it.
- Too much feedback is also a failure: no toast for every trivial save.

## 5. Constraints

Limit what can be done so the wrong thing is hard to do.

- Prefer pickers, steppers and selects over free text when the valid set is small.
- Disable or hide actions that cannot work right now, and explain why (tooltip or helper text).
- Validate on blur and on submit, not on every keystroke while someone is still typing.
- Format input for the user (spaces in IBAN, phone formatting) instead of rejecting theirs.

## 6. Conceptual model

People build a mental model of how the system works. A good interface communicates a
model that is simple and correct, so their predictions come true.

- Use the words users use, not internal or technical terms.
- One concept, one name, everywhere.
- Show system state that matters: saved/unsaved, online/offline, draft/published.
- Make the structure visible: where am I, where can I go, how do I get back.

## 7. Consistency and standards

Users spend most of their time in *other* products. Match platform conventions unless you
have a strong, tested reason not to.

- Same component, same behavior, everywhere in the product.
- Primary action position is consistent across dialogs and forms.
- Standard icons for standard meanings; label anything less common.

## 8. Error prevention and recovery

Human error is usually design error. Design for slips (wrong action, right intent) and
mistakes (wrong intent).

- Undo is better than confirmation. Confirm only irreversible, costly actions, and name the
  consequence in the button ("Delete 3 files", not "OK").
- Preserve user input on errors and navigation. Never clear a form because one field failed.
- Destructive actions are visually distinct and not the default focus.

## 9. Recognition over recall

Minimize what users must remember.

- Show options instead of requiring typed commands.
- Keep context visible across steps (summary of choices in a checkout).
- Recently used and suggested items surface first.

## 10. Accessibility is part of the design

Accessible design is usable design under more conditions (bright sun, one hand, tired eyes).

- Contrast: body text at least 4.5:1, large text and UI boundaries at least 3:1 (WCAG 2.2 AA).
- Touch targets at least 24×24 px (WCAG 2.2), aim for 44×44 px on touch devices.
- Visible focus indicator on every focusable element; logical tab order.
- Never convey meaning by color alone.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.
- Text resizes to 200 % without breaking layout.

---

## Laws of UX worth applying daily

- **Fitts's law:** important targets are large and close to where the pointer or thumb already is.
- **Hick's law:** more choices, slower decisions. Reduce, group, or stage them.
- **Miller / chunking:** chunk long information (phone numbers, settings) into groups.
- **Jakob's law:** users expect your site to work like the ones they already know.
- **Doherty threshold:** responses under ~400 ms keep people in flow.
- **Aesthetic-usability effect:** polished interfaces are perceived as easier, so polish is not
  optional, but it never replaces actual usability.
- **Peak-end rule:** design the best moment and the last moment of a flow with extra care
  (success states, confirmation screens).
- **Tesler's law:** complexity cannot be removed, only moved. Move it to the system, not the user.

---

## Sources (for further reading; ideas summarized, no text reproduced)

- Don Norman, *The Design of Everyday Things*, revised edition, 2013.
- Jakob Nielsen, *10 Usability Heuristics for User Interface Design*, Nielsen Norman Group.
- Jon Yablonski, *Laws of UX*, lawsofux.com.
- W3C, *Web Content Accessibility Guidelines (WCAG) 2.2*.
