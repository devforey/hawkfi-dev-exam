# Initial Price Notation and UX

## Prompts

### Prompt 1: Small Digit Notation

> I'm confused about the Initial Price. Is there a reason why there is a digit smaller than the other digits in the value?
>
> (Referring to: `0.0₄484 SOL/COPE`)

### Prompt 2: Editing and Increment Behavior

> The requirement states:
> - `Initial price` should only allow numbers
> - The `Initial price` determines the initial price of the pool...
> - Allow the input buttons +- to change the price
>
> - How would users typically expect to edit this field when its displayed to have a notation display?
> - There's a plus and minus buttons, I assume it mean to increment/decrement the initial value but how much would users expect to increment or decrement the value since we're working with deep decimals here?

---

## Summary

### Subscript Notation Explained

The small digit is **shorthand notation** for very small numbers with many zeros.

```
0.0₄484 = 0.0000484
```

The subscript `₄` means "4 zeros here" after the decimal point.

**Examples:**

| Shorthand | Full Number |
|-----------|-------------|
| 0.0₄484 | 0.0000484 |
| 0.0₂5 | 0.005 |
| 0.0₆9 | 0.0000009 |
| 0.0₈123 | 0.00000000123 |

**Why use it?**
- Crypto tokens often have very small prices
- Writing all zeros is hard to read and easy to miscount
- Takes up less space

---

## UX Recommendations

### Handling Notation Display During Edit

**Recommended Approach: Display vs Edit Mode**

| State | What User Sees |
|-------|----------------|
| **Viewing** (blurred) | `0.0₄484` (shorthand notation) |
| **Editing** (focused) | `0.0000484` (full number) |

When user clicks/focuses on input → show full number for editing.
When user clicks away → convert back to shorthand notation.

### Plus/Minus Button Increment

**Problem:** Fixed increments like `+1` or `+0.01` are useless for prices like `0.0000484`.

**Recommended Solution: Percentage-based increment (1%)**

```
Current: 0.0000484
+1% → 0.0000489
-1% → 0.0000479
```

**Why percentage-based?**
- Works for any price (tiny or large)
- Users adjusting initial price typically want "slightly above" or "slightly below" market price
- 1% is a meaningful adjustment in trading contexts

**Implementation:**
```typescript
const increment = () => {
  newPrice = currentPrice * 1.01;  // +1%
};

const decrement = () => {
  newPrice = currentPrice * 0.99;  // -1%
};
```

### Alternative Approaches (Not Recommended)

| Approach | Example | Why Not Ideal |
|----------|---------|---------------|
| Increment last digit | 0.0000484 → 0.0000485 | Too granular for practical use |
| Fixed increment | +0.0000001 | Doesn't scale with different price ranges |

---

## Implementation Notes

1. Store the actual numeric value internally
2. Format to subscript notation only for display
3. On focus, show full decimal for editing
4. Use percentage-based increment for +/- buttons
5. Validate that input is a valid number
