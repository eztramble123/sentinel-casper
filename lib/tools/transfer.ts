/**
 * Casper Agent Framework - Transfer Tools
 * Tools for sending CSPR tokens
 */

import { tool } from "ai";
import { z } from "zod";
import { csprToMotes } from "../casper/client";
import { isDemoMode, getMockTransferResult } from "../casper/mock";

export const transferTools = {
  /**
   * Send CSPR tokens to another address
   */
  sendCSPR: tool({
    description:
      "Send CSPR tokens to another wallet address. Requires the recipient's public key and amount in CSPR.",
    inputSchema: z.object({
      recipientPublicKey: z
        .string()
        .describe(
          "The recipient's public key (hex string starting with 01 or 02)"
        ),
      amountCSPR: z
        .number()
        .positive()
        .describe("Amount of CSPR to send (e.g., 10 for 10 CSPR)"),
    }),
    execute: async ({ recipientPublicKey, amountCSPR }) => {
      // Validate public key format
      if (
        !recipientPublicKey.startsWith("01") &&
        !recipientPublicKey.startsWith("02")
      ) {
        return {
          success: false,
          error:
            "Invalid public key format. Must start with 01 (Ed25519) or 02 (Secp256k1)",
        };
      }

      // Demo mode
      if (isDemoMode()) {
        const result = getMockTransferResult(recipientPublicKey, amountCSPR);
        return {
          success: true,
          message: `Successfully sent ${amountCSPR} CSPR (Demo)`,
          transactionHash: result.transactionHash,
          explorerUrl: result.explorerUrl,
          recipient: recipientPublicKey,
          amountCSPR,
          amountMotes: result.amountMotes,
          note: "Demo mode - simulated transfer",
        };
      }

      // Real mode
      const { getWalletInfo } = await import("../casper/wallet");
      const { getAccountBalance, transferCSPR } = await import(
        "../casper/transfer"
      );

      // Check balance first
      const info = await getWalletInfo();
      const balance = await getAccountBalance(info.publicKey);
      const balanceCSPR = parseFloat(balance.balanceCSPR);

      if (balanceCSPR < amountCSPR + 0.1) {
        return {
          success: false,
          error: `Insufficient balance. Have ${balanceCSPR} CSPR, need ${amountCSPR + 0.1} CSPR (including gas)`,
        };
      }

      const amountMotes = csprToMotes(amountCSPR);
      const result = await transferCSPR({
        recipientPublicKeyHex: recipientPublicKey,
        amountMotes,
      });

      if (result.success) {
        return {
          success: true,
          message: `Successfully sent ${amountCSPR} CSPR`,
          transactionHash: result.transactionHash,
          explorerUrl: result.explorerUrl,
          recipient: recipientPublicKey,
          amountCSPR,
          amountMotes,
        };
      }

      return {
        success: false,
        error: result.error,
      };
    },
  }),
};
