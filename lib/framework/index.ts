/**
 * Casper Agent Framework
 *
 * Build AI-powered agents on Casper Network
 *
 * @example
 * ```ts
 * import { createAgent, presets } from "@/lib/framework";
 *
 * const agent = createAgent({
 *   name: "My Agent",
 *   description: "Custom Casper agent",
 *   tools: { include: [presets.defi] },
 *   prompt: { base: "defi" },
 * });
 *
 * // Use with Vercel AI SDK
 * const result = await streamText({
 *   model: anthropic("claude-sonnet-4-20250514"),
 *   system: agent.systemPrompt,
 *   tools: agent.tools,
 *   messages,
 * });
 * ```
 */

// Agent factory
export {
  createAgent,
  createDeFiAgent,
  createMinimalAgent,
} from "./createAgent";

// Types
export type {
  AgentConfig,
  Agent,
  ToolConfig,
  PromptConfig,
  ToolPreset,
  Framework,
} from "./types";

// Tool presets and builder
export { presets, createTools, getAvailableTools } from "../tools";

// Prompt builder
export { buildPrompt, PROMPTS } from "../prompts";

// Casper utilities (for custom tool development)
export * from "../casper/client";
export { isDemoMode, MOCK_WALLET, getMockBalance } from "../casper/mock";
