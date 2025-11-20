// Main theme export

import { colors, ColorScheme, ThemeMode } from "./colors";
import {
  borderRadius,
  BorderRadius,
  shadows,
  Shadows,
  spacing,
  Spacing,
} from "./spacing";
import { typography, Typography } from "./typography";

export interface Theme {
  colors: typeof colors.light | typeof colors.dark;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadows;
  mode: ThemeMode;
  isDark: boolean;
}

export const createTheme = (mode: ThemeMode): Theme => ({
  colors: colors[mode],
  typography,
  spacing,
  borderRadius,
  shadows,
  mode,
  isDark: mode === "dark",
});

export const lightTheme = createTheme("light");
export const darkTheme = createTheme("dark");

export type { ColorScheme, ThemeMode };
