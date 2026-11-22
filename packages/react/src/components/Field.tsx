import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../cx";

export interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Always visible. Placeholders are examples, never labels. */
  label: ReactNode;
  /** Explains format or purpose before the user makes a mistake (constraint over correction). */
  hint?: ReactNode;
  /** What went wrong and how to fix it. Presence switches the field to its error state. */
  error?: ReactNode;
  /** Marks optional fields instead of starring required ones: most fields in a good form are required. */
  optional?: boolean;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, error, optional, id, className, disabled, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label htmlFor={inputId} className={cx("text-sm font-medium text-ink", disabled && "opacity-60")}>
        {label}
        {optional ? <span className="ml-1.5 font-regular text-ink-muted">(optional)</span> : null}
      </label>
      <input
        ref={ref}
        id={inputId}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cx(
          "h-control-md w-full rounded-md border bg-surface px-3 text-base text-ink transition-[border-color,box-shadow]",
          "placeholder:text-ink-muted/70",
          "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-focus",
          "disabled:cursor-not-allowed disabled:bg-sunken disabled:opacity-60",
          error ? "border-danger" : "border-border-strong hover:border-ink-muted",
        )}
        {...rest}
      />
      {error ? (
        <p id={errorId} className="flex items-start gap-1.5 text-sm text-danger">
          <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-0.5 size-4 shrink-0" fill="currentColor">
            <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM7.25 4.5h1.5v4.25h-1.5V4.5Zm.75 7.25a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Z" />
          </svg>
          <span>{error}</span>
        </p>
      ) : null}
      {hint ? (
        <p id={hintId} className="text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
