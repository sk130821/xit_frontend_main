import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Eye,
  UserCheck,
  Coins,
  AlertCircle,
  CheckCircle2,
  Filter,
  Lock,
  Unlock,
  Layers,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAdminAuth } from '@/context/AdminAuthContext';
import MemberDetailModal, { shortWallet, fmtDate } from '@/components/MemberDetailModal';
import type { AdminUser, AdminUsersSummary, AdminMemberDetail } from '@/types';

export default function AdminUsers() {
  const { admin } = useAdminAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [summary, setSummary] = useState<AdminUsersSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('newest');
  const [planType, setPlanType] = useState('all');
  const [minTokens, setMinTokens] = useState('');
  const [maxTokens, setMaxTokens] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  const [viewUserId, setViewUserId] = useState<number | null>(null);
  const [detail, setDetail] = useState<AdminMemberDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { sort };
      if (search) params.search = search;
      if (status !== 'all') params.status = status;
      if (planType !== 'all') params.plan_type = planType;
      if (minTokens) params.min_usdt = minTokens;
      if (maxTokens) params.max_usdt = maxTokens;
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const data: any = await api.admin.users(params);
      setUsers(data.users);
      setSummary(data.summary);
    } catch (err) {
      console.error('Users load error:', err);
    }
    setLoading(false);
  }, [search, status, sort, planType, minTokens, maxTokens, dateFrom, dateTo]);

  useEffect(() => {
    if (admin) loadUsers();
  }, [admin, loadUsers]);

  const openMemberDetail = async (userId: number) => {
    setViewUserId(userId);
    setDetailLoading(true);
    setDetail(null);
    try {
      const data = await api.admin.userDetail(userId);
      setDetail(data as AdminMemberDetail);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
      setViewUserId(null);
    }
    setDetailLoading(false);
  };

  const refreshDetail = async () => {
    if (!viewUserId) return;
    const data = await api.admin.userDetail(viewUserId);
    setDetail(data as AdminMemberDetail);
    await loadUsers();
  };

  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-red-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">All Users</h1>
          <p className="text-gray-400 text-sm mt-1">Member tokens, plan type & team — USDT wallet hidden</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white text-sm"
        >
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {message && (
        <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
          message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <SummaryCard label="Total Members" value={String(summary.total_members)} icon={Users} color="text-white" />
          <SummaryCard label="Active Members" value={String(summary.active_members)} icon={UserCheck} color="text-emerald-400" />
          <SummaryCard label="With Investment" value={String(summary.with_investment)} icon={Layers} color="text-blue-400" />
          <SummaryCard label="Total XIT (All)" value={`${summary.total_xit.toLocaleString()} XIT`} icon={Coins} color="text-orange-400" />
          <SummaryCard label="In Active Plans" value={`${summary.total_plan_tokens.toLocaleString()} XIT`} icon={Lock} color="text-purple-400" />
        </div>
      )}

      {showFilters && (
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-orange-500 outline-none"
              placeholder="Name, email, phone, wallet, referral, sponsor..."
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="invested">Invested</option>
              <option value="not_invested">Not Invested</option>
            </select>
            <select value={planType} onChange={(e) => setPlanType(e.target.value)} className="bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none">
              <option value="all">All Plan Types</option>
              <option value="lock">Lock Plan (4X)</option>
              <option value="flexible">Flexible Plan (2X)</option>
              <option value="both">Both Plans</option>
              <option value="none">No Active Plan</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="tokens_high">Tokens High → Low</option>
              <option value="tokens_low">Tokens Low → High</option>
            </select>
            <input type="number" value={minTokens} onChange={(e) => setMinTokens(e.target.value)} placeholder="Min XIT" className="bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none" />
            <input type="number" value={maxTokens} onChange={(e) => setMaxTokens(e.target.value)} placeholder="Max XIT" className="bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none" />
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none" title="Joined from" />
          </div>
          {(planType !== 'all' || status !== 'all' || minTokens || maxTokens || dateFrom) && (
            <div className="flex flex-wrap gap-2 pt-1">
              {planType !== 'all' && (
                <FilterChip
                  label={
                    planType === 'lock' ? 'Lock Plan' :
                    planType === 'flexible' ? 'Flexible Plan' :
                    planType === 'both' ? 'Both Plans' : 'No Plan'
                  }
                  onClear={() => setPlanType('all')}
                />
              )}
              {status !== 'all' && (
                <FilterChip label={status.replace('_', ' ')} onClear={() => setStatus('all')} />
              )}
              {minTokens && <FilterChip label={`Min ${minTokens} XIT`} onClear={() => setMinTokens('')} />}
              {maxTokens && <FilterChip label={`Max ${maxTokens} XIT`} onClear={() => setMaxTokens('')} />}
              {dateFrom && <FilterChip label={`From ${dateFrom}`} onClear={() => setDateFrom('')} />}
            </div>
          )}
        </div>
      )}

      <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/30">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Member</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Contact</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Sponsor</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Plan Type</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Total XIT</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Free / Plan</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Directs</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Team</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Joined</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-800/20 transition-all">
                    <td className="px-4 py-3">
                      <p className="text-sm text-white font-semibold">{u.username}</p>
                      <p className="text-xs text-orange-400 font-mono">{u.referral_code}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-300">{u.email}</p>
                      <p className="text-xs text-gray-500 font-mono">{shortWallet(u.wallet_address)}</p>
                    </td>
                    <td className="px-4 py-3">
                      {u.sponsor_name ? (
                        <>
                          <p className="text-sm text-gray-300">{u.sponsor_name}</p>
                          {u.sponsor_code && <p className="text-xs text-orange-400 font-mono">{u.sponsor_code}</p>}
                        </>
                      ) : (
                        <span className="text-gray-600 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <PlanBadges types={u.plan_types} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-bold text-orange-400 tabular-nums">{u.total_xit.toFixed(2)}</span>
                      <span className="text-[10px] text-gray-500 ml-1">XIT</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-xs space-y-0.5">
                        <p className="text-emerald-400 tabular-nums">
                          <Unlock className="w-3 h-3 inline mr-0.5 opacity-70" />
                          {u.xit_balance.toFixed(2)} free
                        </p>
                        <p className="text-blue-400 tabular-nums">
                          <Layers className="w-3 h-3 inline mr-0.5 opacity-70" />
                          {u.plan_tokens.toFixed(2)} plan
                        </p>
                        {u.plan_locked > 0 && (
                          <p className="text-purple-400 tabular-nums">
                            <Lock className="w-3 h-3 inline mr-0.5 opacity-70" />
                            {u.plan_locked.toFixed(2)} locked
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-300">{u.direct_count}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-300">{u.team_size}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        u.member_status === 'invested' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-400'
                      }`}>
                        {u.member_status === 'invested' ? 'Invested' : 'Not Invested'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{fmtDate(u.created_at)}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => openMemberDetail(u.id)}
                        className="p-2 rounded-lg text-amber-400 hover:bg-amber-500/10 transition-all"
                        title="View member"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-10 h-10 text-gray-700 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No users found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {viewUserId !== null && (
        <MemberDetailModal
          detail={detail}
          loading={detailLoading}
          onClose={() => { setViewUserId(null); setDetail(null); }}
          onRefresh={refreshDetail}
          onMessage={setMessage}
        />
      )}
    </div>
  );
}

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300">
      {label}
      <button type="button" onClick={onClear} className="text-blue-400/70 hover:text-blue-200">×</button>
    </span>
  );
}

function PlanBadges({ types }: { types: string[] }) {
  if (!types || types.length === 0) {
    return <span className="text-xs text-gray-600">No plan</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {types.includes('lock') && (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-medium">
          Lock 4X
        </span>
      )}
      {types.includes('flexible') && (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-medium">
          Flexible 2X
        </span>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color} opacity-70`} />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}
