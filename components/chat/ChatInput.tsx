"use client";

import { FormEvent } from "react";
import { ArrowRight } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder = "Message Sentinel...",
}: ChatInputProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-3">
      <input
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="neo-input flex-1 px-4 py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="neo-btn px-4 py-3 text-xs disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center gap-2"
      >
        <span className="hidden sm:inline">SEND</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
