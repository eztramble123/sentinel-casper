/**
 * Casper Agent Framework - Prompt Builder
 * Build customizable system prompts for agents
 */

import { PromptConfig } from "../framework/types";
import { PROMPTS, PromptTemplate } from "./templates";

export { PROMPTS } from "./templates";

/**
 * Build a system prompt from configuration
 */
export function buildPrompt(config: PromptConfig): string {
  // Use custom prompt if provided
  if (config.custom) {
    return injectAgentInfo(config.custom, config);
  }

  // Get base template
  const baseTemplate = config.base || "defi";
  let prompt: string = PROMPTS[baseTemplate as PromptTemplate] || PROMPTS.defi;

  // Inject agent info
  prompt = injectAgentInfo(prompt, config);

  // Add custom additions
  if (config.additions) {
    prompt += `\n\nADDITIONAL INSTRUCTIONS:\n${config.additions}`;
  }

  return prompt;
}

/**
 * Inject agent name and description into prompt
 */
function injectAgentInfo(prompt: string, config: PromptConfig): string {
  if (config.agentName) {
    prompt = `Your name is ${config.agentName}.\n\n${prompt}`;
  }
  if (config.agentDescription) {
    prompt = prompt.replace(
      "You are an AI agent",
      `You are ${config.agentDescription}`
    );
  }
  return prompt;
}

/**
 * Create a custom prompt template
 */
export function createPromptTemplate(
  name: string,
  template: string
): { name: string; template: string } {
  return { name, template };
}
