# API Fetching Refactoring

## Overview

Consolidated scattered API fetching methods into a centralized service layer organized by domain, following Next.js best practices.

---

## User Prompts

> **Prompt 1:** There are API fetching methods that are scattered accross the components. Check Next best practice on where to put those (folder structure, etc.)

> **Prompt 2:** commit all changes

---

## Key Decisions

### API Service Layer Organization

**Question:** How would you like the API service layer to be organized?

**Options:**
1. **By domain (Recommended)** - Create service files per API domain (e.g., jupiter.service.ts, solana.service.ts). Best for this codebase size.
2. **Single api.ts file** - Put all API methods in one file. Simpler but less scalable.
3. **By feature** - Co-locate API calls with feature folders (e.g., pool-sniper/api.ts). Good for larger teams.

**User Choice:** By domain (Recommended)

---

## Problem Analysis

### Scattered API Calls Found

| File | API | Issue |
|------|-----|-------|
| `src/components/common/base-token-input.tsx:33-56` | Jupiter Token Search | fetch embedded in component |
| `src/components/pool-sniper/pool-form.tsx:30-50` | Jupiter Price API | fetch embedded in component |
| `src/hooks/useWalletBalance.ts` | Solana RPC | Already well-structured (no changes needed) |

### Issues Identified
1. **No centralized API layer** - fetch calls embedded directly in components
2. **Hardcoded endpoints** - API URLs scattered across files
3. **No error handling wrapper** - Each component handles errors independently
4. **Tight coupling** - Components directly depend on specific API implementations

---

## Generated/Modified Files

### Created
- `src/services/jupiter.service.ts` - Jupiter API methods (searchToken, getTokenPrices)
- `src/services/index.ts` - Barrel export for services
- `src/hooks/queries/useTokenInfo.ts` - Token search query hook
- `src/hooks/queries/useMarketPrice.ts` - Market price query hook
- `src/hooks/queries/index.ts` - Barrel export for query hooks

### Modified
- `src/lib/constants.ts` - Added `API_ENDPOINTS` constant
- `src/components/common/base-token-input.tsx` - Refactored to use `useTokenInfo` hook
- `src/components/pool-sniper/pool-form.tsx` - Refactored to use `useMarketPrice` hook

---

## Implementation Details

### New Folder Structure

```
/src/
├── /services/                      # NEW: API service layer
│   ├── jupiter.service.ts          # Jupiter API methods
│   └── index.ts                    # Barrel export
├── /hooks/
│   ├── /queries/                   # NEW: React Query hooks
│   │   ├── useTokenInfo.ts
│   │   ├── useMarketPrice.ts
│   │   └── index.ts
│   └── useWalletBalance.ts         # Keep as-is
├── /lib/
│   └── constants.ts                # Added API_ENDPOINTS
└── /components/                    # Consume hooks only (no embedded fetch)
```

### API Endpoints Constant

```typescript
// src/lib/constants.ts
export const API_ENDPOINTS = {
  JUPITER_TOKEN_SEARCH: "https://lite-api.jup.ag/tokens/v2/search",
  JUPITER_PRICE: "https://lite-api.jup.ag/price/v3",
} as const;
```

### Jupiter Service

```typescript
// src/services/jupiter.service.ts
import { API_ENDPOINTS } from "@/lib/constants";

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

export interface PriceData {
  [tokenMint: string]: {
    usdPrice: number;
  };
}

export async function searchToken(mintAddress: string): Promise<TokenInfo> {
  const response = await fetch(
    `${API_ENDPOINTS.JUPITER_TOKEN_SEARCH}?query=${mintAddress}`
  );

  if (!response.ok) {
    throw new Error("Token not found");
  }

  const data = await response.json();
  const token = data.find((t: { id: string }) => t.id === mintAddress);

  if (!token) {
    throw new Error("Token not found");
  }

  return {
    address: token.id,
    symbol: token.symbol,
    name: token.name,
    decimals: token.decimals,
    logoURI: token.icon,
  };
}

export async function getTokenPrices(tokenMints: string[]): Promise<PriceData> {
  const response = await fetch(
    `${API_ENDPOINTS.JUPITER_PRICE}?ids=${tokenMints.join(",")}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch token prices");
  }

  return response.json();
}

export const jupiterService = {
  searchToken,
  getTokenPrices,
};
```

### Query Hooks

```typescript
// src/hooks/queries/useTokenInfo.ts
export function useTokenInfo(mintAddress: string, options: UseTokenInfoOptions = {}) {
  const shouldFetch = isValidMintAddress(mintAddress);

  return useQuery<TokenInfo, Error>({
    queryKey: ["token", mintAddress],
    queryFn: () => jupiterService.searchToken(mintAddress),
    enabled: shouldFetch && (options.enabled ?? true),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: false,
  });
}
```

```typescript
// src/hooks/queries/useMarketPrice.ts
export function useMarketPrice({ baseTokenMint, quoteToken }: UseMarketPriceOptions) {
  const quoteTokenMint = QUOTE_TOKEN_MINTS[quoteToken];

  return useQuery<number | null, Error>({
    queryKey: ["marketPrice", baseTokenMint, quoteToken],
    queryFn: async () => {
      if (!baseTokenMint || !quoteTokenMint) return null;

      const data = await jupiterService.getTokenPrices([quoteTokenMint, baseTokenMint]);

      const quotePrice = data[quoteTokenMint]?.usdPrice;
      const basePrice = data[baseTokenMint]?.usdPrice;

      if (!quotePrice || !basePrice) return null;

      return basePrice / quotePrice;
    },
    enabled: !!baseTokenMint && !!quoteTokenMint,
    staleTime: 30 * 1000, // Cache for 30 seconds
  });
}
```

### Component Refactoring

**Before (base-token-input.tsx):**
```typescript
const fetchTokenInfo = async (mintAddress: string): Promise<TokenInfo> => {
  const response = await fetch(
    `https://lite-api.jup.ag/tokens/v2/search?query=${mintAddress}`
  );
  // ... embedded logic
};

const { data: tokenInfo } = useQuery({
  queryKey: ["token", inputValue],
  queryFn: () => fetchTokenInfo(inputValue),
  // ...
});
```

**After:**
```typescript
import { useTokenInfo } from "@/hooks/queries";

const { data: tokenInfo, isLoading, isError } = useTokenInfo(inputValue);
```

---

## Commit

```
refactor: centralize API fetching into services layer

Extract scattered API calls from components into a centralized
architecture following Next.js best practices:

- Add API_ENDPOINTS constants for Jupiter API URLs
- Create jupiter.service.ts with searchToken and getTokenPrices methods
- Add useTokenInfo and useMarketPrice query hooks
- Refactor components to consume hooks instead of embedding fetch logic
```

---

## Benefits

1. **Centralized endpoints** - Single source of truth in `constants.ts`
2. **Reusable services** - `jupiterService` can be used anywhere
3. **Clean components** - Components only consume hooks, no embedded fetch logic
4. **Better testability** - Services and hooks can be mocked independently
5. **Scalable architecture** - Easy to add new services (e.g., `solana.service.ts`)
