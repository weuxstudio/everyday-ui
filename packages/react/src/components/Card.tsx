import { useId, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../cx";

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Render as a semantic element. Use "section" or "article" when the card has a heading. */
  as?: "div" | "section" | "article" | "li";
  /** Visible heading. Cards with headings get a proper landmark via aria-labelledby. */
  title?: ReactNode;
  description?: ReactNode;
  /** Actions for the card, placed top-right (mapped to the content they act on). */
  actions?: ReactNode;
  /** "flat" for content in the page flow (border, no shadow). "raised" only for things that float. */
  elevation?: "flat" | "raised";
}

export function Card({ as: Tag = "section", title, description, actions, elevation = "flat", className, children, id, ...rest }: CardProps) {
  const autoId = useId();
  const headingId = title ? `${id ?? autoId}-title` : undefined;
  return (
    <Tag
      id={id}
      aria-labelledby={headingId}
      className={cx(
        "rounded-lg border border-border bg-surface p-6",
        elevation === "raised" && "shadow-md",
        className,
      )}
      {...rest}
    >
      {title || actions ? (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {title ? (
              <h2 id={headingId} className="text-lg font-semibold text-ink">
                {title}
              </h2>
            ) : null}
            {description ? <p className="mt-1 text-sm text-ink-muted">{description}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      {children}
    </Tag>
  );
}
