# Sentinel - AI DeFi Agent on Casper Network

An AI-powered DeFi agent that owns a wallet on Casper Network testnet. Interact with the blockchain through natural language - check balances, send tokens, and explore staking.

Built for the **Casper Hackathon 2026**.

## Features

- **AI-Powered Chat Interface** - Natural language interaction powered by Claude
- **Wallet Management** - Server-side wallet that the agent controls
- **CSPR Transfers** - Send tokens to any Casper address
- **Balance Checking** - Real-time balance queries
- **Validator Explorer** - View staking validators and delegation info

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local
```

### Configuration

Edit `.env.local` with your Anthropic API key:

```bash
ANTHROPIC_API_KEY=sk-ant-...
```

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Run - Wallet Generation

On first run, if no `CASPER_PRIVATE_KEY` is set, Sentinel will generate a new wallet and print the private key to the console:

```
========================================
NEW WALLET GENERATED
========================================
Public Key: 01abc...
Account Hash: account-hash-...

SAVE THIS PRIVATE KEY TO .env.local:
CASPER_PRIVATE_KEY=...

Fund your wallet at:
https://testnet.cspr.live/tools/faucet
========================================
```

1. Copy the `CASPER_PRIVATE_KEY` line to your `.env.local`
2. Visit the [testnet faucet](https://testnet.cspr.live/tools/faucet) to fund your wallet
3. Restart the dev server

## Usage

Once running, you can interact with Sentinel using natural language:

- **"What's my wallet address?"** - Get the agent's public key
- **"Check my balance"** - See current CSPR balance
- **"Send 10 CSPR to 01abc..."** - Transfer tokens
- **"List staking validators"** - View available validators
- **"How does staking work?"** - Learn about Casper staking

## Tech Stack

- **Next.js 15** - React framework with App Router
- **Vercel AI SDK v6** - Streaming AI responses with tool calling
- **Claude Sonnet** - LLM for natural language understanding
- **casper-js-sdk v5** - Official Casper JavaScript SDK
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

## Project Structure

```
sentinel-casper/
├── app/
│   ├── page.tsx              # Main chat interface
│   └── api/
│       ├── chat/route.ts     # AI chat endpoint
│       └── wallet/           # Wallet info endpoints
├── lib/
│   ├── casper/
│   │   ├── client.ts         # RPC client
│   │   ├── wallet.ts         # Key management
│   │   ├── transfer.ts       # Token transfers
│   │   └── staking.ts        # Validator queries
│   └── ai/
│       ├── tools.ts          # Claude tool definitions
│       └── prompts.ts        # System prompt
└── components/
    └── chat/                 # Chat UI components
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `CASPER_NODE_URL` | Casper RPC endpoint (default: testnet) |
| `CASPER_CHAIN_NAME` | Chain name (default: casper-test) |
| `CASPER_PRIVATE_KEY` | Ed25519 private key hex |
| `ANTHROPIC_API_KEY` | Claude API key |

## Security Notes

- This is a **hackathon demo** - not production ready
- Private keys are stored in environment variables
- Only use on **testnet** - tokens have no real value
- Never commit `.env.local` to version control

## Deployment

Deploy to Vercel:

```bash
vercel deploy
```

Add environment variables in the Vercel dashboard.

## License

MIT

---

Built with AI for the Casper Hackathon 2026
# sentinel-casper
