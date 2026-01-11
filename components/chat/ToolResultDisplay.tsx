"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  Copy,
  Wallet,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { AgentActivity } from "./AgentActivity";

interface ToolResultDisplayProps {
  toolName: string;
  result: unknown;
  state: "partial-call" | "call" | "result";
}

export function ToolResultDisplay({
  toolName,
  result,
  state,
}: ToolResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLoading = state === "partial-call" || state === "call";
  const data = (result || {}) as Record<string, unknown>;

  // Show activity timeline for tools that have defined flows
  const showsActivity = [
    "swapTokens",
    "getSwapQuote",
    "listDexPools",
    "getTokenBalances",
    "sendCSPR",
    "checkBalance",
    "checkRecipientBalance",
    "getDexPoolInfo",
  ].includes(toolName);

  // Loading state with activity timeline
  if (isLoading) {
    return (
      <AgentActivity
        toolName={toolName}
        isLoading={true}
        hasResult={false}
      />
    );
  }

  // Token badge component - neo-brutalism style
  const TokenBadge = ({ symbol }: { symbol: string }) => {
    return (
      <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center font-black text-xs text-black">
        {symbol.slice(0, 2)}
      </div>
    );
  };

  // Swap result (swapTokens)
  if (toolName === "swapTokens") {
    const success = Boolean(data.success);
    const tokenIn = String(data.tokenIn || "");
    const tokenOut = String(data.tokenOut || "");
    const amountIn = String(data.amountIn || "");
    const amountOut = String(data.amountOut || "");
    const priceImpact = String(data.priceImpact || "");
    const transactionHash = String(data.transactionHash || "");
    const explorerUrl = String(data.explorerUrl || "");
    const errorMsg = String(data.error || "");

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="neo-card-sm my-3"
      >
        {/* Header */}
        <div className={`flex items-center gap-3 p-4 border-b-2 border-black ${success ? "bg-white" : "bg-black text-white"}`}>
          {success ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <XCircle className="w-6 h-6" />
          )}
          <span className="font-black uppercase tracking-wide">
            {success ? "SWAP COMPLETE" : "SWAP FAILED"}
          </span>
        </div>

        <div className="p-4 bg-white">
          {success ? (
            <>
              {/* Swap visualization */}
              <div className="flex items-center justify-center gap-4 py-6">
                <div className="text-center">
                  <TokenBadge symbol={tokenIn} />
                  <div className="mt-2">
                    <div className="text-xl font-black text-black">{amountIn}</div>
                    <div className="text-xs font-bold text-black uppercase">{tokenIn}</div>
                  </div>
                </div>

                <div className="flex items-center px-4">
                  <ArrowRight className="w-8 h-8 text-black" />
                </div>

                <div className="text-center">
                  <TokenBadge symbol={tokenOut} />
                  <div className="mt-2">
                    <div className="text-xl font-black text-black">{amountOut}</div>
                    <div className="text-xs font-bold text-black uppercase">{tokenOut}</div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="border-t-2 border-black pt-4 space-y-2">
                {priceImpact && (
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-black uppercase">Price Impact</span>
                    <span className="font-mono text-black">{priceImpact}</span>
                  </div>
                )}
                {transactionHash && (
                  <div className="pt-2">
                    <div className="text-xs font-bold text-black uppercase mb-1">Transaction</div>
                    <code className="text-xs font-mono text-black break-all">
                      {transactionHash.slice(0, 32)}...
                    </code>
                  </div>
                )}
              </div>

              {explorerUrl && (
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-btn neo-btn-white w-full mt-4 py-3 flex items-center justify-center gap-2 text-sm"
                >
                  VIEW ON EXPLORER <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </>
          ) : (
            <div className="text-black font-medium">{errorMsg}</div>
          )}
        </div>
      </motion.div>
    );
  }

  // Swap quote result
  if (toolName === "getSwapQuote") {
    const tokenIn = String(data.tokenIn || "");
    const tokenOut = String(data.tokenOut || "");
    const amountIn = String(data.amountIn || "");
    const amountOut = String(data.amountOut || "");
    const priceImpact = String(data.priceImpact || "");
    const fee = String(data.fee || "");
    const minimumReceived = String(data.minimumReceived || "");

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="neo-card-sm my-3"
      >
        <div className="p-4 border-b-2 border-black bg-white">
          <span className="font-black uppercase tracking-wide text-black">SWAP QUOTE</span>
        </div>

        <div className="p-4 bg-white">
          {/* Quote visualization */}
          <div className="flex items-center justify-between py-4 border-b-2 border-black mb-4">
            <div className="flex items-center gap-3">
              <TokenBadge symbol={tokenIn} />
              <div>
                <div className="font-black text-black text-lg">{amountIn}</div>
                <div className="text-xs font-bold text-black uppercase">{tokenIn}</div>
              </div>
            </div>

            <ArrowRight className="w-6 h-6 text-black" />

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-black text-black text-lg">{amountOut}</div>
                <div className="text-xs font-bold text-black uppercase">{tokenOut}</div>
              </div>
              <TokenBadge symbol={tokenOut} />
            </div>
          </div>

          {/* Quote details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-bold text-black uppercase">Price Impact</span>
              <span className="font-mono text-black">{priceImpact}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-black uppercase">Fee</span>
              <span className="font-mono text-black">{fee}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-black uppercase">Min. Received</span>
              <span className="font-mono text-black">{minimumReceived} {tokenOut}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Pool list result
  if (toolName === "listDexPools") {
    const pools = (data.pools || []) as Array<{
      id: string;
      pair: string;
      tokenX: string;
      tokenY: string;
      feeTier: string;
      tvl: string;
      volume24h: string;
      price: string;
    }>;

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="neo-card-sm my-3"
      >
        <div className="p-4 border-b-2 border-black bg-white flex justify-between items-center">
          <span className="font-black uppercase tracking-wide text-black">POOLS</span>
          <span className="text-sm font-bold text-black">{pools.length} AVAILABLE</span>
        </div>
        <div className="divide-y-2 divide-black bg-white">
          {pools.map((pool, i) => (
            <div
              key={pool.id}
              className="flex items-center justify-between p-4 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1">
                  <TokenBadge symbol={pool.tokenX} />
                  <TokenBadge symbol={pool.tokenY} />
                </div>
                <div>
                  <div className="font-black text-black">{pool.pair}</div>
                  <div className="text-xs font-bold text-black uppercase">{pool.feeTier} FEE</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-black">{pool.tvl}</div>
                <div className="text-xs font-bold text-black uppercase">TVL</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Pool info result
  if (toolName === "getDexPoolInfo") {
    const pool = data as {
      pair?: string;
      feeTier?: string;
      price?: string;
      tvl?: string;
      volume24h?: string;
      liquidity?: string;
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="neo-card-sm my-3"
      >
        <div className="p-4 border-b-2 border-black bg-white">
          <span className="font-black uppercase tracking-wide text-black">{pool.pair} POOL</span>
        </div>
        <div className="grid grid-cols-2 gap-0 bg-white">
          <div className="p-4 border-r-2 border-b-2 border-black">
            <div className="text-xs font-bold text-black uppercase mb-1">TVL</div>
            <div className="text-lg font-black text-black">{pool.tvl}</div>
          </div>
          <div className="p-4 border-b-2 border-black">
            <div className="text-xs font-bold text-black uppercase mb-1">24H Volume</div>
            <div className="text-lg font-black text-black">{pool.volume24h}</div>
          </div>
          <div className="p-4 border-r-2 border-black">
            <div className="text-xs font-bold text-black uppercase mb-1">Price</div>
            <div className="text-lg font-black text-black">{pool.price}</div>
          </div>
          <div className="p-4">
            <div className="text-xs font-bold text-black uppercase mb-1">Fee Tier</div>
            <div className="text-lg font-black text-black">{pool.feeTier}</div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Token balances result
  if (toolName === "getTokenBalances") {
    const balances = (data.balances || []) as Array<{
      symbol: string;
      name: string;
      balanceFormatted: string;
      valueUSD: string;
    }>;
    const totalUSD = String(data.totalValueUSD || "$0.00");

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="neo-card-sm my-3"
      >
        <div className="p-4 border-b-2 border-black bg-white flex justify-between items-center">
          <span className="font-black uppercase tracking-wide text-black">BALANCES</span>
          <span className="font-black text-black">{totalUSD}</span>
        </div>
        <div className="divide-y-2 divide-black bg-white">
          {balances.map((token, i) => (
            <div
              key={token.symbol}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <TokenBadge symbol={token.symbol} />
                <div>
                  <div className="font-black text-black">{token.symbol}</div>
                  <div className="text-xs font-bold text-black uppercase">{token.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-black">{token.balanceFormatted}</div>
                <div className="text-xs font-bold text-black">{token.valueUSD}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Wallet address result
  if (toolName === "getWalletAddress") {
    const publicKey = String(data.publicKey || "");
    const explorerUrl = String(data.explorerUrl || "");
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="neo-card-sm my-3"
      >
        <div className="p-4 border-b-2 border-black bg-white flex items-center gap-3">
          <Wallet className="w-5 h-5 text-black" />
          <span className="font-black uppercase tracking-wide text-black">WALLET</span>
        </div>
        <div className="p-4 bg-white">
          <div className="text-xs font-bold text-black uppercase mb-2">Public Key</div>
          <div className="flex items-center gap-2">
            <code className="text-sm font-mono text-black break-all flex-1">
              {publicKey.slice(0, 20)}...{publicKey.slice(-10)}
            </code>
            <button
              onClick={() => copyToClipboard(publicKey)}
              className="p-2 bg-black text-white hover:bg-gray-800 transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {copied && (
            <div className="text-xs font-bold text-black mt-2 uppercase">Copied!</div>
          )}
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn neo-btn-white w-full mt-4 py-3 flex items-center justify-center gap-2 text-sm"
            >
              VIEW ON EXPLORER <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </motion.div>
    );
  }

  // Balance result
  if (toolName === "checkBalance" || toolName === "checkRecipientBalance") {
    const balanceCSPR = String(data.balanceCSPR || "0");
    const balanceMotes = String(data.balanceMotes || "0");
    const explorerUrl = String(data.explorerUrl || "");
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="neo-card-sm my-3"
      >
        <div className="p-4 border-b-2 border-black bg-white">
          <span className="font-black uppercase tracking-wide text-black">BALANCE</span>
        </div>
        <div className="p-6 bg-white text-center">
          <div className="text-4xl font-black text-black mb-2">
            {balanceCSPR} CSPR
          </div>
          <div className="text-sm font-mono text-black">
            {Number(balanceMotes).toLocaleString()} motes
          </div>
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn neo-btn-white mt-4 py-2 px-4 inline-flex items-center gap-2 text-sm"
            >
              EXPLORER <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </motion.div>
    );
  }

  // Transaction result (sendCSPR)
  if (toolName === "sendCSPR") {
    const success = Boolean(data.success);
    const message = String(data.message || data.error || "");
    const amountCSPR = data.amountCSPR as number | undefined;
    const transactionHash = String(data.transactionHash || "");
    const explorerUrl = String(data.explorerUrl || "");
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="neo-card-sm my-3"
      >
        <div className={`p-4 border-b-2 border-black flex items-center gap-3 ${success ? "bg-white" : "bg-black text-white"}`}>
          {success ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span className="font-black uppercase tracking-wide">
            {success ? "TRANSFER COMPLETE" : "TRANSFER FAILED"}
          </span>
        </div>
        <div className="p-4 bg-white">
          <div className="text-black font-medium mb-2">{message}</div>
          {success && amountCSPR !== undefined && (
            <div className="text-2xl font-black text-black mb-4">
              {amountCSPR} CSPR
            </div>
          )}
          {transactionHash && (
            <div className="mb-4">
              <div className="text-xs font-bold text-black uppercase mb-1">Transaction</div>
              <code className="text-xs font-mono text-black break-all">
                {transactionHash}
              </code>
            </div>
          )}
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn neo-btn-white w-full py-3 flex items-center justify-center gap-2 text-sm"
            >
              VIEW TRANSACTION <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </motion.div>
    );
  }

  // Validators result
  if (toolName === "listValidators") {
    const validators = (data.validators || []) as Array<{
      publicKey: string;
      delegationRate: string;
      totalStake: string;
      status: string;
    }>;
    const note = String(data.note || "");
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="neo-card-sm my-3"
      >
        <div className="p-4 border-b-2 border-black bg-white">
          <span className="font-black uppercase tracking-wide text-black">VALIDATORS</span>
        </div>
        <div className="divide-y-2 divide-black bg-white">
          {validators.map((v, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4"
            >
              <code className="font-mono text-xs text-black">
                {v.publicKey.slice(0, 12)}...{v.publicKey.slice(-8)}
              </code>
              <div className="flex gap-4 text-sm">
                <span className="font-bold text-black">{v.delegationRate}</span>
                <span className="font-mono text-black">{v.totalStake}</span>
              </div>
            </div>
          ))}
        </div>
        {note && (
          <div className="p-4 border-t-2 border-black bg-white">
            <div className="text-xs text-black">{note}</div>
          </div>
        )}
      </motion.div>
    );
  }

  // Generic result fallback
  return (
    <motion.pre
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="neo-card-sm p-4 my-3 text-xs overflow-x-auto font-mono text-black bg-white"
    >
      {JSON.stringify(result, null, 2)}
    </motion.pre>
  );
}
