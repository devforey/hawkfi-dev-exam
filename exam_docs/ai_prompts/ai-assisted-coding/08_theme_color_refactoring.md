# Theme Color Refactoring

## Overview

Consolidating scattered hardcoded input styles and colors into a centralized MUI theme configuration. This includes creating a color tokens layer, extracting theme components into separate files, and refactoring all components to use theme palette references.

---

## User Prompts

> **Prompt 1:** The border colors or input styles are all scattered and hardcoded across the app. Check if there's a global MUI option to set the global styling of the input component and put those there.

> **Prompt 2:** Update Input/Select based on Figma below. Retain focus/error state styling etc. *[Figma reference showing borderless input design]*

> **Prompt 3:** Is there MUI best practice to store the color tokens and apply those tokens instead of hardcoding it in the theme?

> **Prompt 4:** Follow the file structure inside @src/theme/, extract palette, each components, etc. into its own file.

> **Prompt 5:** Maybe create a sub folder for components and have separate component files inside rather than having only one file for all components

> **Prompt 6:** Update colors (bg, font) etc. based on Figma *[Figma reference showing gray/white focus border]*

> **Prompt 7:** There are hardcoded colors in the components/pages. What is the best practice for this? Can them get from the theme palette instead?

> **Prompt 8:** Lets go with third approach and scan and refactor all hardcoded colors

---

## Key Decisions

### Color Token Storage Approach

**Question:** What is the MUI best practice for storing color tokens?

**Options:**
1. Palette tokens + callback pattern with `alpha()` utility
2. Inline hardcoded values (current state)
3. CSS custom properties (CSS variables)

**User Choice:** Palette tokens + callback pattern

### Theme File Structure

**Question:** How should theme configuration be organized?

**Options:**
- Single `components.ts` file for all component overrides
- Separate `components/` subfolder with individual files per component type

**User Choice:** Separate `components/` subfolder with individual files

### Component Color Refactoring Approach

**Question:** How should hardcoded colors in components be refactored?

**Options:**
1. Keep hardcoded values (no change)
2. Use `useTheme()` hook with callback pattern everywhere
3. Use sx prop string shorthand (`"primary.main"`) with `alpha()` for opacity variants

**User Choice:** String shorthand with `alpha()` for opacity variants

### Input/Select Border Styling

**Question:** What should the default border style be?

**Implementation based on Figma:**
- Default state: `borderColor: "transparent"` (no visible border)
- Hover state: `borderColor: alpha(divider, 0.5)`
- Focus state: `borderColor: divider` (gray/white, not green)
- Error state: `borderColor: error.main`

---

## Generated Files

### Theme Structure
```
src/theme/
├── index.tsx                    # Main ThemeProvider
├── breakpoints.ts               # (existing)
├── shadows.ts                   # (existing)
├── palette.ts                   # NEW - Semantic palette definitions
├── tokens/
│   └── colors.ts                # NEW - Raw color token values
└── components/
    ├── index.ts                 # NEW - Barrel export
    ├── button.ts                # NEW - MuiButton overrides
    ├── input.ts                 # NEW - MuiOutlinedInput overrides
    ├── select.ts                # NEW - MuiSelect overrides
    └── menu.ts                  # NEW - MuiMenu/MenuItem overrides
```

### File Paths (Created)
- `src/theme/tokens/colors.ts`
- `src/theme/palette.ts`
- `src/theme/components/index.ts`
- `src/theme/components/button.ts`
- `src/theme/components/input.ts`
- `src/theme/components/select.ts`
- `src/theme/components/menu.ts`

### File Paths (Modified)
- `src/theme/index.tsx`
- `src/app/page.tsx`
- `src/app/pool-sniper/page.tsx`
- `src/components/common/base-token-input.tsx`
- `src/components/common/price-input.tsx`
- `src/components/pool-sniper/pool-form.tsx`
- `src/components/pool-sniper/position-form.tsx`
- `src/components/pool-sniper/position-list.tsx`
- `src/components/solana/wallet-button.tsx`

---

## Implementation Details

### Color Tokens Layer

Raw color values stored in `tokens/colors.ts`:

```typescript
export const colors = {
  green: {
    500: "#46EB80",
    600: "#3dd16f",
  },
  red: {
    500: "#ff6363",
  },
  orange: {
    500: "#ffb74d",
  },
  neutral: {
    900: "#070D0A",
    850: "#070D0AE5",
    800: "#0a1510",
    700: "#1A1E1C",
  },
  white: {
    alpha90: "rgba(255, 255, 255, 0.9)",
    alpha80: "rgba(255, 255, 255, 0.8)",
    alpha70: "rgba(255, 255, 255, 0.7)",
    alpha60: "rgba(255, 255, 255, 0.6)",
    alpha50: "rgba(255, 255, 255, 0.5)",
    alpha30: "rgba(255, 255, 255, 0.3)",
    alpha15: "rgba(255, 255, 255, 0.15)",
  },
};
```

### Semantic Palette

Palette referencing color tokens in `palette.ts`:

```typescript
import { colors } from "./tokens/colors";

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
  custom: {
    backgroundOverlay: colors.neutral[850],
    textTertiary: colors.white.alpha60,
    textMuted: colors.white.alpha70,
  },
};
```

### Component Override Pattern

Using callback pattern with theme access in `components/input.ts`:

```typescript
import { Components, Theme, alpha } from "@mui/material/styles";

const input: Components<Omit<Theme, "components">> = {
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "transparent",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: alpha(theme.palette.divider, 0.5),
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.divider,
        },
        "&.Mui-error .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.error.main,
        },
      }),
      input: ({ theme }) => ({
        color: theme.palette.text.primary,
        "&::placeholder": {
          color: theme.palette.text.secondary,
          opacity: 1,
        },
      }),
    },
  },
};
```

### Component Refactoring Pattern

Replacing hardcoded colors with palette references:

```typescript
// Before
<Typography sx={{ color: "#46EB80" }}>Text</Typography>
<Box sx={{ backgroundColor: "rgba(70, 235, 128, 0.2)" }}>Box</Box>

// After
<Typography sx={{ color: "primary.main" }}>Text</Typography>
<Box sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.2) }}>Box</Box>
```

### Color Mapping Reference

| Hardcoded Value | Palette Path |
|-----------------|--------------|
| `#46EB80` | `primary.main` |
| `#3dd16f` | `primary.dark` |
| `#ff6363` | `error.main` |
| `#ffb74d` | `warning.main` |
| `#070D0A` | `background.default` |
| `#070D0AE5` | `custom.backgroundOverlay` |
| `#1A1E1C` | `background.paper` |
| `rgba(255, 255, 255, 0.8)` | `text.primary` |
| `rgba(255, 255, 255, 0.6)` | `custom.textTertiary` |
| `rgba(255, 255, 255, 0.7)` | `custom.textMuted` |
| `rgba(255, 255, 255, 0.5)` | `text.secondary` |
| `rgba(255, 255, 255, 0.3)` | `divider` |

---

## Reference Documents

- Figma design references (provided in session)
- MUI Theme documentation: https://mui.com/material-ui/customization/theming/
