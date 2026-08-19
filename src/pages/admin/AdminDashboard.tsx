import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Activity, TrendingUp, Coins, Award, Gift, Layers, Link2, ArrowRight, Zap, History, ShoppingCart, BarChart3 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAdminAuth } from '@/context/AdminAuthContext';
import AdminStat from '@/components/AdminStat';

export default function AdminDashboard() {
  const { admin } = useAdminAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (admin) {
      api.admin.stats().then((data) => {
        if (data && (data as any).success) setStats(data);
      });
    }
  }, [admin]);

  if (!admin) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Platform overview and quick navigation</p>
      </div>

      {stats && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Platform Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <AdminStat label="Total Users" value={String(stats.total_users)} icon={Users} color="emerald" />
            <AdminStat label="Active Users" value={String(stats.active_users)} icon={Activity} color="blue" />
            <AdminStat label="Total Invested" value={`${Number(stats.total_invested).toFixed(0)} XIT`} icon={Coins} color="purple" />
            <AdminStat label="ROI Paid" value={`${Number(stats.total_roi_paid).toFixed(0)} XIT`} icon={TrendingUp} color="green" />
            <AdminStat label="Referral Bonus" value={`${Number(stats.total_referral_bonus || 0).toFixed(0)} XIT`} icon={Gift} color="cyan" />
            <AdminStat
              label="Level + Reward"
              value={`${(Number(stats.total_level_bonus || 0) + Number(stats.total_reward_bonus || 0)).toFixed(0)} XIT`}
              icon={Award}
              color="orange"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickLink
          to="/admin/payout"
          title="ROI Payout"
          description="Preview & run manual payout — ROI + Level + Royalty at 12 AM IST"
          icon={Zap}
          color="cyan"
        />
        <QuickLink
          to="/admin/payout-history"
          title="Payout History"
          description="Daily income paid — ROI, level bonus & royalty breakdown"
          icon={History}
          color="purple"
        />
        <QuickLink
          to="/admin/reports"
          title="Business Report"
          description="Complete platform analytics — members, income, plans & trends"
          icon={BarChart3}
          color="cyan"
        />
        <QuickLink
          to="/admin/trades"
          title="Buy & Sell History"
          description="Purchase & sale logs with daily totals and filters"
          icon={ShoppingCart}
          color="emerald"
        />
        <QuickLink
          to="/admin/mlm"
          title="MLM Control"
          description="Referral, level bonus, reward tiers, plans & limits"
          icon={Layers}
          color="emerald"
        />
        <QuickLink
          to="/admin/blockchain"
          title="Blockchain & Wallet"
          description="Platform mode, token contract, network & wallet addresses"
          icon={Link2}
          color="orange"
        />
        <QuickLink
          to="/admin/users"
          title="User Management"
          description="Activate users, credit/debit wallets, view members"
          icon={Users}
          color="blue"
        />
      </div>
    </div>
  );
}

function QuickLink({
  to,
  title,
  description,
  icon: Icon,
  color,
}: {
  to: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'emerald' | 'orange' | 'blue' | 'purple' | 'cyan';
}) {
  const styles = {
    emerald: 'border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400',
    orange: 'border-orange-500/20 hover:border-orange-500/40 text-orange-400',
    blue: 'border-blue-500/20 hover:border-blue-500/40 text-blue-400',
    purple: 'border-purple-500/20 hover:border-purple-500/40 text-purple-400',
    cyan: 'border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400',
  };

  return (
    <Link
      to={to}
      className={`group bg-[#111827] border rounded-2xl p-6 transition-all hover:bg-[#111827]/80 ${styles[color]}`}
    >
      <div className="flex items-start justify-between mb-3">
        <Icon className={`w-6 h-6 ${styles[color].split(' ').pop()}`} />
        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  );
}
