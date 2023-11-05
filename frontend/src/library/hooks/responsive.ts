import { Grid } from "antd";
import type { Breakpoint as AntdBreakpoint } from "antd";
import { useMemo } from "react";

import { ViewStyle, ViewStyles, Breakpoint } from "../styles";

const { useBreakpoint } = Grid;

type AntdBreakpoints = Partial<Record<AntdBreakpoint, boolean>>;
export type ResponsiveStyles = Partial<Record<Breakpoint, ViewStyles>>;

const isDoubleExtraLargeScreen = (currentBreakpoints: AntdBreakpoints) =>
  currentBreakpoints.xxl;
const isExtraLargeScreen = (currentBreakpoints: AntdBreakpoints) =>
  currentBreakpoints.xl;

const isLargeScreen = (currentBreakpoints: AntdBreakpoints) =>
  currentBreakpoints.lg && !currentBreakpoints.xl;

const isMediumScreen = (currentBreakpoints: AntdBreakpoints) =>
  currentBreakpoints.md && !currentBreakpoints.lg;

const isSmallScreen = (currentBreakpoints: AntdBreakpoints) =>
  currentBreakpoints.sm && !currentBreakpoints.md;

const isExtraSmallScreen = (currentBreakpoints: AntdBreakpoints) =>
  currentBreakpoints.xs && !currentBreakpoints.sm;

const combineResponsiveStyles = (
  baseStyles: ViewStyles,
  responsiveStyles: ResponsiveStyles,
  currentBreakpoints: AntdBreakpoints
): ViewStyles => {
  if (isDoubleExtraLargeScreen(currentBreakpoints)) {
    return baseStyles;
  }
  const resultStyles: ViewStyles = {};
  for (const className in baseStyles) {
    let doubleExtraLargeScreenStyle: ViewStyle = {};
    let extraLargeScreenStyle: ViewStyle = {};
    let largeScreenStyle: ViewStyle = {};
    let mediumScreenStyle: ViewStyle = {};
    let smallScreenStyle: ViewStyle = {};
    let extraSmallScreenStyle: ViewStyle = {};

    if (
      isDoubleExtraLargeScreen(currentBreakpoints) &&
      responsiveStyles[Breakpoint.DoubleExtraLarge]
    ) {
      doubleExtraLargeScreenStyle =
        responsiveStyles[Breakpoint.DoubleExtraLarge]?.[className] ?? {};
    }
    if (
      isExtraLargeScreen(currentBreakpoints) &&
      responsiveStyles[Breakpoint.ExtraLarge]
    ) {
      extraLargeScreenStyle =
        responsiveStyles[Breakpoint.ExtraLarge]?.[className] ?? {};
    }
    if (
      isLargeScreen(currentBreakpoints) &&
      responsiveStyles[Breakpoint.Large]
    ) {
      largeScreenStyle = responsiveStyles[Breakpoint.Large]?.[className] ?? {};
    }
    if (
      isMediumScreen(currentBreakpoints) &&
      responsiveStyles[Breakpoint.Medium]
    ) {
      mediumScreenStyle =
        responsiveStyles[Breakpoint.Medium]?.[className] ?? {};
    }
    if (
      isSmallScreen(currentBreakpoints) &&
      responsiveStyles[Breakpoint.Small]
    ) {
      smallScreenStyle = responsiveStyles[Breakpoint.Small]?.[className] ?? {};
    }
    if (
      isExtraSmallScreen(currentBreakpoints) &&
      responsiveStyles[Breakpoint.ExtraSmall]
    ) {
      extraSmallScreenStyle =
        responsiveStyles[Breakpoint.ExtraSmall]?.[className] ?? {};
    }

    resultStyles[className] = {
      ...baseStyles[className],
      ...doubleExtraLargeScreenStyle,
      ...extraLargeScreenStyle,
      ...largeScreenStyle,
      ...mediumScreenStyle,
      ...smallScreenStyle,
      ...extraSmallScreenStyle,
    };
  }
  return resultStyles;
};

export const useResponsiveStyles = (
  baseStyles: ViewStyles,
  responsiveStyles: ResponsiveStyles
): ViewStyles => {
  const currentBreakpoints = useBreakpoint();
  const resultStyles = useMemo<ViewStyles>(
    () =>
      combineResponsiveStyles(baseStyles, responsiveStyles, currentBreakpoints),
    [currentBreakpoints, baseStyles, responsiveStyles]
  );
  return resultStyles;
};
