import { useEffect, useId, useRef, type ReactNode } from "react";
import { cx } from "../cx";

export interface BottomSheetProps {
  open: boolean;
  /** Called for every way out: close button, Escape, scrim, system/browser back. */
  onClose: () => void;
  /** Short title in sentence case ("What do you want to add?"). Receives focus on open. */
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Sticky action bar at the bottom: one primary action, full width. */
  footer?: ReactNode;
  /**
   * Close on Android back / browser back by pushing a history entry while open (default true).
   * Turn off only if your router already models the sheet as a route.
   */
  closeOnBack?: boolean;
  /** Tap on the scrim closes. Turn off when closing would lose input. Default true. */
  dismissible?: boolean;
  /** Accessible name of the close button. */
  closeLabel?: string;
  className?: string;
}

/**
 * Bottom sheet for short, contextual tasks (pick, filter, quick add). Native <dialog> with
 * showModal(): focus trap, Escape, inert page and focus return come from the browser.
 * Rules: max 90 % height, grab handle AND close button, content scrolls inside, safe-area padding,
 * closes on back. Long forms and multi-step tasks belong on their own screen.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  closeOnBack = true,
  dismissible = true,
  closeLabel = "Close",
  className,
}: BottomSheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleId = useId();
  const descId = useId();
  const pushed = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Open/close the native dialog; model the open sheet as a history entry.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      titleRef.current?.focus();
      if (closeOnBack) {
        history.pushState({ ...(history.state ?? {}), euSheet: true }, "");
        pushed.current = true;
      }
    }
    if (!open && el.open) {
      el.close();
      // Closed by the app (not by back): remove our history entry so back doesn't "reopen" nothing.
      if (pushed.current) {
        pushed.current = false;
        history.back();
      }
    }
  }, [open, closeOnBack]);

  useEffect(() => {
    if (!closeOnBack) return;
    const onPop = () => {
      if (pushed.current && !history.state?.euSheet) {
        pushed.current = false;
        onCloseRef.current();
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [closeOnBack]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (dismissible && e.target === e.currentTarget) onClose();
      }}
      className={cx(
        "eu-sheet fixed inset-x-0 bottom-0 top-auto m-0 mx-auto flex-col p-0 open:flex",
        "max-h-[90dvh] w-full max-w-[40rem] overscroll-contain rounded-t-dialog border border-b-0 border-border bg-surface text-ink shadow-lg",
        className,
      )}
    >
      <div aria-hidden="true" className="mx-auto mt-2 h-[0.3125rem] w-9 shrink-0 rounded-full bg-border-strong" />
      <div className="flex shrink-0 items-start gap-4 py-2 pl-6 pr-4">
        <div className="flex flex-1 flex-col gap-1 pt-2">
          <h2 ref={titleRef} id={titleId} tabIndex={-1} className="text-xl font-heading outline-none">
            {title}
          </h2>
          {description ? (
            <p id={descId} className="text-base text-ink-muted">
              {description}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full text-ink hover:bg-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      {children ? (
        <div className={cx("overflow-y-auto overscroll-contain px-6", footer ? "pb-4" : "pb-[calc(env(safe-area-inset-bottom)+1.5rem)]")}>
          {children}
        </div>
      ) : null}
      {footer ? (
        <footer className="flex shrink-0 flex-col gap-3 border-t border-border px-6 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] [&>*]:w-full">
          {footer}
        </footer>
      ) : null}
    </dialog>
  );
}
