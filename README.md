# HS Technical Exam (Frontend)

Please refer to the Notion page provided via email for guidelines and tasks. Best of luck!

## Demo

**Live Demo**: https://hawkfi-dev-exam-tau.vercel.app/pool-sniper

**Demo Video**:

### Instructions

1. Connect your Wallet
2. Enter COPE base token: `8HGyAAB1yoM1ttS7pXjHMa3dukTFGQggnFFH3hJZgzQh`

## Work Logs

| Date   | Duration      | Tasks                                                                   |
| ------ | ------------- | ----------------------------------------------------------------------- |
| Dec 10 | ~1h           | Checking requirements, researching                                      |
| Dec 11 | ~3h (morning) | Creating functional Pool and Position forms                             |
| Dec 12 | ~4h (morning) | Polishing form behavior, applying Figma UI/styling, minor final touches |

## Remaining Todos

- [x] Polish Base Token Input
- [x] Polish Price Input
- [x] Polish form behavior
- [x] Polish UI Styling and Layout
- [ ] Consistent hover/focused states for all selectable components
- [ ] Polish Design System (no hardcoded tokens, apply token access rules, etc.)
- [ ] Display Zero Notation in Price Inputs
- [ ] Create reusable components for similar form controls
- [ ] Fix Pool Sniper page layout (Open Pool Sniper button should remain clickable with many mock positions)
- [ ] Unit tests

## Assumptions

- **Reset all fields**: No "Reset all fields" button in Figma, so assumed this can be done by cancelling and reopening the Sheet.
- **Custom Deposit**: Assumed it will show two fields for custom amounts (base token and quote token). Happy to add if required.

## Potential Improvements

- **Figma DEV Access**: If given access to Figma DEV, could use Figma MCP to expedite UI creation and access token variables for accurate values (colors, spacings, etc.).

## Exam Documentation

| Folder                                                                                         | Description                                 |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [`exam_docs/ai_prompts/ai-assisted-coding/`](./exam_docs/ai_prompts/ai-assisted-coding/)       | AI prompts for implementing form components |
| [`exam_docs/ai_prompts/requirements_grooming/`](./exam_docs/ai_prompts/requirements_grooming/) | Requirements research and specifications    |

## Getting Started

### Prerequisites

- Node v20.18.0 or higher
- yarn v1.22.22

### Installation

1. Clone the repository: `git clone <repo-url>`
2. Create an `.env` file on the root folder and populate with these environment variables:
   ```json
   NEXT_PUBLIC_MAINNET_RPC="your_rpc_url_here"
   ```
3. Install dependencies: `yarn`
4. Start development server: `yarn run dev`
