# Dialog Header - Color and Text Refinement

## User Prompts

### Prompt 1: Always Show "Snipe" Text
```
If there's no tokenPair then just show "<icon> Snipe"

Change text and icon color to #FCFCFC, check for existing theme color
```

### Prompt 2: Use Token Symbol Instead of Mint Address
```
The baseToken should be the name of the token instead of the mint address
```

## Questions & Clarifications

**Q:** Does #FCFCFC exist in the theme?
**A:** No, it wasn't defined. Added `solid: "#FCFCFC"` to the `white` object in colors.ts.

**Q:** How to get token symbol instead of mint address?
**A:** `baseTokenInfo` already has a `symbol` property. Changed `onTokenChange` to pass `baseTokenInfo?.symbol` instead of the mint address.

## Implementation Summary

### 1. Add White Solid Color to Theme
**File:** `src/theme/tokens/colors.ts`
```typescript
white: {
  solid: "#FCFCFC",
  alpha90: "rgba(255, 255, 255, 0.9)",
  // ...
},
```

### 2. Update Header to Always Show "Snipe"
**File:** `src/app/pool-sniper/page.tsx`
- Changed conditional to always show "Snipe" text
- Appends token pair only if both tokens exist
- Changed color from `primary.main` to `#FCFCFC`

```typescript
<Typography
  sx={{
    fontFamily: '"Space Grotesk"',
    fontWeight: 700,
    fontSize: "16px",
    lineHeight: "150%",
    color: "#FCFCFC",
  }}
>
  Snipe{tokenPair.baseToken && tokenPair.quoteToken
    ? ` ${tokenPair.baseToken}-${tokenPair.quoteToken}`
    : ""}
</Typography>
```

### 3. Pass Token Symbol Instead of Mint Address
**File:** `src/components/pool-sniper/pool-sniper-form.tsx`
- Changed `onTokenChange` to pass `baseTokenInfo?.symbol` instead of `baseToken` (mint address)
- Removed unused `baseToken` watch variable

```typescript
useEffect(() => {
  onTokenChange?.(baseTokenInfo?.symbol || "", quoteToken);
}, [baseTokenInfo?.symbol, quoteToken, onTokenChange]);
```

## Files Updated

1. `src/theme/tokens/colors.ts` - Added `white.solid: "#FCFCFC"`
2. `src/components/pool-sniper/pool-sniper-form.tsx` - Pass symbol instead of mint address
3. `src/app/pool-sniper/page.tsx` - Updated header text logic and colors

## Result

- Header always shows "Snipe" (even when no token pair selected)
- When tokens are selected, shows "Snipe COPE-SOL" (using symbol, not mint address)
- Icon and text color changed to #FCFCFC (white)
