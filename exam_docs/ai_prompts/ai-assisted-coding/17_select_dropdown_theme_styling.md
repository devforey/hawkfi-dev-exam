# Select Dropdown Theme Styling

## Session Overview

This session covers centralizing dropdown/Select styling in the MUI theme system, moving inline `sx` overrides to theme-level configuration, and standardizing placeholder patterns across Select components.

---

## User Prompt

> @src/components/pool-sniper/position-form.tsx
>
> Apply placeholder dropdown and focus states styling from Base Fee select (from @src/components/pool-sniper/pool-form.tsx) in Preset Dropdown.
>
> Prefer to put it in the theme and be applied automatically to dropdowns

---

## AI Analysis

### Current State Comparison

**Base Fee Select (pool-form.tsx lines 146-174):**
- Uses `displayEmpty` + `renderValue` for placeholder with `opacity: 0.5`
- No inline `sx` styling - relies on theme defaults
- Clean, maintainable pattern

**Preset Dropdown (position-form.tsx lines 193-229):**
- Has inline `sx` with `backgroundColor`, `border: "none"` for all states
- Uses disabled `MenuItem` for placeholder (different pattern)
- Inline overrides bypass theme system

### Proposed Solution

1. Add Select root styling to theme for automatic application
2. Update Preset Dropdown to use `renderValue` pattern for placeholder consistency

---

## AI Question

> Should I remove borders entirely from Select components, or retain hover/focus outlines?

### User Answer

> Retain the hover and focused outlines

---

## Files Updated

| File | Change |
|------|--------|
| `src/theme/components/select.ts` | Added `root` style override with `backgroundColor` |
| `src/components/pool-sniper/position-form.tsx` | Removed inline `sx`, added `renderValue` for placeholder |

---

## Code Changes

### src/theme/components/select.ts

**Before:**
```typescript
import { Components, Theme } from "@mui/material/styles";

const select: Components<Omit<Theme, "components">> = {
  MuiSelect: {
    styleOverrides: {
      icon: ({ theme }) => ({
        color: theme.palette.text.secondary,
      }),
    },
  },
};

export default select;
```

**After:**
```typescript
import { Components, Theme } from "@mui/material/styles";

const select: Components<Omit<Theme, "components">> = {
  MuiSelect: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.custom.inputBackground,
      }),
      icon: ({ theme }) => ({
        color: theme.palette.text.secondary,
      }),
    },
  },
};

export default select;
```

### src/components/pool-sniper/position-form.tsx

**Before (lines 193-229):**
```tsx
<FormControl size="small" sx={{ minWidth: 220 }}>
  <Select
    value={field.value ?? ""}
    displayEmpty
    onChange={(e) => {
      const presetId = e.target.value as number;
      const preset = POSITION_PRESETS.find((p) => p.id === presetId);
      if (preset) {
        applyPreset(preset);
      }
    }}
    sx={{
      backgroundColor: "custom.inputBackground",
      border: "none",
      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
      "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
    }}
  >
    <MenuItem value="" disabled>
      <Typography sx={{ color: "text.secondary" }}>
        Select HawkFi preset
      </Typography>
    </MenuItem>
    {POSITION_PRESETS.map((preset) => (
      <MenuItem key={preset.id} value={preset.id}>
        {preset.code} - {preset.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>
```

**After (lines 193-224):**
```tsx
<FormControl size="small" sx={{ minWidth: 220 }}>
  <Select
    value={field.value ?? ""}
    displayEmpty
    renderValue={(value) => {
      if (!value) {
        return (
          <span style={{ color: "inherit", opacity: 0.5 }}>
            Select HawkFi preset
          </span>
        );
      }
      const preset = POSITION_PRESETS.find((p) => p.id === value);
      return preset ? `${preset.code} - ${preset.name}` : null;
    }}
    onChange={(e) => {
      const presetId = e.target.value as number;
      const preset = POSITION_PRESETS.find((p) => p.id === presetId);
      if (preset) {
        applyPreset(preset);
      }
    }}
  >
    {POSITION_PRESETS.map((preset) => (
      <MenuItem key={preset.id} value={preset.id}>
        {preset.code} - {preset.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>
```

---

## Summary

| Task | Status |
|------|--------|
| Add Select background to theme | Complete |
| Retain hover/focus outlines | Complete |
| Remove inline `sx` from Preset Dropdown | Complete |
| Use `renderValue` for placeholder | Complete |
| Remove disabled placeholder MenuItem | Complete |

### Pattern Standardization

| Component | Placeholder Pattern | Theme Styling |
|-----------|---------------------|---------------|
| Base Fee Select | `renderValue` with `opacity: 0.5` | Theme defaults |
| Bin Step Select | `renderValue` with `opacity: 0.5` | Theme defaults |
| Preset Dropdown | `renderValue` with `opacity: 0.5` | Theme defaults |

### Theme Architecture

Select styling now follows a layered approach:

1. **`MuiOutlinedInput`** (`input.ts`) - Handles border states (transparent default, visible on hover/focus)
2. **`MuiSelect`** (`select.ts`) - Handles Select-specific styling (background color, icon color)
3. **`MuiMenu/MuiMenuItem`** (`menu.ts`) - Handles dropdown menu appearance

This separation allows all Select components to automatically receive consistent styling without inline overrides.
