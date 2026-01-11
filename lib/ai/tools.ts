/**
 * Sentinel Tools
 *
 * This file uses the Casper Agent Framework to build the Sentinel DeFi agent.
 * It demonstrates how to use the framework's tool presets.
 */

import { presets } from "../tools";

/**
 * Sentinel uses the full DeFi preset which includes:
 * - Wallet tools (getWalletAddress, checkBalance, checkRecipientBalance)
 * - Transfer tools (sendCSPR)
 * - DEX tools (listDexPools, getDexPoolInfo, getTokenBalances, getSwapQuote, swapTokens)
 * - Staking tools (listValidators)
 */
export const sentinelTools = presets.defi;
