# Generic Components Setup

## Overview

Setting up a reusable components folder structure with two components: `BaseTokenInput` (token mint address input with API fetching) and `PriceInput` (numeric input with +/- buttons and subscript notation).

---

## User Prompts

> **Prompt 1:** Suggest on where to create folder for generic components

> **Prompt 2:** I'm planning to include Base Token Input and Price Input here. Base Token Input expects mint token address, fetch and show the token details. Also will be adding a generic price field here (+- buttons, token pair (sol/cope) suffix, editable input that has shortcut notation for zeros) check `exam_docs/ai_prompts/requirements_grooming/06_*` file

---

## Key Decisions

### Folder Naming Convention

**Question:** Which naming convention would you prefer for the generic components folder?

**Options:**
- `ui` - Common in Next.js/shadcn projects, suggests primitive UI elements
- `common` - Indicates shared/reusable components across features
- `shared` - Similar to common, emphasizes cross-feature usage

**User Choice:** `common`

### Token Data Source

**Question:** For the Base Token Input, how should token data be fetched when a mint address is entered?

**Options:**
- Use MOCK_TOKENS only
- Jupiter Token API
- Solana RPC + Metaplex

**User Choice:** Jupiter Token API

### Subscript Notation Style

**Question:** Should the subscript notation (e.g., 0.0₄484) be displayed using actual Unicode subscript characters or styled HTML/CSS?

**Options:**
- Unicode subscripts (₀₁₂₃₄₅₆₇₈₉)
- CSS styled (`<sub>` tag or CSS)

**User Choice:** Unicode subscripts

---

## Generated Files

```
src/components/common/
├── index.ts                         # Barrel exports
├── base-token-input.tsx             # Token mint input component
├── price-input.tsx                  # Price input with +/- buttons
└── utils/
    └── format-subscript.ts          # Subscript notation utility
```

### File Paths
- `src/components/common/index.ts`
- `src/components/common/base-token-input.tsx`
- `src/components/common/price-input.tsx`
- `src/components/common/utils/format-subscript.ts`

---

## Component Specifications

### BaseTokenInput Props
```typescript
interface BaseTokenInputProps {
  value: string;                    // Mint address
  onChange: (value: string) => void;
  onTokenFetched?: (token: TokenInfo | null) => void;
  error?: string;
  placeholder?: string;
  label?: string;
}
```

### PriceInput Props
```typescript
interface PriceInputProps {
  value: number;
  onChange: (value: number) => void;
  quoteToken?: string;              // e.g., "SOL"
  baseToken?: string;               // e.g., "COPE"
  incrementPercent?: number;        // Default: 1 (for 1%)
  min?: number;
  max?: number;
  error?: string;
  label?: string;
}
```

---

## Reference Documents

- `exam_docs/ai_prompts/requirements_grooming/06_initial_price_notation_and_ux.md`
