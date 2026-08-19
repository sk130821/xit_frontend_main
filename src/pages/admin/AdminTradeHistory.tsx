import { useEffect, useState } from 'react';
import {
  ShoppingCart,
  ArrowDownToLine,
  TrendingUp,
  TrendingDown,
  Calendar,
  RefreshCw,
  Loader2,
  Search,
} from 'lucide-react';
import { api } from '@/lib/api';
import {
  AdminPageHero,
  AdminSummaryCard,
  AdminFilterBar,
  AdminFilterField,
  AdminInput,
  AdminSelect,
  AdminPagination,
  fmtNum,
  fmtDate,
  fmtDateTime,
} from '@/components/admin/AdminUI';

interface TradeItem {
  id: number;
  user_id: number;
  username: string;
  email: string;
  type: 'buy' | 'sell';
  amount: number;
  description: string;
  on_chain_status: string | null;
  created_at: string;
}

interface DailyTrade {
  date: string;
  buy_total: number;
  sell_total: number;
  buy_count: number;
  sell_count: number;
  net: number;
}

export default function AdminTradeHistory() {
  const [tab, setTab] = useState<'history' | 'daily'>('daily');
  const [items, setItems] = useState<TradeItem[]>([]);
  const [daily, setDaily] = useState<DailyTrade[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [type, setType] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadDaily = async () => {
    const params: Record<string, string> = {};
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;
    const data: any = await api.admin.tradeDaily(params);
    setDaily(data.daily || []);
    setSummary(data.summary || null);
  };

  const loadHistory = async (p = 1) => {
    const params: Record<string, string> = { page: String(p), limit: '25' };
    if (type !== 'all') params.type = type;
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;
    if (search) params.search = search;
    const data: any = await api.admin.tradeHistory(params);
    setItems(data.items || []);
    setPagination(data.pagination || { total: 0, totalPages: 1 });
    setPage(p);
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      await Promise.all([loadDaily(), loadHistory()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const applyFilters = async () => {
    setLoading(true);
    try {
      if (tab === 'daily') await loadDaily();
      else await loadHistory(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHero
        badge="Trade Analytics"
        badgeIcon={ShoppingCart}
        title="Buy & Sell History"
        subtitle="Track all token purchases and sales — daily totals and transaction logs"
      >
        <button
          onClick={loadAll}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-sm hover:border-blue-500/40"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </AdminPageHero>

      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <AdminSummaryCard
            label="Total Purchases"
            value={`${fmtNum(summary.total_buy)} XIT`}
            sub={`${summary.buy_count} buy transactions`}
            icon={ShoppingCart}
            color="emerald"
          />
          <AdminSummaryCard
            label="Total Sales"
            value={`${fmtNum(summary.total_sell)} USDT`}
            sub={`${summary.sell_count} sell transactions`}
            icon={ArrowDownToLine}
            color="orange"
          />
          <AdminSummaryCard
            label="Buy Volume"
            value={`${fmtNum(summary.total_buy)} XIT`}
            sub="Tokens purchased"
            icon={TrendingUp}
            color="cyan"
          />
          <AdminSummaryCard
            label="Buy Count"
            value={String(summary.buy_count)}
            icon={TrendingUp}
            color="blue"
          />
          <AdminSummaryCard
            label="Sell Count"
            value={String(summary.sell_count)}
            icon={TrendingDown}
            color="purple"
          />
        </div>
      )}

      <div className="flex gap-2">
        {(['daily', 'history'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : 'border border-gray-800 text-gray-500 hover:text-gray-300'
            }`}
          >
            {t === 'daily' ? 'Daily Summary' : 'All Transactions'}
          </button>
        ))}
      </div>

      <AdminFilterBar>
        <AdminFilterField label="Type">
          <AdminSelect value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">All</option>
            <option value="buy">Purchase Only</option>
            <option value="sell">Sale Only</option>
          </AdminSelect>
        </AdminFilterField>
        <AdminFilterField label="From">
          <AdminInput type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </AdminFilterField>
        <AdminFilterField label="To">
          <AdminInput type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </AdminFilterField>
        {tab === 'history' && (
          <AdminFilterField label="Search">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <AdminInput
                className="pl-9"
                placeholder="Member name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </AdminFilterField>
        )}
        <button
          onClick={applyFilters}
          className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-medium hover:bg-emerald-500/30"
        >
          Apply Filter
        </button>
      </AdminFilterBar>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-emerald-400 animate-spin" /></div>
      ) : tab === 'daily' ? (
        <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden">
          {daily.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-sm">No trade data for selected period</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3"><Calendar className="w-3 h-3 inline mr-1" />Date</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Buy (XIT)</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Buy Count</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Sell (USDT)</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Sell Count</th>
                  </tr>
                </thead>
                <tbody>
                  {daily.map((row) => (
                    <tr key={String(row.date)} className="border-b border-gray-800/40 hover:bg-gray-900/30">
                      <td className="px-4 py-3 text-sm text-white font-medium">{fmtDate(row.date)}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-400 tabular-nums">{fmtNum(row.buy_total)} XIT</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-400">{row.buy_count}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-orange-400 tabular-nums">{fmtNum(row.sell_total)} USDT</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-400">{row.sell_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-sm">No transactions found</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Date</th>
                      <th className="text-left text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Member</th>
                      <th className="text-left text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Type</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Amount</th>
                      <th className="text-left text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Description</th>
                      <th className="text-left text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Mode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((tx) => (
                      <tr key={tx.id} className="border-b border-gray-800/40 hover:bg-gray-900/30">
                        <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{fmtDateTime(tx.created_at)}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-white font-medium">{tx.username}</p>
                          <p className="text-[10px] text-gray-500 truncate max-w-[140px]">{tx.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                            tx.type === 'buy'
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : 'bg-orange-500/15 text-orange-300'
                          }`}>
                            {tx.type === 'buy' ? <ShoppingCart className="w-3 h-3" /> : <ArrowDownToLine className="w-3 h-3" />}
                            {tx.type === 'buy' ? 'Purchase' : 'Sale'}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-right text-sm font-bold tabular-nums ${
                          tx.type === 'buy' ? 'text-emerald-400' : 'text-orange-400'
                        }`}>
                          {fmtNum(tx.amount)} {tx.type === 'buy' ? 'XIT' : 'USDT'}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 max-w-[200px] truncate">{tx.description || '—'}</td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 uppercase">
                            {tx.on_chain_status || 'demo'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 pb-4">
                <AdminPagination
                  page={page}
                  totalPages={pagination.totalPages}
                  total={pagination.total}
                  onPage={(p) => { setLoading(true); loadHistory(p).finally(() => setLoading(false)); }}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
