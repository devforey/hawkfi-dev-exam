# Input Theme and Placeholder Styling

## Session Overview

This session covers updates to input font styling in the theme system and creation of custom palette/typography for token input placeholders.

---

## Part 1: Input Font Size and Weight

### User Prompt

> Change Input font size to 13px and font weight to 600
> @src/theme/components/input.ts
>
> Also check if there's hardcoded font size and font weight values across the components

### AI Actions

1. Explored codebase for hardcoded font values
2. Found 20+ instances across 8 files

### Files Updated

| File | Change |
|------|--------|
| `src/theme/components/input.ts` | Added `fontSize: "13px"` and `fontWeight: 600` to input styleOverrides |

### Code Change

```typescript
// src/theme/components/input.ts (lines 27-35)
input: ({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "13px",
  fontWeight: 600,
  "&::placeholder": {
    color: theme.palette.text.secondary,
    opacity: 1,
  },
}),
```

### Hardcoded Values Report

| File | Occurrences |
|------|-------------|
| `src/app/page.tsx` | 4 hardcoded values |
| `src/app/pool-sniper/page.tsx` | 8 hardcoded values |
| `src/components/common/base-token-input.tsx` | 4 hardcoded values |
| `src/components/common/price-input.tsx` | 1 hardcoded value |
| `src/components/pool-sniper/pool-form.tsx` | 2 hardcoded values |
| `src/components/pool-sniper/position-form.tsx` | 3 hardcoded values |
| `src/components/pool-sniper/position-list.tsx` | 7 hardcoded values |
| `src/components/solana/wallet-button.tsx` | 2 hardcoded values |

---

## Part 2: Fix Missing inputBackground Color

### User Prompt

> There's an issue
>
> TypeError: Cannot read properties of undefined (reading 'type')
>
> Source: src/components/pool-sniper/position-form.tsx (174:42) @ theme

### Root Cause

Code referenced `theme.palette.custom.inputBackground` which didn't exist in the palette.

### Files Updated

| File | Change |
|------|--------|
| `src/theme/palette.ts` | Added `inputBackground: colors.neutral[700]` to custom colors |

### Code Change

```typescript
// src/theme/palette.ts (line 55)
custom: {
  backgroundOverlay: colors.neutral[850],
  textTertiary: colors.white.alpha60,
  textMuted: colors.white.alpha70,
  priceInputValue: colors.gray[400],
  priceInputUnit: colors.gray[500],
  inputBackground: colors.neutral[700], // Added
},
```

---

## Part 3: Token Input Placeholder Custom Styles

### User Prompt

> @src/components/common/base-token-input.tsx
>
> In the placeholder typography. Create another custom palette, tokenInputPlaceholder* to match placeholder styles of the global inputs

### AI Question

> How would you like to define the font size and font weight for tokenInputPlaceholder?

### User Answer

> Add to typography.ts

### Files Updated

| File | Change |
|------|--------|
| `src/theme/palette.ts` | Added `tokenInputPlaceholder` to type declarations and custom colors |
| `src/theme/typography.ts` | Added `tokenInputPlaceholder` typography variant with type declarations |
| `src/components/common/base-token-input.tsx` | Updated placeholder Typography to use new styles |

### Code Changes

#### palette.ts

```typescript
// Type declarations (lines 12, 23)
interface Palette {
  custom: {
    // ...existing
    tokenInputPlaceholder: string;
  };
}

// Custom colors (line 56)
custom: {
  // ...existing
  tokenInputPlaceholder: colors.white.alpha50,
},
```

#### typography.ts

```typescript
// Type declarations (lines 6, 10, 17)
interface TypographyVariants {
  sectionLabel: React.CSSProperties;
  tokenInputPlaceholder: React.CSSProperties;
}

// Typography variant (lines 32-35)
tokenInputPlaceholder: {
  fontSize: "13px",
  fontWeight: 600,
},
```

#### base-token-input.tsx

```typescript
// Placeholder Typography (lines 131-139)
<Typography
  sx={{
    color: "custom.tokenInputPlaceholder",
    ...theme.typography.tokenInputPlaceholder,
    pointerEvents: "none",
  }}
>
  {placeholder}
</Typography>
```

---

## Summary

| Task | Status |
|------|--------|
| Update input font size to 13px | Complete |
| Update input font weight to 600 | Complete |
| Document hardcoded font values | Complete |
| Fix missing inputBackground color | Complete |
| Add tokenInputPlaceholder palette color | Complete |
| Add tokenInputPlaceholder typography variant | Complete |
| Update base-token-input.tsx placeholder styling | Complete |

### Style Values Applied

| Property | Value | Source |
|----------|-------|--------|
| Input font size | 13px | `src/theme/components/input.ts` |
| Input font weight | 600 | `src/theme/components/input.ts` |
| Placeholder color | `colors.white.alpha50` | `custom.tokenInputPlaceholder` |
| Placeholder font size | 13px | `typography.tokenInputPlaceholder` |
| Placeholder font weight | 600 | `typography.tokenInputPlaceholder` |
