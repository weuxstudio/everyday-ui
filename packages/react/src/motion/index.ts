// Optional motion layer: import from "@everyday-ui/react/motion".
// The core components animate with CSS only; this entry adds Motion (motion.dev, MIT) for the
// cases CSS can't handle well: exit animations, layout changes, height: auto, springs.
export { MotionProvider, Reveal, Collapse, AnimatedList, useViewTransition } from "./components";
export type { MotionProviderProps, RevealProps, CollapseProps, AnimatedListProps } from "./components";
export { useMotionTokens, useReadMotionTokens, useTransitions, readMotionTokens, transitionsFrom, DEFAULT_MOTION, MotionTokensContext, type MotionTokens } from "./tokens";
