import { CLPublicKey, DeployUtil, CasperClient } from "casper-js-sdk";
import { getWallet } from "./wallet";
import { getCasperClient, getChainName, getNodeUrl } from "./client";

const TRANSFER_GAS = "100000000"; // 0.1 CSPR for native transfer

export interface TransferParams {
  recipientPublicKeyHex: string;
  amountMotes: string;
  memo?: string;
}

export interface TransferResult {
  success: boolean;
  transactionHash?: string;
  explorerUrl?: string;
  error?: string;
}

export async function transferCSPR(
  params: TransferParams
): Promise<TransferResult> {
  try {
    const wallet = await getWallet();
    const client = getCasperClient();
    const chainName = getChainName();

    // Parse recipient public key
    const recipientPubKey = CLPublicKey.fromHex(params.recipientPublicKeyHex);

    // Build native transfer deploy using DeployUtil
    const deployParams = new DeployUtil.DeployParams(
      wallet.getPublicKey(),
      chainName
    );

    const session = DeployUtil.ExecutableDeployItem.newTransfer(
      params.amountMotes,
      recipientPubKey,
      null, // source purse (null = main purse)
      Date.now() // unique transfer ID
    );

    const payment = DeployUtil.standardPayment(TRANSFER_GAS);

    const deploy = DeployUtil.makeDeploy(deployParams, session, payment);

    // Sign the deploy
    const signedDeploy = wallet.sign(deploy);

    // Submit to network
    const result = await client.putDeploy(signedDeploy);

    return {
      success: true,
      transactionHash: result,
      explorerUrl: `https://testnet.cspr.live/deploy/${result}`,
    };
  } catch (error) {
    console.error("Transfer error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function getAccountBalance(
  publicKeyHex: string
): Promise<{ balanceMotes: string; balanceCSPR: string }> {
  try {
    const client = getCasperClient();
    const publicKey = CLPublicKey.fromHex(publicKeyHex);

    // Get state root hash first
    const stateRootHash = await client.nodeClient.getStateRootHash();

    // Get account info to find the main purse
    try {
      const accountHash = publicKey.toAccountHashStr();
      const { Account } = await client.nodeClient.getBlockState(
        stateRootHash,
        accountHash,
        []
      );

      if (!Account) {
        return { balanceMotes: "0", balanceCSPR: "0.0000" };
      }

      // Get balance from main purse
      const mainPurse = Account.mainPurse;
      const balanceResult = await client.nodeClient.getAccountBalance(
        stateRootHash,
        mainPurse
      );

      const balanceMotes = balanceResult.toString();
      const balanceCSPR = (Number(balanceMotes) / 1_000_000_000).toFixed(4);

      return { balanceMotes, balanceCSPR };
    } catch {
      // If the balance query fails, account may not exist yet
      return { balanceMotes: "0", balanceCSPR: "0.0000" };
    }
  } catch (error) {
    console.error("Balance check error:", error);
    // Return 0 if account doesn't exist yet
    return { balanceMotes: "0", balanceCSPR: "0.0000" };
  }
}
