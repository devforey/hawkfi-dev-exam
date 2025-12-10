# Token Mint Address

## Prompt

> What is "mint address"?

---

## Summary

### Definition

A **mint address** is the unique identifier (like an ID number) for a specific token on Solana. Every token created on Solana has one.

### Analogy

| Real World | Solana Equivalent |
|------------|-------------------|
| Company's stock ticker (AAPL, GOOGL) | Token symbol (SOL, USDC) |
| Company's official registration number | **Mint address** |

### Why It Exists

Anyone can create a token called "USDC" or "BONK" on Solana - including scammers. The **mint address** is the only way to verify you're dealing with the *real* token.

**Real USDC on Solana:**
```
EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

Any other address claiming to be "USDC" is fake.

### Why Called "Mint"?

The term comes from the process of creating new tokens - called **minting** (like minting coins). The mint address points to the program that controls:
- Creating (minting) new tokens
- The token's total supply
- Decimal places
- Who can mint more

### Example Mint Addresses

| Token | Mint Address |
|-------|--------------|
| USDC | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |
| BONK | `DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263` |
| Wrapped SOL | `So11111111111111111111111111111111111111112` |

### Where to Find Mint Addresses

1. **Solana Explorer** - https://explorer.solana.com
2. **Solscan** - https://solscan.io
3. **Jupiter** - https://jup.ag (search for a token, check its details)

### For the Exam

The "Input base token" field expects a **mint address**, not a wallet address. Validation should check if it's a valid Solana address format (base58 string, 32-44 characters).
