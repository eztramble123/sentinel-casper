/**
 * Casper Agent Framework - DEX Tools
 * Tools for decentralized exchange operations
 */

import { tool } from "ai";
import { z } from "zod";
import {
  listPools,
  getPoolInfo,
  getTokenBalances,
  getSwapQuote,
  executeSwap,
  getSupportedTokens,
} from "../casper/dex";

export const dexTools = {
  /**
   * List available trading pools
   */
  listDexPools: tool({
    description:
      "List all available trading pools on the DEX. Shows token pairs, liquidity, fees, and 24h volume.",
    inputSchema: z.object({
      limit: z
        .number()
        .optional()
        .describe("Maximum number of pools to return (optional)"),
    }),
    execute: async ({ limit }) => {
      try {
        const pools = await listPools(limit);
        return {
          success: true,
          poolCount: pools.length,
          pools: pools.map((p) => ({
            id: p.id,
            pair: `${p.tokenX.symbol}/${p.tokenY.symbol}`,
            tokenX: p.tokenX.symbol,
            tokenY: p.tokenY.symbol,
            feeTier: p.feeTier,
            liquidity: p.liquidityUSD,
            volume24h: p.volume24h,
            tvl: p.tvl,
            price: p.priceUSD,
            isActive: p.isActive,
          })),
          note: "Simulated DEX data for demo.",
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to list pools",
        };
      }
    },
  }),

  /**
   * Get specific pool information
   */
  getDexPoolInfo: tool({
    description:
      "Get detailed information about a specific trading pool by token pair.",
    inputSchema: z.object({
      tokenA: z
        .string()
        .describe("First token symbol (e.g., CSPR, USDC, USDT, WETH)"),
      tokenB: z
        .string()
        .describe("Second token symbol (e.g., CSPR, USDC, USDT, WETH)"),
    }),
    execute: async ({ tokenA, tokenB }) => {
      try {
        const pool = await getPoolInfo(tokenA, tokenB);
        if (!pool) {
          const tokens = getSupportedTokens();
          return {
            success: false,
            error: `No pool found for ${tokenA}/${tokenB} pair`,
            supportedTokens: tokens.map((t) => t.symbol),
            hint: "Try one of the supported token pairs like CSPR/USDC or CSPR/USDT",
          };
        }
        return {
          success: true,
          pair: `${pool.tokenX.symbol}/${pool.tokenY.symbol}`,
          tokenX: pool.tokenX.symbol,
          tokenY: pool.tokenY.symbol,
          feeTier: pool.feeTier,
          price: pool.priceUSD,
          liquidity: pool.liquidityUSD,
          tvl: pool.tvl,
          volume24h: pool.volume24h,
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Failed to get pool info",
        };
      }
    },
  }),

  /**
   * Get all token balances
   */
  getTokenBalances: tool({
    description:
      "Get all token balances for the wallet. Shows balances for CSPR, USDC, USDT, WETH, and other tokens.",
    inputSchema: z.object({}),
    execute: async () => {
      try {
        const balances = await getTokenBalances();
        const totalValue = balances.reduce((sum, b) => {
          const val = parseFloat(b.valueUSD.replace("$", "").replace(",", ""));
          return sum + (isNaN(val) ? 0 : val);
        }, 0);
        return {
          success: true,
          tokenCount: balances.length,
          totalValueUSD: `$${totalValue.toFixed(2)}`,
          balances: balances.map((b) => ({
            symbol: b.symbol,
            name: b.name,
            balanceFormatted: b.balanceFormatted,
            valueUSD: b.valueUSD,
          })),
          note: "Simulated balances for demo.",
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Failed to get balances",
        };
      }
    },
  }),

  /**
   * Get swap quote
   */
  getSwapQuote: tool({
    description:
      "Get a quote for swapping tokens. Shows expected output, price impact, and fees before executing.",
    inputSchema: z.object({
      tokenIn: z.string().describe("Symbol of token to sell (e.g., CSPR, USDC)"),
      tokenOut: z
        .string()
        .describe("Symbol of token to buy (e.g., USDC, CSPR)"),
      amountIn: z
        .string()
        .describe("Amount of input token to swap (e.g., '100' for 100 tokens)"),
    }),
    execute: async ({ tokenIn, tokenOut, amountIn }) => {
      try {
        const quote = await getSwapQuote(tokenIn, tokenOut, amountIn);
        if (!quote) {
          return {
            success: false,
            error: `No pool found for ${tokenIn}/${tokenOut} pair`,
          };
        }
        return {
          success: true,
          tokenIn: quote.tokenIn,
          tokenOut: quote.tokenOut,
          amountIn: quote.amountIn,
          amountOut: quote.amountOut,
          priceImpact: quote.priceImpact,
          fee: quote.fee,
          minimumReceived: quote.minimumReceived,
          route: quote.route.join(" → "),
          note: "Quote preview. Execute swapTokens to complete the trade.",
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to get quote",
        };
      }
    },
  }),

  /**
   * Execute token swap
   */
  swapTokens: tool({
    description:
      "Execute a token swap on the DEX. Swaps one token for another.",
    inputSchema: z.object({
      tokenIn: z.string().describe("Symbol of token to sell (e.g., CSPR, USDC)"),
      tokenOut: z
        .string()
        .describe("Symbol of token to buy (e.g., USDC, CSPR)"),
      amountIn: z
        .string()
        .describe("Amount of input token to swap (e.g., '100' for 100 tokens)"),
      slippagePercent: z
        .number()
        .optional()
        .default(1)
        .describe("Maximum slippage tolerance in percent (default 1%)"),
    }),
    execute: async ({ tokenIn, tokenOut, amountIn, slippagePercent }) => {
      try {
        const quote = await getSwapQuote(tokenIn, tokenOut, amountIn);
        if (!quote) {
          return {
            success: false,
            error: `No pool found for ${tokenIn}/${tokenOut} pair`,
          };
        }

        const result = await executeSwap(
          tokenIn,
          tokenOut,
          amountIn,
          slippagePercent
        );

        if (result.success) {
          return {
            success: true,
            message: `Swapped ${amountIn} ${tokenIn} for ${result.amountOut} ${tokenOut}`,
            transactionHash: result.transactionHash,
            explorerUrl: result.explorerUrl,
            tokenIn: result.tokenIn,
            tokenOut: result.tokenOut,
            amountIn: result.amountIn,
            amountOut: result.amountOut,
            priceImpact: result.priceImpact,
            note: "Simulated swap for demo.",
          };
        }

        return {
          success: false,
          error: result.error,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Swap failed",
        };
      }
    },
  }),
};
