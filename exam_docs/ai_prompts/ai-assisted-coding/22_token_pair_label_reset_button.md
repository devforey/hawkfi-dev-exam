# Token Pair Label and Reset Button Styling

## Session Overview
Update the "Token Pair Label and Reset Button" section in position-form.tsx to match Figma design.

## Prompts & Questions

### Initial Prompt
> Style Current "Token Pair Label and Reset Button" according to Figma for `@src/components/pool-sniper/position-form.tsx`

**Figma Specs Provided:**

Section background: `#1A1E1C`

Label:
- font-family: Manrope
- font-weight: 800
- font-size: 12px
- line-height: 140%
- letter-spacing: 6%
- text-transform: uppercase
- color: #EFF0F0

Button:
- font-family: Manrope
- font-weight: 800
- font-size: 12px
- line-height: 140%
- letter-spacing: 6%
- text-transform: uppercase
- color: #C4CAC8

## Files Updated

### `src/components/pool-sniper/position-form.tsx`
Lines 452-493

## Summary of Changes

### Before
```tsx
<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <Typography variant="sectionLabel" sx={{ color: "custom.textTertiary" }}>
    {quoteToken}/{watch("pool.baseToken") ? "TOKEN" : "-"}
  </Typography>
  <Button
    sx={{
      color: "primary.main",  // Green
      textTransform: "none",
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      },
    }}
  >
    RESET PRICE RANGE
  </Button>
</Box>
```

### After
```tsx
<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1E1C",
    borderRadius: "8px",
    p: 1.5,
  }}
>
  <Typography
    sx={{
      fontWeight: 800,
      fontSize: "12px",
      lineHeight: "140%",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "#EFF0F0",
    }}
  >
    {quoteToken}/{watch("pool.baseToken") ? "TOKEN" : "-"}
  </Typography>
  <Button
    sx={{
      fontWeight: 800,
      fontSize: "12px",
      lineHeight: "140%",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "#C4CAC8",
      "&:hover": {
        backgroundColor: "transparent",
      },
    }}
  >
    RESET PRICE RANGE
  </Button>
</Box>
```

## Key Changes

| Element | Before | After |
|---------|--------|-------|
| Container bg | None | `#1A1E1C` |
| Container padding | None | `p: 1.5` |
| Container border-radius | None | `8px` |
| Label color | `custom.textTertiary` (gray) | `#EFF0F0` (white/light) |
| Label typography | `variant="sectionLabel"` | Custom 800 weight, 12px |
| Button color | `primary.main` (green) | `#C4CAC8` (gray) |
| Button typography | Default | Custom 800 weight, 12px |
