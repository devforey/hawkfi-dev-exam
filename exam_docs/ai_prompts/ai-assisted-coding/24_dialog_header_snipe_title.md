# Dialog Header - Snipe Title with CrosshairSimple Icon

## User Prompt

```
@src/app/pool-sniper/page.tsx

Follow figma design in the dialog header

Figma: [Image]

Icon is CrossHairSimple

Title typo
font-family: Space Grotesk;
font-weight: 700;
font-style: Bold;
font-size: 16px;
leading-trim: NONE;
line-height: 150%;
letter-spacing: 0%;

COPE-SOL depends on the value of the @src/components/pool-sniper/pool-sniper-form.tsx,
just leave it empty if the pair is incomplete or empty
```

## Questions & Clarifications

**Q:** How to access form values (baseToken, quoteToken) from the parent page component?
**A:** The form context is inside `PoolSniperForm`, not accessible from page directly. Solution: Add `onTokenChange` callback prop to pass token values up to the parent.

## Implementation Summary

### 1. Import Space Grotesk Font
**File:** `src/app/layout.tsx`
```typescript
import "@fontsource/space-grotesk/700.css";
```

### 2. Add Token Change Callback to PoolSniperForm
**File:** `src/components/pool-sniper/pool-sniper-form.tsx`
- Added `onTokenChange?: (baseToken: string, quoteToken: string) => void` prop
- Used `useWatch` to monitor `pool.baseToken` and `pool.quoteToken`
- Called `onTokenChange` when either value changes via `useEffect`

```typescript
export interface PoolSniperFormProps {
  onTokenChange?: (baseToken: string, quoteToken: string) => void;
}

const quoteToken = useWatch({ control: methods.control, name: "pool.quoteToken" });

useEffect(() => {
  onTokenChange?.(baseTokenInfo?.symbol || "", quoteToken);
}, [baseTokenInfo?.symbol, quoteToken, onTokenChange]);
```

### 3. Update Page Header
**File:** `src/app/pool-sniper/page.tsx`
- Replaced `CloseIcon` with `CrosshairSimple` and `X` from `@phosphor-icons/react`
- Added `tokenPair` state and `handleTokenChange` callback
- Updated Toolbar layout:
  - Left side: CrosshairSimple icon + "Snipe {baseToken}-{quoteToken}" title
  - Right side: X close button
- Applied Space Grotesk typography

```typescript
import { CrosshairSimple, X } from "@phosphor-icons/react";

const [tokenPair, setTokenPair] = useState({ baseToken: "", quoteToken: "" });

const handleTokenChange = useCallback(
  (baseToken: string, quoteToken: string) => {
    setTokenPair({ baseToken, quoteToken });
  },
  []
);

// In Toolbar:
<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  <CrosshairSimple size={24} color="#FCFCFC" />
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
</Box>
```

## Files Updated

1. `src/app/layout.tsx` - Added Space Grotesk font import
2. `src/components/pool-sniper/pool-sniper-form.tsx` - Added onTokenChange callback
3. `src/app/pool-sniper/page.tsx` - Updated header with icon and dynamic title

## Key Findings

- `@phosphor-icons/react` was installed but not previously used
- `@fontsource/space-grotesk` was installed but not imported
- Form context required callback pattern to pass values to parent component
