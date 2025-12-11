# HS Technical Exam (Frontend)

Please refer to the Notion page provided via email for guidelines and tasks. Best of luck!

## Demo

**Live Demo**: https://hawkfi-dev-exam-tau.vercel.app/pool-sniper

### Instructions
1. Connect your Wallet
2. Enter COPE base token: `8HGyAAB1yoM1ttS7pXjHMa3dukTFGQggnFFH3hJZgzQh`

## Work Logs

| Date | Duration | Tasks |
|------|----------|-------|
| Dec 10 | ~1h | Checking requirements, researching |
| Dec 11 | ~3h (morning) | Creating functional Pool and Position forms |

## Remaining Todos

- [ ] Polish Base Token Input
- [ ] Polish Price Input
- [ ] Polish form behavior
- [ ] Polish UI Styling and Layout

## Exam Documentation

| Folder | Description |
|--------|-------------|
| [`exam_docs/ai_prompts/ai-assisted-coding/`](./exam_docs/ai_prompts/ai-assisted-coding/) | AI prompts for implementing form components (7 files) |
| [`exam_docs/ai_prompts/requirements_grooming/`](./exam_docs/ai_prompts/requirements_grooming/) | Requirements research and specifications (8 files) |

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
