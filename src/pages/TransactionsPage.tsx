import { useState, useEffect, useCallback } from 'react';
import {
  History,
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  TrendingUp,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Transaction } from '@/types';
import { TRANSACTION_LABELS, TRANSACTION_COLORS, planTypeLabel, planTypeShortLabel } from '@/lib/constants';

const TYPE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'buy', label: 'Buy & Invest' },
  { id: 'sell', label: 'Token Sale' },
  { id: 'invest', label: 'Investment' },
  { id: 'roi', label: 'ROI Income' },
  { id: 'referral_bonus', label: 'Referral Bonus' },
  { id: 'level_bonus', label: 'Level Bonus' },
  { id: 'reward_bonus', label: 'Reward Bonus' },
  { id: 'admin_credit', label: 'Admin Credit' },
  { id: 'admin_debit', label: 'Admin Debit' },
  { id: 'admin_grant', label: 'Admin XIT Grant' },
] as const;

const INCOME_FILTERS = [
  { id: 'income', label: 'All Income' },
  { id: 'roi', label: 'ROI' },
  { id: 'referral_bonus', label: 'Referral' },
  { id: 'level_bonus', label: 'Level' },
  { id: 'reward_bonus', label: 'Reward' },
] as const;

const PAGE_SIZE = 10;

const DEBIT_TYPES = new Set(['sell', 'admin_debit', 'withdraw']);

function formatAmount(tx: Transaction) {
  const n = Number(tx.amount);
  const prefix = DEBIT_TYPES.has(tx.type) ? '-' : '+';
  return `${prefix}${Math.abs(n).toFixed(4)}`;
}

export default function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [incomeFilter, setIncomeFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [explorerUrl, setExplorerUrl] = useState('https://testnet.bscscan.com');

  useEffect(() => {
    api.blockchain.config().then((c: any) => {
      if (c.blockExplorerUrl) setExplorerUrl(c.blockExplorerUrl);
    }).catch(() => {});
  }, []);

  const loadTransactions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: String(PAGE_SIZE),
      };

      if (search.trim()) params.search = search.trim();
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      if (incomeFilter !== 'all') {
        if (incomeFilter === 'income') {
          params.category = 'income';
        } else {
          params.type = incomeFilter;
        }
      } else if (filterType !== 'all') {
        params.type = filterType;
      }

      const data = await api.user.transactions(params);
      setTransactions(data.items);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Transactions load error:', err);
    }
    setLoading(false);
  }, [user, page, search, filterType, incomeFilter, dateFrom, dateTo]);

  useEffect(() => {
    if (user) loadTransactions();
  }, [user, loadTransactions]);

  const resetFilters = () => {
    setSearch('');
    setFilterType('all');
    setIncomeFilter('all');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    filterType !== 'all' ||
    incomeFilter !== 'all' ||
    dateFrom !== '' ||
    dateTo !== '';

  const applySearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadTransactions();
  };

  const handleTypeFilter = (type: string) => {
    setFilterType(type);
    setIncomeFilter('all');
    setPage(1);
  };

  const handleIncomeFilter = (type: string) => {
    setIncomeFilter(type);
    setFilterType('all');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-[#1a1208] via-[#121820] to-[#0a0e17] p-6 sm:p-8">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-300 text-[11px] font-semibold uppercase tracking-wider mb-3">
              <History className="w-3.5 h-3.5" />
              Activity Log
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Transactions</h1>
            <p className="text-gray-400 text-sm mt-1">Complete history of your token activity</p>
          </div>
          <div className="flex gap-3">
            <StatPill label="Total Records" value={String(pagination.total)} />
            <StatPill label="Page" value={`${pagination.page} / ${pagination.totalPages}`} accent />
          </div>
        </div>
      </div>

      {/* Filters panel */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 space-y-4">
        <form onSubmit={applySearch} className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-900/60 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              placeholder="Search by description, type, amount..."
            />
          </div>
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <div className="relative flex-1 min-w-[130px]">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                className="w-full bg-gray-900/60 border border-gray-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:border-emerald-500 outline-none [color-scheme:dark]"
              />
            </div>
            <div className="relative flex-1 min-w-[130px]">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                className="w-full bg-gray-900/60 border border-gray-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:border-emerald-500 outline-none [color-scheme:dark]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-colors"
            >
              Search
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 text-sm flex items-center gap-1.5 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Type filters */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">Type Filter</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeFilter(type.id)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                  filterType === type.id && incomeFilter === 'all'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-gray-900/60 text-gray-400 border border-gray-700 hover:text-white hover:border-gray-600'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Income filters */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">Income Filter</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {INCOME_FILTERS.map((type) => (
              <button
                key={type.id}
                onClick={() => handleIncomeFilter(type.id)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                  incomeFilter === type.id
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
                    : 'bg-gray-900/60 text-gray-400 border border-gray-700 hover:text-orange-300 hover:border-orange-500/30'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16">
            <History className="w-10 h-10 text-gray-700 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No transactions found</p>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="text-orange-400 text-xs mt-2 hover:underline">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/40">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Type</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Description</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Amount</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Tx Hash</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-800/20 transition-all">
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-900/60 ${TRANSACTION_COLORS[tx.type] || 'text-gray-400'}`}>
                          {TRANSACTION_LABELS[tx.type] || tx.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-400">
                          {tx.type === 'roi' && tx.plan_type
                            ? `${planTypeLabel(tx.plan_type)}${tx.investment_token_amount ? ` · ${Number(tx.investment_token_amount).toFixed(0)} XIT` : ''}`
                            : tx.description || '-'}
                        </span>
                        {tx.type === 'buy' && tx.on_chain_status === 'failed' && (
                          <p className="text-[11px] text-red-400 mt-0.5">Buy incomplete — retry with same USDT tx or ask admin</p>
                        )}
                        {tx.type === 'sell' && tx.on_chain_status === 'pending' && (
                          <p className="text-[11px] text-amber-400 mt-0.5">USDT payout pending — will be retried</p>
                        )}
                        {tx.type === 'sell' && tx.on_chain_status === 'failed' && (
                          <p className="text-[11px] text-red-400 mt-0.5">Sell incomplete — admin may retry payout or compensate</p>
                        )}
                        {tx.type === 'roi' && tx.plan_type && (
                          <p className="text-[11px] text-gray-600 mt-0.5">{planTypeShortLabel(tx.plan_type)}</p>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={`text-sm font-semibold tabular-nums ${DEBIT_TYPES.has(tx.type) ? 'text-red-400' : TRANSACTION_COLORS[tx.type] || 'text-emerald-400'}`}>
                          {formatAmount(tx)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">XIT</span>
                      </td>
                      <td className="px-5 py-3.5">
                        {tx.tx_hash ? (
                          <a
                            href={`${explorerUrl}/tx/${tx.tx_hash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-cyan-400 font-mono hover:underline"
                          >
                            {tx.tx_hash.slice(0, 10)}...
                          </a>
                        ) : (
                          <span className="text-xs text-gray-600">{tx.on_chain_status === 'demo' ? 'demo' : '-'}</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="text-xs text-gray-500 tabular-nums">
                          {new Date(tx.created_at).toLocaleDateString('en-GB')}
                        </span>
                        <span className="block text-[11px] text-gray-600">
                          {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-800 bg-gray-900/20">
                <p className="text-xs text-gray-500">
                  Showing {(pagination.page - 1) * pagination.limit + 1}–
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all ${
                          page === pageNum
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page >= pagination.totalPages}
                    className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatPill({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border px-4 py-3 min-w-[100px] ${accent ? 'border-orange-500/30 bg-orange-500/10' : 'border-gray-700 bg-gray-900/40'}`}>
      <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
      <p className={`text-lg font-bold mt-0.5 ${accent ? 'text-orange-300' : 'text-white'}`}>{value}</p>
    </div>
  );
}
