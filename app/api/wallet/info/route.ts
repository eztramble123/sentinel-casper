import { NextResponse } from "next/server";
import { isDemoMode, MOCK_WALLET, getMockBalance } from "@/lib/casper/mock";

export async function GET() {
  try {
    // Always use mock data for demo deployment
    if (isDemoMode()) {
      const balance = getMockBalance();
      return NextResponse.json({
        publicKey: MOCK_WALLET.publicKey,
        accountHash: MOCK_WALLET.accountHash,
        balanceCSPR: balance.balanceCSPR,
        balanceMotes: balance.balanceMotes,
      });
    }

    // Real wallet mode (if key is configured)
    const { getWalletInfo } = await import("@/lib/casper/wallet");
    const { getAccountBalance } = await import("@/lib/casper/transfer");

    const info = await getWalletInfo();
    const balance = await getAccountBalance(info.publicKey);

    return NextResponse.json({
      publicKey: info.publicKey,
      accountHash: info.accountHash,
      balanceCSPR: balance.balanceCSPR,
      balanceMotes: balance.balanceMotes,
    });
  } catch (error) {
    console.error("Wallet info error:", error);
    // Fallback to mock on error
    const balance = getMockBalance();
    return NextResponse.json({
      publicKey: MOCK_WALLET.publicKey,
      accountHash: MOCK_WALLET.accountHash,
      balanceCSPR: balance.balanceCSPR,
      balanceMotes: balance.balanceMotes,
    });
  }
}
