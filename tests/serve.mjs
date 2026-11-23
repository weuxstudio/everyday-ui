import { serveStatic } from "../packages/shots/lib/shots.mjs";
await serveStatic(process.cwd(), 4173);
