import type { ReactNode } from "react";
import { cx } from "../cx";

/** Marks required fields with a neutral asterisk and optional ones with the word "optional". */
export function RequirementMark({ required, optional }: { required?: boolean; optional?: boolean }) {
  if (required)
    return (
      <span aria-hidden="true" className="ml-0.5 text-ink-muted">
        *
      </span>
    );
  if (optional) return <span className="ml-1.5 font-regular text-ink-muted">(optional)</span>;
  return null;
}

/** Hint text: sits between label and input, so it is read before typing and never hidden by autofill. */
export function FieldHint({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="text-sm text-ink-muted">
      {children}
    </p>
  );
}

/** Error text: icon + colour + text (never colour alone), placed above the input. */
export function FieldError({ id, children, className }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <p id={id} className={cx("flex items-start gap-1.5 text-sm font-semibold text-danger", className)}>
      <ErrorIcon className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={className} fill="currentColor">
      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM7.25 4.5h1.5v4.25h-1.5V4.5Zm.75 7.25a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Z" />
    </svg>
  );
}
