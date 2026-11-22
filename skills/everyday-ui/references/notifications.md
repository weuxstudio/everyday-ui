# Notifications (push, in-app, email)

For many apps the most important touchpoint isn't a screen: it's a line of text on a lock
screen. A notification interrupts someone who was doing something else. Every one has to be
worth that interruption, readable in two seconds and actionable without opening the app.

Read this when the project sends push notifications, in-app notifications or transactional
emails. Platform details: Apple HIG *Notifications*, Material *Notifications* (Android
notification channels).

## 1. Is it worth an interruption?

Sort every notification type into one of three classes before writing it:

| Class | Examples | Delivery |
| --- | --- | --- |
| **Urgent and personal** | appointment in 30 min moved, payment failed, someone is waiting for a reply | Push, immediately; may break through quiet hours only if the user allowed it |
| **Useful, not urgent** | new comment, weekly report ready, task assigned | Push or in-app, bundled (digest), respects quiet hours |
| **Informational / promotional** | tips, feature news, offers | In-app or email only; push only with explicit opt-in for marketing |

- **Budget:** decide a maximum per user per day in the brief (a good default: 3 non-urgent
  pushes per day). Over budget → the rest goes into a digest or the in-app inbox.
- **Bundle**: five comments on one item are one notification ("5 new comments on „Q3 plan“"),
  not five. Replace or update a notification instead of stacking duplicates (same thread/tag).
- **New notification types default to off** for existing users, or on only if they are clearly
  urgent and personal. Never re-enable something the user turned off.
- One setting per type, in the app's own settings and mapped to Android notification channels,
  so people can mute one kind without losing all of them.

## 2. Copy: front-loaded, factual, actionable

Lock screens show about one line of title and two lines of body, often truncated further.

- **Title: what + when** (or who + what), the key fact first:
  "Appointment moved to Thu 19 Nov, 14:00" – not "Important update!".
- **Body: the one fact needed to act** or decide, nothing else:
  "Priya Raman moved it. Tap to confirm or suggest another time."
- **Name the object** (appointment, invoice, project) and the person, so it makes sense without
  opening the app or the app's name in front of it.
- **Dates with weekday and time** in the locale format ("Thu 19 Nov, 14:00"; German
  "Do., 19.11., 14:00 Uhr"); "today"/"tomorrow" in addition only if the notification is
  delivered close to the event.
- **No marketing tone**: no exclamation marks, no emojis as content, no "Don't miss out", no
  clickbait ("You won't believe…"), no fake urgency.
- **No sensitive content on the lock screen** by default (health, money amounts, message bodies
  when the product is private): "New message from Dr. Weber" instead of the message. Offer a
  setting to show previews.
- Same vocabulary and address form (du/Sie) as the app.

## 3. Actions

- **At most 2–3 actions**, each a verb (+ object): "Confirm", "Suggest time", "Reply". Not
  "OK", not "View" (tapping the notification already opens it).
- **Safe default:** the tap opens the exact item the notification is about (deep link), not the
  home screen. The destructive action, if any, is never first and asks for confirmation or
  offers undo.
- Actions that work **without opening the app** (mark as done, snooze, reply inline) must give
  feedback (the notification updates: "Confirmed") and work if the app was closed or the user is
  signed out (then: open the app to sign in, then complete the action).
- Expired notifications update or disappear: an invitation that was cancelled shouldn't still
  offer "Accept".

## 4. Timing and quiet hours

- Respect the system's Focus / Do Not Disturb modes; mark only truly time-sensitive types as
  time-sensitive (iOS) or high-importance (Android).
- **Quiet hours** (default e.g. 21:00–8:00 in the user's time zone): non-urgent items wait and
  arrive bundled at the end of quiet hours. **Move urgent items before the quiet hours** where
  possible ("Tomorrow 8:00: appointment with Jonas" sent the evening before), don't drop them.
- Send in the user's local time zone, not the server's.
- Reminders: the lead time fits the task (30 min before a call, a day before an appointment that
  needs travel), and users can change it.

## 5. Delivery honesty

- Never claim something was delivered, read or seen unless the system confirmed it. Say
  "Sent" until delivery is confirmed; "Seen" only with a read receipt the other side allowed.
- Push is not guaranteed. For anything that must arrive (security codes, payment failures,
  cancelled appointments), use a fallback channel (email, SMS) and say which one in the app.
- Show the same information in the app (inbox, badge, banner on the item): a missed push must
  never mean missed information.

## 6. Permission prompt

- **Don't ask at first launch.** Ask when the user does something that benefits from
  notifications ("Remind me 1 hour before" while booking).
- **Explain first, in the app's own UI** (one sentence on the benefit, what kind and how often),
  with "Allow notifications" and "Not now". Only "Allow" triggers the system prompt; a refused
  system prompt usually can't be shown again.
- **Denied:** the feature still works where possible ("We'll show reminders in the app"), and a
  quiet hint in settings links to the system settings ("Notifications are off for this app.
  Turn them on in Settings").
- Web push: the same flow; browsers block sites that prompt without a user gesture.

## 7. In-app counterpart: notification inbox

- An inbox (bell or "Inbox" tab) lists what was sent, newest first, grouped by day, with unread
  marked by weight **and** a dot or label (not colour alone).
- Each entry links to its item; actions available in the push are available here too.
- "Mark all as read" as a tertiary action; the badge count follows the rules in `mobile.md`
  (only what needs action).
- Empty state: "No notifications. We'll let you know when someone replies or something changes."

## 8. Emails (transactional)

- Subject line follows the title rules (what + when); preheader is the body line.
- One primary button with the action, also as a plain link; the email makes sense with images
  off and in dark mode.
- Unsubscribe or "Manage notifications" link in every non-essential email; essential emails
  (security, receipts, contract changes) say why the user still gets them.

## Notifications checklist (only if the project sends notifications)

- [ ] Every type classified (urgent / useful / informational) with a channel and a setting.
- [ ] Daily budget defined; bundling and digest for non-urgent types; duplicates updated, not stacked.
- [ ] Titles front-load what + when; bodies carry one actionable fact; no marketing tone, no exclamation marks.
- [ ] Dates with weekday and local time; same vocabulary and address form as the app.
- [ ] Lock-screen content safe by default; previews opt-in for private content.
- [ ] ≤ 3 actions with verb labels; tap opens the exact item; actions work with the app closed and give feedback.
- [ ] Quiet hours respected; urgent items moved before them, not dropped; user's time zone.
- [ ] Delivery status honest; critical messages have a fallback channel; everything also visible in the app.
- [ ] Permission asked in context after an in-app explanation; denied state handled with a path to settings.
