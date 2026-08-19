import { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';
import { api } from '@/lib/api';
import { IncomeListSection } from './IncomeSectionPage';
import { PageHero, HeroStat } from '@/components/member/MemberUI';

export default function LevelPlanPage() {
  const [rates, setRates] = useState<any[]>([]);

  useEffect(() => {
    api.user.levelBonusRates().then((d) => setRates(d as any[]));
  }, []);

  return (
    <div className="space-y-6">
      <PageHero badge="15 Level MLM" badgeIcon={Layers} title="15 Level Plan" subtitle="Level bonus when downline claims ROI — up to 15 levels deep">
        <HeroStat label="Levels" value="15" accent />
      </PageHero>

      <div className="relative overflow-hidden rounded-3xl border border-orange-500/20 bg-[#111827] p-6">
        <div className="flex items-center gap-2 mb-5">
          <Layers className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Level Bonus Rates</h3>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-2">
          {rates.map((r) => (
            <div key={r.level} className="relative overflow-hidden rounded-xl border border-orange-500/15 bg-gradient-to-br from-orange-500/10 to-[#111827] p-3 text-center hover:border-orange-500/40 transition-all">
              <p className="text-[10px] text-gray-500 uppercase">Level</p>
              <p className="text-lg font-black text-white">{r.level}</p>
              <p className="text-sm font-bold text-orange-400 mt-1">{Number(r.percentage)}%</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Your Level Income History</h3>
        <IncomeListSection filter="level_bonus" embedded />
      </div>
    </div>
  );
}
