import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../cx";
import { FieldError } from "./FieldParts";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /**
   * Positive phrasing: describe what happens when checked ("Send me product updates",
   * not "Don't send me updates"). Test: read it as "Yes, <label>".
   * Use a checkbox when the choice takes effect on submit; use Switch for immediate effect.
   */
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, hint, error, id, className, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={cx("flex flex-col gap-1", className)}>
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
      <label htmlFor={inputId} className="flex min-h-touch cursor-pointer items-start gap-3 py-2.5">
        <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={[errorId, hintId].filter(Boolean).join(" ") || undefined}
            className={cx(
              "peer size-5 cursor-pointer appearance-none rounded-check border-2 bg-surface transition-colors",
              "checked:border-accent checked:bg-accent",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
              "disabled:cursor-not-allowed disabled:bg-sunken",
              error ? "border-danger" : "border-border-strong",
            )}
            {...rest}
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="pointer-events-none absolute size-3.5 text-accent-ink opacity-0 peer-checked:opacity-100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
          </svg>
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="text-base text-ink">{label}</span>
          {hint ? (
            <span id={hintId} className="text-sm text-ink-muted">
              {hint}
            </span>
          ) : null}
        </span>
      </label>
    </div>
  );
});
