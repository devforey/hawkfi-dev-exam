# Position Form Infrastructure

## Overview

Setting up the infrastructure for the New Position form including validation schema, DLMM bins calculation utility, wallet balance hook, and mock positions store.

---

## User Prompts

> **Prompt 1:** Let's tackle New Position Form requirements
>
> Requirements:
> - Create the **New Position** forms with input validations and display warnings when necessary
> - `min price`, `max price`, and `deposit amount` should only allow numbers
> - `min price` cannot be greater than `max price`
> - `max price` cannot be less than `min price`
> - Display the number of bins depending on the price range, refer to the Meteora DLMM docs/repo
> - Submit button should simulate a mock transaction where toasts are shown to display loading/success/error states
> - On submission generate 2 random keypairs to simulate creation of the `pool address` and `position address`

> **Prompt 2:** Check `@exam_docs/ai_prompts/requirements_grooming/07_new_position_form.md` for technical and detailed requirement for the form.

---

## Key Decisions

### Preset Button Labels

**Question:** For the quick preset buttons (shown as P1, P1, P1 in Figma), what labels should they display?

**Options:**
- Preset codes (HFI-001, HFI-002, HFI-004)
- Short names (HFL, HFL Turbo, MCU)
- Keep as P1, P2, P3

**User Choice:** Short names, update constants.ts to have the shortName field

### Mock Positions Storage

**Question:** How should we handle the mock transaction submission and display the results?

**Options:**
- Simple: Log + Toast only - Log form data to console, show pool/position addresses in success toast
- Full: Mock positions list - Store and display mock positions in a list UI

**User Choice:** Full: Mock positions list

---

## Generated/Modified Files

### Created
- `src/hooks/useWalletBalance.ts` - SOL balance fetching hook
- `src/store/mockPositionsStore.ts` - Zustand store for mock positions

### Modified
- `src/components/pool-sniper/schema.ts` - Added position form validation
- `src/lib/constants.ts` - Added shortName to POSITION_PRESETS
- `src/utils/dlmm.ts` - Implemented calculateNumberOfBins function

---

## Implementation Details

### Position Form Schema

Zod schema with cross-field validation for min/max price:

```typescript
export const positionFormSchema = z
  .object({
    presetId: z.number().nullable(),
    depositAmount: z.number().min(0, "Deposit amount must be positive"),
    depositOption: z.enum(["0.5", "1", "5", "CUSTOM"]),
    minPrice: z.number().min(0, "Min price must be positive"),
    maxPrice: z.number().min(0, "Max price must be positive"),
  })
  .refine((data) => data.minPrice <= data.maxPrice, {
    message: "Min price cannot be greater than max price",
    path: ["minPrice"],
  })
  .refine((data) => data.maxPrice >= data.minPrice, {
    message: "Max price cannot be less than min price",
    path: ["maxPrice"],
  });
```

### POSITION_PRESETS with shortName

```typescript
export const POSITION_PRESETS = [
  {
    id: 1,
    code: "HFI-001",
    name: "High Frequency Liquidity (HFL)",
    shortName: "HFL",
    upperPercentage: 0.5,
    lowerPercentage: 0.5,
    solAmount: 1,
  },
  // ... more presets
];
```

### DLMM Bins Calculation

Formula based on Meteora DLMM documentation:

```typescript
// binId = log(price) / log(1 + binStep/10000)
// numberOfBins = upperBinId - lowerBinId + 1

export function calculateNumberOfBins(
  minPrice: number | string | Decimal,
  maxPrice: number | string | Decimal,
  binStep: number
): number {
  const min = new Decimal(minPrice);
  const max = new Decimal(maxPrice);

  if (min.lte(0) || max.lte(0) || min.gte(max) || binStep <= 0) {
    return 0;
  }

  const binStepDecimal = new Decimal(binStep).div(BASIS_POINT_MAX);
  const base = new Decimal(1).plus(binStepDecimal);

  const lowerBinId = Math.floor(Decimal.ln(min).div(Decimal.ln(base)).toNumber());
  const upperBinId = Math.ceil(Decimal.ln(max).div(Decimal.ln(base)).toNumber());

  return Math.max(0, upperBinId - lowerBinId + 1);
}
```

### Wallet Balance Hook

Uses React Query for caching with 30s stale time:

```typescript
export const useWalletBalance = () => {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();

  const { data: balance, isLoading, error, refetch } = useQuery({
    queryKey: ["walletBalance", publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey || !connection) return null;
      const lamports = await connection.getBalance(publicKey);
      return lamports / LAMPORTS_PER_SOL;
    },
    enabled: connected && !!publicKey && !!connection,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });

  return { balance, isLoading, error, refetch, connected };
};
```

### Mock Positions Store

Zustand store for session persistence:

```typescript
interface MockPosition {
  id: string;
  poolAddress: string;
  positionAddress: string;
  baseToken: string;
  quoteToken: string;
  minPrice: number;
  maxPrice: number;
  depositAmount: number;
  numberOfBins: number;
  createdAt: Date;
}

export const useMockPositionsStore = create<MockPositionsStore>((set) => ({
  positions: [],
  addPosition: (position) =>
    set((state) => ({ positions: [position, ...state.positions] })),
  clearPositions: () => set({ positions: [] }),
}));
```

---

## Reference Documents

- `exam_docs/ai_prompts/requirements_grooming/07_new_position_form.md`
- Meteora DLMM Documentation: https://docs.meteora.ag/developer-guide/guides/dlmm/overview
