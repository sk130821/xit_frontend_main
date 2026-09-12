import { useEffect, useState } from 'react';
import {
  BarChart3,
  Users,
  TrendingUp,
  Coins,
  Wallet,
  ShoppingCart,
  ArrowDownToLine,
  Award,
  Gift,
  Layers,
  Crown,
  Network,
  Lock,
  Unlock,
  RefreshCw,
  Loader2,
  Calendar,
  UserPlus,
  PieChart,
  Trophy,
  DollarSign,
  Activity,
} from 'lucide-react';
import { api } from '@/lib/api';
import {
  AdminPageHero,
  AdminSummaryCard,
  AdminFilterBar,
  AdminFilterField,
  AdminInput,
  fmtNum,
  fmtDate,
} from '@/components/admin/AdminUI';

interface BusinessReport {
  generated_at: string;
  filters: { date_from: string | null; date_to: string | null };
  settings: { token_price: number; admin_charge_percent: number };
  overview: Record<string, number>;
  investments: Record<string, number | any[]>;
  financial: Record<string, number>;
  income: Record<string, number | object>;
  network: Record<string, number>;
  trends: {
    registrations: { date: string; count: number }[];
    purchases: { date: string; buy_xit: number; count: number }[];
    sales: { date: string; sell_usdt: number; count: number }[];
    payouts: { date: string; roi: number; level_bonus: number; reward_bonus: number; total: number }[];
  };
  top: {
    investors: any[];
    earners: any[];
    referrers: any[];
  };
}

export default function AdminBusinessReport() {
  const [report, setReport] = useState<BusinessReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const loadReport = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;
      const data = await api.admin.businessReport(params);
      setReport(data as BusinessReport);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const income = report?.income as any;
  const breakdown = income?.breakdown_pct || {};

  return (
    <div className="space-y-6">
      <AdminPageHero
        badge="Analytics"
        badgeIcon={BarChart3}
        title="Business Report"
        subtitle="Complete platform overview — members, investments, income, trades & network"
      >
        <button
          onClick={loadReport}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-sm hover:border-blue-500/40"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </AdminPageHero>

      <AdminFilterBar>
        <AdminFilterField label="From Date">
          <AdminInput type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </AdminFilterField>
        <AdminFilterField label="To Date">
          <AdminInput type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </AdminFilterField>
        <button
          onClick={loadReport}
          className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium hover:bg-blue-500/30"
        >
          Apply Filter
        </button>
        {(dateFrom || dateTo) && (
          <button
            onClick={() => {
              setDateFrom('');
              setDateTo('');
              setLoading(true);
              api.admin.businessReport({}).then((d) => setReport(d as BusinessReport)).finally(() => setLoading(false));
            }}
            className="px-4 py-2 rounded-xl border border-gray-700 text-gray-400 text-sm hover:text-white"
          >
            Clear
          </button>
        )}
      </AdminFilterBar>

      {loading && !report ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      ) : report && (
        <>
          {/* ── Members Overview ── */}
          <Section title="Members Overview" icon={Users}>
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <AdminSummaryCard label="Total Members" value={String(report.overview.total_users)} icon={Users} color="blue" />
              <AdminSummaryCard label="Active" value={String(report.overview.active_users)} sub="Activated accounts" icon={Activity} color="emerald" />
              <AdminSummaryCard label="Invested" value={String(report.overview.invested_members)} sub="With active plans" icon={Coins} color="purple" />
              <AdminSummaryCard label="Pending" value={String(report.overview.pending_members)} sub="Not invested yet" icon={UserPlus} color="amber" />
              <AdminSummaryCard label="New Today" value={String(report.overview.new_today)} icon={Calendar} color="cyan" />
              <AdminSummaryCard label="New (30 Days)" value={String(report.overview.new_month)} icon={TrendingUp} color="orange" />
            </div>
          </Section>

          {/* ── Financial Summary ── */}
          <Section title="Financial Summary" icon={DollarSign}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <AdminSummaryCard
                label="Total Purchases"
                value={`${fmtNum(report.financial.total_buy_xit)} XIT`}
                sub={`≈ ${fmtNum(report.financial.estimated_buy_usdt)} USDT · ${report.financial.buy_count} txns`}
                icon={ShoppingCart}
                color="emerald"
              />
              <AdminSummaryCard
                label="Total Sales"
                value={`${fmtNum(report.financial.total_sell_usdt)} USDT`}
                sub={`${report.financial.sell_count} sell transactions`}
                icon={ArrowDownToLine}
                color="orange"
              />
              <AdminSummaryCard
                label="Est. Sell Revenue"
                value={`${fmtNum(report.financial.estimated_admin_sell_revenue)} USDT`}
                sub={`${report.settings.admin_charge_percent}% admin charge`}
                icon={Wallet}
                color="amber"
              />
              <AdminSummaryCard
                label="USDT in Wallets"
                value={`${fmtNum(report.overview.total_wallet_usdt)} USDT`}
                sub="Member USDT balance"
                icon={Wallet}
                color="cyan"
              />
              <AdminSummaryCard
                label="Free XIT (Members)"
                value={`${fmtNum(report.overview.total_xit_balance)} XIT`}
                sub="Outside plans"
                icon={Coins}
                color="purple"
              />
              <AdminSummaryCard
                label="Total Invested"
                value={`${fmtNum(report.overview.total_invested)} XIT`}
                sub="In active plans"
                icon={Layers}
                color="blue"
              />
              <AdminSummaryCard
                label="Total Purchased"
                value={`${fmtNum(report.overview.total_purchased)} XIT`}
                icon={ShoppingCart}
                color="emerald"
              />
              <AdminSummaryCard
                label="Total Income Paid"
                value={`${fmtNum(report.financial.total_income_paid)} XIT`}
                sub="ROI + bonuses"
                icon={TrendingUp}
                color="orange"
              />
            </div>
          </Section>

          {/* ── Income Breakdown ── */}
          <Section title="Income Distribution" icon={PieChart}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="grid grid-cols-2 gap-4">
                <IncomeCard label="ROI Paid" value={Number(income?.roi || 0)} pct={breakdown.roi} color="emerald" icon={TrendingUp} />
                <IncomeCard label="Referral Bonus" value={Number(income?.referral || 0)} pct={breakdown.referral} color="blue" icon={Gift} />
                <IncomeCard label="Level Income" value={Number(income?.level || 0)} pct={breakdown.level} color="purple" icon={Layers} />
                <IncomeCard label="Royalty / Reward" value={Number(income?.reward || 0)} pct={breakdown.reward} color="amber" icon={Crown} />
              </div>
              <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
                <h4 className="text-sm font-semibold text-white mb-4">Income Share</h4>
                <div className="space-y-3">
                  <ShareBar label="ROI" pct={breakdown.roi || 0} color="bg-emerald-500" />
                  <ShareBar label="Referral" pct={breakdown.referral || 0} color="bg-blue-500" />
                  <ShareBar label="Level" pct={breakdown.level || 0} color="bg-purple-500" />
                  <ShareBar label="Royalty" pct={breakdown.reward || 0} color="bg-amber-500" />
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Total: <span className="text-white font-semibold">{fmtNum(Number(income?.total || 0))} XIT</span> paid to members
                </p>
              </div>
            </div>
          </Section>

          {/* ── Investment Plans ── */}
          <Section title="Investment Plans" icon={Layers}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              <AdminSummaryCard label="Active Plans" value={String(report.investments.active)} icon={Activity} color="emerald" />
              <AdminSummaryCard label="Completed" value={String(report.investments.completed)} icon={Award} color="blue" />
              <AdminSummaryCard label="Sellable in Plans" value={`${fmtNum(Number(report.investments.total_sellable))} XIT`} icon={Unlock} color="cyan" />
              <AdminSummaryCard label="Locked in Plans" value={`${fmtNum(Number(report.investments.total_locked))} XIT`} icon={Lock} color="purple" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PlanCard
                name="Lock Plan (4X)"
                count={Number(report.investments.lock_count)}
                amount={Number(report.investments.lock_amount)}
                color="purple"
              />
              <PlanCard
                name="Flexible Plan (2X)"
                count={Number(report.investments.flex_count)}
                amount={Number(report.investments.flex_amount)}
                color="blue"
              />
              <PlanCard
                name="Flexible Lock"
                count={Number(report.investments.flex_lock_count || 0)}
                amount={Number(report.investments.flex_lock_amount || 0)}
                color="amber"
              />
            </div>
            {(report.investments.plan_breakdown as any[])?.length > 0 && (
              <div className="mt-4 bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left text-[10px] uppercase text-gray-500 px-4 py-3">Plan</th>
                      <th className="text-left text-[10px] uppercase text-gray-500 px-4 py-3">Status</th>
                      <th className="text-right text-[10px] uppercase text-gray-500 px-4 py-3">Count</th>
                      <th className="text-right text-[10px] uppercase text-gray-500 px-4 py-3">Amount</th>
                      <th className="text-right text-[10px] uppercase text-gray-500 px-4 py-3">ROI Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(report.investments.plan_breakdown as any[]).map((p, i) => (
                      <tr key={i} className="border-b border-gray-800/40">
                        <td className="px-4 py-2.5 text-white">{p.plan_type === 'flexible_lock' ? 'Flexible Lock' : p.plan_type}</td>
                        <td className="px-4 py-2.5 capitalize text-gray-400">{p.status}</td>
                        <td className="px-4 py-2.5 text-right text-gray-300">{p.count}</td>
                        <td className="px-4 py-2.5 text-right text-emerald-400 tabular-nums">{fmtNum(p.amount)} XIT</td>
                        <td className="px-4 py-2.5 text-right text-orange-400 tabular-nums">{fmtNum(p.roi_received)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          {/* ── Network ── */}
          <Section title="Network Stats" icon={Network}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <AdminSummaryCard label="Referral Links" value={String(report.network.total_relations)} sub="Total upline relations" icon={Network} color="blue" />
              <AdminSummaryCard label="Leaders w/ Team" value={String(report.network.members_with_team)} icon={Users} color="purple" />
              <AdminSummaryCard label="Referred Members" value={String(report.network.referred_users)} icon={UserPlus} color="emerald" />
              <AdminSummaryCard label="Avg Team Size" value={fmtNum(report.network.avg_team_size, 1)} icon={TrendingUp} color="cyan" />
            </div>
          </Section>

          {/* ── Daily Trends ── */}
          <Section title="Daily Trends (Last 30 Days)" icon={BarChart3}>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <TrendTable
                title="New Registrations"
                headers={['Date', 'Members']}
                rows={report.trends.registrations.map((r) => [fmtDate(r.date), String(r.count)])}
                empty="No registrations"
              />
              <TrendTable
                title="Purchases"
                headers={['Date', 'XIT Bought', 'Txns']}
                rows={report.trends.purchases.map((r) => [fmtDate(r.date), fmtNum(r.buy_xit), String(r.count)])}
                empty="No purchases"
              />
              <TrendTable
                title="Sales"
                headers={['Date', 'USDT Paid', 'Txns']}
                rows={report.trends.sales.map((r) => [fmtDate(r.date), `${fmtNum(r.sell_usdt)} USDT`, String(r.count)])}
                empty="No sales"
              />
              <TrendTable
                title="Income Payouts"
                headers={['Date', 'ROI', 'Level', 'Royalty', 'Total']}
                rows={report.trends.payouts.map((r) => [
                  fmtDate(r.date),
                  fmtNum(r.roi),
                  fmtNum(r.level_bonus),
                  fmtNum(r.reward_bonus),
                  fmtNum(r.total),
                ])}
                empty="No payouts"
              />
            </div>
          </Section>

          {/* ── Top Performers ── */}
          <Section title="Top Performers" icon={Trophy}>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <TopTable
                title="Top Investors"
                headers={['#', 'Member', 'Invested']}
                rows={report.top.investors.map((m, i) => [
                  String(i + 1),
                  m.username,
                  `${fmtNum(m.total_invested)} XIT`,
                ])}
              />
              <TopTable
                title="Top Earners"
                headers={['#', 'Member', 'Earned']}
                rows={report.top.earners.map((m, i) => [
                  String(i + 1),
                  m.username,
                  `${fmtNum(m.total_earned)} XIT`,
                ])}
              />
              <TopTable
                title="Top Referrers"
                headers={['#', 'Member', 'Directs', 'Volume']}
                rows={report.top.referrers.map((m, i) => [
                  String(i + 1),
                  m.username,
                  String(m.direct_count),
                  fmtNum(m.direct_volume),
                ])}
              />
            </div>
          </Section>

          <p className="text-center text-xs text-gray-600 pb-4">
            Report generated {new Date(report.generated_at).toLocaleString('en-IN')}
            {report.filters.date_from && ` · Filter: ${report.filters.date_from} to ${report.filters.date_to || 'now'}`}
          </p>
        </>
      )}
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-blue-400" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function IncomeCard({ label, value, pct, color, icon: Icon }: {
  label: string; value: number; pct: number; color: string; icon: React.ComponentType<{ className?: string }>;
}) {
  const colors: Record<string, string> = {
    emerald: 'border-emerald-500/25 from-emerald-600/10 text-emerald-300',
    blue: 'border-blue-500/25 from-blue-600/10 text-blue-300',
    purple: 'border-purple-500/25 from-purple-600/10 text-purple-300',
    amber: 'border-amber-500/25 from-amber-600/10 text-amber-300',
  };
  return (
    <div className={`rounded-2xl border bg-gradient-to-br to-[#111827] p-4 ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 opacity-80" />
        <p className="text-[10px] uppercase tracking-wider opacity-80">{label}</p>
      </div>
      <p className="text-xl font-bold text-white tabular-nums">{fmtNum(value)} XIT</p>
      <p className="text-xs text-gray-500 mt-1">{(pct || 0).toFixed(1)}% of total</p>
    </div>
  );
}

function ShareBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-300 tabular-nums">{(pct || 0).toFixed(1)}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${Math.min(100, pct || 0)}%` }} />
      </div>
    </div>
  );
}

function PlanCard({ name, count, amount, color }: { name: string; count: number; amount: number; color: 'purple' | 'blue' | 'amber' }) {
  const styles = {
    purple: 'border-purple-500/25 from-purple-600/10',
    blue: 'border-blue-500/25 from-blue-600/10',
    amber: 'border-amber-500/25 from-amber-600/10',
  };
  return (
    <div className={`rounded-2xl border bg-gradient-to-br to-[#111827] p-5 ${styles[color]}`}>
      <h4 className="text-sm font-semibold text-white mb-3">{name}</h4>
      <div className="flex justify-between">
        <div>
          <p className="text-[10px] uppercase text-gray-500">Investments</p>
          <p className="text-2xl font-bold text-white">{count}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase text-gray-500">Total XIT</p>
          <p className="text-2xl font-bold text-emerald-400 tabular-nums">{fmtNum(amount, 0)}</p>
        </div>
      </div>
    </div>
  );
}

function TrendTable({ title, headers, rows, empty }: { title: string; headers: string[]; rows: string[][]; empty: string }) {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-800">
        <h4 className="text-sm font-semibold text-white">{title}</h4>
      </div>
      {rows.length === 0 ? (
        <p className="text-center text-gray-500 text-sm py-10">{empty}</p>
      ) : (
        <div className="overflow-x-auto max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#111827]">
              <tr className="border-b border-gray-800">
                {headers.map((h) => (
                  <th key={h} className="text-left text-[10px] uppercase text-gray-500 px-4 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-800/30 hover:bg-gray-900/30">
                  {row.map((cell, j) => (
                    <td key={j} className={`px-4 py-2 ${j > 0 ? 'text-right tabular-nums text-gray-300' : 'text-white'}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TopTable({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-amber-400" />
        <h4 className="text-sm font-semibold text-white">{title}</h4>
      </div>
      {rows.length === 0 ? (
        <p className="text-center text-gray-500 text-sm py-10">No data yet</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              {headers.map((h) => (
                <th key={h} className="text-left text-[10px] uppercase text-gray-500 px-4 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-800/30 hover:bg-gray-900/30">
                <td className="px-4 py-2.5 text-gray-500 w-8">{row[0]}</td>
                <td className="px-4 py-2.5 text-white font-medium">{row[1]}</td>
                <td className="px-4 py-2.5 text-right text-emerald-400 tabular-nums font-semibold">{row[2]}</td>
                {row[3] && <td className="px-4 py-2.5 text-right text-gray-400 tabular-nums">{row[3]}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
