import { useEffect, useState } from "react";
import type { Transition } from "motion/react";

type Bezier = [number, number, number, number];

/**
 * Motion values read from the theme's CSS variables, so JS animations (Motion) follow the same
 * knob as CSS transitions: minimal / smooth / playful, and zero under reduced motion.
 */
export interface MotionTokens {
  /** seconds */
  duration: { instant: number; fast: number; base: number; slow: number };
  ease: { out: Bezier; in: Bezier; inOut: Bezier };
  /** 0 = no overshoot. Only playful themes bounce. */
  bounce: number;
  /** px an element travels when it enters or leaves */
  distance: number;
  reduced: boolean;
}

export const DEFAULT_MOTION: MotionTokens = {
  duration: { instant: 0.08, fast: 0.14, base: 0.22, slow: 0.34 },
  ease: { out: [0.2, 0, 0, 1], in: [0.4, 0, 1, 1], inOut: [0.4, 0, 0.2, 1] },
  bounce: 0,
  distance: 8,
  reduced: false,
};

const seconds = (v: string, fallback: number) => {
  const m = v.trim().match(/^([\d.]+)(ms|s)$/);
  return m ? (m[2] === "ms" ? +m[1]! / 1000 : +m[1]!) : fallback;
};
const bezier = (v: string, fallback: Bezier): Bezier => {
  const m = v.match(/cubic-bezier\(([^)]+)\)/);
  const n = m ? m[1]!.split(",").map(Number) : [];
  return n.length === 4 && n.every(Number.isFinite) ? (n as Bezier) : fallback;
};
const px = (v: string, fallback: number) => {
  const m = v.trim().match(/^([\d.]+)(px|rem)$/);
  if (!m) return fallback;
  return m[2] === "rem" ? +m[1]! * parseFloat(getComputedStyle(document.documentElement).fontSize || "16") : +m[1]!;
};

export function readMotionTokens(el: Element = document.documentElement): MotionTokens {
  const s = getComputedStyle(el);
  const get = (name: string) => s.getPropertyValue(`--eu-${name}`);
  const d = DEFAULT_MOTION;
  const reduced = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  return {
    duration: {
      instant: seconds(get("duration-instant"), d.duration.instant),
      fast: seconds(get("duration-fast"), d.duration.fast),
      base: seconds(get("duration-base"), d.duration.base),
      slow: seconds(get("duration-slow"), d.duration.slow),
    },
    ease: {
      out: bezier(get("ease-out"), d.ease.out),
      in: bezier(get("ease-in"), d.ease.in),
      inOut: bezier(get("ease-in-out"), d.ease.inOut),
    },
    bounce: reduced ? 0 : Number(get("spring-bounce") || d.bounce) || 0,
    distance: reduced ? 0 : px(get("motion-distance"), d.distance),
    reduced,
  };
}

/** Live motion tokens: updates when the theme stylesheet, data-theme or reduced-motion changes. */
export function useMotionTokens(): MotionTokens {
  const [tokens, setTokens] = useState<MotionTokens>(DEFAULT_MOTION);
  useEffect(() => {
    const update = () => setTokens(readMotionTokens());
    update();
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", update);
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class", "style"] });
    mo.observe(document.head, { childList: true });
    return () => {
      mq.removeEventListener("change", update);
      mo.disconnect();
    };
  }, []);
  return tokens;
}

/** Transitions for the three jobs motion does in a UI: entering, leaving, moving. */
export function transitionsFrom(t: MotionTokens): { enter: Transition; exit: Transition; move: Transition } {
  const enter: Transition = t.bounce > 0
    ? { type: "spring" as const, visualDuration: t.duration.base, bounce: t.bounce }
    : { duration: t.duration.base, ease: t.ease.out };
  const exit: Transition = { duration: t.duration.fast, ease: t.ease.in };
  const move: Transition = t.bounce > 0
    ? { type: "spring" as const, visualDuration: t.duration.base, bounce: t.bounce * 0.6 }
    : { duration: t.duration.base, ease: t.ease.inOut };
  return { enter, exit, move };
}

export function useTransitions() {
  const t = useMotionTokens();
  return { ...transitionsFrom(t), tokens: t };
}
