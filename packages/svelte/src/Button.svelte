<!--
  Three weights carry importance, not colour alone:
  primary = filled, the single most important action in a view; secondary = outlined;
  tertiary = underlined text; danger = only inside the confirmation step of a destructive action.
  Disabled stays focusable (aria-disabled) so people can find out why.
-->
<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import type { ButtonSize, ButtonVariant } from "./types";

  type Props = Omit<HTMLButtonAttributes, "children"> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    /** Spinner, keeps the width, ignores repeat presses. */
    loading?: boolean;
    /** Icon before the label. Icons support a label, they don't replace it. */
    icon?: Snippet;
    /** Full width; "mobile" = full width below the sm breakpoint. */
    fullWidth?: boolean | "mobile";
    children?: Snippet;
  };

  let {
    variant = "secondary",
    size = "md",
    loading = false,
    icon,
    fullWidth,
    class: className,
    children,
    disabled,
    onclick,
    type = "button",
    ...rest
  }: Props = $props();

  const inert = $derived(Boolean(disabled) || loading);

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-accent text-accent-ink hover:bg-accent-hover",
    secondary: "border border-accent bg-surface text-accent hover:bg-accent-subtle",
    tertiary: "text-accent underline decoration-from-font underline-offset-[0.2em] hover:text-accent-hover",
    danger: "bg-danger text-danger-ink hover:bg-danger-hover",
  };
  const sizes: Record<ButtonSize, string> = {
    // sm keeps a 44 px hit area through an invisible extension.
    sm: "h-control-sm px-3 text-sm after:absolute after:inset-x-0 after:-inset-y-1 after:content-['']",
    md: "h-control-md px-4 text-base",
    lg: "h-control-lg px-6 text-base",
  };
  const tertiaryPadding: Record<ButtonSize, string> = { sm: "px-1.5", md: "px-2", lg: "px-3" };

  function handleClick(e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
    if (inert) {
      e.preventDefault();
      return;
    }
    onclick?.(e);
  }
</script>

<button
  {type}
  aria-disabled={inert || undefined}
  aria-busy={loading || undefined}
  onclick={handleClick}
  class={[
    "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-control font-semibold",
    "transition-[background-color,border-color,color,scale]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
    "active:scale-(--eu-press-scale) active:duration-(--eu-duration-instant)",
    "aria-disabled:cursor-not-allowed aria-disabled:active:scale-100",
    variants[variant],
    sizes[size],
    variant === "tertiary" && tertiaryPadding[size],
    disabled && !loading && "aria-disabled:border aria-disabled:border-border-strong aria-disabled:bg-sunken aria-disabled:text-ink-muted aria-disabled:no-underline",
    fullWidth === true && "w-full",
    fullWidth === "mobile" && "w-full sm:w-auto",
    className,
  ]}
  {...rest}
>
  <span class={["inline-flex items-center gap-2", loading && "invisible"]}>
    {#if icon}<span aria-hidden="true" class="-ml-0.5 inline-flex size-[1.15em] shrink-0">{@render icon()}</span>{/if}
    <span>{@render children?.()}</span>
  </span>
  {#if loading}
    <span class="absolute inset-0 grid place-items-center" aria-hidden="true">
      <span class="size-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"></span>
    </span>
  {/if}
</button>
