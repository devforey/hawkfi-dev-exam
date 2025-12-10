# New Position Form

## Prompt

> There is another form called "New Position" below the Pool Form. Below is the requirements:
>
> **NEW POSITION**
> - Create the **New Position** forms with input validations and display warnings when necessary
>     - `min price`, `max price` , and `deposit amount` should only allow numbers
>     - `min price` cannot be greater `max price`
>     - `max price` cannot be less than `min price`
> - Select a `HawkFi Preset` using the dropdown
>     - The preset settings should apply to the forms when selected
>     - for example: +10% upper range will automatically set the max price to +10% of the initial price inputted
> - Deposit amounts should display a warning if the amount inputted is greater than the actual token balance in the user's wallet
>     - Display the the SOL balance of your wallet
>     - Display the balances of the other token in your wallet as well
>     - Note: For the sake of testing don't let this block the submit button
> - `Min price` and `max price` inputs follow similar behavior to the `initial price`, including the +- buttons.
>     - default values are +-10% from the `initial price`
> - Be able to reset the price range
> - Display the number of bins depending on the price range, refer to the Meteora DLMM docs/repo to get the number of bins
> - Allow resetting of all fields
> - Submit button should simulate a mock transaction where toasts are shown to display loading/success/error states.
>     - On submission generate 2 random keypairs to simulate creation of the `pool address` and `position address` to be displayed
>     - At the very least log or display all the info the user inputted somewhere in the UI or even better display "mock positions" whenever a user successfully "creates" a mock position

---

## Summary

### Form Fields

| Field | Validation | Notes |
|-------|------------|-------|
| **Preset (Optional)** | Dropdown selection | Quick buttons + dropdown for full list |
| **Deposit Amount** | Numbers only, warn if > wallet balance | Don't block submit |
| **Min Price** | Numbers only, cannot be > max price | Default: -10% of initial price |
| **Max Price** | Numbers only, cannot be < min price | Default: +10% of initial price |
| **Number of Bins** | Calculated automatically | Based on price range, from Meteora DLMM |

### Preset Configuration

Presets are defined in `src/lib/constants.ts` under `POSITION_PRESETS`:

```typescript
POSITION_PRESETS = [
  {
    id: 1,
    code: "HFI-001",
    name: "High Frequency Liquidity (HFL)",
    upperPercentage: 0.5,   // +0.5% max price
    lowerPercentage: 0.5,   // -0.5% min price
    solAmount: 1,
  },
  {
    id: 2,
    code: "HFI-002",
    name: "High Frequency Liquidity (HFL) Turbo",
    upperPercentage: 0.25,
    lowerPercentage: 0.25,
    solAmount: 2,
  },
  {
    id: 3,
    code: "HFI-004",
    name: "Multiday Cook Up (MCU)",
    upperPercentage: 15,
    lowerPercentage: 15,
    solAmount: 5,
  },
  {
    id: 4,
    code: "HFI-005",
    name: "TGE Sniper",
    upperPercentage: 5,
    lowerPercentage: 5,
    solAmount: 0.5,
  },
]
```

### Figma Quick Preset Buttons (P1, P1, P1)

The three "P1" labels in Figma are placeholders. Implementation options:
- Show first 3 presets as quick buttons (HFI-001, HFI-002, HFI-004)
- Or create separate quick presets for the buttons

### Deposit Amount Options (from Figma)

Quick-select buttons for deposit amount (NOT related to HawkFi Presets):

| Button | Purpose |
|--------|---------|
| 0.5 SOL | Quick select: deposit 0.5 SOL |
| 1 SOL | Quick select: deposit 1 SOL (default) |
| 5 SOL | Quick select: deposit 5 SOL |
| CUSTOM | Allow manual input of any amount |

**Why quick-select buttons exist:**
- Common UX pattern for convenience (similar to tipping apps: $1, $2, $5, Custom)
- User doesn't have to type for common amounts
- "CUSTOM" allows flexibility when presets don't fit

**CUSTOM option:**
- Allows user to enter amounts for SOL and/or the base token
- No Figma design provided for this expanded form
- **Lower priority** - implement basic input fields if time permits

**Interaction with HawkFi Presets:**
- `POSITION_PRESETS` also have a `solAmount` field
- When a HawkFi preset is selected, it sets the deposit amount too:
  - HFI-001 → 1 SOL
  - HFI-002 → 2 SOL
  - HFI-004 → 5 SOL
  - HFI-005 → 0.5 SOL
- Deposit buttons and presets can override each other (last selection wins)

### Wallet Balance Display

- Show user's SOL balance
- Show user's balance of the base token (e.g., COPE)
- Warning (not blocking) if deposit > balance

### Price Range Behavior

- Default: ±10% from initial price
- +/- buttons: Use percentage-based increment (same as initial price)
- "RESET PRICE RANGE" button: Resets to ±10% default

### Number of Bins Calculation

Refer to Meteora DLMM documentation to calculate bins based on:
- Min price
- Max price
- Bin step (from pool form)

### Submit Behavior (Mock Transaction)

**Frontend-only simulation:**
1. Show loading toast
2. Generate 2 random keypairs using `Keypair.generate()`:
   - Pool address
   - Position address
3. Show success toast with addresses (or error toast if simulating failure)
4. Store position in local state
5. Display "mock positions" list in UI

---

## Questions & Assumptions

### Q1: What are the P1 button presets?

**Answer:** Found in `src/lib/constants.ts` - `POSITION_PRESETS` array contains 4 presets. The P1/P1/P1 buttons are Figma placeholders.

**Assumption:** Will use first 3 presets as quick buttons, full list in dropdown.

### Q2: Is "Mock Transaction" frontend-only?

**Answer:** Yes, based on requirements language ("simulate", "mock", "generate random keypairs").

**Implementation:**
- No actual Phantom wallet transaction
- Generate keypairs with `@solana/web3.js`
- Store in local memory/state
- Display toast notifications for loading/success/error

### Q3: Where is "Reset All Fields" button?

**Observation:** Figma only shows "RESET PRICE RANGE" button. Requirements say "Allow resetting of all fields."

**Assumption:** Will add a "Reset All" button (likely near Cancel button or as a link). This resets:
- Preset selection
- Deposit amount (back to default 1 SOL)
- Min/Max price (back to ±10%)

**To Document:** Deviation from Figma - added "Reset All" button for full form reset functionality.

### Q4: Should fields reset when Base/Quote Token changes?

**Prompt:**
> Since the two forms depends on Base and Quote Token, will it be reasonable to reset some of the fields when any of them changed?
>
> Should we add friction when user tries to change the base or quote token if the fields depending on them already have values?

**Analysis:** When Base Token or Quote Token changes, these fields become invalid:

| Field | Why It's Affected |
|-------|-------------------|
| Initial Price | Price is specific to the pair (COPE/SOL vs COPE/USDC) |
| Min Price | Derived from initial price |
| Max Price | Derived from initial price |
| Number of Bins | Calculated from price range |
| Token Balance Display | Different tokens = different balances |

**Decision: Reset with conditional friction**

| Scenario | Behavior |
|----------|----------|
| Fields are empty/default | Reset silently, no friction |
| User has entered custom values | Show confirmation dialog |

**Confirmation dialog example:**
```
"Changing the quote token will reset your price settings. Continue?"
[Cancel] [Continue]
```

**UX Flow:**
```
User changes Quote Token (SOL → USDC)
        ↓
Check: Are price fields modified from defaults?
        ↓
   ┌────┴────┐
   No        Yes
   ↓          ↓
Reset      Show confirmation
silently   "This will reset price fields. Continue?"
                ↓
          [Cancel] [Continue]
                     ↓
                  Reset fields
```

**What Gets Reset vs Preserved:**

| Reset | Preserve |
|-------|----------|
| Initial Price | Deposit Amount (SOL values still valid) |
| Min Price | Selected Preset (can re-apply after) |
| Max Price | Base Fee |
| Number of Bins | Bin Step |
