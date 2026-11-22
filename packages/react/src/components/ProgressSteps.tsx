import type { ReactNode } from "react";
import { cx } from "../cx";

export interface ProgressStepsProps {
  steps: ReactNode[];
  /** Zero-based index of the current step. */
  current: number;
  /** Completed steps become buttons so people can go back and change answers. */
  onStepClick?: (index: number) => void;
  className?: string;
}

/**
 * Where am I, how much is left. Phones get a compact "Step 2 of 4" line and a bar; wider
 * screens get the named steps. Completed steps are reachable; future steps are not.
 */
export function ProgressSteps({ steps, current, onStepClick, className }: ProgressStepsProps) {
  const total = steps.length;
  return (
    <nav aria-label="Progress" className={cx("flex flex-col gap-2", className)}>
      <p className="text-sm text-ink-muted sm:hidden">
        Step {current + 1} of {total}: <span className="font-semibold text-ink">{steps[current]}</span>
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-sunken sm:hidden" aria-hidden="true">
        <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${((current + 1) / total) * 100}%` }} />
      </div>
      <ol className="hidden items-center gap-2 sm:flex">
        {steps.map((step, i) => {
          const done = i < current;
          const isCurrent = i === current;
          const marker = (
            <span
              className={cx(
                "grid size-7 shrink-0 place-items-center rounded-full border-2 text-sm font-semibold tabular-nums",
                done && "border-accent bg-accent text-accent-ink",
                isCurrent && "border-accent text-accent",
                !done && !isCurrent && "border-border-strong text-ink-muted",
              )}
              aria-hidden="true"
            >
              {done ? "✓" : i + 1}
            </span>
          );
          const text = (
            <span className={cx("text-sm", isCurrent ? "font-semibold text-ink" : done ? "text-ink" : "text-ink-muted")}>
              {step}
              <span className="sr-only">{done ? " (completed)" : isCurrent ? " (current step)" : ""}</span>
            </span>
          );
          return (
            <li key={i} className="flex items-center gap-2" aria-current={isCurrent ? "step" : undefined}>
              {done && onStepClick ? (
                <button
                  type="button"
                  onClick={() => onStepClick(i)}
                  className="flex items-center gap-2 rounded-control underline-offset-[0.2em] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  {marker}
                  {text}
                </button>
              ) : (
                <span className="flex items-center gap-2">
                  {marker}
                  {text}
                </span>
              )}
              {i < total - 1 ? <span aria-hidden="true" className={cx("mx-1 h-px w-8 lg:w-12", done ? "bg-accent" : "bg-border-strong")} /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
