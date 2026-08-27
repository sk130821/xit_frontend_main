import { useState, useEffect } from 'react';
import {
  ArrowDownToLine,
  Check,
  AlertCircle,
  TrendingDown,
  Wallet,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import { useXitBalances } from '@/hooks/useXitBalances';
import { sendXitTokens, shortenAddress } from '@/lib/web3';
import type { Investment } from '@/types';
import { PageHero, HeroStat } from '@/components/member/MemberUI';

export default function SellTokens() {
  const { user, refreshUser } = useAuth();
  const { config, connectedAddress, isBlockchainMode, connect, connecting } = useWallet();
  const balances = useXitBalances();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [txExplorerUrl, setTxExplorerUrl] = useState('');
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [sellingInvestment, setSellingInvestment] = useState<Investment | null>(null);
  const [invSellAmount, setInvSellAmount] = useState('');

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [invData, settingsData] = await Promise.all([
        api.investments.list(),
        api.user.settings(),
      ]);
      const activeInv = (invData as Investment[]).filter((i) => i.status === 'active');
      setInvestments(activeInv);
      setSettings(settingsData as Record<string, string>);
    } catch (err) {
      console.error('Load error:', err);
    }
  };

  const adminChargePercent = parseFloat(settings.admin_charge_percent || '10');
  const tokenPrice = parseFloat(settings.token_price || '1');
  const sellAmount = parseFloat(amount) || 0;
  const adminCharge = (sellAmount * adminChargePercent) / 100;
  const netXit = sellAmount - adminCharge;
  const paymentSymbol = config?.paymentTokenSymbol || 'BNB';
  const paymentReceive = netXit * tokenPrice;

  const usdtWallet = Number(user?.wallet_balance || 0);
  const sellableFromInvestments = balances.planSellable;
  const totalSellable = balances.totalSellable;
  const incomeBalance = balances.incomeBalance;
  const walletXit = balances.walletTotal;

  const handleSell = async (opts?: { investmentId?: number; amount?: number }) => {
    setError('');
    setSuccess('');
    setTxExplorerUrl('');

    const sellAmt = opts?.amount ?? sellAmount;
    const investmentId = opts?.investmentId;

    if (sellAmt <= 0) {
      setError('Enter a valid amount');
      return;
    }

    const maxSellable = investmentId
      ? Number(investments.find((i) => i.id === investmentId)?.sellable_amount || 0)
      : totalSellable;

    if (sellAmt > maxSellable) {
      setError(investmentId ? 'Amount exceeds this investment sellable balance' : 'Insufficient sellable tokens');
      return;
    }

    if (!investmentId && sellAmt > totalSellable) {
      setError('Insufficient sellable tokens');
      return;
    }

    if (isBlockchainMode && !connectedAddress) {
      setError('Connect MetaMask wallet first');
      return;
    }

    if (isBlockchainMode) {
      if (!config?.bep20ContractAddress) {
        setError('XIT contract not configured. Contact admin.');
        return;
      }
      const adminWallet = config.adminPayoutWallet || config.adminTreasuryWallet;
      if (!adminWallet) {
        setError('Admin wallet not configured. Contact admin.');
        return;
      }
    }

    setLoading(true);
    try {
      let result: any;
      if (isBlockchainMode) {
        const adminWallet = config!.adminPayoutWallet || config!.adminTreasuryWallet!;
        const tokenTxHash = await sendXitTokens(
          adminWallet,
          sellAmt.toFixed(8),
          config!.bep20ContractAddress,
          config!.tokenDecimals || 18,
        );
        result = await api.investments.sell(sellAmt, tokenTxHash, investmentId);
      } else {
        result = await api.investments.sell(sellAmt, undefined, investmentId);
      }

      const symbol = result.paymentSymbol || (isBlockchainMode ? paymentSymbol : 'USDT');
      let msg = `Sold ${Number(result.sold).toFixed(2)} XIT. Admin charge: ${Number(result.adminCharge).toFixed(2)} XIT (${adminChargePercent}%).`;
      msg += ` You received ${Number(result.usdtReceived).toFixed(4)} ${symbol}.`;
      if (result.tokenReturnTxHash && config?.blockExplorerUrl) {
        setTxExplorerUrl(`${config.blockExplorerUrl}/tx/${result.tokenReturnTxHash}`);
      }
      if (result.explorerUrl) {
        msg += ' Payment sent to your wallet on-chain.';
      }
      setSuccess(msg);
      setAmount('');
      setInvSellAmount('');
      setSellingInvestment(null);
      await refreshUser();
      await loadData();
      await balances.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to sell tokens');
    } finally {
      setLoading(false);
    }
  };

  const formatInvDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <PageHero
        badge="Token Sale"
        badgeIcon={ArrowDownToLine}
        title="Sell Tokens"
        subtitle={isBlockchainMode ? `${config?.platformMode?.toUpperCase()} — send XIT to admin, receive ${paymentSymbol} back` : 'Demo mode — sell tokens with admin charge'}
      >
        <HeroStat label="Sellable" value={`${totalSellable.toFixed(0)} XIT`} accent />
      </PageHero>

      {!user?.is_active && (
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Account not active yet. Buy tokens first — then you can sell.
        </div>
      )}

      {isBlockchainMode && !connectedAddress && (
        <div className="flex items-center justify-between bg-orange-500/10 border border-orange-500/30 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 text-orange-400 text-sm">
            <Wallet className="w-4 h-4" />
            Connect wallet to sell on-chain (XIT → admin, {paymentSymbol} back)
          </div>
          <button onClick={connect} disabled={connecting} className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg font-medium">
            {connecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 text-sm">
          <Check className="w-4 h-4 flex-shrink-0" />
          <div>
            {success}
            {txExplorerUrl && (
              <a href={txExplorerUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-cyan-400 mt-1 hover:underline">
                View payout on Explorer <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
              <ArrowDownToLine className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Sell XIT Tokens</h3>
              <p className="text-xs text-gray-500">{adminChargePercent}% admin charge applies</p>
            </div>
          </div>

          {isBlockchainMode && connectedAddress && config && (
            <div className="bg-gray-900/50 rounded-xl p-3 mb-4 text-xs text-gray-400 space-y-1">
              <p>Your wallet: <span className="text-emerald-400 font-mono">{shortenAddress(connectedAddress)}</span></p>
              <p>Send XIT to: <span className="text-orange-400 font-mono">{shortenAddress(config.adminPayoutWallet || config.adminTreasuryWallet || '')}</span></p>
            </div>
          )}

          <div className="bg-gray-900/50 rounded-xl p-4 mb-4 space-y-2">
            {isBlockchainMode ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-2"><Wallet className="w-4 h-4 text-orange-400" /> Wallet XIT (on-chain)</span>
                  <span className="text-white font-medium">{walletXit.toFixed(2)} XIT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-emerald-400" /> ROI & Income (sellable)</span>
                  <span className="text-white font-medium">{incomeBalance.toFixed(2)} XIT</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-2"><Wallet className="w-4 h-4 text-emerald-400" /> Free XIT Balance</span>
                  <span className="text-white font-medium">{incomeBalance.toFixed(2)} XIT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-2"><Wallet className="w-4 h-4 text-cyan-400" /> USDT Wallet</span>
                  <span className="text-white font-medium">{usdtWallet.toFixed(2)} USDT</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-blue-400" /> Sellable from Investments</span>
              <span className="text-white font-medium">{sellableFromInvestments.toFixed(2)} XIT</span>
            </div>
            <div className="border-t border-gray-800 pt-2 flex justify-between text-sm">
              <span className="text-gray-300 font-medium">Total Sellable</span>
              <span className="text-emerald-400 font-bold">{totalSellable.toFixed(2)} XIT</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Sell Amount</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white text-lg font-medium focus:border-orange-500 outline-none"
                  placeholder="0"
                  max={totalSellable}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">XIT</span>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-400">Sell Amount</span><span className="text-white font-medium">{sellAmount.toFixed(2)} XIT</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Admin Charge ({adminChargePercent}%)</span><span className="text-red-400 font-medium">- {adminCharge.toFixed(2)} XIT</span></div>
              <div className="border-t border-gray-800 pt-2 flex justify-between text-sm"><span className="text-gray-300 font-medium">You Receive</span><span className="text-emerald-400 font-bold text-base">{paymentReceive.toFixed(4)} {isBlockchainMode ? paymentSymbol : 'USDT'}</span></div>
            </div>

            <button
              onClick={() => handleSell()}
              disabled={loading || !user?.is_active || sellAmount <= 0 || sellAmount > totalSellable || (isBlockchainMode && !connectedAddress)}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ArrowDownToLine className="w-4 h-4" />
                  Sell {sellAmount > 0 ? `${sellAmount} ` : ''}Tokens
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-1">Your Investments</h3>
            <p className="text-xs text-gray-500 mb-4">Sell from a specific investment — each has its own sellable balance and date.</p>
            {investments.filter((i) => i.status === 'active').length === 0 ? (
              <div className="text-center py-6">
                <TrendingDown className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No active investments</p>
              </div>
            ) : (
              <div className="space-y-3">
                {investments.filter((i) => i.status === 'active').map((inv) => {
                  const sellable = Number(inv.sellable_amount);
                  const canSell = sellable > 0;
                  const isSelling = sellingInvestment?.id === inv.id;
                  const invAmount = parseFloat(invSellAmount) || 0;

                  return (
                    <div key={inv.id} className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                      <div className="flex justify-between items-start gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              inv.plan_type === 'lock'
                                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                                : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                            }`}>
                              {inv.plan_type === 'lock' ? 'Lock Plan' : 'Flexible 2X'}
                            </span>
                            {inv.income_eligible === false && (
                              <span className="text-[10px] text-gray-500 border border-gray-700 rounded-full px-2 py-0.5">ROI only</span>
                            )}
                          </div>
                          <p className="text-sm text-white font-medium">{Number(inv.token_amount).toFixed(2)} XIT invested</p>
                          <p className="text-xs text-gray-500 mt-0.5">Started {formatInvDate(inv.created_at)}</p>
                        </div>
                        <div className="text-right shrink-0">
                          {canSell ? (
                            <>
                              <p className="text-sm font-semibold text-emerald-400">{sellable.toFixed(2)}</p>
                              <p className="text-xs text-gray-500">sellable</p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm font-semibold text-gray-500">0.00</p>
                              <p className="text-xs text-gray-600">locked</p>
                            </>
                          )}
                        </div>
                      </div>

                      {canSell && (
                        <div className="mt-3 pt-3 border-t border-gray-800">
                          {!isSelling ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSellingInvestment(inv);
                                setInvSellAmount('');
                                setError('');
                              }}
                              disabled={loading || !user?.is_active || (isBlockchainMode && !connectedAddress)}
                              className="w-full text-sm font-medium py-2 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-300 hover:bg-orange-500/25 transition-colors disabled:opacity-50"
                            >
                              Sell from this investment
                            </button>
                          ) : (
                            <div className="space-y-2">
                              <div className="relative">
                                <input
                                  type="number"
                                  value={invSellAmount}
                                  onChange={(e) => setInvSellAmount(e.target.value)}
                                  placeholder="Amount"
                                  max={sellable}
                                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => setInvSellAmount(String(sellable))}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-orange-400 font-semibold uppercase"
                                >
                                  Max
                                </button>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleSell({ investmentId: inv.id, amount: invAmount })}
                                  disabled={loading || invAmount <= 0 || invAmount > sellable || (isBlockchainMode && !connectedAddress)}
                                  className="flex-1 text-sm font-medium py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white disabled:opacity-50"
                                >
                                  {loading ? 'Selling...' : `Sell ${invAmount > 0 ? invAmount : ''}`}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => { setSellingInvestment(null); setInvSellAmount(''); }}
                                  className="px-3 py-2 text-sm text-gray-400 border border-gray-700 rounded-lg hover:text-white"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <h4 className="text-sm font-semibold text-orange-300">How Selling Works</h4>
            </div>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li className="flex items-start gap-2"><Check className="w-3 h-3 text-orange-400 mt-0.5 flex-shrink-0" />10% admin charge on every sale</li>
              <li className="flex items-start gap-2"><Check className="w-3 h-3 text-orange-400 mt-0.5 flex-shrink-0" />Sell ROI/income from the top form, or sell from a specific investment card</li>
              <li className="flex items-start gap-2"><Check className="w-3 h-3 text-orange-400 mt-0.5 flex-shrink-0" />Flexible plan: 80% sellable per investment</li>
              <li className="flex items-start gap-2"><Check className="w-3 h-3 text-orange-400 mt-0.5 flex-shrink-0" />Lock plan (&lt;100 XIT): not sellable — ROI only</li>
              {!isBlockchainMode && (
                <li className="flex items-start gap-2"><Check className="w-3 h-3 text-orange-400 mt-0.5 flex-shrink-0" />Demo mode: net USDT credited to your USDT wallet</li>
              )}
              {isBlockchainMode && (
                <li className="flex items-start gap-2"><Check className="w-3 h-3 text-orange-400 mt-0.5 flex-shrink-0" />Blockchain: send XIT from MetaMask to admin, receive {paymentSymbol} back</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
