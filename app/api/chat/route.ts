import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { sentinelTools } from "@/lib/ai/tools";
import { SENTINEL_SYSTEM_PROMPT } from "@/lib/ai/prompts";

export const maxDuration = 60; // Allow longer for blockchain operations

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: SENTINEL_SYSTEM_PROMPT,
    messages,
    tools: sentinelTools,
  });

  return result.toUIMessageStreamResponse();
}
