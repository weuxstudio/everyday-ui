import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../cx";
import { FieldError, FieldHint, RequirementMark } from "./FieldParts";

export interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Always visible, above the input. Placeholders are never labels. */
  label: ReactNode;
  /** Format or purpose, shown before the user types (between label and input). */
  hint?: ReactNode;
  /** What went wrong and how to fix it. Switches the field to its error state. */
  error?: ReactNode;
  /** Marked with an asterisk. Use with a note at the top of the form: "Required fields are marked with an asterisk *". */
  required?: boolean;
  /** Marked with "(optional)". Prefer an opt-in checkbox that reveals a required field instead. */
  optional?: boolean;
  /** Width matched to the expected input, in characters (e.g. 5 for a German postcode). Full width if omitted. */
  chars?: number;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, error, required, optional, chars, id, className, style, disabled, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <div className="flex flex-col gap-1">
        <label htmlFor={inputId} className="text-base font-semibold text-ink">
          {label}
          <RequirementMark required={required} optional={optional} />
        </label>
        {hint ? <FieldHint id={hintId}>{hint}</FieldHint> : null}
        {error ? <FieldError id={errorId}>{error}</FieldError> : null}
      </div>
      <input
        ref={ref}
        id={inputId}
        disabled={disabled}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        style={chars ? { maxWidth: `calc(${chars}ch + 2rem)`, ...style } : style}
        className={cx(
          "h-control-md w-full rounded-control bg-surface px-3 text-base text-ink transition-[border-color]",
          "placeholder:text-ink-muted",
          "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-focus",
          "disabled:cursor-not-allowed disabled:bg-sunken disabled:text-ink-muted",
          // Error: thicker border + tinted background + icon above, not colour alone.
          error ? "border-2 border-danger bg-danger-subtle" : "border border-border-strong hover:border-ink-muted",
        )}
        {...rest}
      />
    </div>
  );
});
