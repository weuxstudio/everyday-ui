import type { Snippet } from "svelte";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface SegmentOption {
  value: string;
  label: string | Snippet;
}

export interface ErrorSummaryItem {
  /** id of the input (or first radio) to focus. */
  fieldId: string;
  message: string;
}
