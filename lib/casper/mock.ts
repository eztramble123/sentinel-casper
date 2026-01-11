/**
 * Mock Data for Demo/Vercel Deployment
 * Returns simulated data when no real wallet key is configured
 */

// Mock wallet data
export const MOCK_WALLET = {
  publicKey: "01a1b2c3d4e5f6789012345678901234567890123456789012345678901234abcd",
  accountHash: "account-hash-0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
};

// Mock balance (changes slightly each call for realism)
export function getMockBalance() {
  const baseBalance = 2547.8234;
  const variation = (Math.random() - 0.5) * 10; // +/- 5 CSPR variation
  const balance = baseBalance + variation;
  const motes = Math.floor(balance * 1_000_000_000);
  return {
    balanceCSPR: balance.toFixed(4),
    balanceMotes: motes.toString(),
  };
}

// Mock validators
export const MOCK_VALIDATORS = [
  {
    publicKey: "01def456789abc0123456789abc0123456789abc0123456789abc0123456789abc",
    delegationRate: 10,
    totalStake: "15000000000000000",
    isActive: true,
  },
  {
    publicKey: "02abc789def0123456789def0123456789def0123456789def0123456789def012",
    delegationRate: 8,
    totalStake: "12500000000000000",
    isActive: true,
  },
  {
    publicKey: "01789abc0123456789abc0123456789abc0123456789abc0123456789abc01234",
    delegationRate: 12,
    totalStake: "9800000000000000",
    isActive: true,
  },
  {
    publicKey: "020123456789def0123456789def0123456789def0123456789def0123456789de",
    delegationRate: 5,
    totalStake: "8200000000000000",
    isActive: true,
  },
  {
    publicKey: "01456789abc0123456789abc0123456789abc0123456789abc0123456789abc012",
    delegationRate: 15,
    totalStake: "6500000000000000",
    isActive: true,
  },
];

// Mock transfer result
export function getMockTransferResult(recipientPublicKey: string, amountCSPR: number) {
  const txHash = `demo-tx-${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`;
  return {
    success: true,
    transactionHash: txHash,
    explorerUrl: `https://testnet.cspr.live/deploy/${txHash}`,
    recipient: recipientPublicKey,
    amountCSPR,
    amountMotes: Math.floor(amountCSPR * 1_000_000_000).toString(),
  };
}

// Check if we're in demo mode (no real wallet configured)
export function isDemoMode(): boolean {
  return !process.env.CASPER_PRIVATE_KEY;
}
