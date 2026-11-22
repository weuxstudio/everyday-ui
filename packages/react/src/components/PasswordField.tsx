import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../cx";
import { FieldError, FieldHint, RequirementMark } from "./FieldParts";

export interface PasswordRule {
  label: ReactNode;
  test: (value: string) => boolean;
}

export interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /**
   * Requirements shown before typing and ticked off live. This is one of the few places where
   * live feedback helps: it is neutral guidance, never an error, until the form is submitted.
   */
  rules?: PasswordRule[];
  /** "new" for sign-up (lets password managers generate one), "current" for sign-in. */
  purpose?: "new" | "current";
}

/**
 * Password input with a show/hide toggle instead of a "confirm password" field: people can
 * check what they typed, and paste is never blocked.
 */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  { label, hint, error, required, rules, purpose = "new", id, className, value, defaultValue, onChange, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [visible, setVisible] = useState(false);
  const [inner, setInner] = useState(String(defaultValue ?? ""));
  const current = value !== undefined ? String(value) : inner;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const rulesId = rules?.length ? `${inputId}-rules` : undefined;

  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <div className="flex flex-col gap-1">
        <label htmlFor={inputId} className="text-base font-semibold text-ink">
          {label}
          <RequirementMark required={required} />
        </label>
        {hint ? <FieldHint id={hintId}>{hint}</FieldHint> : null}
        {rules?.length ? (
          <ul id={rulesId} className="flex flex-col gap-0.5 text-sm" aria-live="polite">
            {rules.map((r, i) => {
              const met = r.test(current);
              return (
                <li key={i} className={cx("flex items-center gap-1.5", met ? "text-success" : "text-ink-muted")}>
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {met ? <path d="M3.5 8.5 6.5 11.5 12.5 4.5" /> : <circle cx="8" cy="8" r="5" />}
                  </svg>
                  <span>
                    {r.label}
                    <span className="sr-only">{met ? " – done" : " – not yet"}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}
        {error ? <FieldError id={errorId}>{error}</FieldError> : null}
      </div>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={visible ? "text" : "password"}
          autoComplete={purpose === "new" ? "new-password" : "current-password"}
          spellCheck={false}
          autoCapitalize="none"
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={[errorId, rulesId, hintId].filter(Boolean).join(" ") || undefined}
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          onChange={(e) => {
            if (value === undefined) setInner(e.target.value);
            onChange?.(e);
          }}
          className={cx(
            "h-control-md w-full rounded-control bg-surface pl-3 pr-20 text-base text-ink",
            "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-focus",
            error ? "border-2 border-danger bg-danger-subtle" : "border border-border-strong hover:border-ink-muted",
          )}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-controls={inputId}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 my-auto mr-1 h-[calc(100%-0.5rem)] rounded-control px-3 text-sm font-semibold text-accent underline decoration-from-font underline-offset-[0.2em] hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-focus"
        >
          {visible ? "Hide" : "Show"}
          <span className="sr-only"> password</span>
        </button>
      </div>
    </div>
  );
});
