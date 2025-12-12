# 20. Sniper Pool Preferences Component

## Session Overview

This session creates a new view-only `SniperPoolPreferences` component that displays Priority Fee and Deposit Slippage settings with decorative edit icons, matching the Figma design.

---

## Prompt 1: Create SniperPoolPreferences Component

### User Request

```
Create new view only component, SniperPoolPreferences.
Use the component in @src/components/pool-sniper/pool-sniper-form.tsx

Figma:
[Image provided showing two preference items side-by-side]

label (priority fee)

font-family: Manrope;
font-weight: 800;
font-style: ExtraBold;
font-size: 10px;
leading-trim: CAP_HEIGHT;
line-height: 100%;
letter-spacing: 4%;
text-align: center;
text-transform: uppercase;
color: #8B948F

value (FAST)
font-family: Manrope;
font-weight: 800;
font-style: ExtraBold;
font-size: 12px;
leading-trim: CAP_HEIGHT;
line-height: 140%;
letter-spacing: 6%;
text-transform: uppercase;
color: #C4CAC8

border: #1A1E1C
background: transparent
```

### Clarifying Question

**Q: Should the edit icons be clickable with callbacks, or purely decorative for now?**

**A: Purely decorative** - Just display the icons without any interaction.

### Implementation

1. **Explored codebase** to understand existing patterns:
   - Component patterns in `src/components/pool-sniper/`
   - Theme system in `src/theme/`
   - Icon libraries used (`@phosphor-icons/react`, `@mui/icons-material`)

2. **Mapped Figma colors to existing theme tokens**:
   - Label color `#8B948F` → `colors.gray[500]`
   - Value color `#C4CAC8` → `colors.gray[400]`
   - Border color `#1A1E1C` → `colors.neutral[700]`

3. **Created typography variants** matching Figma specs

4. **Built component** with:
   - Two `PreferenceItem` sub-components
   - Vertical divider between items
   - `PencilSimple` icon from `@phosphor-icons/react`
   - Props for `priorityFee` and `depositSlippage` with defaults

---

## Files Created

### `src/components/pool-sniper/sniper-pool-preferences.tsx`

```tsx
"use client";

import { Box, Divider, Typography } from "@mui/material";
import { PencilSimple } from "@phosphor-icons/react";
import { colors } from "@/theme/tokens/colors";

interface PreferenceItemProps {
  label: string;
  value: string;
}

function PreferenceItem({ label, value }: PreferenceItemProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.75,
        flex: 1,
        py: 1.5,
        px: 2,
      }}
    >
      <Typography
        variant="preferencesLabel"
        sx={{ color: colors.gray[500] }}
      >
        {label}
      </Typography>
      <Typography
        variant="preferencesValue"
        sx={{ color: colors.gray[400] }}
      >
        {value}
      </Typography>
      <PencilSimple size={14} color={colors.gray[500]} />
    </Box>
  );
}

export interface SniperPoolPreferencesProps {
  priorityFee?: string;
  depositSlippage?: string;
}

export function SniperPoolPreferences({
  priorityFee = "FAST",
  depositSlippage = "0.5%",
}: SniperPoolPreferencesProps) {
  return (
    <Box
      sx={{
        display: "flex",
        border: "1px solid",
        borderColor: colors.neutral[700],
        borderRadius: "8px",
        backgroundColor: "transparent",
      }}
    >
      <PreferenceItem label="PRIORITY FEE" value={priorityFee} />
      <Divider
        orientation="vertical"
        flexItem
        sx={{ borderColor: colors.neutral[700] }}
      />
      <PreferenceItem label="DEPOSIT SLIPPAGE" value={depositSlippage} />
    </Box>
  );
}
```

---

## Files Modified

### `src/theme/typography.ts`

**Added typography variant declarations:**

```tsx
declare module "@mui/material/styles" {
  interface TypographyVariants {
    // ... existing variants
    preferencesLabel: React.CSSProperties;
    preferencesValue: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    // ... existing variants
    preferencesLabel?: React.CSSProperties;
    preferencesValue?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    // ... existing variants
    preferencesLabel: true;
    preferencesValue: true;
  }
}
```

**Added typography variant definitions:**

```tsx
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
```

### `src/components/pool-sniper/pool-sniper-form.tsx`

**Added import:**

```tsx
import { SniperPoolPreferences } from "./sniper-pool-preferences";
```

**Added component at top of form:**

```tsx
<FormProvider {...methods}>
  <Box component="form" sx={{ ... }}>
    <SniperPoolPreferences />  {/* Added here */}
    <PoolForm onBaseTokenInfoChange={setBaseTokenInfo} />
    <PositionForm baseTokenInfo={baseTokenInfo} />
  </Box>
</FormProvider>
```

---

## Summary

| Aspect | Details |
|--------|---------|
| **Component** | `SniperPoolPreferences` - view-only preferences display |
| **Typography** | Added `preferencesLabel` (10px) and `preferencesValue` (12px) variants |
| **Icons** | `PencilSimple` from `@phosphor-icons/react` (decorative only) |
| **Colors** | Uses existing theme tokens: `gray.500`, `gray.400`, `neutral.700` |
| **Props** | `priorityFee` (default: "FAST"), `depositSlippage` (default: "0.5%") |
| **Build** | Verified successful with `npm run build` |

---

## Design Specifications Reference

| Element | Font | Size | Weight | Letter Spacing | Color |
|---------|------|------|--------|----------------|-------|
| Label | Manrope | 10px | 800 | 4% (0.04em) | #8B948F |
| Value | Manrope | 12px | 800 | 6% (0.06em) | #C4CAC8 |
| Border | - | - | - | - | #1A1E1C |
