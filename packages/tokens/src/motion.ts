export type Bezier = [number, number, number, number];

/**
 * Motion values read from the theme's CSS variables, so JS animations (Motion) follow the same
 * knob as CSS transitions (minimal / smooth / playful) and stop under reduced motion.
 */
export interface MotionTokens {
  /** seconds */
  duration: { instant: number; fast: number; base: number; slow: number };
  ease: { out: Bezier; in: Bezier; inOut: Bezier };
  /** 0 = no overshoot. Only playful themes bounce. */
  bounce: number;
  /** px an element travels when it enters or leaves (0 = fade only) */
  distance: number;
  /** scale an entering element starts from (1 = none) */
  scale: number;
  /** scale of a pressed control */
  press: number;
  reduced: boolean;
}

export const DEFAULT_MOTION: MotionTokens = {
  duration: { instant: 0.08, fast: 0.14, base: 0.24, slow: 0.36 },
  ease: { out: [0.2, 0, 0, 1], in: [0.4, 0, 1, 1], inOut: [0.4, 0, 0.2, 1] },
  bounce: 0,
  distance: 10,
  scale: 1,
  press: 0.98,
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
  const m = v.trim().match(/^(-?[\d.]+)(px|rem)$/);
  if (!m) return fallback;
  return m[2] === "rem" ? +m[1]! * parseFloat(getComputedStyle(document.documentElement).fontSize || "16") : +m[1]!;
};
const num = (v: string, fallback: number) => (v.trim() === "" || !Number.isFinite(+v) ? fallback : +v);

/** Read the motion tokens that apply to an element (inherited CSS variables). */
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
    bounce: reduced ? 0 : num(get("spring-bounce"), d.bounce),
    distance: reduced ? 0 : px(get("motion-distance"), d.distance),
    scale: reduced ? 1 : num(get("motion-scale"), d.scale),
    press: reduced ? 1 : num(get("press-scale"), d.press),
    reduced,
  };
}
