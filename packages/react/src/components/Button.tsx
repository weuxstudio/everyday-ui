import { forwardRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { cx } from "../cx";

/**
 * Three weights carry importance, not colour alone:
 * - primary:   filled. The single most important action in a view.
 * - secondary: outlined in the accent colour. Alternatives, or several equal actions.
 * - tertiary:  underlined text. Least important or repeated actions (e.g. "Remove" in a list).
 * - danger:    filled red. Only inside the confirmation step of a destructive action,
 *              never on the first trigger (that one should be tertiary or secondary).
 */
export type ButtonVariant = "primary" | "secondary" | "tertiary" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, keeps the width, ignores repeat presses (feedback + constraint). */
  loading?: boolean;
  /** Icon before the label. Icons support a label, they do not replace it. */
  icon?: ReactNode;
  /** Full width; "mobile" = full width below the sm breakpoint (one-handed reach). */
  fullWidth?: boolean | "mobile";
}

const base =
  "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-control font-semibold " +
  "transition-[background-color,border-color,color,transform] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus " +
  "active:translate-y-px " +
  // Disabled stays readable and focusable (aria-disabled), so people can still find out why.
  "aria-disabled:cursor-not-allowed aria-disabled:active:translate-y-0";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-accent-hover",
  secondary: "border border-accent bg-surface text-accent hover:bg-accent-subtle",
  tertiary: "text-accent underline decoration-from-font underline-offset-[0.2em] hover:text-accent-hover",
  danger: "bg-danger text-danger-ink hover:bg-danger-hover",
};

const disabledLook =
  "aria-disabled:border aria-disabled:border-border-strong aria-disabled:bg-sunken aria-disabled:text-ink-muted aria-disabled:no-underline";

const sizes: Record<ButtonSize, string> = {
  // sm keeps a 44 px hit area through an invisible extension.
  sm: "h-control-sm px-3 text-sm after:absolute after:inset-x-0 after:-inset-y-1 after:content-['']",
  md: "h-control-md px-4 text-base",
  lg: "h-control-lg px-6 text-base",
};
const tertiaryPadding: Record<ButtonSize, string> = { sm: "px-1.5", md: "px-2", lg: "px-3" };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", loading = false, icon, fullWidth, className, children, disabled, onClick, type = "button", ...rest },
  ref,
) {
  const inert = disabled || loading;
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (inert) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type={type}
      aria-disabled={inert || undefined}
      aria-busy={loading || undefined}
      onClick={handleClick}
      className={cx(
        base,
        variants[variant],
        sizes[size],
        variant === "tertiary" && tertiaryPadding[size],
        disabled && !loading && disabledLook,
        fullWidth === true && "w-full",
        fullWidth === "mobile" && "w-full sm:w-auto",
        className,
      )}
      {...rest}
    >
      <span className={cx("inline-flex items-center gap-2", loading && "invisible")}>
        {icon ? <span aria-hidden="true" className="-ml-0.5 inline-flex size-[1.15em] shrink-0">{icon}</span> : null}
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
