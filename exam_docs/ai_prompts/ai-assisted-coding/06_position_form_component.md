# Position Form Component

## Overview

Implementation of the main PositionForm component with preset selection, deposit amount, price range inputs, and bins display.

---

## User Prompts

> **Prompt 1:** Focus on reusing MUI components for now to match the Figma best. We will polish the UI/layout/styling later.

> **Prompt 2:** *Preset section*
> - Quick Preset Buttons should be ContainedButton and check for best fit color
> - Deposit Amount should be a ToggleButtonGroup
> - Let's skip CUSTOM for now. Just show the option but lets not do anything.
> - Min Price and Max Price fields should use `@src/components/common/price-input.tsx`

---

## Key Decisions

### Quick Preset Buttons

**Implementation:** Using MUI `<Button variant="contained">` with semi-transparent green background

```typescript
<Button
  variant="contained"
  sx={{
    backgroundColor: "rgba(70, 235, 128, 0.15)",
    color: "rgba(255, 255, 255, 0.8)",
    "&:hover": {
      backgroundColor: "rgba(70, 235, 128, 0.25)",
    },
  }}
>
  {preset.shortName}
</Button>
```

### Deposit Amount

**Implementation:** Using MUI `<ToggleButtonGroup>` with options: 0.5 SOL, 1 SOL, 5 SOL, CUSTOM

- CUSTOM option is visible but non-functional (per requirements)
- Selection updates both `depositOption` and `depositAmount` in form state

### Price Range Inputs

**Implementation:** Reusing existing `<PriceInput>` component from `src/components/common/`

- Same component used in Pool Form for initial price
- Shows percentage offset from initial price (e.g., "-10%", "+10%")

---

## Generated/Modified Files

### Modified
- `src/components/pool-sniper/position-form.tsx` - Complete rewrite from placeholder

---

## Component Features

### 1. Preset Section
- **Quick Buttons:** First 3 presets (HFL, HFL Turbo, MCU) as contained buttons
- **Dropdown:** Full list of all 4 presets with code and name
- **Apply Logic:** Sets minPrice, maxPrice, depositAmount based on preset percentages

```typescript
const applyPreset = useCallback((preset) => {
  const initialPrice = getValues("pool.initialPrice");
  if (initialPrice > 0) {
    const newMinPrice = initialPrice * (1 - preset.lowerPercentage / 100);
    const newMaxPrice = initialPrice * (1 + preset.upperPercentage / 100);

    setValue("position.minPrice", newMinPrice);
    setValue("position.maxPrice", newMaxPrice);
    setValue("position.depositAmount", preset.solAmount);
  }
}, [getValues, setValue]);
```

### 2. Deposit Amount Section
- Toggle buttons: 0.5, 1, 5, CUSTOM SOL
- Wallet balance display below
- Warning alert if deposit exceeds balance (non-blocking)

### 3. Price Range Section
- Min Price and Max Price using PriceInput component
- Percentage offset display calculated from initial price
- Reset Price Range button returns to ±10% defaults

```typescript
const minPriceOffset = useMemo(() => {
  if (initialPrice > 0 && minPrice > 0) {
    return ((minPrice - initialPrice) / initialPrice) * 100;
  }
  return -10;
}, [initialPrice, minPrice]);
```

### 4. Number of Bins Display
- Auto-calculated using `calculateNumberOfBins(minPrice, maxPrice, binStep)`
- Read-only display in styled box

### 5. Auto-initialization
- When initial price is set and position prices are 0, auto-sets to ±10%

```typescript
useEffect(() => {
  if (initialPrice > 0 && currentMin === 0 && currentMax === 0) {
    setValue("position.minPrice", initialPrice * 0.9);
    setValue("position.maxPrice", initialPrice * 1.1);
  }
}, [initialPrice]);
```

---

## Data Dependencies

The component watches these values from the pool form:
- `pool.initialPrice` - For calculating default price range and percentage offsets
- `pool.binStep` - For bins calculation
- `pool.quoteToken` - For display labels

Uses `useWatch` from react-hook-form for reactive updates.

---

## Styling

Follows existing patterns from `pool-form.tsx`:
- Primary: `#46EB80`
- Background: `rgba(7, 13, 10, 0.5)`
- Border: `rgba(70, 235, 128, 0.2)`
- Header badge: Green background with dark text

---

## Reference Documents

- `exam_docs/ai_prompts/requirements_grooming/07_new_position_form.md`
- `src/components/common/price-input.tsx` - Reused for min/max price inputs
