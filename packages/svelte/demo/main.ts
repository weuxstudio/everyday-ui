import { mount } from "svelte";
import Demo from "./Demo.svelte";

import Checkout from "../../../skills/everyday-ui/patterns/checkout/Checkout.svelte";
import Dashboard from "../../../skills/everyday-ui/patterns/dashboard/Dashboard.svelte";
import ListsTables from "../../../skills/everyday-ui/patterns/lists-tables/ListsTables.svelte";
import Pricing from "../../../skills/everyday-ui/patterns/pricing/Pricing.svelte";
import Settings from "../../../skills/everyday-ui/patterns/settings/Settings.svelte";
import SignupOnboarding from "../../../skills/everyday-ui/patterns/signup-onboarding/SignupOnboarding.svelte";

const patterns = {
  "checkout": Checkout,
  "dashboard": Dashboard,
  "lists-tables": ListsTables,
  "pricing": Pricing,
  "settings": Settings,
  "signup-onboarding": SignupOnboarding,
};
const name = new URLSearchParams(location.search).get("pattern");
mount(name && Object.hasOwn(patterns, name) ? patterns[name as keyof typeof patterns] : Demo, { target: document.getElementById("app")! });
