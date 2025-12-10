# RPC, Helius, and Solana Mainnet

## Prompt

> I'm taking a technical exam. There is an instruction for "This test is intended only for Solana Mainnet network - no need to bother with Devnet support. You will need to setup the connection and RPC (can use any or get a free one from https://www.helius.dev/)."
>
> Can you explain to me whats an RPC, helius, and Solana Mainnet Network

---

## Summary

### Solana Mainnet Network

- The live, production blockchain network where real transactions happen with real SOL tokens
- As opposed to **Devnet** (test network with fake tokens) or **Testnet** (for validators)
- The exam requires working with Mainnet, meaning real blockchain data

### RPC (Remote Procedure Call)

- An API URL/endpoint that allows applications to communicate with the Solana blockchain
- Used to:
  - Read blockchain data (account balances, transaction history, token info)
  - Submit transactions
  - Query program state
- Example: `https://api.mainnet-beta.solana.com`
- Think of it as the "gateway" between your code and the blockchain

### Helius

- A company providing Solana RPC infrastructure
- Offers:
  - Fast, reliable RPC endpoints
  - Enhanced APIs (NFT data, transaction parsing, webhooks)
  - Free tier for developers
- Why use Helius over public RPC?
  - Public Solana RPC (`api.mainnet-beta.solana.com`) has rate limits and can be slow
  - Helius offers better performance and higher rate limits

### Setup Steps

1. Go to https://www.helius.dev/
2. Create a free account
3. Get your API key
4. RPC URL format: `https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY`

### Code Example

```typescript
import { Connection } from '@solana/web3.js';

const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY');
```
