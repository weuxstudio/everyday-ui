import type { ReactNode } from "react";
import { cx } from "../cx";

export interface EmptyStateProps {
  /** Simple line icon or small illustration that hints at the content type. Decorative. */
  icon?: ReactNode;
  /** What will appear here ("No invoices yet") or what happened ("No results for “berlin”"). */
  title: ReactNode;
  /** Why it's empty and what the user gains by acting. One or two sentences. */
  description?: ReactNode;
  /** The action that fills it: usually one primary Button. */
  action?: ReactNode;
  /** Optional secondary path: a link to docs, an import, "Clear filters". */
  secondary?: ReactNode;
  className?: string;
}

/**
 * An empty area is a moment to teach, not a dead end. Centered because it is a short,
 * isolated block with nothing else to align with.
 */
export function EmptyState({ icon, title, description, action, secondary, className }: EmptyStateProps) {
  return (
    <div className={cx("mx-auto flex max-w-md flex-col items-center gap-2 px-4 py-12 text-center", className)}>
      {icon ? (
        <div aria-hidden="true" className="mb-2 grid size-12 place-items-center rounded-card bg-accent-subtle text-accent [&>svg]:size-6">
          {icon}
        </div>
      ) : null}
      <h3 className="text-lg font-heading text-ink">{title}</h3>
      {description ? <p className="text-base text-ink-muted">{description}</p> : null}
      {action || secondary ? (
        <div className="mt-4 flex flex-col items-center gap-3">
          {action}
          {secondary}
        </div>
      ) : null}
    </div>
  );
}
