import { useEffect, useId, useRef, type ReactNode } from "react";
import { cx } from "../cx";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** One sentence naming what happens and what it affects. */
  description?: ReactNode;
  children?: ReactNode;
  /** Buttons. Put the primary (or destructive) action last; it should name its outcome. */
  footer?: ReactNode;
  className?: string;
}

/**
 * Modal dialog built on the native <dialog> element: focus trap, Escape to close,
 * inert background and focus return come from the browser, not from custom code.
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
        // Click on the backdrop (the dialog element itself, outside the panel) closes it.
        if (e.target === e.currentTarget) onClose();
      }}
      className={cx(
        "m-auto w-[min(32rem,calc(100vw-2rem))] rounded-xl border border-border bg-surface p-0 text-ink shadow-lg",
        "backdrop:bg-scrim",
        "open:animate-[eu-dialog-in_var(--eu-duration-base)_var(--eu-ease-out)] motion-reduce:animate-none",
        className,
      )}
    >
      <div className="p-6">
        <h2 id={titleId} className="text-xl font-semibold">
          {title}
        </h2>
        {description ? (
          <p id={descId} className="mt-2 text-base text-ink-muted">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-4">{children}</div> : null}
      </div>
      {footer ? (
        <footer className="flex flex-col-reverse gap-2 border-t border-border bg-sunken px-6 py-4 sm:flex-row sm:justify-end">
          {footer}
        </footer>
      ) : null}
    </dialog>
  );
}
