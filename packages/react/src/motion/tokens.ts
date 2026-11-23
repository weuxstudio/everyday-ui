import { createContext, useContext, useEffect, useState, type RefObject } from "react";
import type { Transition } from "motion/react";

import { DEFAULT_MOTION, readMotionTokens, type MotionTokens } from "@everyday-ui/tokens/motion";
export { DEFAULT_MOTION, readMotionTokens, type MotionTokens } from "@everyday-ui/tokens/motion";

/** Reads tokens from an element (or the document) and keeps them live. */
export function useReadMotionTokens(ref?: RefObject<Element | null>, deps: unknown[] = []): MotionTokens {
  const [tokens, setTokens] = useState<MotionTokens>(DEFAULT_MOTION);
  useEffect(() => {
    const update = () => setTokens(readMotionTokens(ref?.current ?? document.documentElement));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return tokens;
}

export const MotionTokensContext = createContext<MotionTokens | null>(null);

/** Tokens from the nearest MotionProvider, or from the document if there is none. */
export function useMotionTokens(): MotionTokens {
  const scoped = useContext(MotionTokensContext);
  const doc = useReadMotionTokens();
  return scoped ?? doc;
}

/** Transitions for the three jobs motion does in a UI: entering, leaving, moving. */
export function transitionsFrom(t: MotionTokens): { enter: Transition; exit: Transition; move: Transition } {
  const enter: Transition = t.bounce > 0
    ? { type: "spring", visualDuration: t.duration.base, bounce: t.bounce }
    : { duration: t.duration.base, ease: t.ease.out };
  const exit: Transition = { duration: t.duration.fast, ease: t.ease.in };
  const move: Transition = t.bounce > 0
    ? { type: "spring", visualDuration: t.duration.base, bounce: t.bounce * 0.7 }
    : { duration: t.duration.base, ease: t.ease.inOut };
  return { enter, exit, move };
}

export function useTransitions() {
  const t = useMotionTokens();
  return { ...transitionsFrom(t), tokens: t };
}
