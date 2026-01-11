import { getCasperClient } from "./client";

export interface ValidatorInfo {
  publicKey: string;
  delegationRate: number;
  totalStake: string;
  isActive: boolean;
}

export interface DelegationResult {
  success: boolean;
  deployHash?: string;
  explorerUrl?: string;
  error?: string;
}

// Minimum delegation amount: 500 CSPR in motes
export const MIN_DELEGATION_MOTES = "500000000000";

export async function getValidators(
  limit: number = 10
): Promise<ValidatorInfo[]> {
  try {
    const client = getCasperClient();

    // Get auction info which contains validator data
    const stateRootHash = await client.nodeClient.getStateRootHash();
    const auctionInfo = await client.nodeClient.getValidatorsInfo();

    const validators: ValidatorInfo[] = [];

    // Extract validators from auction state
    if (auctionInfo && auctionInfo.auction_state) {
      const bids = auctionInfo.auction_state.bids || [];

      for (const bid of bids.slice(0, limit)) {
        try {
          validators.push({
            publicKey: bid.public_key || "",
            delegationRate: bid.bid?.delegation_rate || 0,
            totalStake: bid.bid?.staked_amount || "0",
            isActive: !bid.bid?.inactive,
          });
        } catch {
          // Skip malformed bid entries
        }
      }
    }

    return validators;
  } catch (error) {
    console.error("Error fetching validators:", error);
    return [];
  }
}

// Note: Full staking implementation requires the auction contract interaction
// which is more complex. For hackathon demo, we'll show the validator list
// and explain the staking process.
export async function getDelegationInfo(_accountHash: string): Promise<{
  delegations: Array<{ validator: string; amount: string }>;
}> {
  try {
    // This would query the auction contract for delegation info
    // Simplified for hackathon - returns empty for now
    return { delegations: [] };
  } catch (error) {
    console.error("Error fetching delegation info:", error);
    return { delegations: [] };
  }
}
