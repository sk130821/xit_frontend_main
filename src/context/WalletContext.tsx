import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api } from '@/lib/api';
import { connectWallet, switchNetwork } from '@/lib/web3';
import type { BlockchainConfig } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface WalletContextType {
  config: BlockchainConfig | null;
  connectedAddress: string | null;
  connecting: boolean;
  isBlockchainMode: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshConfig: () => Promise<void>;
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

  useEffect(() => {
    if (user?.wallet_address) {
      setConnectedAddress(user.wallet_address);
    }
  }, [user?.wallet_address]);

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

  const disconnect = () => {
    setConnectedAddress(null);
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setConnectedAddress(null);
      } else {
        setConnectedAddress(accounts[0]);
        if (user) {
          api.blockchain.linkWallet(accounts[0]).then(() => refreshUser());
        }
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    return () => window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
  }, [user, refreshUser]);

  return (
    <WalletContext.Provider value={{
      config, connectedAddress, connecting, isBlockchainMode, connect, disconnect, refreshConfig,
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
