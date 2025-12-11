# BaseTokenInput Component

## Overview

A reusable input component that accepts a Solana token mint address, fetches token metadata from Jupiter Token API, and displays token details (logo, symbol, name, decimals).

---

## User Prompts

> **Prompt 1:** Use `@src/components/common/base-token-input.tsx` in `@src/components/pool-sniper/pool-form.tsx` Input base token field

> **Prompt 2:** The Jupiter API is having an issue `https://tokens.jup.ag/token/8HGyAAB1yoM1ttS7pXjHMa3dukTFGQggnFFH3hJZgzQh` net::ERR_NAME_NOT_RESOLVED

> **Prompt 3:** (Provided actual API response structure showing `id` and `icon` fields instead of `mint` and `logoURI`)

---

## Issues & Fixes

### Issue 1: Deprecated API Endpoint

**Problem:** Original endpoint `https://tokens.jup.ag/token/{mint}` was not resolving (DNS error).

**Solution:** Updated to Jupiter Token API V2:
```
https://lite-api.jup.ag/tokens/v2/search?query={mint}
```

### Issue 2: Response Structure Mismatch

**Problem:** API response uses different field names than expected.

**Actual Response:**
```json
[
  {
    "id": "8HGyAAB1yoM1ttS7pXjHMa3dukTFGQggnFFH3hJZgzQh",
    "name": "COPE",
    "symbol": "COPE",
    "icon": "https://raw.githubusercontent.com/.../logo.png",
    "decimals": 6
  }
]
```

**Fix:** Updated field mappings:
- `token.mint` → `token.id`
- `token.logoURI` → `token.icon`

---

## Generated/Modified Files

### Created
- `src/components/common/base-token-input.tsx`

### Modified
- `src/components/pool-sniper/pool-form.tsx` - Integrated BaseTokenInput

---

## API Reference

### Jupiter Token API V2

**Endpoint:** `https://lite-api.jup.ag/tokens/v2/search?query={mint_address}`

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Token mint address |
| `symbol` | string | Token symbol (e.g., "COPE") |
| `name` | string | Token name |
| `decimals` | number | Token decimal places |
| `icon` | string | URL to token logo |

**Documentation:** https://dev.jup.ag/docs/token-api/v2

---

## Component Features

- Validates Solana base58 address format (32-44 characters)
- Shows loading spinner while fetching
- Displays token info card when found (logo, symbol, name, decimals)
- Error state for invalid/not found tokens
- Clear button to reset input
- Uses React Query for caching (5 min stale time)

---

## Test Token

**COPE Token Mint Address:**
```
8HGyAAB1yoM1ttS7pXjHMa3dukTFGQggnFFH3hJZgzQh
```
