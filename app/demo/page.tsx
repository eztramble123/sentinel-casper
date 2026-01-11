"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import Link from "next/link";
import { Zap, ArrowLeft, Wallet, Send, ArrowRightLeft, Users, ArrowRight, Loader2 } from "lucide-react";
import { MessageList } from "@/components/chat/MessageList";

// Quick action suggestions
const quickActions = [
  { icon: Wallet, text: "What's my wallet address?", label: "Wallet" },
  { icon: Zap, text: "Check my balance", label: "Balance" },
  { icon: ArrowRightLeft, text: "Swap 100 CSPR for USDC", label: "Swap" },
  { icon: Send, text: "How do I send CSPR?", label: "Send" },
  { icon: Users, text: "Show me staking validators", label: "Validators" },
];

export default function DemoPage() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat();
  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput("");
    await sendMessage({ text: message });
  };

  const handleQuickAction = async (text: string) => {
    if (isLoading) return;
    await sendMessage({ text });
  };

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="border-b-3 border-white bg-black p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="neo-btn-sm flex items-center gap-2 text-xs">
              <ArrowLeft className="w-4 h-4" />
              BACK
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" />
              </div>
              <div>
                <h1 className="text-white font-black text-lg uppercase tracking-tight">
                  Sentinel Demo
                </h1>
                <p className="text-white/50 text-xs font-medium uppercase">
                  Casper Testnet Agent
                </p>
              </div>
            </div>
          </div>
          <div className="neo-card-sm px-3 py-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-bold uppercase">Demo Mode</span>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* Welcome + Quick Actions when no messages */}
          {messages.length === 0 && (
            <div className="py-8">
              {/* Logo */}
              <div className="w-16 h-16 mx-auto mb-6 bg-white border-2 border-black shadow-brutal-sm flex items-center justify-center">
                <Zap className="w-8 h-8 text-black" />
              </div>

              {/* Title */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                  Try Sentinel
                </h2>
                <p className="text-white text-sm font-medium max-w-md mx-auto opacity-75">
                  Chat with an AI DeFi agent on Casper Network. Try the quick actions below or type your own message.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-3xl mx-auto mb-8">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickAction(action.text)}
                    disabled={isLoading}
                    className="neo-card-sm neo-card-hover p-3 text-center disabled:opacity-50"
                  >
                    <div className="w-10 h-10 bg-black flex items-center justify-center mx-auto mb-2">
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-bold text-black uppercase">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Info */}
              <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="neo-card p-4">
                  <h3 className="font-black text-xs uppercase mb-2 text-black">Testnet Only</h3>
                  <p className="text-xs text-black/75">
                    Runs on Casper Testnet. Tokens have no real value.
                  </p>
                </div>
                <div className="neo-card p-4">
                  <h3 className="font-black text-xs uppercase mb-2 text-black">Demo Mode</h3>
                  <p className="text-xs text-black/75">
                    Transactions are simulated for this demo.
                  </p>
                </div>
                <div className="neo-card p-4">
                  <h3 className="font-black text-xs uppercase mb-2 text-black">AI Powered</h3>
                  <p className="text-xs text-black/75">
                    Built with Claude and the Casper Agent Framework.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <div className="space-y-6">
              <MessageList messages={messages} />

              {isLoading && (
                <div className="flex items-center gap-3 text-white p-4 bg-black border-3 border-white">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-bold uppercase tracking-wide text-sm">PROCESSING...</span>
                </div>
              )}

              {error && (
                <div className="neo-card p-4">
                  <div className="font-bold uppercase mb-2 text-sm text-black">ERROR</div>
                  <div className="text-sm text-black">{error.message}</div>
                </div>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t-3 border-white p-4 bg-black flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          {/* Quick action pills when chatting */}
          {messages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {quickActions.slice(0, 4).map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAction(action.text)}
                  disabled={isLoading}
                  className="neo-card-sm px-3 py-1.5 text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Input form */}
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask Sentinel anything about DeFi on Casper..."
              disabled={isLoading}
              className="neo-input flex-1 px-4 py-3 text-sm font-medium disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="neo-btn px-5 py-3 text-xs flex items-center gap-2 disabled:opacity-50"
            >
              <span>SEND</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <p className="text-white text-xs opacity-50 uppercase">
              Casper Testnet — Demo Mode
            </p>
            <Link href="/" className="text-white text-xs opacity-50 hover:opacity-100 uppercase">
              Build Your Own Agent →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
