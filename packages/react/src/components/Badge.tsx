import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../cx";

export type BadgeTone = "neutral" | "success" | "warning" | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Optional icon so status is not carried by colour alone. */
  icon?: ReactNode;
}

const tones: Record<BadgeTone, string> = {
  neutral: "bg-sunken text-ink-muted",
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  danger: "bg-danger-subtle text-danger",
};

/**
 * Status label. Pill-shaped, tinted, never in the action colour: a badge must not
 * look like a button, because things that look alike are expected to work alike.
 */
export function Badge({ tone = "neutral", icon, className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cx("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-semibold", tones[tone], className)}
      {...rest}
    >
      {icon ? <span aria-hidden="true" className="inline-flex size-3.5">{icon}</span> : null}
      {children}
    </span>
  );
}
