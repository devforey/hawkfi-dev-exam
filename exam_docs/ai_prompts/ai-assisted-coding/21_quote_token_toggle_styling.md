# Quote Token Toggle Styling

## Session Overview
Update the quote token toggle buttons (SOL/USDC) in pool-form.tsx to match Figma design specifications.

## Prompts & Questions

### Initial Prompt
> Follow quote token Figma styling for `@src/components/pool-sniper/pool-form.tsx`

**Figma Specs Provided:**

Title (QUOTE TOKEN label):
- font-family: Manrope
- font-weight: 700
- font-size: 10px
- line-height: 100%
- letter-spacing: 4%
- text-transform: uppercase

Toggles (SOL/USDC buttons):
- font-family: Manrope
- font-weight: 700
- font-size: 10px
- line-height: 100%
- letter-spacing: 4%
- text-transform: uppercase
- border: 1px solid #8B948F
- width: 29px, height: 16px
- padding: 4px left/right
- border-radius: 4px

### Follow-up Prompt #1
> Discrepancies:
> - selected state should not use primary main, it should just be white border, main bg, and white font
> - normal state should be lower opacity bg, lower opacity border, and lower opacity font color
> - update the borders of the items (border radius, and missing left border)

### Follow-up Prompt #2
> The selected item left border is incorrect. It should match the selected border top/right/bottom

## Files Updated

### `src/components/pool-sniper/pool-form.tsx`
Lines 65-160

## Summary of Changes

### 1. QUOTE TOKEN Label Typography (lines 65-76)
```tsx
<Typography
  sx={{
    color: "custom.textTertiary",
    fontWeight: 700,
    fontSize: "10px",
    lineHeight: "100%",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  }}
>
  QUOTE TOKEN
</Typography>
```

### 2. ToggleButtonGroup (line 93)
- Added `gap: "10px"` between buttons

### 3. ToggleButtons (SOL & USDC)
**Normal state:**
- `minWidth: "29px"`, `height: "16px"`
- `padding: "0 4px"`
- `borderRadius: "4px !important"` (override MUI default)
- `border: 1px solid ${alpha("#8B948F", 0.5)}` (lower opacity)
- `borderLeft: 1px solid ... !important` (preserve left border)
- `backgroundColor: alpha(theme.palette.background.paper, 0.3)` (subtle bg)
- `color: alpha(theme.palette.text.primary, 0.6)` (lower opacity text)
- Typography: 700 weight, 10px, 4% letter-spacing, uppercase

**Selected state:**
- `backgroundColor: "background.default"` (solid dark bg)
- `color: "text.primary"` (white text)
- `borderColor: "text.primary"` (white border)
- `borderLeft: 1px solid ${theme.palette.text.primary} !important` (white left border)

## Key Technical Notes

1. **MUI ToggleButtonGroup Override**: MUI removes left borders and border-radius on adjacent buttons by default. Used `!important` to preserve individual button styling.

2. **Alpha Function**: Used `alpha()` from MUI for opacity variations on colors.

3. **Border Consistency**: The `borderLeft` property needed explicit `!important` override in both normal and selected states to ensure consistent borders.
