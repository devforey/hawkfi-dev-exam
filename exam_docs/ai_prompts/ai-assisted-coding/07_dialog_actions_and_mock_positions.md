# Dialog Actions and Mock Positions

## Overview

Updates to the dialog structure with proper DialogActions, form submission handling via `useImperativeHandle`, mock transaction simulation, and the PositionList component for displaying created positions.

---

## User Prompts

> **Prompt 1:** In Step 7, create a PositionListComponent and use it directly in pool-sniper/page.tsx instead of adding it in PoolSniperForm

> **Prompt 2:** In Step 7, the dialog should still be a fullScreen dialog

> **Prompt 3:** *[Figma reference showing dialog with Cancel button on left and "Input new pool details" button on right]*

---

## Key Decisions

### Actions Location

**Question:** Where should the Cancel and Submit actions be placed?

**Options:**
- Inside the PoolSniperForm component
- In DialogActions in page.tsx (separate from form)

**User Choice:** DialogActions in page.tsx, using `forwardRef` and `useImperativeHandle` to expose form submission

### PositionList Placement

**Question:** Where should the mock positions list be displayed?

**Options:**
- Inside the fullScreen dialog
- As a separate component in page.tsx (outside dialog)

**User Choice:** Separate component in page.tsx, visible when dialog is closed

### Dialog Style

**Implementation:** Keep fullScreen dialog with:
- DialogContent for scrollable form content
- DialogActions as sticky footer with Cancel/Submit buttons

---

## Generated/Modified Files

### Created
- `src/components/pool-sniper/position-list.tsx` - Mock positions display component

### Modified
- `src/app/pool-sniper/page.tsx` - Dialog structure, Snackbar notifications
- `src/components/pool-sniper/pool-sniper-form.tsx` - forwardRef with submit handler

---

## Implementation Details

### Form Submission via forwardRef

Using `useImperativeHandle` to expose form methods to parent:

```typescript
export interface PoolSniperFormRef {
  submitForm: () => Promise<{
    success: boolean;
    poolAddress?: string;
    positionAddress?: string;
    error?: string;
  }>;
  resetForm: () => void;
}

export const PoolSniperForm = forwardRef<PoolSniperFormRef>((_, ref) => {
  const methods = useForm<PoolSniperFormValues>({...});

  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      const isValid = await methods.trigger();
      if (!isValid) {
        return { success: false, error: "Form validation failed" };
      }

      const data = methods.getValues();

      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate random keypairs for mock addresses
      const poolKeypair = Keypair.generate();
      const positionKeypair = Keypair.generate();

      // Add to mock positions store
      addPosition({
        id: crypto.randomUUID(),
        poolAddress: poolKeypair.publicKey.toString(),
        positionAddress: positionKeypair.publicKey.toString(),
        // ... other position data
      });

      return {
        success: true,
        poolAddress: poolKeypair.publicKey.toString(),
        positionAddress: positionKeypair.publicKey.toString(),
      };
    },
    resetForm: () => methods.reset(),
  }));
});
```

### Dialog Structure with Actions

```typescript
<Dialog fullScreen open={open} onClose={handleClose}>
  <AppBar>
    <Toolbar>
      <IconButton onClick={handleClose}><CloseIcon /></IconButton>
      <Typography>Pool Sniper</Typography>
    </Toolbar>
  </AppBar>

  <DialogContent sx={{ flex: 1, overflow: "auto", p: 0 }}>
    <PoolSniperForm ref={formRef} />
  </DialogContent>

  <DialogActions sx={{ borderTop: "1px solid rgba(70, 235, 128, 0.2)" }}>
    <Button onClick={handleClose}>Cancel</Button>
    <Button
      variant="contained"
      onClick={handleSubmit}
      disabled={isSubmitting}
    >
      {isSubmitting ? <CircularProgress /> : "Input new pool details"}
    </Button>
  </DialogActions>
</Dialog>
```

### Snackbar Notifications

Toast notifications for transaction states:

```typescript
const [snackbar, setSnackbar] = useState<{
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}>({ open: false, message: "", severity: "info" });

const handleSubmit = async () => {
  setIsSubmitting(true);
  showSnackbar("Creating position...", "info");

  try {
    const result = await formRef.current.submitForm();
    if (result.success) {
      showSnackbar(
        `Position created! Pool: ${result.poolAddress?.slice(0, 8)}...`,
        "success"
      );
      handleClose();
    } else {
      showSnackbar(result.error || "Failed to create position", "error");
    }
  } catch {
    showSnackbar("An error occurred", "error");
  } finally {
    setIsSubmitting(false);
  }
};
```

### PositionList Component

Displays mock positions from Zustand store:

```typescript
export const PositionList = () => {
  const positions = useMockPositionsStore((state) => state.positions);
  const clearPositions = useMockPositionsStore((state) => state.clearPositions);

  if (positions.length === 0) return null;

  return (
    <Box sx={{ position: "fixed", bottom: 0, maxHeight: "40vh", overflow: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>Mock Positions ({positions.length})</Typography>
        <Button onClick={clearPositions}>Clear All</Button>
      </Box>

      {positions.map((position) => (
        <Box key={position.id}>
          {/* Pool Address, Position Address, Price Range, Deposit, Bins, Created */}
        </Box>
      ))}
    </Box>
  );
};
```

### Position Data Structure

Each mock position contains:

```typescript
interface MockPosition {
  id: string;                  // UUID
  poolAddress: string;         // Generated Keypair public key
  positionAddress: string;     // Generated Keypair public key
  baseToken: string;           // From form (mint address)
  quoteToken: string;          // SOL or USDC
  minPrice: number;
  maxPrice: number;
  depositAmount: number;       // SOL amount
  numberOfBins: number;        // Calculated from price range
  createdAt: Date;
}
```

---

## Styling

### DialogActions
- Sticky footer with border-top
- Cancel button on left (text style)
- Submit button on right (contained, primary color)

### PositionList
- Fixed position at bottom of screen
- Max height 40vh with overflow scroll
- Grid layout for position details
- Clear All button with red hover state

---

## Reference Documents

- `exam_docs/ai_prompts/requirements_grooming/07_new_position_form.md`
- `exam_docs/ai_prompts/requirements_grooming/08_position_form_mock_transaction.md`
