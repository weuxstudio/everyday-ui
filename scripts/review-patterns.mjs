import { loadConfig, run, serveStatic } from "../packages/shots/lib/shots.mjs";

const { server, url } = await serveStatic(process.cwd());
const routes = [];
for (const [adapter, gallery] of Object.entries({
  react: "/examples/dist/patterns.html", svelte: "/packages/svelte/demo/dist/index.html"
})) {
  for (const pattern of ["signup-onboarding", "pricing", "dashboard", "settings", "checkout", "lists-tables"]) {
    const actions = ["signup-onboarding", "checkout"].includes(pattern) ? [{ click: 'form button[type="submit"]' }] : [];
    routes.push({ name: adapter + "-" + pattern, path: gallery + "?pattern=" + pattern, actions, waitFor: "h1" });
  }
}
routes.push({ name: "mobile", path: "/skills/everyday-ui/patterns/mobile-app/blueprint.html" });
try {
  const cfg = loadConfig(process.cwd(), null, { routes, baseUrl: url, out: "everyday-shots/patterns" });
  const { results } = await run(cfg);
  const failures = results.flatMap(r => [...r.consoleErrors, ...r.issues.filter(i => /horizontal scroll/i.test(i))].map(i => r.route + " " + i));
  if (failures.length) throw new Error(failures.join("\n"));
} finally {
  await new Promise(resolve => server.close(resolve));
}
