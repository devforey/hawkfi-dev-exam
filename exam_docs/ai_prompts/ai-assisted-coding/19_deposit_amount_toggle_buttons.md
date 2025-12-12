# 19. Deposit Amount Toggle Buttons Figma Update

## Session Overview

This session implements the Deposit Amount toggle button redesign to match the Figma design, featuring SOL token icons and a CUSTOM button with dual token icons.

---

## Prompt 1: Initial Figma Implementation

### User Request

```
Follow Deposit Amount Figma Design:

Figma: [Image provided]

Toggle Button label style

font-family: Manrope;
font-weight: 800;
font-style: ExtraBold;
font-size: 12px;
leading-trim: CAP_HEIGHT;
line-height: 140%;
letter-spacing: 6%;
text-transform: uppercase;
opacity: 0.5

Selected:
border: 1px solid #C4CAC8
opacity: 1

----

Try to get the image for SOL in @src/lib/constants.ts

Then in custom item, get the image from base token input in @src/components/pool-sniper/pool-form.tsx
```

### Analysis

The Figma design shows:
- 4 toggle buttons in a row: `0.5 SOL`, `1 SOL`, `5 SOL`, `CUSTOM`
- Each button displays a SOL token icon above the label
- CUSTOM button shows base token icon + SOL icon with "+" separator
- Unselected buttons have 50% opacity
- Selected button has full opacity with `#C4CAC8` border
- Typography follows Manrope font with specific styling

### Implementation Plan

1. Export `SOL_LOGO_URL` constant
2. Share `baseTokenInfo` from PoolForm to PositionForm via callback pattern
3. Redesign toggle buttons with icons and Figma typography specs

### Files Updated

#### 1. `/src/lib/constants.ts`

**Change:** Added SOL logo URL export

```typescript
export const SOL_LOGO_URL =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";
```

#### 2. `/src/components/pool-sniper/pool-form.tsx`

**Changes:**
- Added `PoolFormProps` interface with `onBaseTokenInfoChange` callback
- Updated `onTokenFetched` to call parent callback

```typescript
interface PoolFormProps {
  onBaseTokenInfoChange?: (info: TokenInfo | null) => void;
}

export const PoolForm = ({ onBaseTokenInfoChange }: PoolFormProps) => {
  // ...
  onTokenFetched={(info) => {
    setBaseTokenInfo(info);
    onBaseTokenInfoChange?.(info);
  }}
  // ...
};
```

#### 3. `/src/components/pool-sniper/pool-sniper-form.tsx`

**Changes:**
- Added `useState` import
- Added `TokenInfo` import
- Added `baseTokenInfo` state
- Passed callback and state to child components

```typescript
const [baseTokenInfo, setBaseTokenInfo] = useState<TokenInfo | null>(null);

<PoolForm onBaseTokenInfoChange={setBaseTokenInfo} />
<PositionForm baseTokenInfo={baseTokenInfo} />
```

#### 4. `/src/components/pool-sniper/position-form.tsx`

**Changes:**
- Added `Avatar` import from MUI
- Added `SOL_LOGO_URL` and `TokenInfo` imports
- Added `PositionFormProps` interface
- Completely redesigned ToggleButtonGroup with:
  - Vertical layout (icon above label)
  - SOL avatars on amount buttons
  - Dual icons (base token + SOL) on CUSTOM button
  - Figma typography specs
  - Opacity-based selection states

```typescript
interface PositionFormProps {
  baseTokenInfo?: TokenInfo | null;
}

export const PositionForm = ({ baseTokenInfo }: PositionFormProps) => {
  // Toggle button with icon and styled label
  <ToggleButton>
    {option === "CUSTOM" ? (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {baseTokenInfo?.logoURI && (
          <Avatar src={baseTokenInfo.logoURI} sx={{ width: 20, height: 20 }} />
        )}
        <Typography sx={{ mx: 0.5, fontSize: "10px", color: "text.secondary" }}>
          +
        </Typography>
        <Avatar src={SOL_LOGO_URL} sx={{ width: 20, height: 20 }} />
      </Box>
    ) : (
      <Avatar src={SOL_LOGO_URL} sx={{ width: 20, height: 20 }} />
    )}
    <Typography
      sx={{
        fontFamily: "Manrope",
        fontWeight: 800,
        fontSize: "12px",
        lineHeight: "140%",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "text.primary",
      }}
    >
      {option === "CUSTOM" ? "CUSTOM" : `${option} SOL`}
    </Typography>
  </ToggleButton>
};
```

---

## Prompt 2: Border Fix

### User Request

```
Figma: [Image provided]
Actual: [Image provided]

Left border for 2nd and so on button child is missing
```

### Analysis

MUI's `ToggleButtonGroup` has default styles that remove the left border on grouped buttons (for connected button appearance). Since our design uses separated buttons with gaps, each button needs its own complete border on all 4 sides.

### Solution

Add `!important` to border styles to override MUI's default border-left removal.

### File Updated

#### `/src/components/pool-sniper/position-form.tsx`

**Changes:** Added `!important` to border styles

```typescript
sx={{
  // ToggleButtonGroup level
  "& .MuiToggleButtonGroup-grouped": {
    border: "1px solid transparent !important",
    "&:not(:first-of-type)": {
      borderLeft: "1px solid transparent !important",
      marginLeft: 0,
    },
  },
}}

// ToggleButton level
sx={{
  border: "1px solid transparent !important",
  "&.Mui-selected": {
    border: "1px solid #C4CAC8 !important",
    // ...
  },
}}
```

---

## Summary of All Changes

| File | Changes |
|------|---------|
| `/src/lib/constants.ts` | Added `SOL_LOGO_URL` export |
| `/src/components/pool-sniper/pool-form.tsx` | Added `onBaseTokenInfoChange` prop and callback |
| `/src/components/pool-sniper/pool-sniper-form.tsx` | Lifted `baseTokenInfo` state, passed to child components |
| `/src/components/pool-sniper/position-form.tsx` | Redesigned toggle buttons with icons, typography, and border fixes |

---

## Visual Result

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐
│    [SOL]    │ │    [SOL]    │ │    [SOL]    │ │   [BASE] + [SOL]    │
│   0.5 SOL   │ │   1 SOL     │ │   5 SOL     │ │      CUSTOM         │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────────────┘
     (dim)         (selected)       (dim)              (dim)
```

- Unselected: `opacity: 0.5`, transparent border
- Selected: `opacity: 1`, `border: 1px solid #C4CAC8`

---

## Build Verification

```bash
npm run build  # ✓ Compiled successfully
npm run lint   # ✓ No ESLint warnings or errors
```
