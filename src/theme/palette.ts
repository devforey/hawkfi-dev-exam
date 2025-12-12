import { colors } from "./tokens/colors";

declare module "@mui/material/styles" {
  interface Palette {
    custom: {
      backgroundOverlay: string;
      textTertiary: string;
      textMuted: string;
      priceInputValue: string;
      priceInputUnit: string;
      inputBackground: string;
      tokenInputPlaceholder: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      backgroundOverlay?: string;
      textTertiary?: string;
      textMuted?: string;
      priceInputValue?: string;
      priceInputUnit?: string;
      inputBackground?: string;
      tokenInputPlaceholder?: string;
    };
  }
}

const palette = {
  primary: {
    main: colors.green[500],
    dark: colors.green[600],
  },
  error: {
    main: colors.red[500],
  },
  warning: {
    main: colors.orange[500],
  },
  background: {
    default: colors.neutral[900],
    paper: colors.neutral[700],
  },
  text: {
    primary: colors.white.alpha80,
    secondary: colors.white.alpha50,
  },
  divider: colors.white.alpha30,
  // Custom extensions
  custom: {
    backgroundOverlay: colors.neutral[850],
    textTertiary: colors.white.alpha60,
    textMuted: colors.white.alpha70,
    priceInputValue: colors.gray[400],
    priceInputUnit: colors.gray[500],
    inputBackground: colors.neutral[700],
    tokenInputPlaceholder: colors.white.alpha50,
  },
};

export default palette;
