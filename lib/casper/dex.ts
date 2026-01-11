/**
 * DEX Module - Simulated for Hackathon Demo
 *
 * This module simulates DEX functionality for demonstration purposes.
 * The real Invariant DEX SDK is available but requires additional setup:
 * - Contract hash from Invariant team
 * - Complex dependency resolution
 *
 * For production, set INVARIANT_CONTRACT_HASH to enable real DEX integration.
 */

import { getWalletInfo } from "./wallet";

// Types
export interface PoolInfo {
  id: string;
  tokenX: {
    symbol: string;
    name: string;
    contractHash: string;
    decimals: number;
  };
  tokenY: {
    symbol: string;
    name: string;
    contractHash: string;
    decimals: number;
  };
  feeTier: string;
  feePercent: number;
  liquidity: string;
  liquidityUSD: string;
  price: string;
  priceUSD: string;
  volume24h: string;
  tvl: string;
  isActive: boolean;
}

export interface TokenBalance {
  symbol: string;
  name: string;
  contractHash: string;
  decimals: number;
  balance: string;
  balanceFormatted: string;
  valueUSD: string;
}

export interface SwapQuote {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  priceImpact: string;
  fee: string;
  route: string[];
  minimumReceived: string;
}

export interface SwapResult {
  success: boolean;
  transactionHash?: string;
  explorerUrl?: string;
  amountIn?: string;
  amountOut?: string;
  tokenIn?: string;
  tokenOut?: string;
  priceImpact?: string;
  error?: string;
}

// Simulated pool data
const SIMULATED_POOLS: PoolInfo[] = [
  {
    id: "cspr-usdc-0.3",
    tokenX: { symbol: "CSPR", name: "Casper", contractHash: "native", decimals: 9 },
    tokenY: { symbol: "USDC", name: "USD Coin", contractHash: "hash-usdc", decimals: 6 },
    feeTier: "0.3%",
    feePercent: 0.3,
    liquidity: "2500000000000000",
    liquidityUSD: "$125,000",
    price: "0.05",
    priceUSD: "$0.05",
    volume24h: "$45,230",
    tvl: "$125,000",
    isActive: true,
  },
  {
    id: "cspr-usdt-0.3",
    tokenX: { symbol: "CSPR", name: "Casper", contractHash: "native", decimals: 9 },
    tokenY: { symbol: "USDT", name: "Tether USD", contractHash: "hash-usdt", decimals: 6 },
    feeTier: "0.3%",
    feePercent: 0.3,
    liquidity: "1800000000000000",
    liquidityUSD: "$90,000",
    price: "0.05",
    priceUSD: "$0.05",
    volume24h: "$32,100",
    tvl: "$90,000",
    isActive: true,
  },
  {
    id: "usdc-usdt-0.05",
    tokenX: { symbol: "USDC", name: "USD Coin", contractHash: "hash-usdc", decimals: 6 },
    tokenY: { symbol: "USDT", name: "Tether USD", contractHash: "hash-usdt", decimals: 6 },
    feeTier: "0.05%",
    feePercent: 0.05,
    liquidity: "5000000000000",
    liquidityUSD: "$500,000",
    price: "1.0001",
    priceUSD: "$1.00",
    volume24h: "$120,500",
    tvl: "$500,000",
    isActive: true,
  },
  {
    id: "cspr-weth-0.3",
    tokenX: { symbol: "CSPR", name: "Casper", contractHash: "native", decimals: 9 },
    tokenY: { symbol: "WETH", name: "Wrapped Ether", contractHash: "hash-weth", decimals: 18 },
    feeTier: "0.3%",
    feePercent: 0.3,
    liquidity: "800000000000000",
    liquidityUSD: "$40,000",
    price: "0.000025",
    priceUSD: "$0.05",
    volume24h: "$8,750",
    tvl: "$40,000",
    isActive: true,
  },
];

function getSimulatedBalances(publicKey: string): TokenBalance[] {
  const seed = parseInt(publicKey.slice(-4), 16) || 1234;
  return [
    {
      symbol: "CSPR", name: "Casper", contractHash: "native", decimals: 9,
      balance: String(Math.floor((seed * 1000 + 500) * 1e9)),
      balanceFormatted: `${((seed * 1000 + 500) / 1000).toFixed(2)} CSPR`,
      valueUSD: `$${(((seed * 1000 + 500) / 1000) * 0.05).toFixed(2)}`,
    },
    {
      symbol: "USDC", name: "USD Coin", contractHash: "hash-usdc", decimals: 6,
      balance: String(Math.floor((seed * 50 + 100) * 1e6)),
      balanceFormatted: `${(seed * 50 + 100).toFixed(2)} USDC`,
      valueUSD: `$${(seed * 50 + 100).toFixed(2)}`,
    },
    {
      symbol: "USDT", name: "Tether USD", contractHash: "hash-usdt", decimals: 6,
      balance: String(Math.floor((seed * 30 + 50) * 1e6)),
      balanceFormatted: `${(seed * 30 + 50).toFixed(2)} USDT`,
      valueUSD: `$${(seed * 30 + 50).toFixed(2)}`,
    },
  ];
}

/**
 * List all available trading pools
 */
export async function listPools(limit?: number): Promise<PoolInfo[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const pools = SIMULATED_POOLS.filter((p) => p.isActive);
  return limit ? pools.slice(0, limit) : pools;
}

/**
 * Get detailed information about a specific pool
 */
export async function getPoolInfo(
  tokenXSymbol: string,
  tokenYSymbol: string
): Promise<PoolInfo | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const pool = SIMULATED_POOLS.find(
    (p) =>
      (p.tokenX.symbol.toUpperCase() === tokenXSymbol.toUpperCase() &&
        p.tokenY.symbol.toUpperCase() === tokenYSymbol.toUpperCase()) ||
      (p.tokenX.symbol.toUpperCase() === tokenYSymbol.toUpperCase() &&
        p.tokenY.symbol.toUpperCase() === tokenXSymbol.toUpperCase())
  );
  return pool || null;
}

/**
 * Get token balances for a wallet
 */
export async function getTokenBalances(publicKey?: string): Promise<TokenBalance[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  let walletKey = publicKey;
  if (!walletKey) {
    const walletInfo = await getWalletInfo();
    walletKey = walletInfo.publicKey;
  }

  return getSimulatedBalances(walletKey);
}

/**
 * Get a swap quote (preview)
 */
export async function getSwapQuote(
  tokenInSymbol: string,
  tokenOutSymbol: string,
  amountIn: string
): Promise<SwapQuote | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const pool = await getPoolInfo(tokenInSymbol, tokenOutSymbol);
  if (!pool) return null;

  const amountInNum = parseFloat(amountIn);
  const price = parseFloat(pool.price);

  let amountOut: number;
  if (pool.tokenX.symbol.toUpperCase() === tokenInSymbol.toUpperCase()) {
    amountOut = amountInNum * price;
  } else {
    amountOut = amountInNum / price;
  }

  const fee = amountOut * (pool.feePercent / 100);
  amountOut = amountOut - fee;

  const liquidityNum = parseFloat(pool.liquidity);
  const priceImpact = Math.min((amountInNum / liquidityNum) * 100, 10);
  const minimumReceived = amountOut * 0.99;

  return {
    tokenIn: tokenInSymbol,
    tokenOut: tokenOutSymbol,
    amountIn: amountIn,
    amountOut: amountOut.toFixed(6),
    priceImpact: `${priceImpact.toFixed(2)}%`,
    fee: `${fee.toFixed(6)} ${tokenOutSymbol}`,
    route: [tokenInSymbol, tokenOutSymbol],
    minimumReceived: minimumReceived.toFixed(6),
  };
}

/**
 * Execute a token swap (simulated)
 */
export async function executeSwap(
  tokenInSymbol: string,
  tokenOutSymbol: string,
  amountIn: string,
  slippagePercent: number = 1
): Promise<SwapResult> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const quote = await getSwapQuote(tokenInSymbol, tokenOutSymbol, amountIn);
  if (!quote) {
    return {
      success: false,
      error: `No pool found for ${tokenInSymbol}/${tokenOutSymbol} pair`,
    };
  }

  // Generate simulated transaction hash
  const txHash = `simulated-${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`;

  // Simulate occasional failures (5% chance)
  if (Math.random() < 0.05) {
    return {
      success: false,
      error: "Transaction failed: Slippage tolerance exceeded",
    };
  }

  return {
    success: true,
    transactionHash: txHash,
    explorerUrl: `https://testnet.cspr.live/deploy/${txHash}`,
    amountIn: amountIn,
    amountOut: quote.amountOut,
    tokenIn: tokenInSymbol,
    tokenOut: tokenOutSymbol,
    priceImpact: quote.priceImpact,
  };
}

/**
 * Get supported tokens list
 */
export function getSupportedTokens() {
  return [
    { symbol: "CSPR", name: "Casper", decimals: 9, contractHash: "native" },
    { symbol: "USDC", name: "USD Coin", decimals: 6, contractHash: "hash-usdc" },
    { symbol: "USDT", name: "Tether USD", decimals: 6, contractHash: "hash-usdt" },
    { symbol: "WETH", name: "Wrapped Ether", decimals: 18, contractHash: "hash-weth" },
  ];
}

/**
 * Check DEX mode
 */
export function getDexMode(): "real" | "simulated" {
  return "simulated";
}
