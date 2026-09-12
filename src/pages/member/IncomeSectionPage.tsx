import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Gift,
  Layers,
  Award,
  PieChart,
  Sparkles,
  ArrowRight,
  Search,
  Calendar,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Transaction } from '@/types';
import { TRANSACTION_LABELS, TRANSACTION_COLORS, planTypeLabel, planTypeBadgeClass, planTypeShortLabel } from '@/lib/constants';
import {
  PageHero,
  HeroStat,
  TotalBanner,
  FilterPanel,
  FilterChips,
  PaginationBar,
  LoadingSpinner,
  EmptyState,
  paginate,
} from '@/components/member/MemberUI';

type IncomeFilter = 'roi' | 'referral_bonus' | 'level_bonus' | 'reward_bonus' | 'all';

const PAGE_SIZE = 10;

const FILTER_META: Record<string, { badge: string; icon: typeof TrendingUp }> = {
  roi: { badge: 'Daily ROI', icon: TrendingUp },
  referral_bonus: { badge: 'Referral Income', icon: Gift },
  level_bonus: { badge: 'Level Bonus', icon: Layers },
  reward_bonus: { badge: 'Reward Bonus', icon: Award },
  all: { badge: 'All Income', icon: PieChart },
};

export function IncomeListSection({
  filter,
  embedded = false,
}: {
  filter: IncomeFilter;
  embedded?: boolean;
}) {
  const { user } = useAuth();
  const [allTx, setAllTx] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [roiSource, setRoiSource] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (user) loadData();
  }, [user, filter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { limit: '500' };
      if (filter !== 'all') params.type = filter;
      else params.category = 'income';
      const data = await api.user.transactions(params);
      setAllTx(data.items);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filtered = useMemo(() => {
    return allTx.filter((tx) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || tx.description?.toLowerCase().includes(q) || String(tx.amount).includes(q);
      const d = new Date(tx.created_at);
      const matchFrom = !dateFrom || d >= new Date(dateFrom);
      const matchTo = !dateTo || d <= new Date(dateTo + 'T23:59:59');
      const matchSource = roiSource === 'all' || tx.plan_type === roiSource;
      return matchSearch && matchFrom && matchTo && matchSource;
    });
  }, [allTx, search, dateFrom, dateTo, roiSource]);

  const total = filtered.reduce((s, t) => s + Number(t.amount), 0);
  const { items, total: totalCount, totalPages, page: safePage } = paginate(filtered, page, PAGE_SIZE);
  const hasFilters = search.trim() !== '' || dateFrom !== '' || dateTo !== '' || roiSource !== 'all';

  useEffect(() => { setPage(1); }, [search, dateFrom, dateTo, filter, roiSource]);

  return (
    <div className={embedded ? 'space-y-4' : 'space-y-6'}>
      {!embedded && (
        <TotalBanner label="Total from this section" value={total.toFixed(2)} />
      )}

      <FilterPanel
        hasActiveFilters={hasFilters}
        onClear={() => { setSearch(''); setDateFrom(''); setDateTo(''); setRoiSource('all'); }}
      >
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search description or amount..."
              className="w-full bg-gray-900/60 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-orange-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 min-w-[130px]">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="w-full bg-gray-900/60 border border-gray-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:border-orange-500 outline-none [color-scheme:dark]" />
            </div>
            <div className="relative flex-1 min-w-[130px]">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="w-full bg-gray-900/60 border border-gray-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:border-orange-500 outline-none [color-scheme:dark]" />
            </div>
          </div>
        </div>
        {filter === 'roi' && (
          <div className="mt-3">
            <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">ROI from</p>
            <FilterChips
              options={[
                { id: 'all', label: 'All Plans' },
                { id: 'flexible', label: 'Flexible' },
                { id: 'flexible_lock', label: 'Flexible Lock' },
                { id: 'lock', label: 'Lock Plan' },
              ]}
              value={roiSource}
              onChange={setRoiSource}
              accent="emerald"
            />
          </div>
        )}
      </FilterPanel>

      {embedded && (
        <div className="flex items-center justify-between bg-orange-500/5 border border-orange-500/15 rounded-xl px-4 py-3">
          <span className="text-sm text-gray-400">Section Total</span>
          <span className="text-lg font-bold text-orange-400 tabular-nums">{total.toFixed(2)} XIT</span>
        </div>
      )}

      <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : items.length === 0 ? (
          <EmptyState icon={PieChart} title="No income records yet" subtitle={hasFilters ? 'Try adjusting filters' : undefined} />
        ) : (
          <>
            <div className="divide-y divide-gray-800/50">
              {items.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-800/20 transition-colors">
                  <div className="min-w-0 flex-1 mr-4">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-lg ${TRANSACTION_COLORS[tx.type] || 'text-gray-400'} bg-gray-900/60`}>
                        {TRANSACTION_LABELS[tx.type] || tx.type}
                      </span>
                      {tx.type === 'roi' && tx.plan_type && (
                        <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full ${planTypeBadgeClass(tx.plan_type)}`}>
                          {planTypeShortLabel(tx.plan_type)}
                          {tx.investment_daily_roi != null ? ` · ${tx.investment_daily_roi}%` : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {tx.type === 'roi' && tx.plan_type
                        ? `${planTypeLabel(tx.plan_type)}${tx.investment_token_amount ? ` · ${Number(tx.investment_token_amount).toFixed(0)} XIT plan` : ''}`
                        : tx.description}
                    </p>
                    <p className="text-[11px] text-gray-600 mt-0.5">{new Date(tx.created_at).toLocaleString('en-GB')}</p>
                  </div>
                  <span className={`text-sm font-bold tabular-nums shrink-0 ${TRANSACTION_COLORS[tx.type] || 'text-emerald-400'}`}>
                    +{Number(tx.amount).toFixed(4)} XIT
                  </span>
                </div>
              ))}
            </div>
            <PaginationBar page={safePage} totalPages={totalPages} total={totalCount} limit={PAGE_SIZE} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}

export default function IncomeSectionPage({
  title,
  subtitle,
  filter,
}: {
  title: string;
  subtitle: string;
  filter: IncomeFilter;
}) {
  const meta = FILTER_META[filter];
  const Icon = meta.icon;

  return (
    <div className="space-y-6">
      <PageHero badge={meta.badge} badgeIcon={Icon} title={title} subtitle={subtitle}>
        <HeroStat label="Type" value={TRANSACTION_LABELS[filter] || 'All'} accent />
      </PageHero>
      <IncomeListSection filter={filter} />
    </div>
  );
}

export function IncomeBreakdownPage() {
  const { user } = useAuth();
  const [totals, setTotals] = useState({ roi: 0, referral: 0, level: 0, reward: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.user.transactions({ limit: '500', category: 'income' }).then((data) => {
        const txs = data.items;
        setTotals({
          roi: txs.filter((t) => t.type === 'roi').reduce((s, t) => s + Number(t.amount), 0),
          referral: txs.filter((t) => t.type === 'referral_bonus').reduce((s, t) => s + Number(t.amount), 0),
          level: txs.filter((t) => t.type === 'level_bonus').reduce((s, t) => s + Number(t.amount), 0),
          reward: txs.filter((t) => t.type === 'reward_bonus').reduce((s, t) => s + Number(t.amount), 0),
        });
        setLoading(false);
      });
    }
  }, [user]);

  const grandTotal = totals.roi + totals.referral + totals.level + totals.reward;

  const incomeItems = [
    { key: 'roi', label: 'Daily ROI Income', shortLabel: 'ROI', value: totals.roi, icon: TrendingUp, link: '/income/daily', gradient: 'from-emerald-600/25 via-emerald-900/10 to-[#111827]', bar: 'bg-emerald-500', text: 'text-emerald-300', border: 'border-emerald-500/30' },
    { key: 'referral', label: 'Referral Income', shortLabel: 'Referral', value: totals.referral, icon: Gift, link: '/income/referral', gradient: 'from-cyan-600/25 via-cyan-900/10 to-[#111827]', bar: 'bg-cyan-500', text: 'text-cyan-300', border: 'border-cyan-500/30' },
    { key: 'level', label: 'Level Income (15 Level)', shortLabel: 'Level', value: totals.level, icon: Layers, link: '/income/level', gradient: 'from-teal-600/25 via-teal-900/10 to-[#111827]', bar: 'bg-teal-500', text: 'text-teal-300', border: 'border-teal-500/30' },
    { key: 'reward', label: 'Reward Bonus Income', shortLabel: 'Reward', value: totals.reward, icon: Award, link: '/income/reward', gradient: 'from-amber-600/25 via-amber-900/10 to-[#111827]', bar: 'bg-amber-500', text: 'text-amber-300', border: 'border-amber-500/30' },
  ];

  return (
    <div className="space-y-6">
      <PageHero badge="Earnings Overview" badgeIcon={PieChart} title="Income Breakdown" subtitle="Summary of all income streams from your MLM activity">
        <HeroStat label="Total Earned" value={`${grandTotal.toFixed(0)} XIT`} accent />
      </PageHero>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="relative overflow-hidden rounded-3xl border border-orange-500/25 bg-gradient-to-br from-[#1a1208] via-[#151820] to-[#0f1419] p-6 sm:p-8">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <p className="text-xs uppercase tracking-[0.2em] text-orange-300/80 font-medium">Total Income Earned</p>
                </div>
                <div className="flex items-end gap-3">
                  <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-300 via-amber-200 to-orange-400 bg-clip-text text-transparent tabular-nums">{grandTotal.toFixed(2)}</p>
                  <span className="text-orange-400/80 font-semibold text-lg pb-1">XIT</span>
                </div>
              </div>
              {grandTotal > 0 && (
                <div className="sm:w-72 w-full space-y-2">
                  {incomeItems.map((item) => {
                    const pct = (item.value / grandTotal) * 100;
                    if (pct <= 0) return null;
                    return (
                      <div key={item.key}>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-gray-500">{item.shortLabel}</span>
                          <span className={`font-medium ${item.text}`}>{pct.toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                          <div className={`h-full ${item.bar} rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {incomeItems.map((item) => {
              const Icon = item.icon;
              const share = grandTotal > 0 ? (item.value / grandTotal) * 100 : 0;
              return (
                <Link key={item.key} to={item.link} className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-br ${item.gradient} ${item.border} p-6 transition-all hover:scale-[1.01] hover:shadow-xl`}>
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl ${item.bar} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{item.label}</p>
                  <p className={`text-3xl font-bold tabular-nums ${item.text}`}>{item.value.toFixed(2)}</p>
                  <p className="text-gray-500 text-xs mt-1">XIT · {share.toFixed(1)}% of total</p>
                </Link>
              );
            })}
          </div>

          {grandTotal === 0 && (
            <div className="text-center py-10 rounded-2xl border border-gray-800 bg-[#111827]/50">
              <PieChart className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No income recorded yet</p>
              <Link to="/buy" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold">
                Buy & Invest <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
