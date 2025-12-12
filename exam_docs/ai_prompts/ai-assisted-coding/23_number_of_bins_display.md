# Number of Bins Display Styling

## Session Overview
Update the "Number of Bins" display section in position-form.tsx to match Figma design, including theme color updates.

## Prompts & Questions

### Initial Prompt
> Style number of bins display according to Figma for `@src/components/pool-sniper/position-form.tsx`
> Make sure to update theme file if needed for the colors

**Figma Specs Provided:**

Container/box:
- border-radius: 4px
- border-width: 1px
- background: #0F1411
- border: 1px solid #1A1E1C

Label:
- font-family: Manrope
- font-weight: 700
- font-size: 10px
- line-height: 100%
- letter-spacing: 4%
- text-transform: uppercase
- color: #8B948F

Value:
- font-family: Manrope
- font-weight: 600
- font-size: 13px
- line-height: 140%
- letter-spacing: 0%
- text-align: right
- color: #EFF0F0

## Files Updated

### 1. `src/theme/tokens/colors.ts`
Added new color tokens:
- `neutral[750]: "#0F1411"` - bins background
- `white.text: "#EFF0F0"` - value text color

### 2. `src/components/pool-sniper/position-form.tsx`
Lines 495-531

## Summary of Changes

### Theme Colors (colors.ts)

**Before:**
```ts
neutral: {
  900: "#070D0A",
  850: "#070D0AE5",
  800: "#0a1510",
  700: "#1A1E1C",
},
white: {
  solid: "#FCFCFC",
  alpha90: "rgba(255, 255, 255, 0.9)",
  // ...
}
```

**After:**
```ts
neutral: {
  900: "#070D0A",
  850: "#070D0AE5",
  800: "#0a1510",
  750: "#0F1411",  // NEW
  700: "#1A1E1C",
},
white: {
  solid: "#FCFCFC",
  text: "#EFF0F0",  // NEW
  alpha90: "rgba(255, 255, 255, 0.9)",
  // ...
}
```

### Number of Bins Component (position-form.tsx)

**Before:**
```tsx
<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: alpha(theme.palette.background.default, 0.8),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    borderRadius: "8px",
    p: 1.5,
  }}
>
  <Typography variant="sectionLabel" sx={{ color: "custom.textTertiary" }}>
    NUMBER OF BINS
  </Typography>
  <Typography
    variant="body1"
    sx={{
      color: "text.primary",
      fontFamily: "monospace",
      fontWeight: "bold",
    }}
  >
    {numberOfBins}
  </Typography>
</Box>
```

**After:**
```tsx
<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0F1411",
    border: "1px solid #1A1E1C",
    borderRadius: "4px",
    px: 1.5,
    py: 0.75,
  }}
>
  <Typography
    sx={{
      fontWeight: 700,
      fontSize: "10px",
      lineHeight: "100%",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "#8B948F",
    }}
  >
    NUMBER OF BINS
  </Typography>
  <Typography
    sx={{
      fontWeight: 600,
      fontSize: "13px",
      lineHeight: "140%",
      letterSpacing: "0",
      color: "#EFF0F0",
    }}
  >
    {numberOfBins}
  </Typography>
</Box>
```

## Key Changes

| Element | Before | After |
|---------|--------|-------|
| Container bg | `alpha(background.default, 0.8)` | `#0F1411` |
| Container border | `alpha(primary.main, 0.2)` (green tint) | `#1A1E1C` (neutral) |
| Container border-radius | `8px` | `4px` |
| Container height | Larger (`p: 1.5`) | Compact (`py: 0.75`) |
| Label typography | `variant="sectionLabel"` | Custom 700 weight, 10px |
| Label color | `custom.textTertiary` | `#8B948F` |
| Value typography | `monospace`, bold | Manrope, 600 weight, 13px |
| Value color | `text.primary` | `#EFF0F0` |

## Technical Notes

1. **New Theme Colors**: Added `neutral[750]` and `white.text` to the theme for future reusability.

2. **Compact Height**: Changed from `p: 1.5` (padding all around) to `px: 1.5, py: 0.75` for a more compact 28px height per Figma.

3. **Border Styling**: Changed from semi-transparent green border to solid neutral border for a more subtle appearance.
