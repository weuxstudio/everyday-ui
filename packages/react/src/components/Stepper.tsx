import { useId, useState, type ReactNode } from "react";
import { cx } from "../cx";
import { FieldHint } from "./FieldParts";

export interface StepperProps {
  label: ReactNode;
  hint?: ReactNode;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

/**
 * For small numeric changes (quantities, guests): one press per step instead of a
 * dropdown's open-scroll-pick. Buttons sit side by side, 48 px, with − and +
 * (not chevrons, which read as dropdown or accordion). Not for large ranges.
 */
export function Stepper({ label, hint, value, defaultValue = 0, onValueChange, min = 0, max = 99, step = 1, className }: StepperProps) {
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;

  const set = (n: number) => {
    const next = Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };

  const btn =
    "grid size-touch shrink-0 place-items-center rounded-md border border-accent bg-surface text-accent text-xl font-semibold " +
    "hover:bg-accent-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus " +
    "aria-disabled:cursor-not-allowed aria-disabled:border-border-strong aria-disabled:bg-sunken aria-disabled:text-ink-muted";

  return (
    <div role="group" aria-labelledby={`${id}-label`} className={cx("flex items-center justify-between gap-4", className)}>
      <div className="flex flex-col gap-0.5">
        <label id={`${id}-label`} htmlFor={id} className="text-base font-semibold text-ink">
          {label}
        </label>
        {hint ? <FieldHint id={hintId}>{hint}</FieldHint> : null}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={btn}
          aria-label="Decrease"
          aria-controls={id}
          aria-disabled={current <= min || undefined}
          onClick={() => current > min && set(current - step)}
        >
          <span aria-hidden="true">−</span>
        </button>
        <input
          id={id}
          inputMode="numeric"
          aria-describedby={hintId}
          value={current}
          onChange={(e) => set(parseInt(e.target.value.replace(/\D/g, ""), 10))}
          className="h-touch w-14 rounded-md border border-border-strong bg-surface text-center text-base tabular-nums text-ink focus-visible:outline-2 focus-visible:outline-focus"
        />
        <button
          type="button"
          className={btn}
          aria-label="Increase"
          aria-controls={id}
          aria-disabled={current >= max || undefined}
          onClick={() => current < max && set(current + step)}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
    </div>
  );
}
