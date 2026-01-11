/**
 * Casper Agent Framework - Agent Factory
 * Create AI agents for the Casper Network
 */

import { AgentConfig, Agent } from "./types";
import { createTools, presets } from "../tools";
import { buildPrompt } from "../prompts";

/**
 * Create a Casper AI agent from configuration
 *
 * @example
 * ```ts
 * import { createAgent, presets } from "@/lib/framework";
 *
 * // Create a DeFi agent with all tools
 * const defiAgent = createAgent({
 *   name: "DeFi Bot",
 *   description: "AI-powered DeFi assistant",
 *   tools: {
 *     include: [presets.defi],
 *   },
 *   prompt: {
 *     base: "defi",
 *   },
 * });
 *
 * // Create a minimal agent with custom tools
 * const customAgent = createAgent({
 *   name: "NFT Bot",
 *   description: "NFT trading assistant",
 *   tools: {
 *     include: [presets.wallet, presets.transfer],
 *     custom: { mintNFT, listNFT },
 *   },
 *   prompt: {
 *     base: "minimal",
 *     additions: "You specialize in NFT trading on Casper.",
 *   },
 * });
 * ```
 */
export function createAgent(config: AgentConfig): Agent {
  // Build tools from config
  const tools = createTools(config.tools);

  // Build system prompt
  const systemPrompt = buildPrompt({
    ...config.prompt,
    agentName: config.prompt.agentName || config.name,
    agentDescription: config.prompt.agentDescription || config.description,
  });

  return {
    name: config.name,
    description: config.description,
    tools,
    systemPrompt,
    network: config.network || "testnet",
  };
}

/**
 * Quick agent creation with sensible defaults
 */
export function createDeFiAgent(
  name: string,
  customPrompt?: string
): Agent {
  return createAgent({
    name,
    description: `${name} - AI-powered DeFi agent on Casper`,
    tools: {
      include: [presets.defi],
    },
    prompt: {
      base: "defi",
      agentName: name,
      additions: customPrompt,
    },
  });
}

/**
 * Create a minimal agent with just wallet and transfer capabilities
 */
export function createMinimalAgent(
  name: string,
  customPrompt?: string
): Agent {
  return createAgent({
    name,
    description: `${name} - Casper wallet agent`,
    tools: {
      include: [presets.minimal],
    },
    prompt: {
      base: "minimal",
      agentName: name,
      additions: customPrompt,
    },
  });
}
