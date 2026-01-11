import { Tool } from "ai";

/**
 * Casper Agent Framework Types
 * Types for building AI agents on Casper Network
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyTool = Tool<any, any>;

// Tool configuration for agent creation
export interface ToolConfig {
  /** Pre-built tool presets to include */
  include?: Record<string, AnyTool>[];
  /** Custom tools to add */
  custom?: Record<string, AnyTool>;
  /** Tools to exclude by name */
  exclude?: string[];
}

// Prompt configuration
export interface PromptConfig {
  /** Base prompt template to use */
  base?: "defi" | "minimal" | "custom";
  /** Agent name to inject into prompt */
  agentName?: string;
  /** Agent description */
  agentDescription?: string;
  /** Additional prompt instructions */
  additions?: string;
  /** Custom system prompt (overrides base) */
  custom?: string;
}

// Agent configuration
export interface AgentConfig {
  /** Agent name */
  name: string;
  /** Agent description */
  description: string;
  /** Tool configuration */
  tools: ToolConfig;
  /** Prompt configuration */
  prompt: PromptConfig;
  /** Network to use */
  network?: "mainnet" | "testnet";
}

// Created agent instance
export interface Agent {
  /** Agent name */
  name: string;
  /** Agent description */
  description: string;
  /** Compiled tools */
  tools: Record<string, AnyTool>;
  /** Compiled system prompt */
  systemPrompt: string;
  /** Network configuration */
  network: "mainnet" | "testnet";
}

// Tool preset types
export type ToolPreset = "wallet" | "transfer" | "dex" | "staking" | "defi";

// Framework exports
export interface Framework {
  createAgent: (config: AgentConfig) => Agent;
  presets: Record<ToolPreset, Record<string, AnyTool>>;
  prompts: Record<string, string>;
}
