import { useCallback, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useTransitions } from "./tokens";

/**
 * Put once around the app. Motion respects the OS "reduce motion" setting and uses the theme's
 * enter transition by default.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const { enter } = useTransitions();
  return (
    <MotionConfig reducedMotion="user" transition={enter}>
      {children}
    </MotionConfig>
  );
}

export interface RevealProps {
  show: boolean;
  children: ReactNode;
  /** Animate on first render too (default false: content that is there on load just is there). */
  appear?: boolean;
  className?: string;
}

/**
 * Show and hide with a short fade and a small rise. For banners, inline messages, revealed
 * fields (opt-in checkbox → field). Exit is quicker than enter.
 */
export function Reveal({ show, children, appear = false, className }: RevealProps) {
  const { enter, exit, tokens } = useTransitions();
  return (
    <AnimatePresence initial={appear}>
      {show ? (
        <motion.div
          className={className}
          initial={{ opacity: 0, y: tokens.distance }}
          animate={{ opacity: 1, y: 0, transition: enter }}
          exit={{ opacity: 0, y: -tokens.distance / 2, transition: exit }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export interface CollapseProps {
  open: boolean;
  children: ReactNode;
  id?: string;
  className?: string;
}

/**
 * Expand and collapse to the content's natural height (accordions, "Advanced settings").
 * Give the trigger aria-expanded and aria-controls={id}.
 */
export function Collapse({ open, children, id, className }: CollapseProps) {
  const { enter, exit, tokens } = useTransitions();
  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          id={id}
          className={className}
          style={{ overflow: "hidden" }}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1, transition: { ...enter, opacity: { duration: tokens.duration.base, ease: tokens.ease.out } } }}
          exit={{ height: 0, opacity: 0, transition: exit }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export interface AnimatedListProps<T> {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  as?: "ul" | "ol";
  className?: string;
  itemClassName?: string;
}

/**
 * Lists whose items are added, removed or reordered. Movement shows where things went, so
 * people don't lose their place. Neighbours slide into the gap instead of jumping.
 */
export function AnimatedList<T>({ items, getKey, renderItem, as = "ul", className, itemClassName }: AnimatedListProps<T>) {
  const { enter, exit, move, tokens } = useTransitions();
  const List = as === "ol" ? motion.ol : motion.ul;
  return (
    <List className={className} layout transition={move}>
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((item) => (
          <motion.li
            key={getKey(item)}
            layout
            className={itemClassName}
            initial={{ opacity: 0, y: tokens.distance }}
            animate={{ opacity: 1, y: 0, transition: enter }}
            exit={{ opacity: 0, scale: 0.98, transition: exit }}
            transition={move}
          >
            {renderItem(item)}
          </motion.li>
        ))}
      </AnimatePresence>
    </List>
  );
}

/**
 * Wraps a state update in a View Transition where supported (cross-fade between the before and
 * after states, shared elements via `view-transition-name`). Falls back to a plain update.
 * Uses flushSync so React renders the new state inside the transition.
 */
export function useViewTransition() {
  return useCallback((update: () => void) => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (!doc.startViewTransition || reduced) {
      update();
      return;
    }
    doc.startViewTransition(() => flushSync(update));
  }, []);
}
