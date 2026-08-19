import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { History, Clock, Coins, Check, AlertCircle, Search, Calendar, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Investment } from '@/types';
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

const PAGE_SIZE = 8;

export default function InvestmentHistoryPage() {
  const { user, refreshUser } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.investments.list();
      setInvestments(data as Investment[]);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleClaimRoi = async (investmentId: number) => {
    setMessage(null);
    try {
      const result: any = await api.investments.claimRoi(investmentId);
      setMessage({
        type: 'success',
        text: result.completed ? 'Investment completed!' : `ROI claimed: ${Number(result.roi).toFixed(4)} XIT`,
      });
      await refreshUser();
      await loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const filtered = useMemo(() => {
    return investments.filter((inv) => {
      if (planFilter !== 'all' && inv.plan_type !== planFilter) return false;
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
      const q = search.trim();
      if (q && !String(inv.token_amount).includes(q) && !inv.plan_type.includes(q.toLowerCase())) return false;
      const d = new Date(inv.start_date);
      if (dateFrom && d < new Date(dateFrom)) return false;
      if (dateTo && d > new Date(dateTo + 'T23:59:59')) return false;
      return true;
    });
  }, [investments, planFilter, statusFilter, search, dateFrom, dateTo]);

  const activeCount = investments.filter((i) => i.status === 'active').length;
  const totalInvested = investments.reduce((s, i) => s + Number(i.token_amount), 0);
  const { items, total, totalPages, page: safePage } = paginate(filtered, page, PAGE_SIZE);
  const hasFilters = planFilter !== 'all' || statusFilter !== 'all' || search.trim() !== '' || dateFrom !== '' || dateTo !== '';

  useEffect(() => { setPage(1); }, [planFilter, statusFilter, search, dateFrom, dateTo]);

  return (
    <div className="space-y-6">
      <PageHero badge="Investment Plans" badgeIcon={History} title="Investment History" subtitle="All your lock & flexible plan investments">
        <div className="flex gap-3 flex-wrap">
          <HeroStat label="Active" value={String(activeCount)} accent />
          <HeroStat label="Total Invested" value={`${totalInvested.toFixed(0)} XIT`} />
        </div>
      </PageHero>

      {message && (
        <div className={`flex items-center gap-2 rounded-2xl px-5 py-4 text-sm ${
          message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <FilterPanel hasActiveFilters={hasFilters} onClear={() => { setPlanFilter('all'); setStatusFilter('all'); setSearch(''); setDateFrom(''); setDateTo(''); }}>
        <div className="space-y-3">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search amount..."
                className="w-full bg-gray-900/60 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-orange-500 outline-none" />
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
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">Plan</p>
            <FilterChips options={[{ id: 'all', label: 'All Plans' }, { id: 'lock', label: 'Lock 3X' }, { id: 'flexible', label: 'Flexible 2X' }]} value={planFilter} onChange={setPlanFilter} accent="purple" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">Status</p>
            <FilterChips options={[{ id: 'all', label: 'All' }, { id: 'active', label: 'Active' }, { id: 'completed', label: 'Completed' }, { id: 'cancelled', label: 'Cancelled' }]} value={statusFilter} onChange={setStatusFilter} accent="emerald" />
          </div>
        </div>
      </FilterPanel>

      <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : items.length === 0 ? (
          <EmptyState icon={Coins} title="No investments found" subtitle={hasFilters ? 'Try adjusting filters' : 'Buy & Invest to start'} />
        ) : (
          <>
            <div className="p-4 sm:p-5 space-y-3">
              {items.map((inv) => {
                const progress = (Number(inv.roi_received) / Number(inv.total_return)) * 100;
                const today = new Date().toISOString().split('T')[0];
                const lastRoi = new Date(inv.last_roi_date).toISOString().split('T')[0];
                const canClaim = inv.status === 'active' && lastRoi < today;
                return (
                  <div key={inv.id} className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/60 to-[#111827] p-5 hover:border-orange-500/20 transition-all">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${inv.plan_type === 'lock' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
                          {inv.plan_type === 'lock' ? 'Lock 3X → 400' : 'Flexible 2X → 300'}
                        </span>
                        <span className="text-sm text-white font-bold tabular-nums">{Number(inv.token_amount).toFixed(0)} XIT</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${inv.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : inv.status === 'completed' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-400'}`}>
                          {inv.status}
                        </span>
                      </div>
                      {inv.status === 'active' && (
                        <button onClick={() => handleClaimRoi(inv.id)} disabled={!canClaim}
                          className={`text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${canClaim ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
                          <Clock className="w-3.5 h-3.5" />
                          {canClaim ? 'Claim ROI' : 'Claimed Today'}
                        </button>
                      )}
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
                      <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <Stat label="Received" value={`${Number(inv.roi_received).toFixed(2)} XIT`} accent="text-emerald-400" />
                      <Stat label="Target" value={`${Number(inv.total_return).toFixed(2)} XIT`} />
                      <Stat label="Daily ROI" value={`${Number(inv.daily_roi_rate)}%`} accent="text-cyan-400" />
                      <Stat label="Started" value={new Date(inv.start_date).toLocaleDateString('en-GB')} />
                    </div>
                  </div>
                );
              })}
            </div>
            <PaginationBar page={safePage} totalPages={totalPages} total={total} limit={PAGE_SIZE} onPageChange={setPage} />
          </>
        )}
      </div>

      {!loading && investments.length === 0 && (
        <Link to="/buy" className="flex items-center justify-center gap-2 py-4 rounded-2xl border border-orange-500/30 bg-orange-500/5 text-orange-300 hover:bg-orange-500/10 text-sm font-semibold transition-all">
          Start Investing <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="bg-gray-900/40 rounded-lg px-3 py-2">
      <p className="text-gray-600">{label}</p>
      <p className={`font-semibold mt-0.5 ${accent || 'text-gray-300'}`}>{value}</p>
    </div>
  );
}
