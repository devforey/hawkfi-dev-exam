# Trading Pairs (SOL-USDC)

## Prompt

> There's this instruction "Use the SOL-USDC pair but feel free to change if you have any preference as long as either SOL or USDC are the quote tokens."
>
> Whats SOL-USDC?

---

## Summary

### What is SOL-USDC?

A **trading pair** representing the exchange rate between two tokens:
- **SOL** - Solana's native cryptocurrency
- **USDC** - A stablecoin pegged to the US Dollar (1 USDC ≈ $1)

### Trading Pair Terminology

In a pair like **SOL-USDC**:

| Term | Token | Meaning |
|------|-------|---------|
| **Base token** | SOL | The token being priced |
| **Quote token** | USDC | The token used to express the price |

Example: SOL-USDC = 150 means **1 SOL costs 150 USDC** (roughly $150)

### Exam Requirement Interpretation

**Acceptable pairs** (SOL or USDC as quote):
- SOL-USDC ✓
- BTC-USDC ✓
- BTC-SOL ✓
- ETH-USDC ✓
- BONK-SOL ✓

**Not acceptable:**
- BONK-WIF ✗ (neither SOL nor USDC as quote)

### Why SOL or USDC as Quote?

- **USDC** - Stable dollar value, easy to understand pricing
- **SOL** - Native Solana token, commonly used on Solana DEXs

These are the most liquid and commonly used quote tokens on Solana.
