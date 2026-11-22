import { useEffect, useId, useRef, type ReactNode } from "react";
import { cx } from "../cx";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** A short question or statement in sentence case ("Delete Atlas Studio?"). */
  title: ReactNode;
  /** One sentence naming the consequence. */
  description?: ReactNode;
  children?: ReactNode;
  /**
   * Buttons, most important first. They are left-aligned (consistent with forms and
   * easy to find with a screen magnifier) and stack full-width on small screens.
   * Label each with its outcome ("Delete workspace", "Keep workspace"), never "OK".
   */
  footer?: ReactNode;
  className?: string;
}

/**
 * Modal dialog on the native <dialog> element: focus trap, Escape to close, inert
 * background and focus return come from the browser.
 */
export function Dialog({ open, onClose, title, description, children, footer, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={cx(
        "m-auto w-[min(32rem,calc(100vw-2rem))] rounded-dialog border border-border bg-overlay p-0 text-ink shadow-lg backdrop-blur-overlay backdrop-saturate-150",
        "backdrop:bg-scrim",
        "open:animate-[eu-dialog-in_var(--eu-duration-base)_var(--eu-ease-out)] motion-reduce:animate-none",
        className,
      )}
    >
      <div className="flex flex-col gap-2 p-6">
        <h2 id={titleId} className="text-xl font-heading">
          {title}
        </h2>
        {description ? (
          <p id={descId} className="text-base text-ink-muted">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-2">{children}</div> : null}
      </div>
      {footer ? (
        <footer className="flex flex-col gap-3 px-6 pb-6 sm:flex-row [&>*]:w-full sm:[&>*]:w-auto">{footer}</footer>
      ) : null}
    </dialog>
  );
}
