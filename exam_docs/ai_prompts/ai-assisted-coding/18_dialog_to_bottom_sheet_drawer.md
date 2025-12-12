# Dialog to Bottom Sheet Drawer Conversion

## Session Overview

Converted the fullscreen Dialog in the Pool Sniper page to a centered bottom sheet Drawer component with max-width constraint, providing a native mobile sheet experience.

## User Prompts

### Initial Request
> @src/app/pool-sniper/page.tsx
> How to make dialog still behaves like fullscreen but only have max width and centered position?

### Follow-up Questions from User
1. "Will this still looks like a Material Sheet? (animating from bottom to top?) Can you check if there's a Sheet behavior in MUI"

## AI Questions & User Answers

### Question 1: Maximum Width
**Q:** What maximum width do you want for the dialog?
- 600px
- 800px (Recommended)
- 1000px
- 1200px

**A:** 600px

### Question 2: Sheet Style
**Q:** Which behavior do you prefer?
- Drawer (bottom sheet) - Sticks to bottom edge, slides up from screen bottom - like iOS/Android sheets
- Dialog with Slide - Centered modal that animates from bottom - current animation preserved

**A:** Drawer (bottom sheet)

## Research Findings

### MUI Sheet Options
- MUI does not have a dedicated "Sheet" component in Material UI (Joy UI has one)
- Two viable approaches identified:
  1. **Drawer with `anchor="bottom"`** - Native slide-up animation, sticks to bottom edge
  2. **Dialog with Slide transition** - Centered modal with bottom-to-top animation

### Resources Referenced
- [MUI Drawer](https://mui.com/material-ui/react-drawer/)
- [MUI Drawer API](https://mui.com/material-ui/api/drawer/)
- [MUI Transitions](https://mui.com/material-ui/transitions/)

## Files Updated

### `/src/app/pool-sniper/page.tsx`

#### Changes Made

1. **Updated Imports**
   - Removed: `Dialog`, `DialogContent`, `DialogActions`, `Slide`, `TransitionProps`
   - Added: `Drawer`

2. **Removed Transition Component**
   - Deleted the custom `Transition` forwardRef component (Drawer has built-in slide animation)

3. **Replaced Dialog with Drawer**
   ```tsx
   <Drawer
     anchor="bottom"
     open={open}
     onClose={handleClose}
     PaperProps={{
       sx: {
         maxWidth: "600px",
         width: "100%",
         mx: "auto",
         height: "90vh",
         maxHeight: "90vh",
         borderTopLeftRadius: "16px",
         borderTopRightRadius: "16px",
         display: "flex",
         flexDirection: "column",
         bgcolor: "custom.backgroundOverlay",
         overflow: "hidden",
       },
     }}
   >
   ```

4. **Replaced DialogContent/DialogActions with Box**
   - `DialogContent` → `Box` with same styling (`flex: 1`, `overflow: "auto"`)
   - `DialogActions` → `Box` with `display: "flex"` and `justifyContent: "space-between"`

## Summary

| Aspect | Before | After |
|--------|--------|-------|
| Component | `Dialog` with `fullScreen` prop | `Drawer` with `anchor="bottom"` |
| Width | Full viewport width | Max 600px, centered |
| Height | Full viewport height | 90vh |
| Animation | Custom `Slide` transition component | Built-in Drawer slide animation |
| Corners | Square (fullscreen) | Rounded top corners (16px) |
| Content Wrapper | `DialogContent` | `Box` |
| Actions Wrapper | `DialogActions` | `Box` |

## Result

- Bottom sheet slides up from screen edge (native mobile feel)
- Maximum width of 600px, horizontally centered
- Rounded top corners for modern appearance
- Retains AppBar with close button
- Same form content and action buttons
- Build passes successfully
