import { calcGeneratorDuration, cubicBezier, spring } from "motion";
import { flip } from "svelte/animate";
import { slide } from "svelte/transition";
import { readMotionTokens } from "@everyday-ui/tokens/motion";

function timing(node: Element, kind: "enter" | "exit" | "move") {
  const tokens = readMotionTokens(node);
  const curve = kind === "enter" ? tokens.ease.out : kind === "exit" ? tokens.ease.in : tokens.ease.inOut;
  if (!tokens.reduced && kind !== "exit" && tokens.bounce > 0) {
    const animation = spring({ keyframes: [0, 1], visualDuration: tokens.duration.base, bounce: tokens.bounce * (kind === "move" ? 0.7 : 1) });
    const duration = calcGeneratorDuration(animation);
    return { tokens, duration, easing: (t: number) => animation.next(t * duration).value };
  }
  return { tokens, duration: tokens.reduced ? 0 : tokens.duration[kind === "exit" ? "fast" : "base"] * 1000, easing: cubicBezier(...curve) };
}

export function reveal(node: Element, exit = false) {
  const { tokens, duration, easing } = timing(node, exit ? "exit" : "enter");
  const distance = tokens.distance * (exit ? -0.5 : 1);
  return { duration, easing, css: (t: number, u: number) =>
    `opacity: ${t}; translate: 0 ${distance * u}px; scale: ${t + u * tokens.scale}` };
}

export function collapse(node: Element, exit = false) {
  const { duration, easing } = timing(node, exit ? "exit" : "enter");
  return slide(node, { duration, easing });
}

export function move(node: Element, bounds: { from: DOMRect; to: DOMRect }) {
  const { duration, easing } = timing(node, "move");
  return flip(node, bounds, { duration, easing });
}
