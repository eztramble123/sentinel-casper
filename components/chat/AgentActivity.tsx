"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Circle,
  Loader2,
  XCircle,
} from "lucide-react";

export interface ActivityStep {
  id: string;
  label: string;
  status: "pending" | "active" | "completed" | "error";
  detail?: string;
}

interface AgentActivityProps {
  toolName: string;
  isLoading: boolean;
  hasResult: boolean;
  error?: string;
}

// Define activity flows for different tools
const getActivitySteps = (
  toolName: string,
  isLoading: boolean,
  hasResult: boolean,
  error?: string
): ActivityStep[] => {
  const getStatus = (
    stepIndex: number,
    totalSteps: number
  ): ActivityStep["status"] => {
    if (error) {
      if (stepIndex === totalSteps - 1) return "error";
      return "completed";
    }
    if (hasResult) return "completed";
    if (!isLoading) return "pending";

    // During loading, animate through steps
    const activeStep = Math.min(stepIndex, totalSteps - 2);
    if (stepIndex < activeStep) return "completed";
    if (stepIndex === activeStep) return "active";
    return "pending";
  };

  switch (toolName) {
    case "swapTokens": {
      const steps = [
        { id: "1", label: "CHECKING POOLS" },
        { id: "2", label: "CALCULATING QUOTE" },
        { id: "3", label: "VERIFYING SLIPPAGE" },
        { id: "4", label: "EXECUTING SWAP" },
        { id: "5", label: "CONFIRMING TX" },
      ];
      return steps.map((s, i) => ({
        ...s,
        status: getStatus(i, steps.length),
      }));
    }

    case "getSwapQuote": {
      const steps = [
        { id: "1", label: "FINDING POOL" },
        { id: "2", label: "CALCULATING" },
        { id: "3", label: "ESTIMATING FEES" },
      ];
      return steps.map((s, i) => ({
        ...s,
        status: getStatus(i, steps.length),
      }));
    }

    case "listDexPools": {
      const steps = [
        { id: "1", label: "CONNECTING" },
        { id: "2", label: "FETCHING POOLS" },
        { id: "3", label: "PROCESSING" },
      ];
      return steps.map((s, i) => ({
        ...s,
        status: getStatus(i, steps.length),
      }));
    }

    case "getTokenBalances": {
      const steps = [
        { id: "1", label: "LOADING WALLET" },
        { id: "2", label: "QUERYING BALANCES" },
      ];
      return steps.map((s, i) => ({
        ...s,
        status: getStatus(i, steps.length),
      }));
    }

    case "sendCSPR": {
      const steps = [
        { id: "1", label: "BUILDING TX" },
        { id: "2", label: "SIGNING" },
        { id: "3", label: "BROADCASTING" },
        { id: "4", label: "CONFIRMING" },
      ];
      return steps.map((s, i) => ({
        ...s,
        status: getStatus(i, steps.length),
      }));
    }

    case "checkBalance":
    case "checkRecipientBalance": {
      const steps = [
        { id: "1", label: "CONNECTING" },
        { id: "2", label: "READING STATE" },
      ];
      return steps.map((s, i) => ({
        ...s,
        status: getStatus(i, steps.length),
      }));
    }

    default:
      return [];
  }
};

const StatusIcon = ({ status }: { status: ActivityStep["status"] }) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-4 h-4" />;
    case "active":
      return <Loader2 className="w-4 h-4 animate-spin" />;
    case "error":
      return <XCircle className="w-4 h-4" />;
    default:
      return <Circle className="w-4 h-4" />;
  }
};

export function AgentActivity({
  toolName,
  isLoading,
  hasResult,
  error,
}: AgentActivityProps) {
  const steps = getActivitySteps(toolName, isLoading, hasResult, error);

  if (steps.length === 0) {
    return (
      <div className="neo-card-sm my-3 p-4 bg-white">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-black" />
          <span className="font-bold uppercase text-black">PROCESSING...</span>
        </div>
      </div>
    );
  }

  const getToolTitle = () => {
    const titles: Record<string, string> = {
      swapTokens: "EXECUTING SWAP",
      getSwapQuote: "GETTING QUOTE",
      listDexPools: "LOADING POOLS",
      getTokenBalances: "CHECKING BALANCES",
      sendCSPR: "SENDING CSPR",
      checkBalance: "CHECKING BALANCE",
      checkRecipientBalance: "CHECKING BALANCE",
      getDexPoolInfo: "LOADING POOL",
      getWalletAddress: "LOADING WALLET",
      listValidators: "LOADING VALIDATORS",
    };
    return titles[toolName] || "PROCESSING";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      className="neo-card-sm my-3 overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b-2 border-black bg-black text-white">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-black text-sm tracking-wide">
            {getToolTitle()}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4 bg-white">
        <div className="space-y-0">
          <AnimatePresence mode="popLayout">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.1 }}
                className={`flex items-center gap-3 py-2 ${
                  index < steps.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                {/* Status indicator */}
                <div
                  className={`flex-shrink-0 ${
                    step.status === "completed"
                      ? "text-black"
                      : step.status === "active"
                        ? "text-black"
                        : step.status === "error"
                          ? "text-black"
                          : "text-gray-300"
                  }`}
                >
                  <StatusIcon status={step.status} />
                </div>

                {/* Step content */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-xs font-bold uppercase tracking-wide ${
                      step.status === "completed"
                        ? "text-black"
                        : step.status === "active"
                          ? "text-black"
                          : step.status === "error"
                            ? "text-black"
                            : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </div>
                </div>

                {/* Active indicator */}
                {step.status === "active" && (
                  <div className="flex-shrink-0 w-2 h-2 bg-black animate-pulse" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
