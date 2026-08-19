import { useState, useEffect, useMemo } from 'react';
import { Network, Users, ChevronDown, ChevronRight, Search, Calendar, ShieldCheck, ShieldOff } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { ReferralNetworkMember, LevelBonusRate } from '@/types';
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
  const [rates, setRates] = useState<LevelBonusRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set([1]));
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'levels' | 'list'>('levels');

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [networkData, ratesData] = await Promise.all([api.user.network(), api.user.levelBonusRates()]);
      setMembers(networkData as ReferralNetworkMember[]);
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

  const { items: pagedMembers, total, totalPages, page: safePage } = paginate(filteredMembers, page, PAGE_SIZE);
  const hasFilters = search.trim() !== '' || levelFilter !== 'all' || statusFilter !== 'all' || dateFrom !== '' || dateTo !== '';

  useEffect(() => { setPage(1); }, [search, levelFilter, statusFilter, dateFrom, dateTo]);

  const toggleLevel = (level: number) => {
    setExpandedLevels((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  };

  const totalTeamInvested = members.reduce((sum, m) => sum + Number(m.total_invested || 0), 0);
  const activeMembers = members.filter((m) => m.is_active).length;
  const levelOptions = [{ id: 'all', label: 'All Levels' }, ...Array.from({ length: 15 }, (_, i) => ({ id: String(i + 1), label: `Level ${i + 1}` }))];

  const levelGroups = rates.map((rate) => ({
    level: rate.level,
    percentage: Number(rate.percentage),
    members: filteredMembers.filter((m) => m.level === rate.level),
  }));

  return (
    <div className="space-y-6">
      <PageHero badge="MLM Network" badgeIcon={Network} title="My Team" subtitle="Your 15-level referral team and their activity">
        <div className="flex gap-3 flex-wrap">
          <HeroStat label="Members" value={String(members.length)} accent />
          <HeroStat label="Active" value={String(activeMembers)} />
        </div>
      </PageHero>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniStat label="Total Referrals" value={String(members.length)} color="emerald" />
        <MiniStat label="Active Members" value={String(activeMembers)} color="blue" />
        <MiniStat label="Team Investment" value={`${totalTeamInvested.toFixed(0)} XIT`} color="purple" />
        <MiniStat label="Levels Active" value={`${levelGroups.filter((g) => g.members.length > 0).length}/15`} color="cyan" />
      </div>

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
          <FilterChips options={[{ id: 'levels', label: 'By Level View' }, { id: 'list', label: 'Flat List View' }]} value={viewMode} onChange={(v) => setViewMode(v as 'levels' | 'list')} accent="orange" />
        </div>
      </FilterPanel>

      {loading ? (
        <LoadingSpinner />
      ) : filteredMembers.length === 0 ? (
        <div className="bg-[#111827] border border-gray-800 rounded-2xl">
          <EmptyState icon={Network} title="No team members found" subtitle={hasFilters ? 'Try adjusting filters' : 'Share your referral link to build your team'} />
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
          <div className="divide-y divide-gray-800/50">
            {pagedMembers.map((m) => (
              <MemberRow key={m.user_id} member={m} />
            ))}
          </div>
          <PaginationBar page={safePage} totalPages={totalPages} total={total} limit={PAGE_SIZE} onPageChange={setPage} />
        </div>
      ) : (
        <div className="space-y-2">
          {levelGroups.map((group) => {
            if (levelFilter !== 'all' && group.level !== parseInt(levelFilter)) return null;
            const isExpanded = expandedLevels.has(group.level);
            const hasMembers = group.members.length > 0;
            if (!hasMembers && levelFilter === 'all') return null;
            return (
              <div key={group.level} className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
                <button onClick={() => hasMembers && toggleLevel(group.level)}
                  className={`w-full flex items-center justify-between px-5 py-4 transition-all ${hasMembers ? 'hover:bg-gray-800/30' : 'cursor-default opacity-60'}`}>
                  <div className="flex items-center gap-3">
                    {hasMembers ? (isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />) : <div className="w-4" />}
                    <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-xs font-bold text-purple-300">L{group.level}</div>
                    <div className="text-left">
                      <span className="text-sm font-semibold text-white">Level {group.level}</span>
                      <span className="ml-2 text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">{group.percentage}% bonus</span>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${hasMembers ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-500'}`}>
                    {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                  </span>
                </button>
                {isExpanded && hasMembers && (
                  <div className="border-t border-gray-800 divide-y divide-gray-800/50">
                    {group.members.map((m) => (
                      <MemberRow key={m.user_id} member={m} compact />
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

function MemberRow({ member: m, compact }: { member: ReferralNetworkMember; compact?: boolean }) {
  return (
    <div className={`flex items-center justify-between hover:bg-gray-800/20 transition-all ${compact ? 'px-5 py-3' : 'px-5 py-4'}`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400 font-bold text-sm shrink-0">
          {m.username.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-white font-medium truncate">{m.username}</p>
          <p className="text-xs text-gray-500 truncate">{m.email}</p>
          {!compact && <p className="text-[11px] text-gray-600">Level {m.level} · Joined {new Date(m.created_at).toLocaleDateString('en-GB')}</p>}
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-gray-600 uppercase">Invested</p>
          <p className="text-sm text-white font-semibold tabular-nums">{Number(m.total_invested).toFixed(2)}</p>
        </div>
        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${m.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
          {m.is_active ? <ShieldCheck className="w-3 h-3" /> : <ShieldOff className="w-3 h-3" />}
          {m.is_active ? 'Active' : 'Pending'}
        </span>
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
