import { useState, useEffect, useMemo } from 'react';
import { Network, Users, ChevronDown, ChevronRight, Search, Calendar, ShieldCheck, ShieldOff, TrendingUp, Info } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { ReferralNetworkMember, LevelBonusRate, NetworkSummary } from '@/types';
import {
  PageHero,
  HeroStat,
  FilterPanel,
  FilterChips,
  PaginationBar,
  LoadingSpinner,
  EmptyState,
  paginate,
} from '@/components/member/MemberUI';

const PAGE_SIZE = 10;

export default function NetworkPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<ReferralNetworkMember[]>([]);
  const [summary, setSummary] = useState<NetworkSummary | null>(null);
  const [rates, setRates] = useState<LevelBonusRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set([1]));
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'levels' | 'list' | 'directs'>('levels');

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [networkData, ratesData] = await Promise.all([api.user.network(), api.user.levelBonusRates()]);
      setMembers(networkData.members || []);
      setSummary(networkData.summary || null);
      setRates(ratesData as LevelBonusRate[]);
    } catch (err) {
      console.error('Network load error:', err);
    }
    setLoading(false);
  };

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = search.toLowerCase();
      if (q && !m.username.toLowerCase().includes(q) && !m.email.toLowerCase().includes(q)) return false;
      if (levelFilter !== 'all' && m.level !== parseInt(levelFilter)) return false;
      if (statusFilter === 'active' && !m.is_active) return false;
      if (statusFilter === 'pending' && m.is_active) return false;
      const d = new Date(m.created_at);
      if (dateFrom && d < new Date(dateFrom)) return false;
      if (dateTo && d > new Date(dateTo + 'T23:59:59')) return false;
      return true;
    });
  }, [members, search, levelFilter, statusFilter, dateFrom, dateTo]);

  const directMembers = useMemo(() => filteredMembers.filter((m) => m.is_direct || m.level === 1), [filteredMembers]);

  const listMembers = viewMode === 'directs' ? directMembers : filteredMembers;
  const { items: pagedMembers, total, totalPages, page: safePage } = paginate(listMembers, page, PAGE_SIZE);
  const hasFilters = search.trim() !== '' || levelFilter !== 'all' || statusFilter !== 'all' || dateFrom !== '' || dateTo !== '';

  useEffect(() => { setPage(1); }, [search, levelFilter, statusFilter, dateFrom, dateTo, viewMode]);

  const toggleLevel = (level: number) => {
    setExpandedLevels((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  };

  const levelOptions = [{ id: 'all', label: 'All Levels' }, ...Array.from({ length: 15 }, (_, i) => ({ id: String(i + 1), label: `Level ${i + 1}` }))];

  const levelGroups = (summary?.level_stats?.length ? summary.level_stats : rates.map((rate) => ({
    level: rate.level,
    members: 0,
    self_business: 0,
    team_business: 0,
    total_business: 0,
    active_investment: 0,
    level_bonus_percent: Number(rate.percentage),
    estimated_daily_downline_roi: 0,
    estimated_daily_level_income: 0,
    received_level_income: 0,
  }))).map((stat) => ({
    ...stat,
    percentage: stat.level_bonus_percent ?? rates.find((r) => r.level === stat.level)?.percentage ?? 0,
    membersList: filteredMembers.filter((m) => m.level === stat.level),
  }));

  return (
    <div className="space-y-6">
      <PageHero badge="MLM Network" badgeIcon={Network} title="My Team" subtitle="Direct & 15-level team business volume">
        <div className="flex gap-3 flex-wrap">
          <HeroStat label="Members" value={String(summary?.total_members ?? members.length)} accent />
          <HeroStat label="Direct" value={String(summary?.direct_count ?? 0)} />
          <HeroStat label="Total Business" value={`${(summary?.total_team_business ?? 0).toFixed(0)} XIT`} />
        </div>
      </PageHero>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniStat label="Direct Referrals" value={String(summary?.direct_count ?? 0)} color="emerald" />
        <MiniStat label="Direct Self Business" value={`${(summary?.direct_self_business ?? 0).toFixed(0)} XIT`} color="blue" />
        <MiniStat label="Team Self Business" value={`${(summary?.total_self_business ?? 0).toFixed(0)} XIT`} color="purple" />
        <MiniStat label="Est. Daily Level Income" value={`${(summary?.estimated_daily_level_income ?? 0).toFixed(2)} XIT`} color="cyan" />
      </div>

      <RewardExplainBox directVolume={summary?.direct_self_business ?? 0} directCount={summary?.direct_count ?? 0} />

      <FilterPanel hasActiveFilters={hasFilters} onClear={() => { setSearch(''); setLevelFilter('all'); setStatusFilter('all'); setDateFrom(''); setDateTo(''); }}>
        <div className="space-y-3">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search username or email..."
                className="w-full bg-gray-900/60 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-emerald-500 outline-none" />
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 min-w-[120px]">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full bg-gray-900/60 border border-gray-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white [color-scheme:dark] outline-none" />
              </div>
              <div className="relative flex-1 min-w-[120px]">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                  className="w-full bg-gray-900/60 border border-gray-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white [color-scheme:dark] outline-none" />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 overflow-x-auto">
              <FilterChips options={levelOptions.slice(0, 8)} value={levelFilter} onChange={setLevelFilter} accent="purple" />
            </div>
            <FilterChips options={[{ id: 'all', label: 'All Status' }, { id: 'active', label: 'Active' }, { id: 'pending', label: 'Pending' }]} value={statusFilter} onChange={setStatusFilter} accent="emerald" />
          </div>
          <FilterChips options={[
            { id: 'levels', label: 'By Level' },
            { id: 'directs', label: 'Direct Only' },
            { id: 'list', label: 'Full List' },
          ]} value={viewMode} onChange={(v) => setViewMode(v as 'levels' | 'list' | 'directs')} accent="orange" />
        </div>
      </FilterPanel>

      {loading ? (
        <LoadingSpinner />
      ) : filteredMembers.length === 0 ? (
        <div className="bg-[#111827] border border-gray-800 rounded-2xl">
          <EmptyState icon={Network} title="No team members found" subtitle={hasFilters ? 'Try adjusting filters' : 'Share your referral link to build your team'} />
        </div>
      ) : viewMode === 'list' || viewMode === 'directs' ? (
        <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
          {viewMode === 'directs' && (
            <div className="px-5 py-3 border-b border-gray-800 bg-emerald-500/5 text-xs text-emerald-400">
              Direct members — Self = their own purchase · Team = their downline business · Total = Self + Team
            </div>
          )}
          <div className="divide-y divide-gray-800/50">
            {pagedMembers.map((m) => (
              <MemberRow key={m.user_id} member={m} showBusiness />
            ))}
          </div>
          <PaginationBar page={safePage} totalPages={totalPages} total={total} limit={PAGE_SIZE} onPageChange={setPage} />
        </div>
      ) : (
        <div className="space-y-2">
          {levelGroups.map((group) => {
            if (levelFilter !== 'all' && group.level !== parseInt(levelFilter)) return null;
            const isExpanded = expandedLevels.has(group.level);
            const hasMembers = group.membersList.length > 0;
            if (!hasMembers && levelFilter === 'all') return null;
            return (
              <div key={group.level} className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
                <button onClick={() => hasMembers && toggleLevel(group.level)}
                  className={`w-full flex items-center justify-between px-5 py-4 transition-all ${hasMembers ? 'hover:bg-gray-800/30' : 'cursor-default opacity-60'}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    {hasMembers ? (isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />) : <div className="w-4 shrink-0" />}
                    <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-xs font-bold text-purple-300 shrink-0">L{group.level}</div>
                    <div className="text-left min-w-0">
                      <span className="text-sm font-semibold text-white">Level {group.level}</span>
                      <span className="ml-2 text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">{group.percentage}% level bonus</span>
                      {group.members > 0 && (
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                          Self <span className="text-amber-400">{group.self_business.toFixed(0)}</span> XIT
                          · Active {group.active_investment.toFixed(0)} XIT
                          · Est. income <span className="text-teal-400">{group.estimated_daily_level_income.toFixed(2)}</span>/day
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${hasMembers ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-500'}`}>
                    {group.members} member{group.members !== 1 ? 's' : ''}
                  </span>
                </button>
                {isExpanded && hasMembers && (
                  <div className="border-t border-gray-800 divide-y divide-gray-800/50">
                    {group.membersList.map((m) => (
                      <MemberRow key={m.user_id} member={m} compact showBusiness />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MemberRow({ member: m, compact, showBusiness }: { member: ReferralNetworkMember; compact?: boolean; showBusiness?: boolean }) {
  return (
    <div className={`flex items-center justify-between hover:bg-gray-800/20 transition-all gap-3 ${compact ? 'px-5 py-3' : 'px-5 py-4'}`}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400 font-bold text-sm shrink-0">
          {m.username.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm text-white font-medium truncate">{m.username}</p>
            {m.is_direct && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">Direct</span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">{m.email}</p>
          {!compact && <p className="text-[11px] text-gray-600">Level {m.level} · Joined {new Date(m.created_at).toLocaleDateString('en-GB')}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
        {showBusiness && (
          <div className="hidden md:flex items-center gap-4 text-right">
            <BusinessCol label="Self" value={m.self_business} />
            <BusinessCol label="Team" value={m.team_business} accent="text-cyan-400" />
            <BusinessCol label="Total" value={m.total_business} accent="text-amber-400" />
          </div>
        )}
        {showBusiness && (
          <div className="md:hidden text-right">
            <p className="text-[10px] text-gray-600">Total Business</p>
            <p className="text-sm font-semibold text-amber-400 tabular-nums">{m.total_business.toFixed(0)}</p>
          </div>
        )}
        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${m.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
          {m.is_active ? <ShieldCheck className="w-3 h-3" /> : <ShieldOff className="w-3 h-3" />}
          <span className="hidden sm:inline">{m.is_active ? 'Active' : 'Pending'}</span>
        </span>
      </div>
    </div>
  );
}

function BusinessCol({ label, value, accent = 'text-white' }: { label: string; value: number; accent?: string }) {
  return (
    <div>
      <p className="text-[10px] text-gray-600 uppercase">{label}</p>
      <p className={`text-sm font-semibold tabular-nums ${accent}`}>{value.toFixed(0)}</p>
    </div>
  );
}

function RewardExplainBox({ directVolume, directCount }: { directVolume: number; directCount: number }) {
  return (
    <div className="bg-gradient-to-br from-amber-500/10 to-[#111827] border border-amber-500/20 rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-2 text-sm text-gray-400">
          <p className="text-amber-300 font-semibold flex items-center gap-2"><TrendingUp className="w-4 h-4" />How Reward Income Works</p>
          <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-sm">
            <li><strong className="text-gray-300">Self business</strong> = member&apos;s own token purchase</li>
            <li><strong className="text-gray-300">Team business</strong> = all downline purchases under that direct leg</li>
            <li><strong className="text-gray-300">Total business per direct</strong> = Self + Team (each leg counted separately)</li>
            <li><strong className="text-amber-400">Reward tier rule:</strong> at least <strong className="text-white">3 directs</strong> must each reach the tier volume on their own leg</li>
            <li>Example: <strong className="text-yellow-400">30K tier</strong> = 3 different directs, each with ≥ 30,000 XIT total business (not combined)</li>
            <li>Reward is paid on <strong className="text-white">team ROI</strong> — every member&apos;s daily ROI in qualifying direct legs × tier %</li>
            <li>Example: member invested 10,000 XIT, daily ROI 50 XIT, tier 2% → you earn <strong className="text-yellow-400">1 XIT reward</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    emerald: 'border-emerald-500/20 from-emerald-500/15 text-emerald-400',
    blue: 'border-blue-500/20 from-blue-500/15 text-blue-400',
    purple: 'border-purple-500/20 from-purple-500/15 text-purple-400',
    cyan: 'border-cyan-500/20 from-cyan-500/15 text-cyan-400',
  };
  return (
    <div className={`rounded-2xl border bg-gradient-to-br to-[#111827] p-4 ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-1">
        <Users className="w-3.5 h-3.5 opacity-70" />
        <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
      </div>
      <p className={`text-xl font-bold ${colors[color].split(' ').pop()}`}>{value}</p>
    </div>
  );
}
