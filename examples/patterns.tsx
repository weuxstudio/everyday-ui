// Pattern gallery: ?pattern=<name>&theme=<preset>
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SignupOnboarding from "../skills/everyday-ui/patterns/signup-onboarding/SignupOnboarding";
import Pricing from "../skills/everyday-ui/patterns/pricing/Pricing";
import Dashboard from "../skills/everyday-ui/patterns/dashboard/Dashboard";
import Settings from "../skills/everyday-ui/patterns/settings/Settings";
import Checkout from "../skills/everyday-ui/patterns/checkout/Checkout";
import ListsTables from "../skills/everyday-ui/patterns/lists-tables/ListsTables";
import MotionShowcase from "./motion-showcase";
import MotionCompare from "./motion-compare";

const PATTERNS = {
  "signup-onboarding": SignupOnboarding,
  pricing: Pricing,
  dashboard: Dashboard,
  settings: Settings,
  checkout: Checkout,
  "lists-tables": ListsTables,
  motion: MotionShowcase,
  "motion-compare": MotionCompare,
} as const;

const name = (new URLSearchParams(location.search).get("pattern") ?? "") as keyof typeof PATTERNS;
const Pattern = PATTERNS[name];

function Index() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-20">
      <h1 className="text-3xl font-heading">Everyday UI patterns</h1>
      <ul className="mt-6 flex flex-col gap-2">
        {Object.keys(PATTERNS).map((p) => (
          <li key={p}>
            <a href={`?pattern=${p}`}>{p}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode>{Pattern ? <Pattern /> : <Index />}</StrictMode>);
