# Market Price Integration

## Overview

Fetching real-time market price for the token pair from Jupiter Price API and displaying it below the Initial Price field with an "Apply market price" button.

---

## User Prompts

> **Prompt 1:** Let's tackle this part of the requirement:
> ```
> The Initial price determines the initial price of the pool. It can be any arbitrary number but ideally it's close to the market price of the token pair. Use this API (https://dev.jup.ag/docs/price/v3) to get the price of the pair and display it below the initial price input to help the user
> ```
>
> Plan:
> - When there's a base token, fetch market price for the token pair (quote token/base token) along with fetching base token metadata
> - Show a box below the initial price field. Have an action inside the box with "Apply market price" that will apply the market price to "Initial Price" field.

> **Prompt 2:** The fetch market price API, `https://api.jup.ag/price/v3?ids=...`, is having a 401 authorize issue. Might need to add API key, check on how to generate the API key.

---

## Issues & Fixes

### Issue: 401 Unauthorized Error

**Problem:** Jupiter Price API at `api.jup.ag` requires an API key.

**Error:**
```
GET https://api.jup.ag/price/v3?ids=... 401 (Unauthorized)
```

**Solution:** Use the free Lite tier at `lite-api.jup.ag` which doesn't require authentication:
```
https://lite-api.jup.ag/price/v3?ids={mint1},{mint2}
```

**Note:** `lite-api.jup.ag` will be deprecated on December 31, 2025.

---

## Implementation Details

### Price Calculation

The API returns USD prices for each token. To calculate the pair price:

```typescript
// Quote token (e.g., SOL): $200.50
// Base token (e.g., COPE): $0.002391

marketPrice = baseTokenUsdPrice / quoteTokenUsdPrice
// COPE price in SOL = 0.002391 / 200.50 = 0.0000119 SOL per COPE
```

### React Query Hook

```typescript
const { data: marketPrice, isLoading: isPriceLoading } = useQuery({
  queryKey: ["marketPrice", baseTokenInfo?.address, quoteToken],
  queryFn: async () => {
    const response = await fetch(
      `https://lite-api.jup.ag/price/v3?ids=${quoteTokenMint},${baseTokenMint}`
    );
    const data = await response.json();

    const quotePrice = data[quoteTokenMint]?.usdPrice;
    const basePrice = data[baseTokenMint]?.usdPrice;

    return basePrice / quotePrice;
  },
  enabled: !!baseTokenInfo?.address,
  staleTime: 30 * 1000, // Cache for 30 seconds
});
```

---

## Generated/Modified Files

### Created
- `src/lib/constants.ts` - Added `QUOTE_TOKEN_MINTS` constant

### Modified
- `src/components/pool-sniper/pool-form.tsx` - Added market price fetching and display

---

## Constants Added

```typescript
// src/lib/constants.ts
export const QUOTE_TOKEN_MINTS: Record<string, string> = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
};
```

---

## UI Component

The Market Price Box appears below the Initial Price when a base token is selected:

**Features:**
- Shows "Market Price" label
- Displays price in monospace font with token pair suffix
- "Apply market price" button sets the Initial Price field
- Loading state while fetching
- Disabled button when price unavailable

**Styling:**
- Background: `rgba(70, 235, 128, 0.05)`
- Border: `rgba(70, 235, 128, 0.15)`
- Button uses the green accent color (`#46EB80`)

---

## API Reference

### Jupiter Price API V3

**Endpoint:** `https://lite-api.jup.ag/price/v3?ids={mint1},{mint2}`

**Response:**
```json
{
  "So11111111111111111111111111111111111111112": {
    "usdPrice": 200.5,
    "blockId": 348004026,
    "decimals": 9,
    "priceChange24h": 0.52
  },
  "8HGyAAB1yoM1ttS7pXjHMa3dukTFGQggnFFH3hJZgzQh": {
    "usdPrice": 0.002391,
    "blockId": 348004026,
    "decimals": 6,
    "priceChange24h": -0.08
  }
}
```

**Documentation:** https://dev.jup.ag/docs/price/v3

**API Tiers:**
- `lite-api.jup.ag` - Free, no API key required
- `api.jup.ag` - Requires API key from https://portal.jup.ag

**Reference:** https://dev.jup.ag/docs/api-setup
