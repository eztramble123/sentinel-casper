"use client";

import { UIMessage } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Loader2 } from "lucide-react";
import { ToolResultDisplay } from "./ToolResultDisplay";
import ReactMarkdown from "react-markdown";

interface MessageBubbleProps {
  message: UIMessage;
}

// Helper to check if a part is a tool part
function isToolPart(
  part: UIMessage["parts"][number]
): part is UIMessage["parts"][number] & {
  type: `tool-${string}`;
  toolCallId: string;
  toolName: string;
  state: string;
  input?: unknown;
  output?: unknown;
} {
  return part.type.startsWith("tool-");
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  // Get text content from parts
  const getTextContent = (): string => {
    if (message.parts) {
      const textParts = message.parts.filter((p) => p.type === "text");
      return textParts.map((p) => (p as { text: string }).text || "").join("");
    }
    return "";
  };

  // Check if there are any active tool calls (agent is working)
  const hasActiveToolCalls = message.parts?.some((part) => {
    if (isToolPart(part)) {
      const toolPart = part as { state: string };
      return toolPart.state === "call" || toolPart.state === "partial-call";
    }
    return false;
  });

  // Check if this message only has tool parts (no text)
  const hasOnlyToolParts =
    message.parts?.every(
      (part) => isToolPart(part) || (part.type === "text" && !(part as { text: string }).text?.trim())
    ) ?? false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 bg-white border-3 border-black flex items-center justify-center shadow-brutal-sm">
            <Bot className="w-6 h-6 text-black" />
          </div>
          {/* Active indicator */}
          <AnimatePresence>
            {hasActiveToolCalls && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-black border-2 border-white flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-white animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      <div
        className={`max-w-[80%] px-5 py-4 ${
          isUser
            ? "bg-black text-white border-3 border-black"
            : "neo-card text-black"
        }`}
      >
        {/* Working indicator when agent is processing */}
        <AnimatePresence>
          {hasActiveToolCalls && hasOnlyToolParts && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 text-black text-sm font-bold uppercase tracking-wide mb-3 pb-3 border-b-2 border-black"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>PROCESSING...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Render message parts */}
        {message.parts?.map((part, index) => {
          if (part.type === "text") {
            const text = (part as { text: string }).text;
            if (!text) return null;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`prose prose-sm max-w-none ${isUser ? "prose-invert" : ""}`}
              >
                <ReactMarkdown>{text}</ReactMarkdown>
              </motion.div>
            );
          }
          if (isToolPart(part)) {
            const toolPart = part as {
              type: string;
              toolCallId: string;
              toolName: string;
              state: string;
              output?: unknown;
            };
            return (
              <ToolResultDisplay
                key={index}
                toolName={toolPart.toolName || "unknown"}
                result={toolPart.output}
                state={
                  toolPart.state === "result"
                    ? "result"
                    : toolPart.state === "call"
                      ? "call"
                      : "partial-call"
                }
              />
            );
          }
          return null;
        })}

        {/* Fallback for simple text content */}
        {(!message.parts || message.parts.length === 0) && (
          <div className={`prose prose-sm max-w-none ${isUser ? "prose-invert" : ""}`}>
            <ReactMarkdown>{getTextContent() || "..."}</ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-10 h-10 bg-black border-3 border-black flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-white" />
        </div>
      )}
    </motion.div>
  );
}
