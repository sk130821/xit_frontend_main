import { useState, useEffect } from 'react';
import {
  Wallet,
  TrendingUp,
  Coins,
  Users,
  Copy,
  Check,
  Gift,
  Activity,
  Award,
  LayoutDashboard,
  ArrowRight,
  Lock,
  Unlock,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useXitBalances } from '@/hooks/useXitBalances';
import { useWallet } from '@/context/WalletContext';
import type { Investment, Transaction, LevelBonusRate, NetworkResponse, ReferralNetworkMember, RewardStatus } from '@/types';
import { TRANSACTION_LABELS, TRANSACTION_COLORS, planTypeLabel, planTypeShortLabel, planTypeBadgeClass } from '@/lib/constants';
import { PageHero, HeroStat } from '@/components/member/MemberUI';

export default function Dashboard() {
  const { user } = useAuth();
  const { isBlockchainMode } = useWallet();
  const balances = useXitBalances();
  const location = useLocation();
  const navigate = useNavigate();
  const [flash, setFlash] = useState('');
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [levelBonusRates, setLevelBonusRates] = useState<LevelBonusRate[]>([]);
  const [rewardStatus, setRewardStatus] = useState<RewardStatus | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [directVolume, setDirectVolume] = useState(0);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  useEffect(() => {
    const msg = (location.state as { flash?: string } | null)?.flash;
    if (msg) {
      setFlash(msg);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  const loadData = async () => {
    try {
      const [investmentsData, transactionsData, ratesData, networkData, rewardData] = await Promise.all([
        api.investments.list(),
        api.user.transactions({ limit: '100' }),
        api.user.levelBonusRates(),
        api.user.network(),
        api.user.rewardStatus(),
      ]);

      setInvestments(investmentsData as Investment[]);
      setTransactions((transactionsData as { items: Transaction[] }).items);
      setLevelBonusRates(ratesData as LevelBonusRate[]);
      setRewardStatus(rewardData as RewardStatus);

      const networkPayload = networkData as NetworkResponse | ReferralNetworkMember[];
      const members = Array.isArray(networkPayload) ? networkPayload : (networkPayload.members || []);
      const directs = members.filter((m) => m.level === 1);
      setReferralCount(
        !Array.isArray(networkPayload) && networkPayload.summary
          ? Number(networkPayload.summary.direct_count || directs.length)
          : directs.length
      );
      setDirectVolume(directs.reduce((sum, m) => sum + Number(m.total_purchased || m.self_business || 0), 0));
    } catch (err) {
      console.error('Dashboard load error:', err);
    }
  };

  const copyReferralLink = () => {
    if (!user?.is_active) return;
    const link = `${window.location.origin}/login?ref=${user?.referral_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeInvestments = investments.filter((i) => i.status === 'active');
  const flexiblePlan = sumPlanTokens(investments, 'flexible');
  const lockPlan = sumPlanTokens(investments, 'lock');
  const flexibleLockPlan = sumPlanTokens(investments, 'flexible_lock');
  const totalRoi = transactions.filter((t) => t.type === 'roi').reduce((s, t) => s + Number(t.amount), 0);
  const totalReferral = transactions.filter((t) => t.type === 'referral_bonus').reduce((s, t) => s + Number(t.amount), 0);
  const totalLevelBonus = transactions.filter((t) => t.type === 'level_bonus').reduce((s, t) => s + Number(t.amount), 0);
  const totalRewardBonus = transactions.filter((t) => t.type === 'reward_bonus').reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div className="space-y-6">
      <PageHero badge="Member Panel" badgeIcon={LayoutDashboard} title={`Welcome, ${user?.username}`} subtitle="Your XIT Token MLM overview at a glance">
        <div className="flex gap-3 flex-wrap">
          {!isBlockchainMode && (
            <HeroStat label="USDT Wallet" value={`${Number(user?.wallet_balance || 0).toFixed(0)} USDT`} accent />
          )}
          <HeroStat
            label="Sellable"
            value={`${balances.totalSellable.toFixed(0)} XIT`}
            accent={isBlockchainMode}
          />
        </div>
      </PageHero>

      {flash && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 text-sm">
          <Check className="w-4 h-4 flex-shrink-0" />
          {flash}
        </div>
      )}

      {!user?.is_active && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl px-4 py-3 text-sm">
          Account pending — buy tokens to auto-activate. Until then you cannot sell or sponsor new members.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {!isBlockchainMode && (
          <StatCard label="USDT Wallet" value={Number(user?.wallet_balance || 0).toFixed(2)} suffix="USDT" icon={Wallet} color="emerald" />
        )}
        <StatCard
          label={isBlockchainMode ? 'Sellable XIT' : 'Free XIT'}
          value={isBlockchainMode ? balances.totalSellable.toFixed(2) : balances.incomeBalance.toFixed(2)}
          suffix="XIT"
          icon={TrendingUp}
          color="blue"
        />
        <StatCard label="Total Invested" value={Number(user?.total_invested || 0).toFixed(2)} suffix="XIT" icon={Coins} color="purple" />
        <StatCard label="Direct Referrals" value={String(referralCount)} icon={Users} color="cyan" />
      </div>

      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Gift className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">Your Referral Code</h3>
            </div>
            <p className="text-gray-400 text-sm">
              {user?.is_active
                ? 'Share link — earn referral bonus, level bonus & reward bonus'
                : 'Buy tokens to activate — then share your referral link'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gray-900/60 border border-gray-700 rounded-xl px-5 py-3">
              <span className={`text-xl font-bold tracking-wider ${user?.is_active ? 'text-emerald-400' : 'text-gray-500'}`}>
                {user?.referral_code}
              </span>
            </div>
            <button
              onClick={copyReferralLink}
              disabled={!user?.is_active}
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-3 rounded-xl transition-all flex items-center gap-2 text-sm font-medium shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PlanSplitCard
          title="Flexible"
          rate="0.53%"
          tokens={flexiblePlan.tokens}
          roi={flexiblePlan.roi}
          accent="blue"
          icon={Unlock}
        />
        <PlanSplitCard
          title="Lock"
          rate="0.82%"
          tokens={lockPlan.tokens}
          roi={lockPlan.roi}
          accent="purple"
          icon={Lock}
        />
        <PlanSplitCard
          title="Flexible Lock"
          rate="0.82%"
          tokens={flexibleLockPlan.tokens}
          roi={flexibleLockPlan.roi}
          accent="amber"
          icon={Lock}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <IncomeCard label="ROI Income" value={totalRoi} color="green" />
        <IncomeCard label="Referral Bonus" value={totalReferral} color="cyan" />
        <IncomeCard label="Level Bonus" value={totalLevelBonus} color="teal" />
        <IncomeCard label="Reward Bonus" value={totalRewardBonus} color="yellow" />
      </div>

      {rewardStatus && (
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Reward Bonus Status</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <p className="text-xs text-gray-500">Direct Referrals</p>
              <p className="text-xl font-bold text-white">{rewardStatus.direct_count}</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <p className="text-xs text-gray-500">Combined Direct Volume</p>
              <p className="text-xl font-bold text-white">{rewardStatus.direct_volume.toFixed(0)} XIT</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <p className="text-xs text-gray-500">Current Tier</p>
              <p className="text-xl font-bold text-yellow-400">
                {rewardStatus.current_tier ? `${rewardStatus.current_tier.tier_name} (${rewardStatus.current_tier.percentage}%)` : 'None'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {rewardStatus.tiers.map((tier) => (
              <div key={tier.id} className={`rounded-lg p-3 text-center border ${tier.qualified ? 'border-yellow-500/40 bg-yellow-500/10' : 'border-gray-800 bg-gray-900/30'}`}>
                <p className="text-xs text-gray-400">{tier.tier_name}</p>
                <p className="text-sm font-bold text-white mt-1">{tier.percentage}%</p>
                <p className="text-xs text-gray-500 mt-1">{(tier.min_volume / 1000).toFixed(0)}K each leg · {tier.qualifying_count}/{tier.required_directs}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Active Investments</h3>
            <Activity className="w-5 h-5 text-gray-500" />
          </div>
          {activeInvestments.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="w-10 h-10 text-gray-700 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No active investments yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeInvestments.map((inv) => {
                const progress = (Number(inv.roi_received) / Number(inv.total_return)) * 100;
                return (
                  <div key={inv.id} className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${planTypeBadgeClass(inv.plan_type)}`}>
                          {planTypeLabel(inv.plan_type)}
                        </span>
                        <span className="text-sm text-white font-medium">{Number(inv.token_amount).toFixed(0)} XIT</span>
                      </div>
                      <span className="text-xs text-gray-400">ROI: {Number(inv.daily_roi_rate)}%/day</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Received: {Number(inv.roi_received).toFixed(2)}</span>
                      <span>Target: {Number(inv.total_return).toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
            <Link to="/transactions" className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="w-10 h-10 text-gray-700 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.slice(0, 6).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
                  <div>
                    <p className="text-sm text-white font-medium">
                      {TRANSACTION_LABELS[tx.type] || tx.type}
                      {tx.type === 'roi' && tx.plan_type ? ` · ${planTypeShortLabel(tx.plan_type)}` : ''}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.created_at).toLocaleDateString()}
                      {tx.type === 'roi' && tx.plan_type
                        ? ` · ${planTypeLabel(tx.plan_type)}`
                        : tx.description ? ` · ${tx.description}` : ''}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold ${TRANSACTION_COLORS[tx.type] || 'text-gray-400'}`}>
                    +{Number(tx.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Level Bonus on ROI (Income Type 2)</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-3">
          {levelBonusRates.map((rate) => (
            <div key={rate.level} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Level</p>
              <p className="text-lg font-bold text-white">{rate.level}</p>
              <p className="text-sm text-emerald-400 font-semibold mt-1">{Number(rate.percentage)}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MiniStat label="Direct Team Purchase Volume" value={`${directVolume.toFixed(2)} XIT`} icon={Users} />
        <MiniStat label="Total Income (All Types)" value={`${(totalRoi + totalReferral + totalLevelBonus + totalRewardBonus).toFixed(2)} XIT`} icon={Gift} />
      </div>
    </div>
  );
}

function sumPlanTokens(list: Investment[], planType: Investment['plan_type']) {
  const rows = list.filter((i) => i.plan_type === planType && i.status !== 'cancelled');
  return {
    tokens: rows.reduce((s, i) => s + Number(i.token_amount || 0), 0),
    roi: rows.reduce((s, i) => s + Number(i.roi_received || 0), 0),
  };
}

function PlanSplitCard({
  title,
  rate,
  tokens,
  roi,
  accent,
  icon: Icon,
}: {
  title: string;
  rate: string;
  tokens: number;
  roi: number;
  accent: 'blue' | 'purple' | 'amber';
  icon: typeof Lock;
}) {
  const styles = {
    blue: 'border-blue-500/25 from-blue-600/15 text-blue-300',
    purple: 'border-purple-500/25 from-purple-600/15 text-purple-300',
    amber: 'border-amber-500/25 from-amber-600/15 text-amber-200',
  };
  return (
    <div className={`rounded-2xl border bg-gradient-to-br to-[#111827] p-5 ${styles[accent]}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-[11px] text-gray-500">Daily ROI {rate}</p>
        </div>
        <Icon className="w-5 h-5 opacity-80" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Tokens</p>
          <p className="text-xl font-bold text-white tabular-nums">{tokens.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500">ROI earned</p>
          <p className={`text-xl font-bold tabular-nums ${styles[accent].split(' ').pop()}`}>{roi.toFixed(2)}</p>
        </div>
      </div>
      <p className="text-[11px] text-gray-500 mt-3">Together { (tokens + roi).toFixed(2) } XIT</p>
    </div>
  );
}

function StatCard({ label, value, suffix, icon: Icon, color }: { label: string; value: string; suffix?: string; icon: any; color: string }) {
  const colorMap: Record<string, string> = {
    emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/20',
    blue: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/20',
    purple: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/20',
    cyan: 'from-cyan-500/20 to-cyan-600/5 text-cyan-400 border-cyan-500/20',
  };
  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400">{label}</span>
        <Icon className="w-5 h-5 opacity-70" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        {suffix && <span className="text-sm text-gray-400">{suffix}</span>}
      </div>
    </div>
  );
}

function IncomeCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    green: 'text-green-400 border-green-500/20',
    cyan: 'text-cyan-400 border-cyan-500/20',
    teal: 'text-teal-400 border-teal-500/20',
    yellow: 'text-yellow-400 border-yellow-500/20',
  };
  return (
    <div className={`bg-[#111827] border rounded-xl p-4 ${colors[color]}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-lg font-bold ${colors[color].split(' ')[0]}`}>{value.toFixed(2)} XIT</p>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-gray-800/50 flex items-center justify-center">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}
