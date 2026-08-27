import { useState, useEffect, useMemo } from 'react';
import { Layers, TrendingUp, Info } from 'lucide-react';
import { api } from '@/lib/api';
import type { NetworkLevelStat } from '@/types';
import { IncomeListSection } from './IncomeSectionPage';
import { PageHero, HeroStat, LoadingSpinner } from '@/components/member/MemberUI';

export default function LevelPlanPage() {
  const [levelStats, setLevelStats] = useState<NetworkLevelStat[]>([]);
  const [estDailyTotal, setEstDailyTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.user.network().then((data) => {
      setLevelStats(data.summary?.level_stats || []);
      setEstDailyTotal(data.summary?.estimated_daily_level_income || 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totals = useMemo(() => ({
    members: levelStats.reduce((s, l) => s + l.members, 0),
    self: levelStats.reduce((s, l) => s + l.self_business, 0),
    active: levelStats.reduce((s, l) => s + l.active_investment, 0),
    received: levelStats.reduce((s, l) => s + l.received_level_income, 0),
    estDaily: levelStats.reduce((s, l) => s + l.estimated_daily_level_income, 0),
  }), [levelStats]);

  return (
    <div className="space-y-6">
      <PageHero
        badge="15 Level MLM"
        badgeIcon={Layers}
        title="15 Level Plan"
        subtitle="See self business & estimated level income from each downline level"
      >
        <div className="flex gap-3 flex-wrap">
          <HeroStat label="Est. Daily Level Income" value={`${estDailyTotal.toFixed(2)} XIT`} accent />
          <HeroStat label="Total Received" value={`${totals.received.toFixed(2)} XIT`} />
        </div>
      </PageHero>

      <div className="bg-gradient-to-br from-teal-500/10 to-[#111827] border border-teal-500/20 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <div className="text-sm text-gray-400 space-y-1">
            <p className="text-teal-300 font-medium">How level income is calculated</p>
            <p>When a member at <strong className="text-white">Level N</strong> claims daily ROI, you receive:</p>
            <p className="text-teal-200 font-mono text-xs bg-black/30 rounded-lg px-3 py-2 inline-block">
              Your Level Income = Their Daily ROI × Level N Bonus %
            </p>
            <p className="text-xs text-gray-500">Self business = total tokens purchased by members at that level. Active investment = currently earning ROI.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/50">
                  <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase">Level</th>
                  <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Bonus %</th>
                  <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Members</th>
                  <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Self Business</th>
                  <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Active Invest</th>
                  <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Downline Daily ROI</th>
                  <th className="text-right px-4 py-3 text-xs text-teal-400 uppercase">Est. Daily Income</th>
                  <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">Total Received</th>
                </tr>
              </thead>
              <tbody>
                {levelStats.map((row) => (
                  <tr
                    key={row.level}
                    className={`border-b border-gray-800/60 hover:bg-gray-800/20 transition-colors ${
                      row.members > 0 ? '' : 'opacity-50'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/25 text-orange-300 font-bold text-xs">
                        L{row.level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-orange-400 font-semibold tabular-nums">
                      {row.level_bonus_percent}%
                    </td>
                    <td className="px-4 py-3 text-right text-white tabular-nums">{row.members}</td>
                    <td className="px-4 py-3 text-right text-amber-400 font-medium tabular-nums">
                      {row.self_business.toFixed(0)}
                    </td>
                    <td className="px-4 py-3 text-right text-purple-400 tabular-nums">
                      {row.active_investment.toFixed(0)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300 tabular-nums">
                      {row.estimated_daily_downline_roi.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-teal-400 font-bold tabular-nums">
                      {row.estimated_daily_level_income > 0 ? (
                        <span className="inline-flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {row.estimated_daily_level_income.toFixed(2)}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-400 tabular-nums">
                      {row.received_level_income > 0 ? row.received_level_income.toFixed(2) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-900/60 border-t border-gray-700">
                  <td colSpan={2} className="px-4 py-3 text-xs font-bold text-gray-400 uppercase">Total</td>
                  <td className="px-4 py-3 text-right font-bold text-white tabular-nums">{totals.members}</td>
                  <td className="px-4 py-3 text-right font-bold text-amber-400 tabular-nums">{totals.self.toFixed(0)}</td>
                  <td className="px-4 py-3 text-right font-bold text-purple-400 tabular-nums">{totals.active.toFixed(0)}</td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3 text-right font-bold text-teal-400 tabular-nums">{totals.estDaily.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-400 tabular-nums">{totals.received.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Your Level Income History</h3>
        <IncomeListSection filter="level_bonus" embedded />
      </div>
    </div>
  );
}
