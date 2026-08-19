import { useEffect, useState } from 'react';
import { History, TrendingUp, Award, Crown, Zap, Calendar, RefreshCw, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import {
  AdminPageHero,
  AdminSummaryCard,
  AdminFilterBar,
  AdminFilterField,
  AdminInput,
  AdminPagination,
  fmtNum,
  fmtDate,
  fmtDateTime,
} from '@/components/admin/AdminUI';

interface DailyRow {
  date: string;
  roi: number;
  level_bonus: number;
  reward_bonus: number;
  total: number;
  tx_count: number;
}

interface PayoutRun {
  id: number;
  run_type: string;
  run_date: string;
  investments_processed: number;
  total_roi: number;
  total_level_bonus: number;
  total_reward_bonus: number;
  total_payout: number;
  triggered_by: string;
  created_at: string;
}

export default function AdminPayoutHistory() {
  const [tab, setTab] = useState<'daily' | 'runs'>('daily');
  const [daily, setDaily] = useState<DailyRow[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [runs, setRuns] = useState<PayoutRun[]>([]);
  const [runPage, setRunPage] = useState(1);
  const [runPagination, setRunPagination] = useState({ total: 0, totalPages: 1 });
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(true);

  const loadDaily = async () => {
    const params: Record<string, string> = {};
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;
    const data: any = await api.admin.payoutDaily(params);
    setDaily(data.daily || []);
    setSummary(data.summary || null);
  };

  const loadRuns = async (page = 1) => {
    const data: any = await api.admin.payoutRuns({ page: String(page), limit: '15' });
    setRuns(data.items || []);
    setRunPagination(data.pagination || { total: 0, totalPages: 1 });
    setRunPage(page);
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      await Promise.all([loadDaily(), loadRuns()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const applyFilters = () => {
    setLoading(true);
    loadDaily().finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6">
      <AdminPageHero
        badge="Payout Records"
        badgeIcon={History}
        title="Payout History"
        subtitle="Daily ROI, Level Income & Royalty paid — run logs and date-wise breakdown"
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminSummaryCard label="Total ROI Paid" value={`${fmtNum(summary.total_roi)} XIT`} icon={TrendingUp} color="emerald" />
          <AdminSummaryCard label="Total Level Paid" value={`${fmtNum(summary.total_level_bonus)} XIT`} icon={Award} color="purple" />
          <AdminSummaryCard label="Total Royalty" value={`${fmtNum(summary.total_reward_bonus)} XIT`} icon={Crown} color="amber" />
          <AdminSummaryCard label="Grand Total" value={`${fmtNum(summary.grand_total)} XIT`} icon={Zap} color="cyan" />
        </div>
      )}

      <div className="flex gap-2">
        {(['daily', 'runs'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t
                ? 'bg-blue-500/15 border border-blue-500/30 text-blue-300'
                : 'border border-gray-800 text-gray-500 hover:text-gray-300'
            }`}
          >
            {t === 'daily' ? 'Daily Breakdown' : 'Payout Runs'}
          </button>
        ))}
      </div>

      {tab === 'daily' && (
        <>
          <AdminFilterBar>
            <AdminFilterField label="From Date">
              <AdminInput type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </AdminFilterField>
            <AdminFilterField label="To Date">
              <AdminInput type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </AdminFilterField>
            <button
              onClick={applyFilters}
              className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium hover:bg-blue-500/30"
            >
              Apply Filter
            </button>
          </AdminFilterBar>

          <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden">
            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-blue-400 animate-spin" /></div>
            ) : daily.length === 0 ? (
              <div className="text-center py-16 text-gray-500 text-sm">No payout records found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3"><Calendar className="w-3 h-3 inline mr-1" />Date</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">ROI</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Level</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Royalty</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Total Paid</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Txns</th>
                    </tr>
                  </thead>
                  <tbody>
                    {daily.map((row) => (
                      <tr key={String(row.date)} className="border-b border-gray-800/40 hover:bg-gray-900/30">
                        <td className="px-4 py-3 text-sm text-white font-medium">{fmtDate(row.date)}</td>
                        <td className="px-4 py-3 text-right text-sm text-emerald-400 tabular-nums">{fmtNum(row.roi)}</td>
                        <td className="px-4 py-3 text-right text-sm text-purple-400 tabular-nums">{fmtNum(row.level_bonus)}</td>
                        <td className="px-4 py-3 text-right text-sm text-amber-400 tabular-nums">{fmtNum(row.reward_bonus)}</td>
                        <td className="px-4 py-3 text-right text-sm font-bold text-cyan-400 tabular-nums">{fmtNum(row.total)}</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-400">{row.tx_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'runs' && (
        <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden">
          {runs.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-sm">No payout runs yet — run manual or wait for midnight auto</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Run #</th>
                      <th className="text-left text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Type</th>
                      <th className="text-left text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Date</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Plans</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">ROI</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Level</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Royalty</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Total</th>
                      <th className="text-left text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Triggered By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {runs.map((run) => (
                      <tr key={run.id} className="border-b border-gray-800/40 hover:bg-gray-900/30">
                        <td className="px-4 py-3 text-sm text-gray-400">#{run.id}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            run.run_type === 'auto'
                              ? 'bg-indigo-500/15 text-indigo-300'
                              : 'bg-orange-500/15 text-orange-300'
                          }`}>
                            {run.run_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-white">{fmtDateTime(run.created_at)}</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-300">{run.investments_processed}</td>
                        <td className="px-4 py-3 text-right text-sm text-emerald-400 tabular-nums">{fmtNum(run.total_roi)}</td>
                        <td className="px-4 py-3 text-right text-sm text-purple-400 tabular-nums">{fmtNum(run.total_level_bonus)}</td>
                        <td className="px-4 py-3 text-right text-sm text-amber-400 tabular-nums">{fmtNum(run.total_reward_bonus)}</td>
                        <td className="px-4 py-3 text-right text-sm font-bold text-cyan-400 tabular-nums">{fmtNum(run.total_payout)}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{run.triggered_by || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 pb-4">
                <AdminPagination
                  page={runPage}
                  totalPages={runPagination.totalPages}
                  total={runPagination.total}
                  onPage={(p) => loadRuns(p)}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
