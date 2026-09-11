import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import { api } from '@/lib/api';
import { getXitOnChainBalance } from '@/lib/web3';

export interface XitBalanceView {
  isBlockchainMode: boolean;
  loading: boolean;
  walletTotal: number;
  planSellable: number;
  planLocked: number;
  incomeBalance: number;
  totalSellable: number;
  refresh: () => Promise<void>;
}

export function useXitBalances(): XitBalanceView {
  const { user } = useAuth();
  const { config, connectedAddress, isBlockchainMode } = useWallet();
  const [loading, setLoading] = useState(false);
  const [walletTotal, setWalletTotal] = useState(0);
  const [planSellable, setPlanSellable] = useState(0);
  const [planLocked, setPlanLocked] = useState(0);
  const [incomeBalance, setIncomeBalance] = useState(0);
  const [totalSellable, setTotalSellable] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) return;

    const demoSellable = Number(user.plan_sellable || 0);
    const demoLocked = Number(user.plan_locked || 0);
    const demoFree = Number(user.xit_balance || 0);
    const lockRoiHeld = Number(user.lock_roi_held || 0);
    const demoIncomeSellable = Math.max(0, demoFree - lockRoiHeld);

    if (!isBlockchainMode) {
      setWalletTotal(demoFree + demoSellable + demoLocked);
      setPlanSellable(demoSellable);
      setPlanLocked(demoLocked);
      setIncomeBalance(demoIncomeSellable);
      setTotalSellable(demoSellable + demoIncomeSellable);
      return;
    }

    setLoading(true);
    try {
      const data = await api.blockchain.walletBalance() as {
        onChainXitBalance?: number;
        planSellable?: number;
        planLocked?: number;
        incomeBalance?: number;
        totalSellable?: number;
      };

      if (data.onChainXitBalance != null) {
        setWalletTotal(data.onChainXitBalance);
        setPlanSellable(data.planSellable ?? demoSellable);
        setPlanLocked(data.planLocked ?? demoLocked);
        setIncomeBalance(data.incomeBalance ?? 0);
        setTotalSellable(data.totalSellable ?? 0);
        return;
      }

      if (connectedAddress && config?.bep20ContractAddress && config?.rpcUrl) {
        const onChain = await getXitOnChainBalance(
          connectedAddress,
          config.bep20ContractAddress,
          config.rpcUrl,
          config.tokenDecimals || 18,
        );
        const sellable = demoSellable;
        const locked = demoLocked;
        const income = Math.max(0, onChain - locked - lockRoiHeld);
        const sellTotal = Math.min(onChain, sellable + income);

        setWalletTotal(onChain);
        setPlanSellable(sellable);
        setPlanLocked(locked);
        setIncomeBalance(income);
        setTotalSellable(sellTotal);
      } else {
        setWalletTotal(user.on_chain_xit_balance ?? 0);
        setPlanSellable(demoSellable);
        setPlanLocked(demoLocked);
        setIncomeBalance(0);
        setTotalSellable(user.total_sellable ?? demoSellable);
      }
    } catch {
      const fallback = user.on_chain_xit_balance ?? 0;
      setWalletTotal(fallback);
      setPlanSellable(demoSellable);
      setPlanLocked(demoLocked);
      setIncomeBalance(Math.max(0, fallback - demoLocked - lockRoiHeld));
      setTotalSellable(user.total_sellable ?? demoSellable);
    } finally {
      setLoading(false);
    }
  }, [user, isBlockchainMode, connectedAddress, config]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    isBlockchainMode,
    loading,
    walletTotal,
    planSellable,
    planLocked,
    incomeBalance,
    totalSellable,
    refresh,
  };
}
