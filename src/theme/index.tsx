"use client";

import { ReactNode } from "react";
import { CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeOptions, ThemeProvider, createTheme } from "@mui/material/styles";

import breakpoints from "./breakpoints";
import shadows from "./shadows";
import palette from "./palette";
import typography from "./typography";
import components from "./components";

interface IHawksightThemeProvider {
  children: ReactNode;
}

export const getTheme = () => {
  const themeOptions: ThemeOptions = {
    breakpoints,
    shadows,
    palette,
    typography,
    components,
  };

  const theme = createTheme(themeOptions);

  return theme;
};

export const HawksightThemeProvider = ({
  children,
}: IHawksightThemeProvider) => {
  const hawksightTheme = getTheme();

  return (
    <AppRouterCacheProvider options={{ key: "css" }}>
      <ThemeProvider theme={hawksightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default HawksightThemeProvider;
