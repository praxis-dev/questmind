import { CSSProperties } from "react";

export type ViewStyle = CSSProperties;
export type ViewStyles = Record<string, ViewStyle>;

export enum Breakpoint {
  DoubleExtraLarge,
  ExtraLarge,
  Large,
  Medium,
  Small,
  ExtraSmall,
}
