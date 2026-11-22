import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "../cx";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary: the one main action per view. secondary: alternatives. ghost: low-emphasis, toolbars. danger: destructive. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, keeps the button's width and blocks repeat clicks (feedback + constraint). */
  loading?: boolean;
  /** Optional icon before the label. Icons support labels, they do not replace them. */
  icon?: ReactNode;
}

const base =
  "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium " +
  "transition-[background-color,border-color,color,box-shadow,transform] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus " +
  "active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-ink shadow-sm hover:bg-accent-hover",
  secondary: "border border-border-strong bg-surface text-ink hover:bg-sunken",
  ghost: "text-ink hover:bg-sunken",
  danger: "bg-danger text-danger-ink shadow-sm hover:bg-danger-hover",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-control-sm px-3 text-sm",
  md: "h-control-md px-4 text-sm",
  lg: "h-control-lg px-5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", loading = false, icon, className, children, disabled, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {/* Content stays in the layout while loading, so the button does not change width. */}
      <span className={cx("inline-flex items-center gap-2", loading && "invisible")}>
        {icon ? <span aria-hidden="true" className="-ml-0.5 inline-flex size-4 shrink-0">{icon}</span> : null}
        {children}
      </span>
      {loading ? (
        <span className="absolute inset-0 grid place-items-center" aria-hidden="true">
          <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none" />
        </span>
      ) : null}
    </button>
  );
});
