"use client";

import { FormEvent, useRef, useEffect } from "react";
import { UIMessage } from "ai";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { Loader2, Zap, Wallet, Send, Users, ArrowRightLeft } from "lucide-react";

interface ChatContainerProps {
  messages: UIMessage[];
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error?: Error;
  onSuggestionClick?: (suggestion: string) => void;
}

export function ChatContainer({
  messages,
  input,
  onInputChange,
  onSubmit,
  isLoading,
  error,
  onSuggestionClick,
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <WelcomeMessage onSuggestionClick={onSuggestionClick} />
        )}
        <MessageList messages={messages} />
        {isLoading && (
          <div className="flex items-center gap-3 text-white p-4 bg-black border-3 border-white">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-bold uppercase tracking-wide">PROCESSING...</span>
          </div>
        )}
        {error && (
          <div className="neo-card p-4 border-black">
            <div className="font-bold uppercase text-black mb-2">ERROR</div>
            <div className="text-black">{error.message}</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t-3 border-white p-6 bg-black">
        <ChatInput
          value={input}
          onChange={onInputChange}
          onSubmit={onSubmit}
          disabled={isLoading}
          placeholder="Ask Sentinel to check balance, swap tokens, or send CSPR..."
        />
      </div>
    </div>
  );
}

function WelcomeMessage({
  onSuggestionClick,
}: {
  onSuggestionClick?: (suggestion: string) => void;
}) {
  const suggestions = [
    { icon: Wallet, text: "What's my wallet address?" },
    { icon: Zap, text: "Check my balance" },
    { icon: ArrowRightLeft, text: "Swap 100 CSPR for USDC" },
    { icon: Send, text: "How do I send CSPR?" },
  ];

  return (
    <div className="py-8">
      {/* Logo */}
      <div className="w-16 h-16 mx-auto mb-6 bg-white border-2 border-black shadow-brutal-sm flex items-center justify-center">
        <Zap className="w-8 h-8 text-black" />
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
          SENTINEL
        </h2>
        <p className="text-white text-sm font-medium max-w-md mx-auto">
          AI-powered DeFi agent on Casper Network
        </p>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick?.(suggestion.text)}
            className="neo-card-sm neo-card-hover flex items-center gap-3 p-3 text-left"
          >
            <div className="w-8 h-8 bg-black flex items-center justify-center flex-shrink-0">
              <suggestion.icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-bold text-black uppercase">
              {suggestion.text}
            </span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <p className="text-center text-white text-xs font-medium mt-8 uppercase tracking-wider opacity-50">
        Casper Testnet — Tokens have no real value
      </p>
    </div>
  );
}
