import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api } from '@/lib/api';
import { connectWallet, getActiveWalletAddress, switchNetwork } from '@/lib/web3';
import type { BlockchainConfig } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface WalletContextType {
  config: BlockchainConfig | null;
  connectedAddress: string | null;
  connecting: boolean;
  isBlockchainMode: boolean;
  /** Active MetaMask address vs account wallet_address (lowercase compare). */
  walletMismatch: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshConfig: () => Promise<void>;
  /** Ensure active wallet is linked before paying USDT. Returns paying address. */
  ensurePayingWallet: () => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { user, refreshUser } = useAuth();
  const [config, setConfig] = useState<BlockchainConfig | null>(null);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const isBlockchainMode = config?.platformMode === 'testnet' || config?.platformMode === 'real';

  const refreshConfig = useCallback(async () => {
    try {
      const data = await api.blockchain.config();
      setConfig(data as BlockchainConfig);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    refreshConfig();
  }, [refreshConfig]);

  // Prefer live MetaMask account; fall back to linked account for display
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const active = await getActiveWalletAddress();
      if (cancelled) return;
      if (active) {
        setConnectedAddress(active);
      } else if (user?.wallet_address) {
        setConnectedAddress(String(user.wallet_address).toLowerCase());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.wallet_address]);

  const linkedAddress = (user?.wallet_address || '').toLowerCase() || null;
  const activeLower = (connectedAddress || '').toLowerCase() || null;
  const walletMismatch = !!(
    isBlockchainMode &&
    linkedAddress &&
    activeLower &&
    linkedAddress !== activeLower
  );

  const connect = async () => {
    if (!config) await refreshConfig();
    const cfg = config || (await api.blockchain.config() as BlockchainConfig);

    setConnecting(true);
    try {
      if (cfg.platformMode === 'testnet' || cfg.platformMode === 'real') {
        await switchNetwork(cfg.chainId, cfg.chainName, cfg.rpcUrl);
      }

      const address = await connectWallet();
      setConnectedAddress(address);

      if (user) {
        await api.blockchain.linkWallet(address);
        await refreshUser();
      }
    } finally {
      setConnecting(false);
    }
  };

  /** Sync MetaMask active account → users.wallet_address before USDT leave the wallet. */
  const ensurePayingWallet = async (): Promise<string> => {
    let active = await getActiveWalletAddress();
    if (!active) {
      active = await connectWallet();
    }
    setConnectedAddress(active);

    if (!user) throw new Error('Login required');

    const linked = (user.wallet_address || '').toLowerCase();
    if (linked !== active) {
      await api.blockchain.linkWallet(active);
      await refreshUser();
    }

    return active;
  };

  const disconnect = () => {
    setConnectedAddress(null);
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setConnectedAddress(null);
      } else {
        const next = String(accounts[0]).toLowerCase();
        setConnectedAddress(next);
        if (user) {
          api.blockchain.linkWallet(next).then(() => refreshUser()).catch(() => {});
        }
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    return () => window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
  }, [user, refreshUser]);

  return (
    <WalletContext.Provider value={{
      config,
      connectedAddress,
      connecting,
      isBlockchainMode,
      walletMismatch,
      connect,
      disconnect,
      refreshConfig,
      ensurePayingWallet,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
