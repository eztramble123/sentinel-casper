/**
 * Casper Agent Framework - Tool Builder
 * Create and compose tools for your Casper AI agent
 */

import { Tool } from "ai";
import { ToolConfig } from "../framework/types";
import { walletTools } from "./wallet";
import { transferTools } from "./transfer";
import { dexTools } from "./dex";
import { stakingTools } from "./staking";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyTool = Tool<any, any>;

// Re-export individual tool modules
export { walletTools } from "./wallet";
export { transferTools } from "./transfer";
export { dexTools } from "./dex";
export { stakingTools } from "./staking";

/**
 * Pre-built tool presets for common use cases
 */
export const presets = {
  /** Wallet management tools (balance, address) */
  wallet: walletTools,

  /** Transfer tools (send CSPR) */
  transfer: transferTools,

  /** DEX tools (swap, pools, quotes) */
  dex: dexTools,

  /** Staking tools (validators) */
  staking: stakingTools,

  /** Full DeFi toolkit (wallet + transfer + dex + staking) */
  defi: {
    ...walletTools,
    ...transferTools,
    ...dexTools,
    ...stakingTools,
  },

  /** Minimal toolkit (wallet + transfer only) */
  minimal: {
    ...walletTools,
    ...transferTools,
  },
} as const;

export type PresetName = keyof typeof presets;

/**
 * Create a tools object from configuration
 *
 * @example
 * ```ts
 * // Use a preset
 * const tools = createTools({ include: [presets.wallet, presets.dex] });
 *
 * // Add custom tools
 * const tools = createTools({
 *   include: [presets.minimal],
 *   custom: { myCustomTool },
 * });
 *
 * // Exclude specific tools
 * const tools = createTools({
 *   include: [presets.defi],
 *   exclude: ['swapTokens'],
 * });
 * ```
 */
export function createTools(config: ToolConfig): Record<string, AnyTool> {
  let tools: Record<string, AnyTool> = {};

  // Merge included presets
  if (config.include) {
    for (const preset of config.include) {
      tools = { ...tools, ...preset };
    }
  }

  // Add custom tools
  if (config.custom) {
    tools = { ...tools, ...config.custom };
  }

  // Remove excluded tools
  if (config.exclude) {
    for (const name of config.exclude) {
      delete tools[name];
    }
  }

  return tools;
}

/**
 * Get all available tool names from presets
 */
export function getAvailableTools(): string[] {
  return Object.keys(presets.defi);
}
