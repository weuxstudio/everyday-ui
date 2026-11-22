import { useId, useState, type ReactNode } from "react";
import { cx } from "../cx";

export interface SwitchProps {
  /** Describes what is true when the switch is on ("Bill annually (save 10%)"). */
  label: ReactNode;
  hint?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  /** Switches take effect immediately. If the change needs a Save/Submit, use a Checkbox instead. */
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export function Switch({ label, hint, checked, defaultChecked = false, onCheckedChange, className }: SwitchProps) {
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;
  const labelId = useId();
  const hintId = useId();

  const toggle = () => {
    const next = !on;
    if (checked === undefined) setInner(next);
    onCheckedChange?.(next);
  };

  return (
    <div className={cx("flex min-h-touch items-center justify-between gap-4", className)}>
      <span className="flex flex-col gap-0.5">
        <span id={labelId} className="text-base text-ink">
          {label}
        </span>
        {hint ? (
          <span id={hintId} className="text-sm text-ink-muted">
            {hint}
          </span>
        ) : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby={labelId}
        aria-describedby={hint ? hintId : undefined}
        onClick={toggle}
        className={cx(
          // 48 × 28 visual, extended to a 48 px tall hit area
          "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors",
          "after:absolute after:-inset-y-2.5 after:inset-x-0 after:content-['']",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
          on ? "border-accent bg-accent" : "border-border-strong bg-sunken",
        )}
      >
        <span
          aria-hidden="true"
          className={cx(
            "size-5 rounded-full shadow-sm transition-transform",
            on ? "translate-x-[1.375rem] bg-accent-ink" : "translate-x-0.5 bg-border-strong",
          )}
        />
      </button>
    </div>
  );
}
