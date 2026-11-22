import { useId, type ReactNode } from "react";
import { cx } from "../cx";
import { FieldError, FieldHint, RequirementMark } from "./FieldParts";

export interface RadioOption {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
}

export interface RadioGroupProps {
  /** Question or label for the whole group (rendered as <legend>). */
  legend: ReactNode;
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  optional?: boolean;
  /** id of the first radio, so an ErrorSummary link can focus the group. */
  id?: string;
  className?: string;
}

/**
 * Prefer radios over a dropdown for up to ~10 options: everything is visible and
 * one press selects. Options are stacked vertically (single column, easy to scan).
 */
export function RadioGroup({
  legend, name, options, value, defaultValue, onValueChange, hint, error, required, optional, id, className,
}: RadioGroupProps) {
  const autoId = useId();
  const baseId = id ?? autoId;
  const hintId = hint ? `${baseId}-hint` : undefined;
  const errorId = error ? `${baseId}-error` : undefined;

  return (
    <fieldset
      className={cx("flex flex-col gap-1", className)}
      aria-describedby={[errorId, hintId].filter(Boolean).join(" ") || undefined}
      aria-invalid={error ? true : undefined}
    >
      <legend className="mb-1 text-base font-semibold text-ink">
        {legend}
        <RequirementMark required={required} optional={optional} />
      </legend>
      {hint ? <FieldHint id={hintId}>{hint}</FieldHint> : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
      <div className="flex flex-col">
        {options.map((opt, i) => {
          const optId = i === 0 ? baseId : `${baseId}-${i}`;
          const optHint = opt.hint ? `${optId}-hint` : undefined;
          return (
            <label key={opt.value} htmlFor={optId} className="flex min-h-touch cursor-pointer items-start gap-3 py-2.5">
              <input
                id={optId}
                type="radio"
                name={name}
                value={opt.value}
                checked={value !== undefined ? value === opt.value : undefined}
                defaultChecked={value === undefined && defaultValue !== undefined ? defaultValue === opt.value : undefined}
                onChange={(e) => e.target.checked && onValueChange?.(opt.value)}
                aria-describedby={optHint}
                className={cx(
                  "mt-0.5 grid size-5 shrink-0 cursor-pointer appearance-none place-content-center rounded-full border-2 bg-surface",
                  "before:size-2.5 before:scale-0 before:rounded-full before:bg-accent-ink before:transition-transform before:content-['']",
                  "checked:border-accent checked:bg-accent checked:before:scale-100",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                  error ? "border-danger" : "border-border-strong",
                )}
              />
              <span className="flex flex-col gap-0.5">
                <span className="text-base text-ink">{opt.label}</span>
                {opt.hint ? (
                  <span id={optHint} className="text-sm text-ink-muted">
                    {opt.hint}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
