import { useEffect, useState } from 'react';
import {
  Zap,
  TrendingUp,
  Award,
  Crown,
  Clock,
  Play,
  RefreshCw,
  AlertCircle,
  Check,
  Users,
  Loader2,
  CalendarDays,
} from 'lucide-react';
import { api } from '@/lib/api';
import {
  AdminPageHero,
  AdminSummaryCard,
  fmtNum,
} from '@/components/admin/AdminUI';

interface PreviewItem {
  investmentId: number;
  userId: number;
  username: string;
  planType: string;
  tokenAmount: number;
  days: number;
  roiAmount: number;
  levelBonus: number;
  rewardBonus: number;
  rewardTier: string | null;
}

interface PreviewData {
  eligibleInvestments: number;
  totalInvestments: number;
  totalRoi: number;
  totalLevelBonus: number;
  totalRewardBonus: number;
  totalPayout: number;
  items: PreviewItem[];
  hasMore: boolean;
  payoutDate?: string;
  demoMode?: boolean;
}

function todayDateInput() {
  return new Date().toISOString().split('T')[0];
}

function addDaysToDate(dateStr: string, days: number) {
  const d = new Date(`${dateStr}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export default function AdminPayout() {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [payoutDate, setPayoutDate] = useState(todayDateInput);
  const [demoMode, setDemoMode] = useState(false);
  const [debugLoading, setDebugLoading] = useState(false);
  const [debugReport, setDebugReport] = useState<any>(null);

  const loadPreview = async (date?: string, isDemo?: boolean) => {
    const effectiveDate = date ?? payoutDate;
    const useDemoDate = isDemo ?? demoMode;

    setLoading(true);
    setError('');
    const controller = new AbortController();
    const timeoutMs = 180_000;
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      const data = await api.admin.payoutPreview(useDemoDate ? effectiveDate : undefined, {
        signal: controller.signal,
      });
      const previewData = data as PreviewData;
      setPreview(previewData);
      if (previewData.demoMode !== undefined) {
        setDemoMode(!!previewData.demoMode);
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        setError(
          `Preview took longer than ${timeoutMs / 60_000} minutes. Deploy latest backend (preview wallet cache v8), restart Node, then Refresh — or use Debug ROI first.`
        );
      } else {
        setError(err.message || 'Failed to load preview');
      }
    } finally {
      window.clearTimeout(timer);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreview();
  }, []);

  useEffect(() => {
    if (!demoMode) return;
    loadPreview(payoutDate, true);
  }, [payoutDate, demoMode]);

  const handleRunPayout = async () => {
    if (!preview || preview.eligibleInvestments === 0) return;
    const dateLabel = demoMode ? payoutDate : 'today';
    if (!confirm(`Confirm payout for ${dateLabel}?\n\nTotal: ${fmtNum(preview.totalPayout)} XIT\nROI: ${fmtNum(preview.totalRoi)}\nLevel: ${fmtNum(preview.totalLevelBonus)}\nRoyalty: ${fmtNum(preview.totalRewardBonus)}`)) {
      return;
    }

    setRunning(true);
    setError('');
    setSuccess('');
    try {
      const result: any = await api.admin.runPayout(demoMode ? payoutDate : undefined);
      let msg = `Payout completed for ${result.payoutDate || dateLabel}! ${result.investmentsProcessed} investments · Total ${fmtNum(result.totalPayout)} XIT distributed.`;
      if (result.database) msg += ` DB=${result.database}.`;
      if (result.failureCount > 0) {
        msg += ` Failures: ${result.failureCount}.`;
        const firstFail = result.failures?.[0]?.error;
        if (firstFail) msg += ` First: ${firstFail}`;
      }
      setSuccess(msg);
      if (demoMode) {
        const nextDate = addDaysToDate(payoutDate, 1);
        setPayoutDate(nextDate);
      } else {
        await loadPreview();
      }
    } catch (err: any) {
      setError(err.message || 'Payout failed');
    } finally {
      setRunning(false);
    }
  };

  const handleDebug = async () => {
    setDebugLoading(true);
    setError('');
    try {
      const data = await api.admin.payoutDebug(demoMode ? payoutDate : undefined);
      setDebugReport(data);
    } catch (err: any) {
      setError(err.message || 'Debug failed');
    } finally {
      setDebugLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHero
        badge="Income Engine"
        badgeIcon={Zap}
        title="ROI Payout Control"
        subtitle="Preview and run daily ROI + Level Income + Royalty. Auto-runs every night at 12:00 AM IST."
      >
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDebug}
            disabled={debugLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/40 text-amber-300 text-sm hover:bg-amber-500/10 transition-colors disabled:opacity-50"
          >
            {debugLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}
            Debug ROI / Wallet / DB
          </button>
          <button
            onClick={() => loadPreview(payoutDate, demoMode)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-sm hover:border-blue-500/40 hover:text-blue-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Preview
          </button>
          <button
            onClick={handleRunPayout}
            disabled={running || loading || !preview || preview.eligibleInvestments === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {demoMode ? `Run Payout (${payoutDate})` : 'Run Manual Payout'}
          </button>
        </div>
      </AdminPageHero>

      {demoMode && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl px-5 py-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-amber-300 font-medium text-sm mb-1">
                <CalendarDays className="w-4 h-4" />
                Demo Mode — Simulate Payout Date
              </div>
              <p className="text-xs text-amber-200/70 leading-relaxed">
                Select any date to run that day&apos;s ROI without waiting 24 hours. After payout, date auto-advances +1 day for quick testing.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <input
                type="date"
                value={payoutDate}
                onChange={(e) => setPayoutDate(e.target.value)}
                className="bg-gray-900 border border-amber-500/30 rounded-xl px-3 py-2 text-sm text-white"
              />
              <button
                type="button"
                onClick={() => setPayoutDate(addDaysToDate(payoutDate, 1))}
                className="px-3 py-2 rounded-xl border border-amber-500/30 text-amber-300 text-xs hover:bg-amber-500/10"
              >
                +1 Day
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/25 rounded-2xl px-5 py-4 text-sm text-indigo-200">
        <Clock className="w-5 h-5 text-indigo-400 shrink-0" />
        <div>
          <p className="font-medium text-indigo-100">Automatic Schedule: 12:00 AM IST (Midnight)</p>
          <p className="text-indigo-300/70 text-xs mt-0.5">
            {demoMode
              ? 'In demo mode use the date picker above to test multiple days instantly. Same date cannot be paid twice.'
              : 'ROI, Level Income (15 levels), and Royalty are paid together. Manual payout skips if already paid today.'}
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 text-sm">
          <Check className="w-4 h-4 shrink-0" />
          {success}
        </div>
      )}

      {debugReport && (
        <div className="bg-[#111827] border border-amber-500/30 rounded-2xl p-5 space-y-4 text-sm">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-amber-300 font-semibold">Payout Debug Report</h3>
            <button
              type="button"
              onClick={() => setDebugReport(null)}
              className="text-xs text-gray-500 hover:text-gray-300"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-gray-900/60 rounded-xl p-3 border border-gray-800">
              <p className="text-gray-500 mb-1">Database</p>
              <p className="text-white font-mono">{debugReport.database?.current_db || '—'}</p>
              <p className="text-gray-500 mt-1">env DB_NAME: <span className="text-cyan-300">{debugReport.env?.DB_NAME}</span></p>
              <p className="text-gray-500">match: {String(debugReport.database?.env_DB_NAME_matches)}</p>
            </div>
            <div className="bg-gray-900/60 rounded-xl p-3 border border-gray-800">
              <p className="text-gray-500 mb-1">Platform</p>
              <p className="text-white">{debugReport.platform?.platformMode} · chain={String(debugReport.platform?.chainMode)}</p>
              <p className="text-gray-500 mt-1">ADMIN_PRIVATE_KEY: {debugReport.env?.ADMIN_PRIVATE_KEY_SET ? 'set' : 'MISSING'}</p>
            </div>
            <div className="bg-gray-900/60 rounded-xl p-3 border border-gray-800">
              <p className="text-gray-500 mb-1">Summary</p>
              <p className="text-white">Eligible: {debugReport.summary?.eligibleForRoiToday}</p>
              <p className="text-emerald-400">Would pay: {debugReport.summary?.wouldPayOnSuccess}</p>
              <p className="text-red-400">Fail no wallet: {debugReport.summary?.wouldFailMissingWallet}</p>
            </div>
          </div>
          {Array.isArray(debugReport.notes) && debugReport.notes.length > 0 && (
            <ul className="space-y-1 text-xs text-amber-200/90">
              {debugReport.notes.map((n: string, i: number) => (
                <li key={i}>• {n}</li>
              ))}
            </ul>
          )}
          <div className="overflow-x-auto max-h-72 overflow-y-auto border border-gray-800 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-900 text-gray-400 sticky top-0">
                <tr>
                  <th className="px-3 py-2">Inv</th>
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Amt</th>
                  <th className="px-3 py-2">Wallet</th>
                  <th className="px-3 py-2">ROI</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {(debugReport.investments || [])
                  .filter((i: any) => i.eligible)
                  .map((i: any) => (
                    <tr key={i.investmentId} className="border-t border-gray-800">
                      <td className="px-3 py-1.5 text-gray-300">#{i.investmentId}</td>
                      <td className="px-3 py-1.5 text-white">{i.username}</td>
                      <td className="px-3 py-1.5 text-gray-300">{i.tokenAmount}</td>
                      <td className="px-3 py-1.5 font-mono text-gray-400">{i.hasWallet ? i.walletMasked : 'NONE'}</td>
                      <td className="px-3 py-1.5 text-cyan-300">{i.calcRoi}</td>
                      <td className={`px-3 py-1.5 ${i.willFailOnChain ? 'text-red-400' : 'text-emerald-400'}`}>{i.predictedAction}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loading && !preview ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          <p className="text-sm text-gray-400 max-w-md">
            Loading payout preview… On live (real) mode the server checks wallet balances once per member — first load can take 30–90 seconds after the fix; without the update it may never finish.
          </p>
        </div>
      ) : preview && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <AdminSummaryCard
              label={demoMode ? 'Eligible (Date)' : 'Eligible Today'}
              value={String(preview.eligibleInvestments)}
              sub={`${preview.payoutDate || payoutDate} · ${preview.totalInvestments} active plans`}
              icon={Users}
              color="blue"
            />
            <AdminSummaryCard
              label="ROI Payout"
              value={`${fmtNum(preview.totalRoi)} XIT`}
              sub="Daily return to investors"
              icon={TrendingUp}
              color="emerald"
            />
            <AdminSummaryCard
              label="Level Income"
              value={`${fmtNum(preview.totalLevelBonus)} XIT`}
              sub="15-level upline bonus"
              icon={Award}
              color="purple"
            />
            <AdminSummaryCard
              label="Royalty"
              value={`${fmtNum(preview.totalRewardBonus)} XIT`}
              sub="Reward tier bonus"
              icon={Crown}
              color="amber"
            />
            <AdminSummaryCard
              label="Total Payout"
              value={`${fmtNum(preview.totalPayout)} XIT`}
              sub="All income combined"
              icon={Zap}
              color="cyan"
            />
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Payout Preview</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Top members by ROI for {preview.payoutDate || payoutDate} — review before running
                </p>
              </div>
              {preview.eligibleInvestments === 0 && (
                <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  {demoMode ? 'Already paid for this date or no active plans' : 'Already paid today or no active plans'}
                </span>
              )}
            </div>

            {preview.items.length === 0 ? (
              <div className="text-center py-16 text-gray-500 text-sm">
                No eligible payouts for {preview.payoutDate || payoutDate}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800/80">
                      <th className="text-left text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Member</th>
                      <th className="text-left text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Plan</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Invested</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Days</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">ROI</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Level</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-gray-500 px-4 py-3">Royalty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.items.map((item) => (
                      <tr key={item.investmentId} className="border-b border-gray-800/40 hover:bg-gray-900/30">
                        <td className="px-4 py-3">
                          <p className="text-sm text-white font-medium">{item.username}</p>
                          <p className="text-[10px] text-gray-500">ID #{item.userId}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                            item.planType === 'lock'
                              ? 'bg-purple-500/15 text-purple-300'
                              : 'bg-blue-500/15 text-blue-300'
                          }`}>
                            {item.planType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-300 tabular-nums">{fmtNum(item.tokenAmount, 0)}</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-400 tabular-nums">{item.days}</td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-400 tabular-nums">{fmtNum(item.roiAmount)}</td>
                        <td className="px-4 py-3 text-right text-sm text-purple-400 tabular-nums">{fmtNum(item.levelBonus)}</td>
                        <td className="px-4 py-3 text-right text-sm text-amber-400 tabular-nums">
                          {fmtNum(item.rewardBonus)}
                          {item.rewardTier && <span className="block text-[10px] text-gray-500">{item.rewardTier}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {preview.hasMore && (
              <p className="text-center text-xs text-gray-500 py-3 border-t border-gray-800">Showing top 100 of {preview.eligibleInvestments} eligible</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
