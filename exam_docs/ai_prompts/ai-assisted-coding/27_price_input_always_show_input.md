# Price Input - Always Show Input & Styling Updates

## Session Summary

Refactored the `PriceInput` component to always display the input field (removing the toggle between display/edit modes) and applied comprehensive styling updates based on Figma specifications.

---

## Prompt 1: Remove Conditional Rendering

### User Prompt
```
@src/components/common/price-input.tsx

Always show the Input regardless if unfocused or focused. Entirely remove the displayValue for now
```

### Changes Made

**File Updated:** `src/components/common/price-input.tsx`

| Change | Description |
|--------|-------------|
| Removed `isEditing` state | No longer needed since input is always visible |
| Simplified `useEffect` | Always syncs `inputValue` with `value` prop |
| Removed `handleFocus` function | No longer needed |
| Removed `displayValue` variable | No longer needed |
| Replaced conditional rendering | Always renders `OutlinedInput` instead of ternary with `Typography` |
| Removed `autoFocus` prop | Input is always visible, no need for auto-focus |

---

## Prompt 2: Styling Updates

### User Prompt
```
Make sure to make the Input fill the entire space for the row.
Make it so that the Input will be focused if user clicked on the Price Input component (including the increment/decrement buttons)

Update Input style
font-family: Manrope;
font-weight: 700;
font-style: Bold;
font-size: 16px;
leading-trim: CAP_HEIGHT;
line-height: 125%;
letter-spacing: 0%;
text-align: right;
position: sub;
color: #C4CAC8;

Update token pair style
font-family: Manrope;
font-weight: 700;
font-style: Bold;
font-size: 16px;
leading-trim: CAP_HEIGHT;
line-height: 125%;
letter-spacing: 0%;
text-align: right;
color: #8B948F

Update increment/decrement button icons
width: 16;
height: 16;
angle: 0 deg;
opacity: 1;
color: #8B948F
```

### Changes Made

**File Updated:** `src/components/common/price-input.tsx`

| Change | Description |
|--------|-------------|
| Added `focusInput` function | Helper to focus the input via ref |
| Added `onClick={focusInput}` to container | Clicking anywhere on component focuses input |
| Added `cursor: "pointer"` to container | Visual feedback for clickable area |
| Added `flex: 1` to OutlinedInput | Input now fills entire row space |
| Removed wrapper Box | Flattened structure around input |
| Updated input text style | Manrope, 700 weight, 16px, #C4CAC8 |
| Moved token pair to `endAdornment` | Better positioning within input |
| Updated token pair style | Manrope, 700 weight, 16px, #8B948F |
| Updated icon sizes | Set to 16px via `sx={{ fontSize: 16 }}` |
| Updated icon colors | Set to #8B948F |
| Removed unused imports | Removed `alpha` and `useTheme` |

---

## Final Code Structure

```tsx
// Key styling applied to OutlinedInput
sx={{
  flex: 1,
  backgroundColor: "transparent",
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& input": {
    fontFamily: "Manrope",
    fontWeight: 700,
    fontSize: "16px",
    lineHeight: "125%",
    letterSpacing: "0%",
    textAlign: "right",
    color: "#C4CAC8",
    padding: "4px 8px",
  },
}}

// Token pair suffix as endAdornment
endAdornment={
  tokenPairSuffix ? (
    <Typography sx={{
      fontFamily: "Manrope",
      fontWeight: 700,
      fontSize: "16px",
      lineHeight: "125%",
      letterSpacing: "0%",
      textAlign: "right",
      color: "#8B948F",
      whiteSpace: "nowrap",
    }}>
      {tokenPairSuffix}
    </Typography>
  ) : undefined
}

// Icon buttons
<IconButton sx={{ color: "#8B948F" }}>
  <RemoveCircleOutline sx={{ fontSize: 16 }} />
</IconButton>
```

---

## Files Modified

- `src/components/common/price-input.tsx`
