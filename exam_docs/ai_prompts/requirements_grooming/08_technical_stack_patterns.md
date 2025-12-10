# Technical Stack & Patterns

## Prompt

> Not related to user requirements but for technical requirements.
>
> The codebase is using Nextjs and there will be APIs needed for the form (e.g getting token pair market price). Is there an example of API layer pattern in the codebase or will it be new.
>
> Are there form libraries already or we're ok using any form library?
>
> Also how is the MUI library setup?

---

## Summary

### API Layer

**Status: No existing API pattern**

- No `/src/app/api/` directory exists
- No fetch/axios calls found in codebase
- Only reference: `// Mock token data - in a real app, this would come from an API`

**Recommendation:** Create new API layer. Options:

| Approach | Pros | Cons |
|----------|------|------|
| Next.js API Routes (`/app/api/`) | Server-side, hides API keys | Extra hop |
| Direct client fetch | Simple, fewer files | Exposes API calls, CORS issues |
| React Query + fetch | Caching, loading states built-in | Already have `@tanstack/react-query` installed |

**Suggested pattern:** Use React Query (already installed) with either:
1. Direct fetch to Jupiter API (if CORS allows)
2. Next.js API route as proxy (if CORS blocked or need to hide keys)

```typescript
// Example with React Query
const { data: price } = useQuery({
  queryKey: ['price', baseToken, quoteToken],
  queryFn: () => fetchPriceFromJupiter(baseToken, quoteToken),
});
```

---

### Form Libraries

**Status: No form library installed**

Available in `package.json`:
- `zod` - Schema validation (already installed)

**Not installed:**
- react-hook-form
- formik

**Recommendation:** Options:

| Option | Pros | Cons |
|--------|------|------|
| **react-hook-form + zod** | Lightweight, great DX, zod already installed | Need to install |
| **formik** | Popular, well-documented | Heavier, no zod integration |
| **Plain React state** | No dependencies | More boilerplate, manual validation |

**Suggested:** Install `react-hook-form` with `@hookform/resolvers` to leverage existing `zod`:

```bash
npm install react-hook-form @hookform/resolvers
```

```typescript
// Example usage
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  initialPrice: z.number().positive(),
  minPrice: z.number().positive(),
  maxPrice: z.number().positive(),
}).refine(data => data.minPrice < data.maxPrice, {
  message: "Min price must be less than max price",
});
```

---

### MUI Setup

**Status: Fully configured**

**Installed packages:**
- `@mui/material` - Core components
- `@mui/icons-material` - Icons
- `@mui/x-charts` - Charts
- `@mui/x-data-grid` - Data tables
- `@emotion/react` & `@emotion/styled` - Styling engine
- `@mui/material-nextjs` - Next.js integration

**Theme setup** (`src/theme/index.tsx`):

```typescript
// HawksightThemeProvider wraps the app
<AppRouterCacheProvider options={{ key: "css" }}>
  <ThemeProvider theme={hawksightTheme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
</AppRouterCacheProvider>
```

**Current theme configuration:**
- Custom breakpoints (`src/theme/breakpoints.ts`)
- Custom shadows (`src/theme/shadows.ts`)
- Ripple disabled on buttons
- Elevation disabled on buttons
- TODO comment: palette and typography not yet added

**Usage:** Just import and use MUI components:

```typescript
import { Button, TextField, Select } from '@mui/material';
```

---

### Other Relevant Libraries

| Library | Purpose | Status |
|---------|---------|--------|
| `@tanstack/react-query` | Data fetching, caching | Installed, configured in provider |
| `zustand` | State management | Installed, not yet used |
| `decimal.js` | Precise decimal math | Installed, used in `dlmm.ts` |
| `@solana/web3.js` | Solana blockchain interaction | Installed |
| `@jup-ag/wallet-adapter` | Jupiter wallet adapter | Installed, configured |

---

### Solana/Wallet Setup

**Provider hierarchy** (`src/app/layout.tsx`):

```
HawksightThemeProvider (MUI)
  └── HawksightClientProvider
        └── QueryClientProvider (React Query)
              └── ConnectionProvider (Solana RPC)
                    └── UnifiedWalletProvider (Wallet)
```

**RPC Endpoint:** `process.env.NEXT_PUBLIC_MAINNET_RPC`

**Supported wallets:**
- Phantom
- Solflare

---

## Decisions to Make

| Decision | Options | Recommendation |
|----------|---------|----------------|
| API pattern | API routes vs direct fetch | Start with direct fetch + React Query, add API route if needed |
| Form library | react-hook-form vs plain state | Install react-hook-form (works with existing zod) |
| State management | zustand vs React Context | Use zustand for mock positions storage |
