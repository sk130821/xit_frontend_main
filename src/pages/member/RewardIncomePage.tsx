import { useState, useEffect } from 'react';
import { Award, Sparkles, Check, X } from 'lucide-react';
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

  const activeTier = rewardStatus?.current_tier;
  const activeTierMin = rewardStatus?.tiers.find((t) => t.id === activeTier?.id)?.min_volume;

  return (
    <div className="space-y-6">
      <PageHero badge="Team Rewards" badgeIcon={Award} title="Reward Bonus" subtitle="Earn tier % on daily ROI from every member in your qualifying direct legs">
        <HeroStat label="Current Tier" value={activeTier?.tier_name || 'None'} accent />
      </PageHero>

      {loading ? (
        <LoadingSpinner />
      ) : rewardStatus && (
        <>
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-br from-[#1a1508] via-[#151820] to-[#0f1419] p-6 sm:p-8">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-lg font-semibold text-white">Your Reward Status</h3>
              </div>
              <p className="text-xs text-gray-500 mb-5 leading-relaxed">
                For each tier, at least <strong className="text-white">3 direct legs</strong> must each have{' '}
                <strong className="text-amber-400">self + team business ≥ tier volume</strong> individually.
                Once qualified, you earn <strong className="text-emerald-400">tier % on daily ROI</strong> from every member
                in those qualifying legs (direct + full downline team).
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <StatBox label="Direct Legs" value={String(rewardStatus.direct_count)} accent="text-white" />
                <StatBox label="Combined Volume" value={`${rewardStatus.direct_volume.toFixed(0)} XIT`} accent="text-amber-300" />
                <StatBox label="Active Tier" value={activeTier ? `${activeTier.percentage}%` : '—'} accent="text-yellow-400" />
                <StatBox label="Reward On" value="Team ROI" accent="text-emerald-400" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {rewardStatus.tiers.map((tier) => (
                  <div key={tier.id} className={`rounded-xl p-3 text-center border transition-all ${
                    tier.qualified
                      ? 'border-yellow-500/50 bg-yellow-500/15 shadow-lg shadow-yellow-500/10'
                      : 'border-gray-800 bg-gray-900/30 opacity-70'
                  }`}>
                    <p className="text-[10px] text-gray-500 uppercase">{tier.tier_name}</p>
                    <p className="text-lg font-bold text-yellow-400 mt-1">{tier.percentage}%</p>
                    <p className="text-[10px] text-gray-600 mt-1">{(tier.min_volume / 1000).toFixed(0)}K each leg</p>
                    <p className={`text-[10px] mt-1 font-semibold ${tier.qualified ? 'text-emerald-400' : 'text-gray-500'}`}>
                      {tier.qualifying_count}/{tier.required_directs} legs qualified
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {rewardStatus.direct_legs?.length > 0 && (
            <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800">
                <h3 className="text-sm font-semibold text-white">Direct Leg Business (Self + Team)</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {activeTierMin
                    ? `Active tier requires each qualifying leg ≥ ${activeTierMin.toLocaleString()} XIT`
                    : 'Build each direct leg to unlock reward tiers'}
                </p>
              </div>
              <div className="divide-y divide-gray-800/60">
                {rewardStatus.direct_legs.map((leg) => {
                  const meetsActive = activeTierMin ? leg.total_business >= activeTierMin : false;
                  return (
                    <div key={leg.user_id} className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <p className="text-sm font-medium text-white">{leg.username}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Self {leg.self_business.toFixed(0)} · Team {leg.team_business.toFixed(0)} XIT
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-[10px] text-gray-600 uppercase">Total Business</p>
                          <p className="text-lg font-bold text-amber-400 tabular-nums">{leg.total_business.toFixed(0)}</p>
                        </div>
                        {activeTierMin ? (
                          meetsActive ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                              <Check className="w-3 h-3" /> Meets tier
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-red-400/90 bg-red-500/10 px-2 py-1 rounded-full">
                              <X className="w-3 h-3" /> Need {(activeTierMin - leg.total_business).toFixed(0)} more
                            </span>
                          )
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
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
