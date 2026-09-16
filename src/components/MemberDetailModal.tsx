import { useState } from 'react';
import {
  X,
  User,
  LogIn,
  ShieldOff,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Coins,
} from 'lucide-react';
import { api } from '@/lib/api';
import type { AdminMemberDetail } from '@/types';
import { planTypeLabel } from '@/lib/constants';

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function fmtDateTime(d: string) {
  return new Date(d).toLocaleString('en-GB');
}

function shortWallet(addr: string | null) {
  if (!addr) return '—';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function MemberDetailModal({
  detail,
  loading,
  onClose,
  onRefresh,
  onMessage,
}: {
  detail: AdminMemberDetail | null;
  loading: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onMessage: (msg: { type: 'success' | 'error'; text: string }) => void;
}) {
  const [tab, setTab] = useState<'overview' | 'investments' | 'income' | 'team'>('overview');
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordModal, setPasswordModal] = useState(false);
  const [grantModal, setGrantModal] = useState(false);
  const [grantAmount, setGrantAmount] = useState('');
  const [grantNote, setGrantNote] = useState('');
  const [grantRefTx, setGrantRefTx] = useState('');
  const [grantKind, setGrantKind] = useState<'sell_failed' | 'buy_failed'>('sell_failed');
  const [grantPlan, setGrantPlan] = useState<'lock' | 'flexible'>('flexible');
  const [actionLoading, setActionLoading] = useState(false);

  if (!detail && !loading) return null;

  const user = detail?.user;

  const handleToggleActivation = async () => {
    if (!user) return;
    setActionLoading(true);
    try {
      await api.admin.toggleActivation(user.id, !user.is_active);
      onMessage({ type: 'success', text: `Account ${user.is_active ? 'deactivated' : 'activated'}` });
      onRefresh();
    } catch (err: any) {
      onMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleLoginAsMember = async () => {
    if (!user) return;
    setActionLoading(true);
    try {
      const data: any = await api.admin.loginAsUser(user.id);
      api.setToken(data.token);
      window.open('/dashboard', '_blank');
      onMessage({ type: 'success', text: `Logged in as ${user.username} (new tab)` });
    } catch (err: any) {
      onMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleGrantXit = async () => {
    if (!user) return;
    const amount = Number(grantAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      onMessage({ type: 'error', text: 'Enter a valid XIT amount' });
      return;
    }
    setActionLoading(true);
    try {
      const result: any = await api.admin.grantXit(user.id, amount, {
        note: grantNote.trim() || undefined,
        compensationKind: grantKind,
        refTxHash: grantKind === 'buy_failed' ? grantRefTx.trim() || undefined : undefined,
        planType: grantKind === 'buy_failed' ? grantPlan : undefined,
      });
      let text: string;
      if (grantKind === 'buy_failed') {
        const planLabel = grantPlan === 'flexible' ? 'Flexible (80% sellable + 20% lock)' : 'Lock (100% locked)';
        text = `Buy failed: ${Number(result.amount).toFixed(2)} XIT — ${planLabel}. Same as purchase, no USDT from admin.`;
        if (result.investment?.sellable != null && grantPlan === 'flexible') {
          text += ` Plan sellable ${Number(result.investment.sellable).toFixed(2)}, locked ${Number(result.investment.locked || 0).toFixed(2)}.`;
        }
        if (result.referralBonus > 0) {
          text += ` Referral bonus: ${Number(result.referralBonus).toFixed(2)} XIT.`;
        }
        if (result.accountActivated) {
          text += ' Account activated.';
        }
      } else {
        text = `Sell failed: Flexible/plan +${Number(result.planRestored ?? result.amount).toFixed(2)} XIT for ${result.username}.`;
        if (result.onChainReturned > 0) {
          text += ` Wallet/Sellable +${Number(result.onChainReturned).toFixed(2)} on-chain.`;
        }
        if (result.walletRestored > 0) {
          text += ` Demo wallet +${Number(result.walletRestored).toFixed(2)}.`;
        }
        if (result.sellOrderAutoLinked && result.sellOrderId) {
          text += ` Linked pending sell #${result.sellOrderId}.`;
        }
        if (result.investmentId) {
          text += ` Investment #${result.investmentId}.`;
        }
      }
      if (result.chainMode && result.txHash) {
        text += ` Tx: ${String(result.txHash).slice(0, 10)}…`;
      }
      onMessage({ type: 'success', text });
      setGrantModal(false);
      setGrantAmount('');
      setGrantNote('');
      setGrantRefTx('');
      onRefresh();
    } catch (err: any) {
      onMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user || newPassword.length < 6) {
      onMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    setActionLoading(true);
    try {
      await api.admin.changePassword(user.id, newPassword);
      onMessage({ type: 'success', text: 'Password updated successfully' });
      setPasswordModal(false);
      setNewPassword('');
    } catch (err: any) {
      onMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-[#111827] border border-gray-800 rounded-2xl w-full max-w-4xl my-4 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-semibold text-white">Member Full Record</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading || !user ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <>
            <div className="px-6 py-5 border-b border-gray-800">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">{user.username}</h3>
                  <p className="text-orange-400 font-mono text-sm mt-0.5">{user.referral_code}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      user.member_status === 'invested' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-400'
                    }`}>
                      {user.member_status === 'invested' ? 'Invested' : 'Not Invested'}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      user.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {user.is_active ? 'Account Active' : 'Account Inactive'}
                    </span>
                  </div>
                  {user.sponsor_name && (
                    <p className="text-sm text-gray-400 mt-2">
                      Sponsor: <span className="text-white">{user.sponsor_name}</span>
                      {user.sponsor_code && <span className="text-orange-400 font-mono ml-1">({user.sponsor_code})</span>}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatBox label="USDT Wallet" value={user.wallet_balance.toFixed(2)} color="text-emerald-400" />
                  <StatBox label="Free XIT" value={(user.xit_balance ?? 0).toFixed(0)} color="text-orange-400" />
                  <StatBox label="Total Income" value={user.total_income.toFixed(2)} color="text-cyan-400" />
                  <StatBox label="Team Size" value={String(user.team_size)} color="text-purple-400" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={handleLoginAsMember}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600/20 border border-teal-500/40 text-teal-400 hover:bg-teal-600/30 text-sm font-medium disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" /> Login as Member
                </button>
                <button
                  onClick={handleToggleActivation}
                  disabled={actionLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 ${
                    user.is_active
                      ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                      : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  }`}
                >
                  {user.is_active ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  {user.is_active ? 'Deactivate Account' : 'Activate Account'}
                </button>
                <button
                  onClick={() => setPasswordModal(true)}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-sm font-medium disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4" /> Change Password
                </button>
                <button
                  onClick={() => setGrantModal(true)}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 text-sm font-medium disabled:opacity-50"
                >
                  <Coins className="w-4 h-4" /> Send XIT (Compensation)
                </button>
              </div>
            </div>

            <div className="px-6 border-b border-gray-800 flex gap-1 overflow-x-auto">
              {([
                ['overview', 'Overview'],
                ['investments', `Investments (${detail.investments.length})`],
                ['income', `Income (${detail.income.length})`],
                ['team', `Team (${detail.team.length})`],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                    tab === key ? 'border-orange-400 text-orange-400' : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="p-6 max-h-[50vh] overflow-y-auto">
              {tab === 'overview' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Profile</h4>
                    <dl className="space-y-2 text-sm">
                      <Row label="Email" value={user.email} />
                      <Row label="Phone" value={user.phone || '—'} />
                      <Row label="Wallet" value={user.wallet_address || '—'} mono />
                      <Row label="Joined" value={fmtDateTime(user.created_at)} />
                      <Row label="Referral Code" value={user.referral_code} mono accent />
                    </dl>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Financial Summary</h4>
                    <dl className="space-y-2 text-sm">
                      <Row label="Total Investment" value={`${user.total_purchased.toFixed(2)} USDT (${user.buy_tx_count} tx)`} />
                      <Row label="USDT Wallet" value={`${user.wallet_balance.toFixed(2)} USDT`} accent />
                      <Row label="Free XIT" value={`${(user.xit_balance ?? 0).toFixed(2)} XIT`} />
                      <Row label="Invested (Plans)" value={`${user.total_invested.toFixed(2)} XIT`} />
                      <Row label="Income Total" value={`${user.total_income.toFixed(2)} XIT`} />
                      <Row label="Total Earned" value={`${user.total_earned.toFixed(2)} XIT`} />
                      <Row label="Direct Referrals" value={String(user.direct_count)} />
                    </dl>
                    {user.sell_balance && (
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sell limits (member view)</h4>
                        <dl className="space-y-1.5 text-sm">
                          {user.sell_balance.chainMode && user.sell_balance.onChainXit != null && (
                            <Row label="Wallet XIT (chain)" value={`${user.sell_balance.onChainXit.toFixed(2)} XIT`} />
                          )}
                          <Row label="Income sellable" value={`${user.sell_balance.incomeSellable.toFixed(2)} XIT`} accent />
                          <Row label="Plan sellable" value={`${user.sell_balance.planSellable.toFixed(2)} XIT`} />
                          <Row label="Plan locked (hold)" value={`${user.sell_balance.planLocked.toFixed(2)} XIT`} />
                          <Row label="Lock ROI held" value={`${user.sell_balance.lockRoiHeld.toFixed(2)} XIT`} />
                          <Row label="Total sellable" value={`${user.sell_balance.totalSellable.toFixed(2)} XIT`} accent />
                        </dl>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {tab === 'investments' && (
                detail.investments.length === 0 ? (
                  <EmptyTab text="No investments yet" />
                ) : (
                  <div className="space-y-3">
                    {detail.investments.map((inv) => (
                      <div key={inv.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-medium">{planTypeLabel(inv.plan_type)}</p>
                            <p className="text-xs text-gray-500">{fmtDate(inv.start_date)} → {fmtDate(inv.end_date)}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            inv.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-400'
                          }`}>{inv.status}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 text-sm">
                          <div><p className="text-gray-500 text-xs">Amount</p><p className="text-white">{inv.token_amount} XIT</p></div>
                          <div><p className="text-gray-500 text-xs">Sellable</p><p className="text-emerald-400">{inv.sellable_amount} XIT</p></div>
                          <div><p className="text-gray-500 text-xs">Locked</p><p className="text-amber-400/90">{inv.locked_amount} XIT</p></div>
                          <div><p className="text-gray-500 text-xs">ROI Received</p><p className="text-emerald-400">{inv.roi_received} XIT</p></div>
                          <div><p className="text-gray-500 text-xs">Total Return</p><p className="text-orange-400">{inv.total_return} XIT</p></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {tab === 'income' && (
                detail.income.length === 0 ? (
                  <EmptyTab text="No income records yet" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-500 border-b border-gray-800">
                          <th className="text-left py-2 px-2">Type</th>
                          <th className="text-left py-2 px-2">From</th>
                          <th className="text-right py-2 px-2">Amount</th>
                          <th className="text-left py-2 px-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detail.income.map((tx) => (
                          <tr key={tx.id} className="border-b border-gray-800/50">
                            <td className="py-2 px-2 text-gray-300 capitalize">{tx.type.replace(/_/g, ' ')}</td>
                            <td className="py-2 px-2 text-gray-400">
                              {tx.type === 'roi' && tx.plan_type ? planTypeLabel(tx.plan_type) : '—'}
                            </td>
                            <td className="py-2 px-2 text-right text-emerald-400 font-medium">{tx.amount.toFixed(2)} XIT</td>
                            <td className="py-2 px-2 text-gray-500">{fmtDateTime(tx.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}

              {tab === 'team' && (
                detail.team.length === 0 ? (
                  <EmptyTab text="No team members yet" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-500 border-b border-gray-800">
                          <th className="text-left py-2 px-2">Member</th>
                          <th className="text-center py-2 px-2">Level</th>
                          <th className="text-right py-2 px-2">USDT</th>
                          <th className="text-center py-2 px-2">Status</th>
                          <th className="text-left py-2 px-2">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detail.team.map((m) => (
                          <tr key={m.id} className="border-b border-gray-800/50">
                            <td className="py-2 px-2">
                              <p className="text-white">{m.username}</p>
                              <p className="text-xs text-gray-500">{m.email}</p>
                            </td>
                            <td className="py-2 px-2 text-center text-orange-400">L{m.level}</td>
                            <td className="py-2 px-2 text-right text-emerald-400">{m.total_purchased.toFixed(2)}</td>
                            <td className="py-2 px-2 text-center">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                m.total_invested > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-400'
                              }`}>{m.total_invested > 0 ? 'Invested' : 'Not Invested'}</span>
                            </td>
                            <td className="py-2 px-2 text-gray-500">{fmtDate(m.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>

      {grantModal && user && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-1">Send XIT (Compensation)</h3>
            <p className="text-sm text-gray-400 mb-3">
              {grantKind === 'buy_failed' ? (
                <>
                  Complete purchase for <span className="text-white">{user.username}</span> — select plan + amount (member
                  buy jaisa). Admin se USDT nahi jayega; chain mode me XIT wallet par jayega + plan rows banenge.
                </>
              ) : (
                <>
                  Failed sell fix for <span className="text-white">{user.username}</span>:{' '}
                  <span className="text-emerald-400/90">Flexible</span> plan restore + chain mode me{' '}
                  <span className="text-emerald-400/90">Sellable</span> (wallet XIT return). Pending sell auto-link — tx hash
                  not needed.
                </>
              )}
              {user.wallet_address ? (
                <span className="block mt-1 font-mono text-[10px] text-cyan-500/80 truncate">{user.wallet_address}</span>
              ) : grantKind === 'buy_failed' ? (
                <span className="block mt-1 text-amber-400/90 text-xs">
                  Blockchain mode: wallet link zaroori hai XIT bhejne ke liye.
                </span>
              ) : (
                <span className="block mt-1 text-amber-400/90 text-xs">Blockchain mode: member must link MetaMask first.</span>
              )}
            </p>

            {user.sell_balance && (
              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-3 mb-4 text-xs text-gray-400 space-y-1">
                <p>
                  Total sellable now:{' '}
                  <span className="text-emerald-400 font-medium">{user.sell_balance.totalSellable.toFixed(2)} XIT</span>
                </p>
                <p>
                  Plan locked: {user.sell_balance.planLocked.toFixed(2)} XIT
                  {grantKind === 'sell_failed'
                    ? ' (after: Flexible + Sellable dono badhenge chain mode me)'
                    : ' (buy failed se badhega agar lock/flex lock)'}
                </p>
              </div>
            )}

            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Reason</p>
            <div className="flex flex-col gap-2 mb-4">
              <label className="flex items-start gap-2 cursor-pointer rounded-xl border border-gray-700 px-3 py-2.5 has-[:checked]:border-orange-500/50 has-[:checked]:bg-orange-500/5">
                <input
                  type="radio"
                  name="grantKind"
                  checked={grantKind === 'sell_failed'}
                  onChange={() => setGrantKind('sell_failed')}
                  className="mt-1"
                />
                <span className="text-sm text-gray-300">
                  <span className="text-white font-medium">Sell failed</span> — XIT sent, USDT not received
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer rounded-xl border border-gray-700 px-3 py-2.5 has-[:checked]:border-orange-500/50 has-[:checked]:bg-orange-500/5">
                <input
                  type="radio"
                  name="grantKind"
                  checked={grantKind === 'buy_failed'}
                  onChange={() => setGrantKind('buy_failed')}
                  className="mt-1"
                />
                <span className="text-sm text-gray-300">
                  <span className="text-white font-medium">Buy failed</span> — USDT paid, XIT not received
                </span>
              </label>
            </div>

            {grantKind === 'buy_failed' && (
              <>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Plan (same as member buy)</p>
                <div className="flex flex-col gap-2 mb-4">
                  <label className="flex items-start gap-2 cursor-pointer rounded-xl border border-gray-700 px-3 py-2.5 has-[:checked]:border-emerald-500/50 has-[:checked]:bg-emerald-500/5">
                    <input
                      type="radio"
                      name="grantPlan"
                      checked={grantPlan === 'flexible'}
                      onChange={() => setGrantPlan('flexible')}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-300">
                      <span className="text-white font-medium">Flexible</span> — 80% sellable + 20% flexible lock
                    </span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer rounded-xl border border-gray-700 px-3 py-2.5 has-[:checked]:border-emerald-500/50 has-[:checked]:bg-emerald-500/5">
                    <input
                      type="radio"
                      name="grantPlan"
                      checked={grantPlan === 'lock'}
                      onChange={() => setGrantPlan('lock')}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-300">
                      <span className="text-white font-medium">Lock</span> — 100% locked until plan completes
                    </span>
                  </label>
                </div>
              </>
            )}

            <label className="text-xs text-gray-500 uppercase tracking-wider">Amount (XIT)</label>
            <input
              type="number"
              min={0}
              step="any"
              value={grantAmount}
              onChange={(e) => setGrantAmount(e.target.value)}
              placeholder="e.g. 80"
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500 mb-3 mt-1"
            />
            {grantKind === 'buy_failed' && (
              <>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Related tx hash (optional)</label>
                <input
                  type="text"
                  value={grantRefTx}
                  onChange={(e) => setGrantRefTx(e.target.value)}
                  placeholder="0x… USDT buy hash"
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm font-mono outline-none focus:border-orange-500 mb-3 mt-1"
                />
              </>
            )}
            <label className="text-xs text-gray-500 uppercase tracking-wider">Note (optional)</label>
            <input
              type="text"
              value={grantNote}
              onChange={(e) => setGrantNote(e.target.value)}
              placeholder="Internal note"
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500 mb-4 mt-1"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setGrantModal(false);
                  setGrantAmount('');
                  setGrantNote('');
                  setGrantRefTx('');
                }}
                className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleGrantXit}
                disabled={actionLoading || !grantAmount || Number(grantAmount) <= 0}
                className="flex-1 py-2.5 rounded-xl bg-orange-500 text-black text-sm font-medium disabled:opacity-50"
              >
                {actionLoading ? 'Processing…' : grantKind === 'buy_failed' ? 'Complete buy (no USDT)' : 'Send XIT'}
              </button>
            </div>
          </div>
        </div>
      )}

      {passwordModal && user && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-white mb-1">Change Password</h3>
            <p className="text-sm text-gray-400 mb-4">Set new password for {user.username}</p>
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min 6 chars)"
                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 pr-12 text-white text-sm outline-none focus:border-amber-500"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setPasswordModal(false); setNewPassword(''); }} className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-sm">Cancel</button>
              <button onClick={handleChangePassword} disabled={actionLoading || newPassword.length < 6} className="flex-1 py-2.5 rounded-xl bg-amber-500 text-black text-sm font-medium disabled:opacity-50">
                {actionLoading ? 'Saving...' : 'Save Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-center min-w-[100px]">
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

function Row({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-gray-500">{label}</dt>
      <dd className={`text-right break-all ${mono ? 'font-mono text-xs' : ''} ${accent ? 'text-orange-400' : 'text-white'}`}>{value}</dd>
    </div>
  );
}

function EmptyTab({ text }: { text: string }) {
  return <p className="text-center text-gray-500 py-8 text-sm">{text}</p>;
}

export { shortWallet, fmtDate };
