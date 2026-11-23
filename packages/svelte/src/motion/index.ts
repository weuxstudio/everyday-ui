import { flushSync } from "svelte";
export { default as MotionProvider } from "./MotionProvider.svelte";
export { default as Reveal } from "./Reveal.svelte";
export { default as Collapse } from "./Collapse.svelte";
export { default as AnimatedList } from "./AnimatedList.svelte";
export { readMotionTokens, type MotionTokens } from "@everyday-ui/tokens/motion";

export function viewTransition(update: () => void) {
  if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    update();
    return;
  }
  return document.startViewTransition(() => flushSync(update));
}
