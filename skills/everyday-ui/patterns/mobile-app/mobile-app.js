// Everyday UI - mobile app blueprint behaviour. Plain JS, no framework, so it ports anywhere.
// What it demonstrates:
//  - hash routes with real history entries (system back = in-app back)
//  - a bottom sheet that is a history entry: back, Escape, close button and scrim all close it
//  - scroll position restored per screen when going back
//  - agenda: one chronological stream, grouped under day headings, all-day items first
(() => {
  "use strict";

  // ---------- Demo data (replace with real data) ----------
  const NOW = new Date(2026, 10, 18, 10, 30); // Wed 18 Nov 2026, 10:30
  const items = [
    { id: "a1", kind: "appointment", title: "Initial consultation", day: "2026-11-18", start: "08:00", end: "08:45", who: "Jonas Becker", where: "Room 2", status: "confirmed" },
    { id: "t1", kind: "task", title: "Send invoice to Studio Nord", day: "2026-11-18", start: null, who: "Studio Nord", status: "open" },
    { id: "a2", kind: "appointment", title: "Follow-up session", day: "2026-11-18", start: "14:00", end: "15:00", who: "Priya Raman", where: "Video call", status: "pending" },
    { id: "r1", kind: "reminder", title: "Prepare treatment notes", day: "2026-11-18", start: "16:30", who: "", status: "open" },
    { id: "a3", kind: "appointment", title: "Workshop: posture at the desk with the whole team of Einverständniserklärung GmbH", day: "2026-11-19", start: "09:30", end: "12:00", who: "Einverständniserklärung GmbH", where: "Client office, Hamburg", status: "confirmed" },
    { id: "a4", kind: "appointment", title: "Initial consultation", day: "2026-11-20", start: "11:00", end: "11:45", who: "Mara Lindqvist", where: "Room 1", status: "pending" },
  ];

  const KIND = {
    appointment: { label: "Appointment", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="5.5" width="16" height="14" rx="2"/><path d="M4 10h16"/></svg>' },
    task: { label: "Task", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>' },
    reminder: { label: "Reminder", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Z"/><path d="M10 20.5h4"/></svg>' },
  };
  const STATUS = {
    confirmed: { label: "Confirmed", tone: "success" },
    pending: { label: "Waiting for confirmation", tone: "warning" },
  };

  const lang = document.documentElement.lang || "en-GB";
  const fmtDay = new Intl.DateTimeFormat(lang, { weekday: "short", day: "numeric", month: "short" });
  const fmtWd = new Intl.DateTimeFormat(lang, { weekday: "short" });
  const rel = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  const toDate = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };
  const isoOf = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const dayDiff = (d) => Math.round((toDate(isoOf(d)) - toDate(isoOf(NOW))) / 864e5);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const $ = (sel, root = document) => root.querySelector(sel);

  // ---------- Week strip ----------
  function renderWeek() {
    const monday = new Date(NOW); monday.setDate(NOW.getDate() - ((NOW.getDay() + 6) % 7));
    const html = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday); d.setDate(monday.getDate() + i);
      const iso = isoOf(d);
      const today = dayDiff(d) === 0;
      const has = items.some((it) => it.day === iso);
      const name = `${fmtDay.format(d)}${today ? ", today" : ""}${has ? "" : ", nothing planned"}`;
      html.push(`<li><button class="day" type="button" data-day="${iso}" aria-pressed="${today}" ${today ? "data-today" : ""} aria-label="${esc(name)}">
        <span class="day__wd" aria-hidden="true">${today ? "Today" : esc(fmtWd.format(d))}</span>
        <span class="day__num" aria-hidden="true">${d.getDate()}</span>
        <span class="day__dot" aria-hidden="true" ${has ? "" : "hidden"}></span></button></li>`);
    }
    $("[data-week]").innerHTML = html.join("");
  }

  // ---------- Agenda: one stream, day headings, all-day first, past muted ----------
  function renderAgenda() {
    const byDay = new Map();
    [...items]
      .sort((a, b) => a.day.localeCompare(b.day) || (a.start ? 1 : 0) - (b.start ? 1 : 0) || String(a.start).localeCompare(String(b.start)))
      .forEach((it) => byDay.has(it.day) ? byDay.get(it.day).push(it) : byDay.set(it.day, [it]));

    const html = [];
    for (const [iso, list] of byDay) {
      const d = toDate(iso);
      const diff = dayDiff(d);
      const relWord = Math.abs(diff) <= 1 ? cap(rel.format(diff, "day")) : "";
      html.push(`<section class="agenda__day" id="day-${iso}" aria-labelledby="h-${iso}">
        <h2 id="h-${iso}" tabindex="-1">${esc(fmtDay.format(d))}${relWord ? ` <span class="rel">· ${esc(relWord)}</span>` : ""}</h2>
        <ul class="list">${list.map(rowHtml).join("")}</ul></section>`);
    }
    $("[data-agenda]").innerHTML = html.join("");
  }

  function rowHtml(it) {
    const k = KIND[it.kind];
    const past = it.day === isoOf(NOW) && it.end && it.end < `${String(NOW.getHours()).padStart(2, "0")}:${String(NOW.getMinutes()).padStart(2, "0")}`;
    const meta = [it.who, it.where].filter(Boolean).join(" · ");
    const status = it.status === "pending" ? ` · <span>${STATUS.pending.label}</span>` : "";
    return `<li><a class="row" href="#/item/${it.id}" ${past ? "data-past" : ""}>
      <span class="row__time">${it.start ? esc(it.start) : "All day"}</span>
      <span class="row__main">
        <span class="row__title">${esc(it.title)}</span>
        <span class="row__meta"><span class="kind">${k.icon}${k.label}</span>${meta ? ` · ${esc(meta)}` : ""}${status}${past ? " · Done" : ""}</span>
      </span>
      <svg class="row__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>
    </a></li>`;
  }

  // ---------- Detail: summary header first, primary action low ----------
  function renderDetail(id) {
    const it = items.find((x) => x.id === id);
    if (!it) { location.replace("#/"); return; }
    const k = KIND[it.kind];
    const st = STATUS[it.status];
    const when = `${fmtDay.format(toDate(it.day))}${it.start ? `, ${it.start}${it.end ? `–${it.end}` : ""}` : ", all day"}`;
    const initials = (n) => n.split(/\s+/).map((p) => p[0]).slice(0, 2).join("");

    $("[data-detail]").innerHTML = `
      <header class="summary">
        <span class="kind muted">${k.icon}${k.label}</span>
        <h1 id="detail-title" tabindex="-1">${esc(it.title)}</h1>
        ${st ? `<span><span class="badge badge--${st.tone}">${st.label}</span></span>` : ""}
        <dl class="facts">
          <dt>When</dt><dd>${esc(when)}</dd>
          ${it.where ? `<dt>Where</dt><dd>${esc(it.where)}</dd>` : ""}
          ${it.who ? `<dt>With</dt><dd>${esc(it.who)}</dd>` : ""}
        </dl>
      </header>
      ${it.who ? `<section class="section" aria-labelledby="p-h"><h2 id="p-h">Participants</h2>
        <ul class="list">
          <li class="person"><span class="avatar" aria-hidden="true">${esc(initials(it.who))}</span><span><span class="row__title">${esc(it.who)}</span><br><span class="muted">Client</span></span></li>
          <li class="person"><span class="avatar" aria-hidden="true">You</span><span><span class="row__title">You</span><br><span class="muted">Organiser</span></span></li>
        </ul></section>` : ""}
      <section class="section" aria-labelledby="h-h"><h2 id="h-h">History</h2>
        <ul class="list">
          <li class="person"><span><span>Created by you</span><br><span class="muted">Mon 16 Nov, 17:12</span></span></li>
          ${it.status === "pending" ? `<li class="person"><span><span>Invitation sent to ${esc(it.who)}</span><br><span class="muted">Mon 16 Nov, 17:12 · no reply yet</span></span></li>` : ""}
        </ul></section>
      ${it.kind === "appointment" ? `<button class="btn btn--tertiary" type="button" data-cancel>Cancel appointment</button>` : ""}`;

    const primary = it.status === "pending" ? "Send reminder to " + it.who.split(" ")[0] : it.kind === "task" ? "Mark as done" : "Add a note";
    $("[data-actionbar]").innerHTML = `<button class="btn btn--primary" type="button" data-primary>${esc(primary)}</button>`;
  }

  // ---------- Routing with real history: system back works everywhere ----------
  const scrollMemory = new Map();
  let currentRoute = null;

  function route() {
    const hash = location.hash || "#/";
    if (currentRoute) scrollMemory.set(currentRoute, window.scrollY);
    const m = hash.match(/^#\/item\/(\w+)/);
    const tab = m ? "agenda" : (hash.match(/^#\/(\w+)/) || [, "agenda"])[1];
    show(m ? "detail" : tab === "agenda" ? "agenda" : "other");

    if (m) renderDetail(m[1]);
    if (!m && tab !== "agenda") $("[data-other-title]").textContent = cap(tab);

    document.querySelectorAll("[data-tab]").forEach((a) => {
      if (a.dataset.tab === tab) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    // Focused flows hide the tab bar; detail screens keep their own action bar instead.
    $("[data-tabbar]").hidden = Boolean(m);

    const prev = scrollMemory.get(hash);
    window.scrollTo(0, prev ?? 0);
    // Move focus to the new screen's heading so screen-reader and keyboard users know where they are.
    if (currentRoute !== null) $(m ? "#detail-title" : tab === "agenda" ? "#agenda-title" : "#other-title")?.focus({ preventScroll: true });
    currentRoute = hash;
    updateScrolled();
  }

  function show(name) {
    document.querySelectorAll("[data-screen]").forEach((s) => { s.hidden = s.id !== `screen-${name}`; });
  }

  // In-app back = history back, so it matches the system gesture. Deep link without history: go to parent.
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-back]")) {
      e.preventDefault();
      if (history.state?.inApp) history.back(); else location.replace("#/");
    }
  });
  // Mark entries created inside the app, so "back" knows whether there is somewhere to go.
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#/"]');
    if (!a) return;
    e.preventDefault();
    const tab = a.closest("[data-tabbar]");
    // Tapping the active tab returns to its top.
    if (tab && a.getAttribute("aria-current") === "page") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (currentRoute) scrollMemory.set(currentRoute, window.scrollY);
    history.pushState({ inApp: true }, "", a.getAttribute("href"));
    route();
  });

  // ---------- Bottom sheet as a history entry ----------
  const sheet = $("[data-sheet]");
  const status = $("[data-status]");
  $("[data-choices]").innerHTML = Object.entries(KIND).map(([key, k]) => `<li><button class="row choice" type="button" data-choice="${key}">
    <span class="choice__icon" aria-hidden="true">${k.icon}</span>
    <span class="row__main"><span class="row__title">New ${k.label.toLowerCase()}</span><span class="row__meta">${key === "appointment" ? "With a client, at a time" : key === "task" ? "Something to get done, no time" : "A nudge at a set time"}</span></span>
    <svg class="row__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>
  </button></li>`).join("");

  function openSheet() {
    if (sheet.open) return;
    history.pushState({ inApp: true, sheet: true }, "", location.href);
    sheet.showModal(); // focus trap, Escape, inert page and focus return come from the browser
  }
  function closeSheet() {
    // Closing through history keeps one rule for every way out (button, Escape, scrim, system back).
    if (history.state?.sheet) history.back(); else sheet.close();
  }
  $("[data-open-sheet]").addEventListener("click", openSheet);
  $("[data-close-sheet]").addEventListener("click", closeSheet);
  sheet.addEventListener("cancel", (e) => { e.preventDefault(); closeSheet(); });
  sheet.addEventListener("click", (e) => { if (e.target === sheet) closeSheet(); }); // scrim: nothing to lose here
  sheet.addEventListener("click", (e) => {
    const c = e.target.closest("[data-choice]");
    if (!c) return;
    closeSheet();
    status.textContent = `New ${KIND[c.dataset.choice].label.toLowerCase()}: the creation screen would open here.`;
  });

  window.addEventListener("popstate", () => {
    if (sheet.open && !history.state?.sheet) { sheet.close(); return; }
    route();
  });

  // ---------- Week strip: jump to the day ----------
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-day]");
    if (!b) return;
    document.querySelectorAll("[data-day]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const target = document.getElementById(`h-${b.dataset.day}`);
    if (target) { target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); target.focus({ preventScroll: true }); }
    else status.textContent = "Nothing planned on this day.";
  });

  // ---------- Scroll edge on the top bar; small title appears once the large one is gone ----------
  function updateScrolled() {
    const y = window.scrollY > 4;
    document.querySelectorAll("[data-topbar]").forEach((t) => {
      t.toggleAttribute("data-scrolled", y);
      const title = t.querySelector(".topbar__title");
      const screen = t.closest("[data-screen]");
      if (title && screen?.id !== "screen-detail") title.textContent = y ? screen.querySelector("h1")?.textContent ?? "" : "";
    });
  }
  window.addEventListener("scroll", updateScrolled, { passive: true });

  // ---------- Start ----------
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  // Demo hooks for screenshots: ?screen=detail or ?sheet=1
  const q = new URLSearchParams(location.search);
  renderWeek();
  renderAgenda();
  if (q.get("screen") === "detail" && !location.hash) history.replaceState(null, "", "#/item/a2");
  route();
  if (q.get("sheet")) openSheet();
})();
