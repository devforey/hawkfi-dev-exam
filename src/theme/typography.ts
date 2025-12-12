import { TypographyOptions } from "@mui/material/styles/createTypography";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    sectionLabel: React.CSSProperties;
    tokenInputPlaceholder: React.CSSProperties;
    preferencesLabel: React.CSSProperties;
    preferencesValue: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    sectionLabel?: React.CSSProperties;
    tokenInputPlaceholder?: React.CSSProperties;
    preferencesLabel?: React.CSSProperties;
    preferencesValue?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    sectionLabel: true;
    tokenInputPlaceholder: true;
    preferencesLabel: true;
    preferencesValue: true;
  }
}

const typography: TypographyOptions = {
  fontFamily:
    '"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  sectionLabel: {
    fontFamily: "Manrope",
    fontWeight: 800,
    fontSize: "12px",
    lineHeight: "140%",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
  },
  tokenInputPlaceholder: {
    fontSize: "13px",
    fontWeight: 600,
  },
  preferencesLabel: {
    fontFamily: "Manrope",
    fontWeight: 800,
    fontSize: "10px",
    lineHeight: "100%",
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  },
  preferencesValue: {
    fontFamily: "Manrope",
    fontWeight: 800,
    fontSize: "12px",
    lineHeight: "140%",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
  },
};

export default typography;
