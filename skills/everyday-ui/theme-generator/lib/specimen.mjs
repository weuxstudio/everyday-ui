// A self-contained preview page for a theme: the same components in light and dark,
// so a theme can be judged at a glance before any product code exists.

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

export function googleFontsHref(fonts) {
  const fam = fonts.map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@400;500;600;700`).join("&");
  return `https://fonts.googleapis.com/css2?${fam}&display=swap`;
}

const CSS = `
*,*::before,*::after{box-sizing:border-box}
.btn,.input,.box,.card,.dialog,.stage{corner-shape:var(--eu-corner-shape,round)}
body{background:var(--eu-color-sunken)}
.wrap{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,560px),1fr));min-height:100vh}
.panel{background:var(--eu-color-paper);color:var(--eu-color-ink);padding:var(--eu-space-xl) var(--eu-space-m);display:flex;flex-direction:column;gap:var(--eu-space-xl)}
@media (min-width:900px){.panel{padding:var(--eu-space-2xl) var(--eu-space-xl)}}
.stack{display:flex;flex-direction:column;gap:var(--eu-space-s)}
.row{display:flex;flex-wrap:wrap;gap:var(--eu-space-s);align-items:center}
.eyebrow{font-size:var(--eu-text-sm);font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--eu-color-ink-muted);margin:0}
h1{font-size:var(--eu-text-4xl);line-height:var(--eu-text-4xl-line);letter-spacing:var(--eu-text-4xl-tracking);margin:var(--eu-space-xs) 0 0}
h2{font-size:var(--eu-text-xl);line-height:var(--eu-text-xl-line);letter-spacing:var(--eu-text-xl-tracking);margin:0}
.lead{font-size:var(--eu-text-lg);line-height:var(--eu-text-lg-line);color:var(--eu-color-ink-muted);max-width:var(--eu-size-measure);margin:0}
.btn{font:inherit;font-weight:600;font-size:var(--eu-text-base);height:var(--eu-size-control-md);padding:0 var(--eu-space-s);border-radius:var(--eu-radius-control);border:1px solid transparent;cursor:pointer;transition:background-color var(--eu-duration-fast) var(--eu-ease-out),transform var(--eu-duration-instant) var(--eu-ease-out)}
.btn:active{transform:translateY(1px)}
.btn-primary{background:var(--eu-color-accent);color:var(--eu-color-accent-ink)}
.btn-primary:hover{background:var(--eu-color-accent-hover)}
.btn-secondary{background:var(--eu-color-surface);color:var(--eu-color-accent);border-color:var(--eu-color-accent)}
.btn-secondary:hover{background:var(--eu-color-accent-subtle)}
.btn-tertiary{background:none;color:var(--eu-color-accent);text-decoration:underline;text-underline-offset:.2em;padding:0 var(--eu-space-xs)}
.btn-danger{background:var(--eu-color-danger);color:var(--eu-color-danger-ink)}
.field{display:flex;flex-direction:column;gap:var(--eu-space-xs);max-width:28rem}
.field label{font-weight:600}
.hint{font-size:var(--eu-text-sm);color:var(--eu-color-ink-muted);margin:0}
.err{font-size:var(--eu-text-sm);font-weight:600;color:var(--eu-color-danger);margin:0}
.input{font:inherit;height:var(--eu-size-control-md);padding:0 .75rem;border-radius:var(--eu-radius-control);border:1px solid var(--eu-color-border-strong);background:var(--eu-color-surface);color:var(--eu-color-ink)}
.input.is-error{border:2px solid var(--eu-color-danger);background:var(--eu-color-danger-subtle)}
.check{display:flex;gap:.75rem;align-items:center}
.box{width:1.25rem;height:1.25rem;border-radius:var(--eu-radius-check);border:2px solid var(--eu-color-border-strong);background:var(--eu-color-surface);display:grid;place-items:center}
.box.on{background:var(--eu-color-accent);border-color:var(--eu-color-accent);color:var(--eu-color-accent-ink)}
.badge{display:inline-flex;align-items:center;padding:.125rem .625rem;border-radius:var(--eu-radius-badge);font-size:var(--eu-text-sm);font-weight:600}
.b-n{background:var(--eu-color-sunken);color:var(--eu-color-ink-muted)}
.b-s{background:var(--eu-color-success-subtle);color:var(--eu-color-success)}
.b-w{background:var(--eu-color-warning-subtle);color:var(--eu-color-warning)}
.b-d{background:var(--eu-color-danger-subtle);color:var(--eu-color-danger)}
.card{background:var(--eu-color-surface);border:1px solid var(--eu-color-border);border-radius:var(--eu-radius-card);padding:var(--eu-space-card);display:flex;flex-direction:column;gap:var(--eu-space-xs)}
.card p{margin:0;color:var(--eu-color-ink-muted)}
.stage{position:relative;border-radius:var(--eu-radius-card);overflow:hidden;padding:var(--eu-space-l) var(--eu-space-m);background:
  radial-gradient(circle at 20% 30%, var(--eu-color-accent) 0 18%, transparent 19%),
  radial-gradient(circle at 75% 70%, var(--eu-color-warning) 0 14%, transparent 15%),
  repeating-linear-gradient(0deg, var(--eu-color-border) 0 1px, transparent 1px 22px), var(--eu-color-sunken)}
.stage-text{position:absolute;inset:var(--eu-space-s);font-size:var(--eu-text-sm);line-height:1.6;color:var(--eu-color-ink);opacity:.8;overflow:hidden}
.dialog{position:relative;max-width:24rem;margin:var(--eu-space-m) auto;background:var(--eu-color-overlay);-webkit-backdrop-filter:blur(var(--eu-effect-overlay-blur)) saturate(1.4);backdrop-filter:blur(var(--eu-effect-overlay-blur)) saturate(1.4);border:1px solid var(--eu-color-border);border-radius:var(--eu-radius-dialog);box-shadow:var(--eu-shadow-lg);padding:var(--eu-space-m);display:flex;flex-direction:column;gap:var(--eu-space-xs)}
.dialog p{margin:0;color:var(--eu-color-ink-muted)}
.scale{display:flex;flex-direction:column;gap:var(--eu-space-xs)}
.scale div{display:flex;gap:var(--eu-space-s);align-items:baseline}
.scale small{width:3.5rem;flex:none;font-size:var(--eu-text-xs);color:var(--eu-color-ink-muted);font-family:var(--eu-font-mono)}
.scale span{font-family:var(--eu-font-display);font-weight:var(--eu-font-weight-heading);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(6.5rem,1fr));gap:var(--eu-space-xs)}
.sw{border:1px solid var(--eu-color-border);border-radius:var(--eu-radius-sm);overflow:hidden;font-size:var(--eu-text-xs);background:var(--eu-color-surface)}
.sw i{display:block;height:2.75rem}
.sw b{display:block;padding:.25rem .5rem;font-weight:600;font-family:var(--eu-font-mono)}
.meta{font-family:var(--eu-font-mono);font-size:var(--eu-text-xs);color:var(--eu-color-ink-muted);margin:0}
`;

const SWATCHES = ["paper", "surface", "sunken", "ink", "ink-muted", "border", "border-strong", "accent", "accent-subtle", "brand", "danger", "success", "warning"];

function panel(mode, { name, knobs }) {
  const k = knobs;
  return `<section class="panel" data-theme="${mode}" aria-label="${mode} mode">
  <header>
    <p class="eyebrow">${esc(name)} · ${mode}</p>
    <h1>Interfaces that explain themselves</h1>
    <p class="lead" style="margin-top:var(--eu-space-s)">Preset <strong>${esc(k.preset)}</strong> · radius ${esc(k.shape?.radius)} ${k.shape?.corners === "squircle" ? "(squircle)" : ""} · ${esc(k.density)} · ${esc(k.depth)} depth · ${esc(k.surface)} surfaces · ${esc(k.motion)} motion</p>
  </header>

  <div class="stack">
    <h2>Actions</h2>
    <div class="row">
      <button class="btn btn-primary">Save changes</button>
      <button class="btn btn-secondary">Preview</button>
      <button class="btn btn-tertiary">Cancel</button>
    </div>
    <div class="row"><span class="badge b-n">Draft</span><span class="badge b-s">Paid</span><span class="badge b-w">Pending</span><span class="badge b-d">Overdue</span></div>
  </div>

  <div class="stack">
    <h2>Form</h2>
    <div class="field"><label for="e-${mode}">Billing email <span style="color:var(--eu-color-ink-muted)">*</span></label><p class="hint">Invoices are sent here</p><input class="input" id="e-${mode}" value="studio@example.com"></div>
    <div class="field"><label for="p-${mode}">Postcode <span style="color:var(--eu-color-ink-muted)">*</span></label><p class="err">Enter a 5-digit postcode</p><input class="input is-error" id="p-${mode}" value="2010" style="max-width:8ch"></div>
    <div class="check"><span class="box on" aria-hidden="true">✓</span>Send me a copy of each invoice</div>
    <div class="check"><span class="box" aria-hidden="true"></span>Add a note to invoices</div>
  </div>

  <div class="stack">
    <h2>Surfaces</h2>
    <div class="card"><strong>Members</strong><p>3 people can open and edit this workspace.</p><div class="row" style="margin-top:var(--eu-space-xs)"><button class="btn btn-secondary">Invite member</button></div></div>
    <div class="stage">
      <div class="stage-text" aria-hidden="true">${"Quarterly report · Revenue 48,210 € · Projects 14 · Invoices 212 · ".repeat(14)}</div>
      <div class="dialog" role="dialog" aria-label="Example dialog"><strong style="font-family:var(--eu-font-display);font-size:var(--eu-text-lg)">Delete Atlas Studio?</strong><p>14 projects and 212 invoices are deleted for all 3 members.</p><div class="row" style="margin-top:var(--eu-space-xs)"><button class="btn btn-danger">Delete workspace</button><button class="btn btn-secondary">Keep workspace</button></div></div>
    </div>
  </div>

  <div class="stack">
    <h2>Type</h2>
    <div class="scale">${["4xl", "3xl", "2xl", "xl"].map((s) => `<div><small>${s}</small><span style="font-size:var(--eu-text-${s});line-height:var(--eu-text-${s}-line);letter-spacing:var(--eu-text-${s}-tracking)">Clear beats clever</span></div>`).join("")}
      <div><small>lg</small><p style="margin:0;font-size:var(--eu-text-lg);line-height:var(--eu-text-lg-line);max-width:var(--eu-size-measure)">Long reading text sits at 18 px with generous line height, so paragraphs stay comfortable even on small screens.</p></div>
      <div><small>base</small><p style="margin:0">Interface text, labels and inputs use 16 px. <a href="#">Links are underlined</a>.</p></div>
    </div>
  </div>

  <div class="stack">
    <h2>Color</h2>
    <div class="swatches">${SWATCHES.map((s) => `<div class="sw"><i style="background:var(--eu-color-${s})"></i><b>${s}</b></div>`).join("")}</div>
  </div>
</section>`;
}

export function specimenHtml({ name, knobs, fonts, notes = [], contrast }) {
  const passed = contrast.results.length - contrast.failed.length;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(name)} · Everyday UI theme</title>
<!-- Preview only. In production, self-host fonts (see THEME.md). -->
<link rel="stylesheet" href="${googleFontsHref(fonts)}">
<link rel="stylesheet" href="./tokens.css">
<link rel="stylesheet" href="./base.css">
<style>${CSS}</style>
</head>
<body>
<main class="wrap">
${panel("light", { name, knobs })}
${panel("dark", { name, knobs })}
</main>
<footer class="panel" data-theme="light" style="padding-top:var(--eu-space-m);padding-bottom:var(--eu-space-m);gap:var(--eu-space-xs)">
  <p class="meta">Contrast (WCAG 2.2 + APCA): ${passed}/${contrast.results.length} checks pass.</p>
  ${notes.map((n) => `<p class="meta">${esc(n)}</p>`).join("\n  ")}
</footer>
</body>
</html>
`;
}
