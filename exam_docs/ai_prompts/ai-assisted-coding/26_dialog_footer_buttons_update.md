# Dialog Footer - Cancel and Submit Buttons Update

## User Prompt

```
@src/app/pool-sniper/page.tsx

Update Cancel and Submit buttons according to Figma.

Current: [Image - showing green primary button]

Figma
Disabled: [Image - showing cyan button at 50% opacity]
Enabled: [Image - showing cyan button at 100% opacity]

Styles:

Cancel button
font-family: Manrope;
font-weight: 700;
font-style: Bold;
font-size: 14px;
leading-trim: NONE;
line-height: 145%;
letter-spacing: 0%;
text-align: center;
color: #46E1EB (cyan)

Submit button
width: 472;
height: 40;
gap: 10px;
angle: 0 deg;
opacity: 0.5;
padding-top: 10px;
padding-right: 20px;
padding-bottom: 10px;
padding-left: 20px;
border-radius: 12px;
border-width: 2px;
background: #46E1EB;
color: #06220D
border: 2px solid #46E1EB
opacity: (50% when disabled, 100% when enabled)

---
Functionalities:
Disable the submit button if the form is invalid
show label "Input new pool details" if Pool Form is invalid or incomplete
show label "Input new position details" if Pool Form is done, and Position Form is invalid or incomplete

Enable the button if both forms are valid and show label "Confirm create new <token pair> pool and position"
```

## Questions & Clarifications

**Q:** Where should the new colors (#46E1EB cyan and #06220D dark green) be added?
**A:** User specified: cyan in new `cyan` object, dark green in `green` object (not neutral).

## Implementation Summary

### 1. Add New Colors to Theme
**File:** `src/theme/tokens/colors.ts`
```typescript
export const colors = {
  green: {
    500: "#46EB80",
    600: "#3dd16f",
    900: "#06220D",  // NEW - dark green for button text
  },
  cyan: {
    500: "#46E1EB",  // NEW - cyan for buttons
  },
  // ...
};
```

### 2. Add Validation Callback to PoolSniperForm
**File:** `src/components/pool-sniper/pool-sniper-form.tsx`

Added prop and validation logic:
```typescript
export interface PoolSniperFormProps {
  onTokenChange?: (baseToken: string, quoteToken: string) => void;
  onValidationChange?: (poolValid: boolean, positionValid: boolean) => void;
}

// Watch form fields for validation
const baseToken = useWatch({ control: methods.control, name: "pool.baseToken" });
const binStep = useWatch({ control: methods.control, name: "pool.binStep" });
const initialPrice = useWatch({ control: methods.control, name: "pool.initialPrice" });
const minPrice = useWatch({ control: methods.control, name: "position.minPrice" });
const maxPrice = useWatch({ control: methods.control, name: "position.maxPrice" });

// Validation effect
useEffect(() => {
  const poolValid = !!baseToken && binStep !== null && initialPrice > 0;
  const positionValid = minPrice > 0 && maxPrice > 0 && minPrice <= maxPrice;
  onValidationChange?.(poolValid, positionValid);
}, [baseToken, binStep, initialPrice, minPrice, maxPrice, onValidationChange]);
```

### 3. Update Page with Button Styles and Logic
**File:** `src/app/pool-sniper/page.tsx`

Added validation state:
```typescript
const [formValidation, setFormValidation] = useState({
  poolValid: false,
  positionValid: false,
});

const handleValidationChange = useCallback(
  (poolValid: boolean, positionValid: boolean) => {
    setFormValidation({ poolValid, positionValid });
  },
  []
);
```

Updated Cancel button:
```typescript
<Button
  onClick={handleClose}
  sx={{
    color: "#46E1EB",
    textTransform: "none",
    fontFamily: "Manrope",
    fontWeight: 700,
    fontSize: "14px",
    lineHeight: "145%",
  }}
>
  Cancel
</Button>
```

Updated Submit button:
```typescript
<Button
  variant="contained"
  onClick={handleSubmit}
  disabled={isSubmitting || !formValidation.poolValid || !formValidation.positionValid}
  sx={{
    flex: 1,
    height: "40px",
    bgcolor: "#46E1EB",
    color: "#06220D",
    textTransform: "none",
    fontFamily: "Manrope",
    fontWeight: 700,
    fontSize: "14px",
    lineHeight: "145%",
    px: "20px",
    py: "10px",
    borderRadius: "12px",
    border: "2px solid #46E1EB",
    "&:hover": {
      bgcolor: "#3bc8d4",
      borderColor: "#3bc8d4",
    },
    "&.Mui-disabled": {
      bgcolor: "#46E1EB",
      color: "#06220D",
      borderColor: "#46E1EB",
      opacity: 0.5,
    },
  }}
>
  {isSubmitting ? (
    <CircularProgress size={24} sx={{ color: "#06220D" }} />
  ) : !formValidation.poolValid ? (
    "Input new pool details"
  ) : !formValidation.positionValid ? (
    "Input new position details"
  ) : (
    `Confirm create new ${tokenPair.baseToken}-${tokenPair.quoteToken} pool and position`
  )}
</Button>
```

## Files Updated

1. `src/theme/tokens/colors.ts` - Added cyan.500 and green.900 colors
2. `src/components/pool-sniper/pool-sniper-form.tsx` - Added onValidationChange callback
3. `src/app/pool-sniper/page.tsx` - Updated button styles and dynamic label logic

## Button Label States

| Pool Form | Position Form | Button Label |
|-----------|---------------|--------------|
| Invalid   | Any           | "Input new pool details" |
| Valid     | Invalid       | "Input new position details" |
| Valid     | Valid         | "Confirm create new COPE-SOL pool and position" |

## Visual Changes

- Cancel button: Green (#46EB80) → Cyan (#46E1EB)
- Submit button background: Green (#46EB80) → Cyan (#46E1EB)
- Submit button text: Dark background → Dark green (#06220D)
- Disabled state: 50% opacity (not different background color)
- Border: 2px solid cyan
- Border radius: 8px → 12px
