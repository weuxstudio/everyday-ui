import { useEffect, useRef, type ReactNode } from "react";
import { ErrorIcon } from "./FieldParts";

export interface ErrorSummaryItem {
  /** id of the input (or first radio) to focus. */
  fieldId: string;
  message: ReactNode;
}

export interface ErrorSummaryProps {
  errors: ErrorSummaryItem[];
  /** Short and calm: what to do, not who is to blame. */
  title?: ReactNode;
}

/**
 * Validate on submit, then show this at the top of the form. It takes focus so
 * keyboard and screen-reader users land on it; each item jumps to its field.
 */
export function ErrorSummary({ errors, title = "Check the highlighted fields" }: ErrorSummaryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const count = errors.length;

  useEffect(() => {
    if (count > 0) ref.current?.focus();
  }, [count]);

  if (count === 0) return null;

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      className="rounded-card border-2 border-danger bg-danger-subtle p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:p-6"
    >
      <p className="flex items-center gap-2 text-lg font-semibold text-danger">
        <ErrorIcon className="size-5 shrink-0" />
        {title}
      </p>
      <ul className="mt-2 flex flex-col gap-1 pl-7">
        {errors.map((e) => (
          <li key={e.fieldId}>
            <a
              href={`#${e.fieldId}`}
              className="text-danger"
              onClick={(ev) => {
                const el = document.getElementById(e.fieldId);
                if (!el) return;
                ev.preventDefault();
                el.focus();
                el.scrollIntoView({ block: "center", behavior: "smooth" });
              }}
            >
              {e.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
