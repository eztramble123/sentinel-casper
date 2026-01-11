/**
 * Casper Agent Framework - Staking Tools
 * Tools for validator queries and staking operations
 */

import { tool } from "ai";
import { z } from "zod";
import { motesToCSPR } from "../casper/client";
import { isDemoMode, MOCK_VALIDATORS } from "../casper/mock";

export const stakingTools = {
  /**
   * List active validators
   */
  listValidators: tool({
    description:
      "Get a list of active validators on the Casper Network. Useful for staking information.",
    inputSchema: z.object({
      limit: z
        .number()
        .optional()
        .default(5)
        .describe("Number of validators to return (default 5)"),
    }),
    execute: async ({ limit }) => {
      if (isDemoMode()) {
        const validators = MOCK_VALIDATORS.slice(0, limit);
        return {
          validators: validators.map((v) => ({
            publicKey: v.publicKey,
            delegationRate: `${v.delegationRate}%`,
            totalStake: `${motesToCSPR(v.totalStake)} CSPR`,
            status: v.isActive ? "Active" : "Inactive",
          })),
          note: "Demo mode - simulated validators. Minimum delegation is 500 CSPR.",
        };
      }

      const { getValidators } = await import("../casper/staking");
      const validators = await getValidators(limit);
      return {
        validators: validators.map((v) => ({
          publicKey: v.publicKey,
          delegationRate: `${v.delegationRate}%`,
          totalStake: `${motesToCSPR(v.totalStake)} CSPR`,
          status: v.isActive ? "Active" : "Inactive",
        })),
        note: "Minimum delegation is 500 CSPR. Staking rewards are distributed every Era (~2 hours).",
      };
    },
  }),
};
