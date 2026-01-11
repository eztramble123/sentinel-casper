/**
 * Casper Agent Framework - Wallet Tools
 * Tools for wallet management and balance checking
 */

import { tool } from "ai";
import { z } from "zod";
import { isDemoMode, MOCK_WALLET, getMockBalance } from "../casper/mock";

export const walletTools = {
  /**
   * Get wallet address and public key
   */
  getWalletAddress: tool({
    description:
      "Get the public key and account hash of the wallet. Use this when users ask for wallet address or want to receive funds.",
    inputSchema: z.object({}),
    execute: async () => {
      if (isDemoMode()) {
        return {
          publicKey: MOCK_WALLET.publicKey,
          accountHash: MOCK_WALLET.accountHash,
          faucetUrl: "https://testnet.cspr.live/tools/faucet",
          explorerUrl: `https://testnet.cspr.live/account/${MOCK_WALLET.publicKey}`,
          note: "Demo mode - using simulated wallet",
        };
      }

      const { getWalletInfo } = await import("../casper/wallet");
      const info = await getWalletInfo();
      return {
        publicKey: info.publicKey,
        accountHash: info.accountHash,
        faucetUrl: "https://testnet.cspr.live/tools/faucet",
        explorerUrl: `https://testnet.cspr.live/account/${info.publicKey}`,
      };
    },
  }),

  /**
   * Check wallet balance
   */
  checkBalance: tool({
    description:
      "Check the current CSPR balance of the wallet. Use this to see how much CSPR is available.",
    inputSchema: z.object({}),
    execute: async () => {
      if (isDemoMode()) {
        const balance = getMockBalance();
        return {
          publicKey: MOCK_WALLET.publicKey,
          balanceMotes: balance.balanceMotes,
          balanceCSPR: balance.balanceCSPR,
          explorerUrl: `https://testnet.cspr.live/account/${MOCK_WALLET.publicKey}`,
          note: "Demo mode - simulated balance",
        };
      }

      const { getWalletInfo } = await import("../casper/wallet");
      const { getAccountBalance } = await import("../casper/transfer");
      const info = await getWalletInfo();
      const balance = await getAccountBalance(info.publicKey);
      return {
        publicKey: info.publicKey,
        balanceMotes: balance.balanceMotes,
        balanceCSPR: balance.balanceCSPR,
        explorerUrl: `https://testnet.cspr.live/account/${info.publicKey}`,
      };
    },
  }),

  /**
   * Check any account's balance
   */
  checkRecipientBalance: tool({
    description:
      "Check the balance of any Casper wallet by public key. Use this to verify an address exists before sending.",
    inputSchema: z.object({
      publicKey: z.string().describe("The public key to check (hex string)"),
    }),
    execute: async ({ publicKey }) => {
      if (isDemoMode()) {
        const mockBalance = (Math.random() * 1000).toFixed(4);
        const mockMotes = Math.floor(
          parseFloat(mockBalance) * 1_000_000_000
        ).toString();
        return {
          publicKey,
          balanceMotes: mockMotes,
          balanceCSPR: mockBalance,
          exists: true,
          explorerUrl: `https://testnet.cspr.live/account/${publicKey}`,
          note: "Demo mode - simulated balance",
        };
      }

      try {
        const { getAccountBalance } = await import("../casper/transfer");
        const balance = await getAccountBalance(publicKey);
        return {
          publicKey,
          balanceMotes: balance.balanceMotes,
          balanceCSPR: balance.balanceCSPR,
          exists: balance.balanceMotes !== "0",
          explorerUrl: `https://testnet.cspr.live/account/${publicKey}`,
        };
      } catch {
        return {
          publicKey,
          exists: false,
          error:
            "Could not find account. It may not exist yet or the public key is invalid.",
        };
      }
    },
  }),
};
