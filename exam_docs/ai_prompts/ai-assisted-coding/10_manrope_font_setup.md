# Manrope Font Setup

## Overview

Adding the "Manrope" font as the global font for the application using `@fontsource/manrope` and MUI's typography configuration following best practices.

---

## User Prompts

> **Prompt 1:** Check how to include font "Manrope" and apply it all. Check MUI best standards to apply global font.

---

## Questions & Answers

| Question | Answer |
|----------|--------|
| Should we remove the existing Geist fonts, or keep them alongside Manrope (e.g., for monospace code display)? | Replace completely |
| Use Next.js font optimization (`next/font/google`) or Fontsource? | Use `@fontsource/manrope` |

---

## Key Decisions

1. **Font Source:** Used `@fontsource/manrope` (already installed in project) instead of `next/font/google`
2. **Font Weights:** Imported weights 400, 500, 600, 700 for flexibility
3. **Complete Replacement:** Removed Geist Sans and Geist Mono fonts entirely
4. **MUI Integration:** Created dedicated `typography.ts` file following the existing theme structure

---

## Files Updated

### 1. `src/app/layout.tsx`

**Changes:**
- Removed `Geist` and `Geist_Mono` imports from `next/font/google`
- Added `@fontsource/manrope` CSS imports for weights 400, 500, 600, 700
- Removed font CSS variable classes from `<body>` tag

**Before:**
```tsx
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ...
<body className={`${geistSans.variable} ${geistMono.variable}`}>
```

**After:**
```tsx
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";

// ...
<body>
```

---

### 2. `src/theme/typography.ts` (New File)

**Created new typography configuration file:**
```tsx
import { TypographyOptions } from "@mui/material/styles/createTypography";

const typography: TypographyOptions = {
  fontFamily:
    '"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

export default typography;
```

---

### 3. `src/theme/index.tsx`

**Changes:**
- Added import for `typography` from `./typography`
- Added `typography` to `themeOptions` object

**Before:**
```tsx
const themeOptions: ThemeOptions = {
  breakpoints,
  shadows,
  palette,
  components,
};
```

**After:**
```tsx
import typography from "./typography";

const themeOptions: ThemeOptions = {
  breakpoints,
  shadows,
  palette,
  typography,
  components,
};
```

---

## Summary

Replaced the default Geist fonts with Manrope as the global application font. The implementation follows MUI best practices by:

1. Using `@fontsource/manrope` for self-hosted font files (bundled with the app, no external CDN)
2. Creating a dedicated `typography.ts` file following the existing theme module structure
3. Setting the font family in MUI's typography configuration, which applies to all MUI components via `CssBaseline`
4. Including system font fallbacks for graceful degradation

The font is now applied globally to all text rendered through MUI components.
