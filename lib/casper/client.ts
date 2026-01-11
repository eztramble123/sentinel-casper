import { CasperClient } from "casper-js-sdk";

// Singleton CasperClient for Casper Network
let casperClient: CasperClient | null = null;

export function getCasperClient(): CasperClient {
  if (!casperClient) {
    const nodeUrl =
      process.env.CASPER_NODE_URL || "https://rpc.testnet.casperlabs.io/rpc";
    casperClient = new CasperClient(nodeUrl);
  }
  return casperClient;
}

export function getNodeUrl(): string {
  return process.env.CASPER_NODE_URL || "https://rpc.testnet.casperlabs.io/rpc";
}

export function getChainName(): string {
  return process.env.CASPER_CHAIN_NAME || "casper-test";
}

// Convert motes to CSPR (1 CSPR = 1,000,000,000 motes)
export function motesToCSPR(motes: bigint | string): string {
  const motesBI = BigInt(motes);
  const cspr = Number(motesBI) / 1_000_000_000;
  return cspr.toFixed(4);
}

// Convert CSPR to motes
export function csprToMotes(cspr: number): string {
  return BigInt(Math.floor(cspr * 1_000_000_000)).toString();
}
