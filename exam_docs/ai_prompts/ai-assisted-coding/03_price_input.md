# PriceInput Component

## Overview

A reusable price input component with increment/decrement buttons (percentage-based), token pair suffix display, and edit mode for direct input.

---

## User Prompts

> **Prompt 1:** Lets use `@src/components/common/price-input.tsx` in `@src/components/pool-sniper/pool-form.tsx`'s Initial Price.

> **Prompt 2:** base token should depend on the Input Base Token field. Is it safe to show "-/<quoteToken>" in the price field if there's no Base Token yet?

> **Prompt 3:** Lets remove notating logic first since its not working. We'll add it later on.

---

## Key Decisions

### Empty Base Token Display

**Question:** What should the price suffix show when no base token is selected?

**Options:**
- No suffix - Show only the price value (cleanest UX)
- Dash placeholder - Show "SOL/-" to indicate a token needs to be selected

**User Choice:** Dash placeholder (`SOL/-`)

---

## Features Implemented

### 1. Percentage-Based Increment/Decrement
- +/- buttons adjust price by 1% (configurable)
- Uses Decimal.js for precision math
- Formula: `newPrice = currentPrice * (1 ± incrementPercent/100)`

### 2. Token Pair Suffix
- Displays `{quoteToken}/{baseToken}` (e.g., "SOL/COPE")
- Shows dash placeholder when no base token: `SOL/-`

### 3. Edit Mode
- Click on price to enter edit mode
- Shows raw number for direct editing
- Press Enter or blur to apply changes

### 4. Subscript Notation (Planned, Not Implemented)
- Originally planned to show `0.0₄484` for `0.0000484`
- Utility created at `src/components/common/utils/format-subscript.ts`
- Removed from component due to issues, to be added later

---

## Generated/Modified Files

### Created
- `src/components/common/price-input.tsx`
- `src/components/common/utils/format-subscript.ts` (utility for future use)

### Modified
- `src/components/pool-sniper/pool-form.tsx` - Integrated PriceInput with dynamic baseToken

---

## Integration Pattern

The component receives the base token symbol dynamically from the fetched token info:

```typescript
// In pool-form.tsx
const [baseTokenInfo, setBaseTokenInfo] = useState<TokenInfo | null>(null);

// BaseTokenInput updates baseTokenInfo via onTokenFetched
<BaseTokenInput
  onTokenFetched={setBaseTokenInfo}
  ...
/>

// PriceInput uses the symbol
<PriceInput
  quoteToken={quoteToken}
  baseToken={baseTokenInfo?.symbol}
  ...
/>
```

---

## Subscript Notation Reference

For future implementation, the subscript notation converts small decimals:

| Input | Output |
|-------|--------|
| 0.0000484 | 0.0₄484 |
| 0.005 | 0.0₂5 |
| 0.0000009 | 0.0₆9 |

Unicode subscript digits: `₀₁₂₃₄₅₆₇₈₉`

See: `exam_docs/ai_prompts/requirements_grooming/06_initial_price_notation_and_ux.md`
