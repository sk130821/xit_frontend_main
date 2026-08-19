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
}

export default function AdminPayout() {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadPreview = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.admin.payoutPreview();
      setPreview(data as PreviewData);
    } catch (err: any) {
      setError(err.message || 'Failed to load preview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreview();
  }, []);

  const handleRunPayout = async () => {
    if (!preview || preview.eligibleInvestments === 0) return;
    if (!confirm(`Confirm payout of ${fmtNum(preview.totalPayout)} XIT total?\n\nROI: ${fmtNum(preview.totalRoi)}\nLevel: ${fmtNum(preview.totalLevelBonus)}\nRoyalty: ${fmtNum(preview.totalRewardBonus)}`)) {
      return;
    }

    setRunning(true);
    setError('');
    setSuccess('');
    try {
      const result: any = await api.admin.runPayout();
      setSuccess(
        `Payout completed! ${result.investmentsProcessed} investments · Total ${fmtNum(result.totalPayout)} XIT distributed.`
      );
      await loadPreview();
    } catch (err: any) {
      setError(err.message || 'Payout failed');
    } finally {
      setRunning(false);
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
            onClick={loadPreview}
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
            Run Manual Payout
          </button>
        </div>
      </AdminPageHero>

      <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/25 rounded-2xl px-5 py-4 text-sm text-indigo-200">
        <Clock className="w-5 h-5 text-indigo-400 shrink-0" />
        <div>
          <p className="font-medium text-indigo-100">Automatic Schedule: 12:00 AM IST (Midnight)</p>
          <p className="text-indigo-300/70 text-xs mt-0.5">
            ROI, Level Income (15 levels), and Royalty (Reward Bonus) are paid together. Manual payout skips if already paid today.
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

      {loading && !preview ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      ) : preview && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <AdminSummaryCard
              label="Eligible Today"
              value={String(preview.eligibleInvestments)}
              sub={`of ${preview.totalInvestments} active plans`}
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
                <p className="text-xs text-gray-500 mt-0.5">Top members by today's ROI — review before running</p>
              </div>
              {preview.eligibleInvestments === 0 && (
                <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  Already paid today or no active plans
                </span>
              )}
            </div>

            {preview.items.length === 0 ? (
              <div className="text-center py-16 text-gray-500 text-sm">No eligible payouts for today</div>
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
