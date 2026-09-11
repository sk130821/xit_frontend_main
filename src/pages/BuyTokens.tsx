import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Check,
  AlertCircle,
  Wallet,
  ExternalLink,
  Lock,
  Unlock,
  Sparkles,
  TrendingUp,
  Gift,
  Zap,
  ArrowRight,
  History,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import { useXitBalances } from '@/hooks/useXitBalances';
import { sendPayment, shortenAddress } from '@/lib/web3';
import { PLAN_CONFIG, calcTotalReturn } from '@/lib/constants';

const QUICK_AMOUNTS = [10, 50, 100, 500, 1000];

export default function BuyTokens() {
  const { user, refreshUser } = useAuth();
  const {
    config,
    connectedAddress,
    isBlockchainMode,
    connect,
    connecting,
    refreshConfig,
    walletMismatch,
    ensurePayingWallet,
  } = useWallet();
  const balances = useXitBalances();
  const [selectedPlan, setSelectedPlan] = useState<'lock' | 'flexible' | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [lastTxHash, setLastTxHash] = useState('');
  const [recoverTxHash, setRecoverTxHash] = useState('');
  const [showRecover, setShowRecover] = useState(false);
  const [pendingPayTx, setPendingPayTx] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const settingsData = await api.user.settings();
      setSettings(settingsData as Record<string, string>);
      await refreshConfig();
    } catch (err) {
      console.error('Load error:', err);
    }
  };

  const tokenAmount = parseFloat(amount) || 0;
  const minPurchase = parseFloat(settings.min_purchase || '1');
  const flexibleMin = parseFloat(settings.flexible_min_tokens || '100');
  const minAmount = minPurchase;
  const minReferral = parseFloat(settings.min_referral_purchase || '100');
  const referralPercent = parseFloat(settings.referral_bonus_percent || '5');
  const isBelowFlexibleMin = tokenAmount > 0 && tokenAmount < flexibleMin;
  const effectivePlan: 'lock' | 'flexible' | null = useMemo(() => {
    if (isBelowFlexibleMin) return 'lock';
    return selectedPlan;
  }, [isBelowFlexibleMin, selectedPlan]);

  useEffect(() => {
    if (isBelowFlexibleMin && selectedPlan === 'flexible') {
      setSelectedPlan('lock');
    }
  }, [isBelowFlexibleMin, selectedPlan]);

  const referralBonus = tokenAmount >= minReferral && !isBelowFlexibleMin ? (tokenAmount * referralPercent) / 100 : 0;
  const tokenPrice = config?.tokenPrice || parseFloat(settings.token_price || '1');
  const paymentAmount = tokenAmount * tokenPrice;

  const plan = effectivePlan ? PLAN_CONFIG[effectivePlan] : null;
  const totalReturn = plan ? calcTotalReturn(tokenAmount, plan) : 0;
  const profit = totalReturn - tokenAmount;
  const dailyEarning = plan ? (tokenAmount * plan.dailyRoi) / 100 : 0;
  const sellable = plan ? (tokenAmount * plan.sellablePercent) / 100 : 0;
  const locked = plan ? (tokenAmount * plan.lockedPercent) / 100 : 0;
  const lockDaysLock = parseInt(settings.lock_period_days || '365');
  const lockDaysFlexible = parseInt(settings.flexible_lock_days || '365');

  const handleDemoBuy = async () => {
    setError('');
    setSuccess('');

    if (!effectivePlan) {
      setError('Please select an investment plan first');
      return;
    }

    if (tokenAmount < minAmount) {
      setError(`Minimum purchase is ${minAmount} tokens`);
      return;
    }

    setLoading(true);
    try {
      const result: any = await api.tokens.buy(tokenAmount, effectivePlan);
      const bonusMsg = result.referralBonus > 0
        ? ` Sponsor received ${Number(result.referralBonus).toFixed(2)} XIT referral bonus.`
        : '';
      const lockNote = result.investment?.planAutoLocked
        ? ' (Auto Lock Plan — under 100 XIT, ROI only)'
        : '';
      setSuccess(
        `${tokenAmount} XIT purchased & invested in ${plan!.name}${lockNote}. Total return: ${Number(result.investment?.totalReturn).toFixed(2)} XIT.${
          result.accountActivated ? ' Your account is now active!' : ''
        }${bonusMsg}`
      );
      setAmount('');
      await refreshUser();
    } catch (err: any) {
      setError(err.message || 'Failed to purchase tokens');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockchainBuy = async () => {
    setError('');
    setSuccess('');
    setLastTxHash('');
    setPendingPayTx('');

    if (!config?.adminTreasuryWallet) {
      setError('Admin treasury wallet not configured. Contact admin.');
      return;
    }

    if (!config?.paymentTokenAddress) {
      setError('USDT payment is not configured. Admin must set BSC USDT (payment_token_address).');
      return;
    }

    if (!effectivePlan) {
      setError('Please select an investment plan first');
      return;
    }

    if (tokenAmount < minAmount) {
      setError(`Minimum purchase is ${minAmount} tokens`);
      return;
    }

    setLoading(true);
    let paidTxHash = '';
    try {
      // Link MetaMask active account BEFORE USDT leaves the wallet
      const payingFrom = await ensurePayingWallet();

      paidTxHash = await sendPayment(
        config.adminTreasuryWallet,
        paymentAmount.toFixed(8),
        config.paymentTokenAddress,
        config.paymentDecimals,
        {
          chainId: config.chainId,
          chainName: config.chainName,
          rpcUrl: config.rpcUrl,
        },
        payingFrom
      );
      setPendingPayTx(paidTxHash);

      const result: any = await api.blockchain.verifyBuy(paidTxHash, tokenAmount, effectivePlan);
      setLastTxHash(result.tokenPayoutTxHash || paidTxHash);
      setPendingPayTx('');
      const syncNote = result.walletSynced
        ? ` Wallet linked to payer ${shortenAddress(result.payerAddress)}.`
        : '';
      setSuccess(
        `On-chain purchase confirmed! ${tokenAmount} XIT sent to ${shortenAddress(result.payerAddress || payingFrom)}. Invested in ${plan!.name}. Total return: ${Number(result.investment?.totalReturn).toFixed(2)} XIT.${
          result.accountActivated ? ' Your account is now active!' : ''
        }${result.referralBonus > 0 ? ` Referral bonus: ${Number(result.referralBonus).toFixed(2)} XIT` : ''}${syncNote}`
      );
      setAmount('');
      await refreshUser();
    } catch (err: any) {
      if (paidTxHash) {
        setPendingPayTx(paidTxHash);
        setRecoverTxHash(paidTxHash);
        setShowRecover(true);
        setError(
          `${err.message || 'Purchase failed after USDT payment'}. USDT tx: ${paidTxHash}. Use Complete purchase below — do not pay again.`
        );
      } else {
        setError(err.message || 'Blockchain purchase failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteBuy = async () => {
    setError('');
    setSuccess('');

    const tx = recoverTxHash.trim() || pendingPayTx.trim();
    if (!tx || !/^0x[a-fA-F0-9]{64}$/.test(tx)) {
      setError('Enter a valid USDT payment transaction hash (0x…)');
      return;
    }
    if (!effectivePlan) {
      setError('Select the same plan you paid for');
      return;
    }
    if (tokenAmount < minAmount) {
      setError(`Enter the same token amount you paid for (min ${minAmount})`);
      return;
    }

    setLoading(true);
    try {
      const result: any = await api.blockchain.completeBuy(tx, tokenAmount, effectivePlan);
      setLastTxHash(result.tokenPayoutTxHash || tx);
      setPendingPayTx('');
      setRecoverTxHash('');
      setShowRecover(false);
      setSuccess(
        `Purchase completed from existing payment! ${tokenAmount} XIT sent to ${shortenAddress(result.payerAddress || '')}. Invested in ${plan!.name}.${
          result.accountActivated ? ' Account activated.' : ''
        }`
      );
      setAmount('');
      await refreshUser();
    } catch (err: any) {
      setError(err.message || 'Could not complete purchase from this tx');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-[#1a1208] via-[#121820] to-[#0a0e17] p-6 sm:p-8">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-300 text-[11px] font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              One-Step Purchase
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Buy & Invest</h1>
            <p className="text-gray-400 text-sm mt-2 max-w-xl">
              {isBlockchainMode
                ? 'Pay with MetaMask — tokens are purchased and invested in your chosen plan instantly.'
                : 'Purchase XIT tokens and start earning daily ROI in a single step.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <ModeBadge
              label={isBlockchainMode ? config?.platformMode?.toUpperCase() || 'BLOCKCHAIN' : 'DEMO'}
              sub={isBlockchainMode ? 'On-chain mode' : 'Simulation mode'}
              accent={isBlockchainMode ? 'orange' : 'emerald'}
            />
            <ModeBadge
              label={isBlockchainMode ? `${balances.walletTotal.toFixed(0)} XIT` : `${Number(user?.wallet_balance || 0).toFixed(0)} USDT`}
              sub={isBlockchainMode ? 'Wallet balance' : 'Your USDT wallet'}
              accent={isBlockchainMode ? 'orange' : 'emerald'}
            />
            {!isBlockchainMode && (
              <ModeBadge
                label={`$${paymentAmount.toFixed(0)}`}
                sub={tokenAmount > 0 ? 'Cost for this buy' : 'Select amount'}
                accent="amber"
              />
            )}
            <ModeBadge
              label={`$${tokenPrice}`}
              sub="Per XIT token"
              accent="cyan"
            />
            <ModeBadge
              label={`${minAmount}+ XIT`}
              sub="Minimum buy"
              accent="purple"
            />
          </div>
        </div>
      </div>

      {!user?.is_active && (
        <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-2xl px-5 py-4 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-200">Pending account</p>
            <p className="text-amber-400/80 mt-0.5">You can buy here — first purchase auto-activates your account. Sell & referral unlock after activation.</p>
          </div>
        </div>
      )}

      {isBlockchainMode && !connectedAddress && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-orange-500/10 to-amber-500/5 border border-orange-500/25 rounded-2xl px-5 py-4">
          <div className="flex items-center gap-3 text-orange-300 text-sm">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-orange-200">Connect MetaMask</p>
              <p className="text-orange-400/70 text-xs">Required for on-chain purchase</p>
            </div>
          </div>
          <button
            onClick={connect}
            disabled={connecting}
            className="shrink-0 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-orange-500/20"
          >
            {connecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      )}

      {isBlockchainMode && connectedAddress && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-900/60 border border-gray-800 rounded-2xl px-5 py-3 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-500">Paying from</span>
            <span className="font-mono text-emerald-300">{shortenAddress(connectedAddress)}</span>
            {user?.wallet_address &&
              user.wallet_address.toLowerCase() === connectedAddress.toLowerCase() && (
                <span className="text-[10px] uppercase tracking-wider text-emerald-500/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Linked
                </span>
              )}
          </div>
          {walletMismatch && (
            <button
              type="button"
              onClick={() => ensurePayingWallet().catch((e: any) => setError(e.message))}
              className="text-xs font-semibold text-amber-300 hover:text-amber-200 underline underline-offset-2"
            >
              Link this MetaMask account
            </button>
          )}
        </div>
      )}

      {isBlockchainMode && walletMismatch && (
        <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-2xl px-5 py-4 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-200">Wallet mismatch</p>
            <p className="text-amber-400/80 mt-0.5">
              Account linked: <span className="font-mono">{shortenAddress(user?.wallet_address || '')}</span>
              {' · '}MetaMask: <span className="font-mono">{shortenAddress(connectedAddress || '')}</span>.
              We will auto-link your MetaMask account before USDT payment so tokens go to the payer.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl px-5 py-4 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl px-5 py-4 text-sm">
          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            {success}
            {lastTxHash && config?.blockExplorerUrl && (
              <a
                href={`${config.blockExplorerUrl}/tx/${lastTxHash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-cyan-400 mt-2 hover:underline"
              >
                View on Explorer <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Plan selection */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Choose Your Plan</h2>
          </div>
          {!effectivePlan ? (
            <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-full font-medium">
              Select a plan to continue
            </span>
          ) : (
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              effectivePlan === 'lock'
                ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                : 'bg-blue-500/15 border-blue-500/40 text-blue-300'
            }`}>
              ✓ {effectivePlan === 'lock' ? 'Lock Plan' : 'Flexible Plan'}{isBelowFlexibleMin ? ' (auto)' : ''} selected
            </span>
          )}
        </div>
        {isBelowFlexibleMin && (
          <div className="mb-4 flex items-start gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-xl px-4 py-3 text-sm">
            <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              Under {flexibleMin} XIT → <strong>Lock Plan only</strong>. You get daily ROI only — no referral, level, or reward income.
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <PlanCard
            plan="lock"
            selected={effectivePlan}
            onSelect={() => { setSelectedPlan('lock'); setError(''); }}
            icon={Lock}
            multiplier="4X"
            badge="Max Returns"
            title="Lock Plan"
            subtitle="3X Profit · 0.82% Daily ROI"
            dailyRoi="0.82%"
            totalReturn="400 total (100 + 300 profit)"
            sellable="0% — fully locked"
            lockLabel={`${lockDaysLock} days lock`}
            note={`All tokens locked for ${lockDaysLock} days. Best for long-term growth.`}
            gradient="from-purple-600/20 via-purple-900/10 to-[#111827]"
            accent="purple"
          />
          <PlanCard
            plan="flexible"
            selected={effectivePlan}
            disabled={isBelowFlexibleMin}
            disabledReason={`Requires ${flexibleMin}+ XIT`}
            onSelect={() => { if (!isBelowFlexibleMin) { setSelectedPlan('flexible'); setError(''); } }}
            icon={Unlock}
            multiplier="3X"
            badge="Flexible"
            title="Flexible Plan"
            subtitle="2X Profit · 0.53% Daily ROI"
            dailyRoi="0.53%"
            totalReturn="300 total (100 + 200 profit)"
            sellable="80% sellable anytime"
            lockLabel={`20% locked · ${lockDaysFlexible} days`}
            note="80% sellable anytime, 20% locked. 10% admin charge on sales."
            gradient="from-blue-600/20 via-blue-900/10 to-[#111827]"
            accent="blue"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Purchase form */}
        <div className="xl:col-span-3 relative overflow-hidden rounded-3xl border border-gray-800 bg-[#111827] p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                {isBlockchainMode ? <Wallet className="w-5 h-5 text-white" /> : <ShoppingCart className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {isBlockchainMode ? 'On-Chain Purchase' : 'Quick Purchase'}
                </h3>
                <p className={`text-xs ${effectivePlan ? 'text-emerald-400' : 'text-amber-400/80'}`}>
                  {effectivePlan ? `Selected: ${plan!.name}${isBelowFlexibleMin ? ' (auto)' : ''}` : 'No plan selected — choose above'}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Enter Token Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-gray-900/70 border border-gray-700 rounded-2xl px-5 py-4 text-white text-2xl font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all tabular-nums"
                    placeholder="0.00"
                    min={minAmount}
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-400 font-semibold text-sm">XIT</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {QUICK_AMOUNTS.map((qa) => (
                    <button
                      key={qa}
                      type="button"
                      onClick={() => setAmount(String(qa))}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        tokenAmount === qa
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                          : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                      }`}
                    >
                      {qa.toLocaleString()} XIT
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Min {minAmount} XIT · ${tokenPrice}/token
                  {isBlockchainMode && ` · Pay in USDT (BEP-20) on ${config?.chainName || 'BNB Smart Chain'}`}
                  {!isBlockchainMode && ` · You pay ${paymentAmount.toFixed(2)} USDT from wallet`}
                </p>
              </div>

              {isBlockchainMode && config?.adminTreasuryWallet && (
                <div className="text-xs text-gray-500 bg-gray-900/50 border border-gray-800 rounded-xl p-3 space-y-1">
                  <p>
                    Treasury: <span className="text-gray-300 font-mono">{shortenAddress(config.adminTreasuryWallet)}</span>
                  </p>
                  {connectedAddress && (
                    <p>
                      You pay from:{' '}
                      <span className="text-emerald-300 font-mono">{shortenAddress(connectedAddress)}</span>
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={isBlockchainMode ? handleBlockchainBuy : handleDemoBuy}
                disabled={loading || !effectivePlan || tokenAmount < minAmount || (isBlockchainMode && !connectedAddress)}
                className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:via-teal-400 hover:to-emerald-500 text-white font-semibold py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : !effectivePlan ? (
                  <>Select a Plan First</>
                ) : (
                  <>
                    {isBlockchainMode ? <Wallet className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                    {isBlockchainMode
                      ? `Pay & Invest${tokenAmount > 0 ? ` · ${tokenAmount.toLocaleString()} XIT` : ''}`
                      : `Buy & Invest${tokenAmount > 0 ? ` · ${tokenAmount.toLocaleString()} XIT` : ''}`}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {isBlockchainMode && (
                <div className="pt-2 border-t border-gray-800/80">
                  <button
                    type="button"
                    onClick={() => setShowRecover((v) => !v)}
                    className="text-xs text-cyan-400/90 hover:text-cyan-300 underline underline-offset-2"
                  >
                    {showRecover ? 'Hide' : 'Already paid USDT? Complete purchase'}
                  </button>
                  {(showRecover || pendingPayTx) && (
                    <div className="mt-3 space-y-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
                      <p className="text-xs text-cyan-200/80 leading-relaxed">
                        Paste your USDT payment tx hash. Enter the same token amount and plan — no second payment.
                      </p>
                      <input
                        type="text"
                        value={recoverTxHash}
                        onChange={(e) => setRecoverTxHash(e.target.value.trim())}
                        placeholder="0x… USDT tx hash"
                        className="w-full bg-gray-900/70 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:border-cyan-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCompleteBuy}
                        disabled={loading || !effectivePlan || tokenAmount < minAmount}
                        className="w-full bg-cyan-600/80 hover:bg-cyan-500 text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-50"
                      >
                        Complete purchase (no re-pay)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live projection */}
        <div className="xl:col-span-2 space-y-4">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-[#0a1512] to-[#111827] p-6">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider">Live Projection</h3>
              </div>

              <div className={`text-center mb-5 py-4 rounded-2xl border ${
                effectivePlan
                  ? 'bg-emerald-500/5 border-emerald-500/15'
                  : 'bg-gray-900/30 border-gray-800'
              }`}>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Return</p>
                {effectivePlan ? (
                  <>
                    <p className="text-3xl font-bold text-white tabular-nums">
                      {totalReturn.toFixed(2)}
                      <span className="text-emerald-400 text-lg ml-1">XIT</span>
                    </p>
                    {tokenAmount > 0 && (
                      <p className="text-emerald-400/80 text-xs mt-1">+{profit.toFixed(2)} XIT profit</p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 text-sm py-2">Select a plan to see projection</p>
                )}
              </div>

              <div className="space-y-3">
                <ProjectionRow label="You Invest" value={effectivePlan ? `${tokenAmount.toFixed(2)} XIT` : '—'} />
                <ProjectionRow label="Daily Earning" value={effectivePlan ? `${dailyEarning.toFixed(4)} XIT` : '—'} accent="text-cyan-400" />
                <ProjectionRow label="Sellable" value={effectivePlan ? `${sellable.toFixed(2)} XIT` : '—'} accent="text-blue-400" />
                <ProjectionRow label="Locked" value={effectivePlan ? `${locked.toFixed(2)} XIT` : '—'} accent="text-purple-400" />
                {isBlockchainMode && tokenAmount > 0 && (
                  <ProjectionRow
                    label={`Payment (USDT)`}
                    value={paymentAmount.toFixed(4)}
                    accent="text-orange-400"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Referral bonus */}
          <div className="rounded-3xl border border-gray-800 bg-[#111827] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-semibold text-white">Referral Bonus</h3>
            </div>
            <p className="text-gray-500 text-xs mb-4 leading-relaxed">
              {isBelowFlexibleMin ? (
                <>Purchases under {flexibleMin} XIT earn <span className="text-purple-300 font-medium">ROI only</span> — no sponsor or team income.</>
              ) : (
                <>Your direct sponsor earns <span className="text-orange-300 font-medium">{referralPercent}%</span> when you buy{' '}
                <span className="text-white">{minReferral}+ XIT</span>.</>
              )}
            </p>
            <div className="flex items-center justify-between bg-gradient-to-r from-orange-500/10 to-amber-500/5 border border-orange-500/20 rounded-xl px-4 py-3">
              <span className="text-gray-400 text-sm">Sponsor Gets</span>
              <span className="text-orange-300 font-bold tabular-nums">{referralBonus.toFixed(2)} XIT</span>
            </div>
          </div>
        </div>
      </div>

      <Link
        to="/investments"
        className="flex items-center justify-center gap-2 py-4 rounded-2xl border border-gray-800 bg-[#111827]/50 hover:border-orange-500/30 hover:bg-orange-500/5 text-sm text-gray-400 hover:text-orange-300 transition-all group"
      >
        <History className="w-4 h-4" />
        View Investment History & Claim ROI
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

function ModeBadge({ label, sub, accent }: { label: string; sub: string; accent: 'orange' | 'emerald' | 'cyan' | 'purple' }) {
  const colors = {
    orange: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
    emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    purple: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 min-w-[100px] ${colors[accent]}`}>
      <p className="text-sm font-bold">{label}</p>
      <p className="text-[10px] uppercase tracking-wider opacity-70 mt-0.5">{sub}</p>
    </div>
  );
}

function PlanCard({
  plan,
  selected,
  onSelect,
  disabled = false,
  disabledReason,
  icon: Icon,
  multiplier,
  badge,
  title,
  subtitle,
  dailyRoi,
  totalReturn,
  sellable,
  lockLabel,
  note,
  gradient,
  accent,
}: {
  plan: 'lock' | 'flexible';
  selected: 'lock' | 'flexible' | null;
  onSelect: () => void;
  disabled?: boolean;
  disabledReason?: string;
  icon: React.ComponentType<{ className?: string }>;
  multiplier: string;
  badge: string;
  title: string;
  subtitle: string;
  dailyRoi: string;
  totalReturn: string;
  sellable: string;
  lockLabel: string;
  note: string;
  gradient: string;
  accent: 'purple' | 'blue';
}) {
  const isSelected = selected === plan;
  const isOtherSelected = selected !== null && !isSelected;
  const isDisabled = disabled && !isSelected;

  const accentStyles = {
    purple: {
      selectedBorder: 'border-purple-400 ring-4 ring-purple-500/40 shadow-2xl shadow-purple-500/25 scale-[1.02]',
      unselectedBorder: 'border-gray-800/80 hover:border-purple-500/30',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      selectedBadge: 'bg-purple-500 text-white border-purple-400',
      icon: 'from-purple-500 to-violet-600 shadow-purple-500/30',
      iconMuted: 'from-gray-700 to-gray-800 shadow-none',
      check: 'text-white',
      ret: 'text-purple-300',
      retMuted: 'text-gray-500',
      glow: 'from-purple-500/20 via-purple-600/10 to-transparent',
      ribbon: 'bg-purple-500 text-white',
    },
    blue: {
      selectedBorder: 'border-blue-400 ring-4 ring-blue-500/40 shadow-2xl shadow-blue-500/25 scale-[1.02]',
      unselectedBorder: 'border-gray-800/80 hover:border-blue-500/30',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      selectedBadge: 'bg-blue-500 text-white border-blue-400',
      icon: 'from-blue-500 to-cyan-600 shadow-blue-500/30',
      iconMuted: 'from-gray-700 to-gray-800 shadow-none',
      check: 'text-white',
      ret: 'text-blue-300',
      retMuted: 'text-gray-500',
      glow: 'from-blue-500/20 via-blue-600/10 to-transparent',
      ribbon: 'bg-blue-500 text-white',
    },
  };
  const a = accentStyles[accent];

  return (
    <button
      type="button"
      onClick={isDisabled ? undefined : onSelect}
      disabled={isDisabled}
      className={`relative text-left overflow-hidden rounded-3xl border-2 transition-all duration-300 w-full p-6 sm:p-7 bg-gradient-to-br ${gradient} ${
        isDisabled
          ? 'border-gray-800/80 opacity-40 cursor-not-allowed'
          : isSelected
          ? a.selectedBorder
          : isOtherSelected
            ? `${a.unselectedBorder} opacity-45 scale-[0.98]`
            : a.unselectedBorder
      }`}
    >
      {isDisabled && disabledReason && (
        <div className="absolute top-4 right-4 text-[10px] uppercase tracking-wider text-gray-400 border border-gray-700 rounded-full px-2.5 py-1">
          {disabledReason}
        </div>
      )}
      {isSelected && (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br ${a.glow} pointer-events-none`} />
          <div className={`absolute top-0 left-0 right-0 ${a.ribbon} text-center text-[11px] font-bold uppercase tracking-[0.15em] py-1.5`}>
            ✓ Selected Plan
          </div>
        </>
      )}

      {!isSelected && !isOtherSelected && !isDisabled && (
        <div className="absolute top-4 right-4 text-[10px] uppercase tracking-wider text-gray-500 border border-gray-700 rounded-full px-2.5 py-1">
          Click to select
        </div>
      )}

      {isSelected && (
        <div className="absolute top-12 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
          <Check className={`w-4 h-4 ${a.check}`} strokeWidth={3} />
        </div>
      )}

      <div className={`relative flex items-start gap-4 mb-5 ${isSelected ? 'mt-6' : ''}`}>
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${isSelected ? a.icon : a.iconMuted} flex items-center justify-center shadow-lg shrink-0 transition-all`}>
          <Icon className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>{title}</h3>
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${isSelected ? a.selectedBadge : a.badge}`}>
              {badge}
            </span>
          </div>
          <p className={`text-sm ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>{subtitle}</p>
        </div>
      </div>

      <div className="relative flex items-end gap-2 mb-5">
        <span className={`text-4xl font-black transition-colors ${isSelected ? a.ret : a.retMuted}`}>{multiplier}</span>
        <span className="text-gray-500 text-sm pb-1">total return</span>
      </div>

      <div className="relative grid grid-cols-2 gap-2 mb-4">
        <StatPill label="Daily ROI" value={dailyRoi} dimmed={!isSelected} />
        <StatPill label="Sellable" value={sellable} dimmed={!isSelected} />
        <StatPill label="Lock" value={lockLabel} dimmed={!isSelected} />
        <StatPill label="Example" value={totalReturn} highlight dimmed={!isSelected} />
      </div>

      <p className={`relative text-xs leading-relaxed border-t pt-3 ${isSelected ? 'text-gray-400 border-white/10' : 'text-gray-600 border-gray-800/80'}`}>
        {note}
      </p>
    </button>
  );
}

function StatPill({ label, value, highlight, dimmed }: { label: string; value: string; highlight?: boolean; dimmed?: boolean }) {
  return (
    <div className={`rounded-xl px-3 py-2 transition-all ${
      highlight && !dimmed ? 'bg-white/5 border border-white/10' : dimmed ? 'bg-black/10' : 'bg-black/20'
    }`}>
      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
      <p className={`text-xs font-semibold mt-0.5 ${highlight && !dimmed ? 'text-emerald-300' : dimmed ? 'text-gray-500' : 'text-gray-300'}`}>
        {value}
      </p>
    </div>
  );
}

function ProjectionRow({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex justify-between items-center text-sm bg-gray-900/40 rounded-xl px-4 py-2.5 border border-gray-800/50">
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold tabular-nums ${accent || 'text-white'}`}>{value}</span>
    </div>
  );
}
