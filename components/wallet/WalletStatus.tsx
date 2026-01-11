"use client";

import { useEffect, useState } from "react";
import { Wallet, RefreshCw, ExternalLink } from "lucide-react";

interface WalletInfo {
  publicKey: string;
  balanceCSPR: string;
  accountHash: string;
}

export function WalletStatus() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchWalletInfo() {
    setLoading(true);
    try {
      const res = await fetch("/api/wallet/info");
      if (res.ok) {
        const data = await res.json();
        setWallet(data);
      }
    } catch (error) {
      console.error("Failed to fetch wallet info:", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchWalletInfo();
    // Refresh every 30 seconds
    const interval = setInterval(fetchWalletInfo, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !wallet) {
    return (
      <div className="flex items-center gap-2 text-white">
        <Wallet className="w-4 h-4" />
        <span className="text-xs font-bold uppercase">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <div className="text-sm font-black text-white">
          {wallet?.balanceCSPR || "0"} CSPR
        </div>
        <a
          href={`https://testnet.cspr.live/account/${wallet?.publicKey}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-white/60 hover:text-white flex items-center gap-1 transition-colors"
        >
          {wallet?.publicKey?.slice(0, 8)}...{wallet?.publicKey?.slice(-6)}
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <button
        onClick={fetchWalletInfo}
        disabled={loading}
        className="p-2 bg-white text-black hover:bg-gray-200 transition-colors border-2 border-white"
        title="Refresh balance"
      >
        <RefreshCw
          className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
        />
      </button>
    </div>
  );
}
