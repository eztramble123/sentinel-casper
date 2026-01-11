# Casper AI Agent Framework

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Casper](https://img.shields.io/badge/Casper-Network-red?style=flat-square)](https://casper.network/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> Build AI-powered blockchain agents on Casper Network in minutes.

**Sentinel** is the reference implementation - a DeFi agent built with this framework.

Built for the **Casper Hackathon 2026**.

[**Live Demo**](http://localhost:3000/demo) | [**Documentation**](http://localhost:3000)

---

## Features

- **AI-Powered** - Natural language interface powered by Claude
- **Pre-built Tools** - Wallet, DEX, transfer, and staking tool presets
- **Customizable** - Flexible prompts and agent behaviors
- **Easy Deployment** - One-click deploy to Vercel
- **Demo Mode** - Test without a real wallet

---

## Table of Contents

- [Quick Start](#quick-start)
- [Creating Your Agent](#creating-your-agent)
- [Tool Presets](#tool-presets)
- [Building Custom Tools](#building-custom-tools)
- [Framework Structure](#framework-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Tech Stack](#tech-stack)
- [Security Notes](#security-notes)

---

## Quick Start

```bash
# Clone the template
git clone https://github.com/eztramble123/sentinel-casper
cd sentinel-casper

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the interactive documentation.

Visit [http://localhost:3000/demo](http://localhost:3000/demo) to try the demo agent.

---

## Creating Your Agent

### 1. Choose Your Tools

Import pre-built tool presets or create custom tools:

```typescript
import { createAgent, presets } from "@/lib/framework";

// Use pre-built presets
const myAgent = createAgent({
  name: "My DeFi Bot",
  description: "Custom DeFi assistant",
  tools: {
    include: [presets.wallet, presets.dex],  // Pick what you need
  },
  prompt: { base: "defi" },
});
```

### 2. Customize the Prompt

```typescript
const agent = createAgent({
  name: "NFT Trading Bot",
  description: "Specializes in NFT trading on Casper",
  tools: {
    include: [presets.wallet, presets.transfer],
    custom: { mintNFT, listNFT, buyNFT },  // Your custom tools
  },
  prompt: {
    base: "defi",
    agentName: "NFT Bot",
    additions: `
      You specialize in NFT trading.
      Always check floor prices before buying.
      Warn about high gas fees.
    `,
  },
});
```

### 3. Connect to AI SDK

```typescript
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

const result = await streamText({
  model: anthropic("claude-sonnet-4-20250514"),
  system: agent.systemPrompt,
  tools: agent.tools,
  messages,
});
```

---

## Tool Presets

| Preset | Tools Included | Use Case |
|--------|---------------|----------|
| `wallet` | getWalletAddress, checkBalance, checkRecipientBalance | Wallet management |
| `transfer` | sendCSPR | Token transfers |
| `dex` | listDexPools, getDexPoolInfo, getTokenBalances, getSwapQuote, swapTokens | DEX trading |
| `staking` | listValidators | Staking operations |
| `defi` | All of the above | Full DeFi suite |
| `minimal` | wallet + transfer | Basic operations |

---

## Building Custom Tools

Create your own tools following the Vercel AI SDK pattern:

```typescript
import { tool } from "ai";
import { z } from "zod";

export const myCustomTool = tool({
  description: "What this tool does",
  inputSchema: z.object({
    param1: z.string().describe("Parameter description"),
    param2: z.number().optional(),
  }),
  execute: async ({ param1, param2 }) => {
    // Your logic here
    return { success: true, data: "..." };
  },
});
```

---

## Framework Structure

```
lib/
├── framework/
│   ├── index.ts           # Main exports
│   ├── createAgent.ts     # Agent factory
│   └── types.ts           # TypeScript types
├── tools/
│   ├── index.ts           # Tool builder + presets
│   ├── wallet.ts          # Wallet tools
│   ├── transfer.ts        # Transfer tools
│   ├── dex.ts             # DEX tools
│   └── staking.ts         # Staking tools
├── prompts/
│   ├── index.ts           # Prompt builder
│   └── templates.ts       # Prompt templates
└── casper/
    ├── client.ts          # RPC client
    ├── wallet.ts          # Key management
    ├── transfer.ts        # Transfer logic
    ├── dex.ts             # DEX integration
    ├── staking.ts         # Validator queries
    └── mock.ts            # Demo mode mocks
```

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Claude API key | Yes |
| `CASPER_PRIVATE_KEY` | Ed25519 private key (optional for demo) | No |
| `CASPER_NODE_URL` | RPC endpoint (default: testnet) | No |
| `CASPER_CHAIN_NAME` | Chain name (default: casper-test) | No |

---

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

Add environment variables in the Vercel dashboard.

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN pnpm install && pnpm build
CMD ["pnpm", "start"]
```

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 16](https://nextjs.org/) | React framework with App Router |
| [Vercel AI SDK](https://sdk.vercel.ai/) | Streaming AI with tool calling |
| [Claude](https://anthropic.com/) | LLM for natural language |
| [casper-js-sdk](https://github.com/casper-ecosystem/casper-js-sdk) | Casper blockchain SDK |
| [React Flow](https://reactflow.dev/) | Interactive documentation |
| [Tailwind CSS](https://tailwindcss.com/) | Neo-brutalism styling |

---

## Sentinel Reference Implementation

Sentinel demonstrates the framework with a full DeFi agent:

- **Wallet Management** - Check balances, get addresses
- **Token Transfers** - Send CSPR to any address
- **DEX Trading** - Swap tokens, get quotes, view pools
- **Staking Info** - View validators, delegation rates

### Try These Commands

```
"What's my wallet address?"
"Check my balance"
"Swap 100 CSPR for USDC"
"List staking validators"
"Send 10 CSPR to 01abc..."
```

---

## Security Notes

> **Warning**: This is a hackathon demo - not production ready.

- Only use on **testnet** - tokens have no real value
- Never commit `.env.local` to version control
- Demo mode simulates transactions safely

---

## License

MIT

---

Built for the Casper Hackathon 2026
