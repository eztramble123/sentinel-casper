import { Keys, DeployUtil, CLPublicKey } from "casper-js-sdk";

interface WalletService {
  keys: Keys.AsymmetricKey;
  getPublicKey(): CLPublicKey;
  getPublicKeyHex(): string;
  getAccountHash(): string;
  sign(deploy: DeployUtil.Deploy): DeployUtil.Deploy;
}

let walletInstance: WalletService | null = null;
let initPromise: Promise<WalletService> | null = null;

function createWalletFromKey(keys: Keys.AsymmetricKey): WalletService {
  return {
    keys,
    getPublicKey: () => keys.publicKey,
    getPublicKeyHex: () => keys.publicKey.toHex(),
    getAccountHash: () => keys.publicKey.toAccountHashStr(),
    sign: (deploy: DeployUtil.Deploy) => {
      return DeployUtil.signDeploy(deploy, keys);
    },
  };
}

function initializeWallet(): WalletService {
  const privateKeyHex = process.env.CASPER_PRIVATE_KEY;

  if (privateKeyHex) {
    // Load existing key from environment
    // Ed25519 private keys are 32 bytes (64 hex chars)
    const privateKeyBytes = Uint8Array.from(
      Buffer.from(privateKeyHex, "hex")
    );
    const keys = Keys.Ed25519.parseKeyPair(
      Keys.Ed25519.privateToPublicKey(privateKeyBytes),
      privateKeyBytes
    );
    console.log("Wallet loaded from environment");
    console.log("Public Key:", keys.publicKey.toHex());
    return createWalletFromKey(keys);
  } else {
    // Generate new key - user needs to save this!
    const keys = Keys.Ed25519.new();
    const privateKeyHexGenerated = Buffer.from(keys.privateKey).toString("hex");

    console.log("\n========================================");
    console.log("NEW WALLET GENERATED");
    console.log("========================================");
    console.log("Public Key:", keys.publicKey.toHex());
    console.log("Account Hash:", keys.publicKey.toAccountHashStr());
    console.log("\n  SAVE THIS PRIVATE KEY TO .env.local:");
    console.log(`CASPER_PRIVATE_KEY=${privateKeyHexGenerated}`);
    console.log("\n  Fund your wallet at:");
    console.log("https://testnet.cspr.live/tools/faucet");
    console.log("========================================\n");
    return createWalletFromKey(keys);
  }
}

export async function getWallet(): Promise<WalletService> {
  if (walletInstance) {
    return walletInstance;
  }

  if (!initPromise) {
    initPromise = Promise.resolve().then(() => {
      walletInstance = initializeWallet();
      return walletInstance;
    });
  }

  return initPromise;
}

// Helper to get wallet info without full initialization logging on every call
export async function getWalletInfo(): Promise<{
  publicKey: string;
  accountHash: string;
}> {
  const wallet = await getWallet();
  return {
    publicKey: wallet.getPublicKeyHex(),
    accountHash: wallet.getAccountHash(),
  };
}

// Get the raw Keys.AsymmetricKey for SDK usage
export async function getWalletKeys(): Promise<Keys.AsymmetricKey> {
  const wallet = await getWallet();
  return wallet.keys;
}
