# Liquidity Pools and New Pool Form

## Prompts

### Prompt 1: New Pool Form Fields

> The instruction in exam is:
> ```
> NEW POOL
> - Allow selection for quote token between SOL or USDC
> - Create the **New Pool** forms with input validations and display warnings when necessary
>     - The `token address input` should check if it's a valid Solana address
>     - `Bin steps` and `base fees` can only be selected from dropdowns
>     - `Initial price` should only allow numbers
> - The `Initial price` determines the initial price of the pool...
> - Allow the input buttons +- to change the price
> ```
>
> From my understanding (please correct me), the Quote Token options (SOL or USDC) is not clear for me what they are for. token address input = Solana Wallet Address? Not sure whats a "Bin steps" and "Base fees" is. Also not sure what the initial price is for

### Prompt 2: What is a Liquidity Pool?

> Ok, what is this "New Pool" for? Whats the use of it?

### Prompt 3: What is a Memecoin?

> What is a memecoin?

---

## Summary

### What is a Liquidity Pool?

A liquidity pool is a **smart contract holding two tokens** that people can trade against - no need to find a buyer/seller directly.

```
┌─────────────────────────────┐
│      SOL-USDC Pool          │
│                             │
│   💰 10,000 SOL             │
│   💵 1,500,000 USDC         │
│                             │
└─────────────────────────────┘
```

**How it works:**
1. You send 1 SOL to the pool
2. The pool sends you ~150 USDC back (based on the ratio)
3. Pool now has 10,001 SOL and 1,499,850 USDC

The price is determined by the **ratio** of tokens in the pool.

### Liquidity Providers (LPs)

People who deposit both tokens into the pool. They earn fees from every trade (e.g., 0.3% per swap).

### New Pool Form Purpose

Creates a **brand new liquidity pool** for a token pair that doesn't exist yet.

**Use case:**
1. You launch a new token called "MYTOKEN"
2. No one can trade it yet because there's no pool
3. You create a MYTOKEN-SOL pool with initial liquidity
4. Now anyone can swap MYTOKEN ↔ SOL

---

## Form Field Explanations

| Field | Purpose |
|-------|---------|
| **Quote Token** (SOL/USDC) | The token used to price the base token |
| **Base Token Input** | The **mint address** of the token to pair (NOT wallet address) |
| **Bin Step** | Price granularity for DLMM pools (smaller = more precise) |
| **Base Fee** | Trading fee percentage charged on swaps (goes to LPs) |
| **Initial Price** | Starting exchange rate for the pair |

### Bin Steps (DLMM-specific)

Specific to **Dynamic Liquidity Market Maker** pools (likely Meteora protocol).
- Defines price granularity between "bins" (price ranges)
- Smaller bin step = more precise pricing
- Common values: 1, 2, 5, 10, 20, 50, 100
- Example: Bin step of 10 means each bin covers a 0.1% price range

### Base Fees

The trading fee charged on swaps:
- Goes to liquidity providers as profit
- Common values: 0.1%, 0.25%, 0.5%, 1%

### Initial Price

When creating a new pool, you must set a **starting price** for the pair.

Example: Creating a COPE-SOL pool
- If COPE is worth ~0.001 SOL, set initial price to `0.001`
- Use Jupiter API to fetch current market price as reference
- If set incorrectly, arbitrage bots would drain your pool

---

## What is a Memecoin?

A cryptocurrency based on internet memes, jokes, or viral trends rather than having real utility.

**Examples:**
| Memecoin | Origin |
|----------|--------|
| DOGE | Shiba Inu "Doge" meme |
| BONK | Solana's dog-themed memecoin |
| WIF | Dog with a hat meme |
| PEPE | Pepe the Frog meme |

**Why relevant:** Memecoins are a huge part of Solana's ecosystem. The "New Pool" form is exactly what a memecoin creator would use to make their token tradeable.

**Degen:** Slang for people who gamble on high-risk memecoin trades hoping for massive gains.
