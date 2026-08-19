import { useState, useEffect } from 'react';
import { Award, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { RewardStatus } from '@/types';
import { IncomeListSection } from './IncomeSectionPage';
import { PageHero, HeroStat, LoadingSpinner } from '@/components/member/MemberUI';

export default function RewardIncomePage() {
  const { user } = useAuth();
  const [rewardStatus, setRewardStatus] = useState<RewardStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.user.rewardStatus().then((d) => {
        setRewardStatus(d as RewardStatus);
        setLoading(false);
      });
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <PageHero badge="Team Rewards" badgeIcon={Award} title="Reward Bonus" subtitle="Team volume reward tiers on ROI claims from your network">
        <HeroStat
          label="Current Tier"
          value={rewardStatus?.current_tier?.tier_name || 'None'}
          accent
        />
      </PageHero>

      {loading ? (
        <LoadingSpinner />
      ) : rewardStatus && (
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-br from-[#1a1508] via-[#151820] to-[#0f1419] p-6 sm:p-8">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-lg font-semibold text-white">Your Reward Status</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatBox label="Direct Referrals" value={String(rewardStatus.direct_count)} accent="text-white" />
              <StatBox label="Team Volume" value={`${rewardStatus.direct_volume.toFixed(0)} XIT`} accent="text-amber-300" />
              <StatBox label="Active Tier" value={rewardStatus.current_tier ? `${rewardStatus.current_tier.percentage}%` : '—'} accent="text-yellow-400" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {rewardStatus.tiers.map((tier) => (
                <div key={tier.id} className={`rounded-xl p-3 text-center border transition-all ${
                  tier.qualified
                    ? 'border-yellow-500/50 bg-yellow-500/15 shadow-lg shadow-yellow-500/10'
                    : 'border-gray-800 bg-gray-900/30 opacity-60'
                }`}>
                  <p className="text-[10px] text-gray-500 uppercase">{tier.tier_name}</p>
                  <p className="text-lg font-bold text-yellow-400 mt-1">{tier.percentage}%</p>
                  <p className="text-[10px] text-gray-600 mt-1">{(tier.min_volume / 1000).toFixed(0)}K vol</p>
                  {tier.qualified && <p className="text-[10px] text-emerald-400 mt-1 font-semibold">✓ Qualified</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Reward Income History</h3>
        <IncomeListSection filter="reward_bonus" embedded />
      </div>
    </div>
  );
}

function StatBox({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 text-center">
      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
      <p className={`text-xl font-bold mt-1 ${accent}`}>{value}</p>
    </div>
  );
}
