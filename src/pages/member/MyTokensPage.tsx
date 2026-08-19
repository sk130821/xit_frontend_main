import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Wallet,
  Coins,
  TrendingUp,
  ShoppingBag,
  Lock,
  Unlock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function MyTokensPage() {
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    refreshUser();
  }, []);

  const purchased = Number(user?.total_purchased || 0);
  const earned = Number(user?.total_earned || 0);
  const usdtWallet = Number(user?.wallet_balance || 0);
  const xitWallet = Number(user?.xit_balance || 0);
  const planLocked = Number(user?.plan_locked || 0);
  const planSellable = Number(user?.plan_sellable || 0);
  const inPlans = planLocked + planSellable;

  // Current XIT tokens you actually hold right now
  const currentTotal = xitWallet + inPlans;

  const purchaseShare = currentTotal > 0 ? (purchased / (purchased + earned || 1)) * 100 : 0;
  const earnShare = currentTotal > 0 ? (earned / (purchased + earned || 1)) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My XIT Tokens</h1>
        <p className="text-gray-400 text-sm mt-1">USDT wallet for buy/sell · XIT holdings from plans & income</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Total Tokens — hero */}
        <div className="xl:col-span-3 relative overflow-hidden rounded-3xl border border-orange-500/25 bg-gradient-to-br from-[#1a1208] via-[#151820] to-[#0f1419] p-6 sm:p-8 shadow-2xl shadow-orange-500/10">
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-orange-300/80 font-medium">Current XIT Holdings</p>
                <p className="text-gray-500 text-xs">Free XIT + sellable + locked in plans</p>
              </div>
              <Sparkles className="w-4 h-4 text-amber-400/60 ml-auto hidden sm:block" />
            </div>

            <div className="flex items-end gap-3 mb-6">
              <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-300 via-amber-200 to-orange-400 bg-clip-text text-transparent tabular-nums">
                {currentTotal.toFixed(2)}
              </p>
              <span className="text-orange-400/80 font-semibold text-lg pb-1">XIT</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-5">
              <BreakdownChip icon={Wallet} label="Free XIT" value={xitWallet} color="from-emerald-500/20 to-emerald-600/5 border-emerald-500/25 text-emerald-300" />
              <BreakdownChip icon={Unlock} label="Sellable in Plan" value={planSellable} color="from-blue-500/20 to-blue-600/5 border-blue-500/25 text-blue-300" />
              <BreakdownChip icon={Lock} label="Locked in Plan" value={planLocked} color="from-purple-500/20 to-purple-600/5 border-purple-500/25 text-purple-300" />
            </div>

            {(purchased > 0 || earned > 0) && (
              <div className="space-y-2 mb-4">
                <p className="text-[10px] uppercase tracking-wider text-gray-600">Total acquired</p>
                <div className="flex justify-between text-[11px] uppercase tracking-wider text-gray-500">
                  <span>Purchased {purchaseShare.toFixed(0)}%</span>
                  <span>Income {earnShare.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-800/80 overflow-hidden flex">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: `${purchaseShare}%` }} />
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: `${earnShare}%` }} />
                </div>
              </div>
            )}

            {planLocked > 0 && (
              <div className="flex items-center gap-2 text-xs text-gray-400 bg-purple-500/5 border border-purple-500/20 rounded-xl px-4 py-3">
                <Lock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>
                  <span className="text-purple-300 font-medium">{planLocked.toFixed(2)} XIT</span> locked in plans
                  {planSellable > 0 && (
                    <span className="text-gray-500"> · <span className="text-blue-300">{planSellable.toFixed(2)} XIT</span> sellable from flexible plan</span>
                  )}
                </span>
              </div>
            )}

            {planLocked === 0 && planSellable > 0 && (
              <div className="flex items-center gap-2 text-xs text-gray-400 bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3">
                <Unlock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span><span className="text-blue-300 font-medium">{planSellable.toFixed(2)} XIT</span> sellable from flexible plan investments</span>
              </div>
            )}
          </div>
        </div>

        {/* USDT Wallet card */}
        <div className="xl:col-span-2 relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-[#0a1512] p-6 sm:p-8 flex flex-col justify-between min-h-[260px]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-semibold uppercase tracking-wider mb-5">
              <Wallet className="w-3.5 h-3.5" />
              USDT Wallet
            </div>
            <p className="text-gray-400 text-sm mb-1">Available USDT</p>
            <p className="text-3xl sm:text-4xl font-bold text-white tabular-nums mb-1">
              {usdtWallet.toFixed(2)}
              <span className="text-emerald-400 text-xl ml-2 font-semibold">USDT</span>
            </p>
            <p className="text-gray-500 text-xs">Decreases on buy · Increases on sell</p>
          </div>

          <div className="relative mt-6 space-y-3">
            {planSellable > 0 && (
              <div className="flex items-center justify-between text-sm bg-blue-500/5 border border-blue-500/15 rounded-xl px-4 py-3">
                <span className="text-gray-400">+ Sellable in plans</span>
                <span className="text-blue-300 font-semibold tabular-nums">{planSellable.toFixed(2)} XIT</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Link to="/buy" className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold transition-colors">
                Buy More <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/sell"
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                  user?.is_active ? 'border-gray-700 text-gray-300 hover:border-emerald-500/40 hover:text-emerald-300' : 'border-gray-800 text-gray-600 pointer-events-none opacity-50'
                }`}
              >
                Sell
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MiniStat label="Total Purchased" value={purchased} hint="Total tokens ever bought" accent="text-blue-400" barColor="bg-blue-500" />
        <MiniStat label="Total Earned" value={earned} hint="ROI, referral & bonuses" accent="text-emerald-400" barColor="bg-emerald-500" />
        <MiniStat label="Locked in Plans" value={planLocked} hint="Lock plan 100% · Flex plan 20%" accent="text-purple-400" barColor="bg-purple-500" />
        <MiniStat label="Sellable in Plans" value={planSellable} hint="Flexible plan 80% — sell page" accent="text-cyan-400" barColor="bg-cyan-500" />
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Account Details</h3>
        <dl className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between bg-gray-900/50 rounded-xl px-4 py-3 border border-gray-800">
            <dt className="text-gray-400">Referral Code</dt>
            <dd className="text-orange-400 font-mono font-semibold">{user?.referral_code}</dd>
          </div>
          <div className="flex justify-between bg-gray-900/50 rounded-xl px-4 py-3 border border-gray-800">
            <dt className="text-gray-400">Account Status</dt>
            <dd className={user?.is_active ? 'text-emerald-400' : 'text-amber-400'}>{user?.is_active ? 'Active' : 'Pending'}</dd>
          </div>
          <div className="flex justify-between bg-gray-900/50 rounded-xl px-4 py-3 border border-gray-800 md:col-span-2">
            <dt className="text-gray-400">Linked Wallet</dt>
            <dd className="text-gray-300 font-mono text-xs break-all">{user?.wallet_address || 'Not connected'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function BreakdownChip({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; color: string }) {
  return (
    <div className={`rounded-xl border bg-gradient-to-br px-3 py-2.5 ${color}`}>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3 opacity-80" />
        <span className="text-[10px] uppercase tracking-wider opacity-80 leading-tight">{label}</span>
      </div>
      <p className="text-sm font-bold text-white tabular-nums">{value.toFixed(2)}</p>
    </div>
  );
}

function MiniStat({ label, value, hint, accent, barColor }: { label: string; value: number; hint: string; accent: string; barColor: string }) {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold tabular-nums ${accent}`}>{value.toFixed(2)} XIT</p>
      <p className="text-gray-600 text-xs mt-1 mb-3">{hint}</p>
      <div className="h-1 rounded-full bg-gray-800 overflow-hidden">
        <div className={`h-full ${barColor} rounded-full opacity-60`} style={{ width: value > 0 ? '100%' : '0%' }} />
      </div>
    </div>
  );
}
