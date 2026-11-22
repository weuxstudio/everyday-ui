import { useId, useState, type ReactNode } from "react";
import { cx } from "../cx";

export interface SegmentOption {
  value: string;
  label: ReactNode;
}

export interface SegmentedControlProps {
  /** Visible or screen-reader label for the group, e.g. "Billing period". */
  label: ReactNode;
  hideLabel?: boolean;
  options: SegmentOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  className?: string;
}

/**
 * Two to four mutually exclusive views or modes that switch immediately (billing period, chart
 * range, list/grid). Built on native radio buttons: arrow keys, form submit and screen
 * readers work without custom code. For choices that need explanation, use RadioGroup.
 */
export function SegmentedControl({ label, hideLabel, options, value, defaultValue, onValueChange, name, className }: SegmentedControlProps) {
  const autoName = useId();
  const labelId = useId();
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value);
  const current = value ?? inner;

  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <span id={labelId} className={cx("text-base font-semibold text-ink", hideLabel && "sr-only")}>
        {label}
      </span>
      <div role="radiogroup" aria-labelledby={labelId} className="inline-flex w-fit rounded-control border border-border-strong bg-sunken p-1">
        {options.map((o) => {
          const checked = current === o.value;
          return (
            <label
              key={o.value}
              className={cx(
                "relative flex h-[calc(var(--eu-size-control-md)-0.625rem)] cursor-pointer select-none items-center rounded-control px-4 text-sm font-semibold transition-colors",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-focus",
                checked ? "bg-surface text-ink shadow-sm" : "text-ink-muted hover:text-ink",
              )}
            >
              <input
                type="radio"
                name={name ?? autoName}
                value={o.value}
                checked={checked}
                onChange={() => {
                  if (value === undefined) setInner(o.value);
                  onValueChange?.(o.value);
                }}
                className="sr-only"
              />
              {o.label}
            </label>
          );
        })}
      </div>
    </div>
  );
}
