# Base Token Input Figma Update

## Overview

Refactoring the `BaseTokenInput` component to match the updated Figma design. The main changes involve moving the token display inline with the input, implementing RTL text alignment for the mint address, and adding a hover-based icon interaction for the valid/clear indicator.

---

## User Prompts

> **Prompt 1:** Update base token input based on Figma
> - Show the base token image and name at the left side of the input instead of having a separate section below the input.
> - Change the alignment of the input to RTL instead.
>
> *[Figma reference showing COPE token with mint address and checkmark]*

> **Prompt 2:** When we made the Input RTL, the placeholder also shift to the right. I still want the placeholder be in the left. Maybe instead of using the input's placeholder, use startAdornment if there's no token fetched yet.

---

## Key Decisions

### Clear Button Behavior

**Question:** Should the clear (X) button be kept alongside the checkmark, or should the checkmark replace it when the token is valid?

**Options:**
1. Keep both - Show checkmark AND clear button on the right side
2. Checkmark only - Replace clear button with checkmark when token is valid

**User Choice:** Replace the checkmark with clear button on hover only.

### Placeholder Alignment Fix

**Question:** How to keep placeholder left-aligned while input value is right-aligned?

**Solution:** Use `startAdornment` to display placeholder text instead of native input placeholder, which respects the RTL text alignment.

---

## Files Modified

### File Path
- `src/components/common/base-token-input.tsx`

---

## Implementation Details

### Before vs After Layout

**Before:**
```
┌────────────────────────────────────────────────────────┐
│ DMwbVy48dWVKGe9z1pcVnwF3HLMLrqWdDLfbvx8RchhK        ✕ │
└────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────┐
│ [🐶] COPE                                  9 decimals  │
│      Cope                                              │
└────────────────────────────────────────────────────────┘
```

**After:**
```
┌────────────────────────────────────────────────────────┐
│ [🐶 COPE]  DMwbVy48dWVKGe9z1pcVnwF3HLMLrqWdDLfbvx8RchhK ✓ │
└────────────────────────────────────────────────────────┘
```

### Visual States

**Empty state (no input):**
```
┌────────────────────────────────────────────────────────┐
│ Enter token mint address                               │
└────────────────────────────────────────────────────────┘
```

**With input (token not yet validated):**
```
┌────────────────────────────────────────────────────────┐
│                 DMwbVy48dWVKGe9z1pcVnwF3HLMLrqWdDLfbvx ✕ │
└────────────────────────────────────────────────────────┘
```

**Valid token (default):**
```
┌────────────────────────────────────────────────────────┐
│ [🐶 COPE]  DMwbVy48dWVKGe9z1pcVnwF3HLMLrqWdDLfbvx8RchhK ✓ │
└────────────────────────────────────────────────────────┘
```

**Valid token (on hover):**
```
┌────────────────────────────────────────────────────────┐
│ [🐶 COPE]  DMwbVy48dWVKGe9z1pcVnwF3HLMLrqWdDLfbvx8RchhK ✕ │
└────────────────────────────────────────────────────────┘
```

### Key Code Changes

#### 1. Added CheckCircle Icon Import

```typescript
import { Close, CheckCircle } from "@mui/icons-material";
```

#### 2. RTL Text Alignment for Input

```typescript
sx={{
  "& .MuiOutlinedInput-input": {
    textAlign: "right",
  },
}}
```

#### 3. Conditional startAdornment (Token Chip or Placeholder)

```typescript
startAdornment={
  <InputAdornment position="start">
    {showTokenInfo ? (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          py: 0.5,
          px: 1,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          borderRadius: "6px",
          mr: 1,
        }}
      >
        <Avatar
          src={tokenInfo.logoURI}
          alt={tokenInfo.symbol}
          sx={{
            width: 20,
            height: 20,
            bgcolor: alpha(theme.palette.primary.main, 0.2),
            fontSize: "0.625rem",
          }}
        >
          {tokenInfo.symbol?.[0]}
        </Avatar>
        <Typography
          sx={{
            color: "text.primary",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          {tokenInfo.symbol}
        </Typography>
      </Box>
    ) : !inputValue ? (
      <Typography
        sx={{
          color: "text.secondary",
          fontSize: "0.875rem",
          pointerEvents: "none",
        }}
      >
        {placeholder}
      </Typography>
    ) : null}
  </InputAdornment>
}
```

#### 4. Hover-Based Icon Swap (Checkmark ↔ Close)

```typescript
{showTokenInfo && !isLoading && (
  <Box
    onClick={handleClear}
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      "& .check-icon": {
        display: "flex",
      },
      "& .close-icon": {
        display: "none",
      },
      "&:hover .check-icon": {
        display: "none",
      },
      "&:hover .close-icon": {
        display: "flex",
      },
    }}
  >
    <CheckCircle
      className="check-icon"
      fontSize="small"
      sx={{ color: "primary.main" }}
    />
    <Close
      className="close-icon"
      fontSize="small"
      sx={{ color: "text.secondary" }}
    />
  </Box>
)}
```

#### 5. Removed Separate Token Info Box

The token info box that previously displayed below the input (showing avatar, symbol, name, and decimals) was removed since the token info is now displayed inline within the input.

---

## Summary

| Change | Description |
|--------|-------------|
| Token display | Moved from separate box below input to inline `startAdornment` |
| Text alignment | Input value now right-aligned (RTL) |
| Placeholder | Moved to `startAdornment` to maintain left alignment |
| Valid indicator | Green checkmark shown when token is valid |
| Clear interaction | Checkmark transforms to X icon on hover |
| Info box | Removed (no longer needed) |

---

## Reference Documents

- Figma design reference (provided in session)
- MUI InputAdornment documentation: https://mui.com/material-ui/api/input-adornment/
