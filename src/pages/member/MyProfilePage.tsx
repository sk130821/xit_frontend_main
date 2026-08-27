import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Share2,
  Wallet,
  Calendar,
  ShieldCheck,
  ShieldOff,
  KeyRound,
  Copy,
  Check,
  Coins,
  TrendingUp,
  ShoppingBag,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useXitBalances } from '@/hooks/useXitBalances';
import { useWallet } from '@/context/WalletContext';
import WalletConnectButton from '@/components/WalletConnectButton';

export default function MyProfilePage() {
  const { user } = useAuth();
  const { isBlockchainMode } = useWallet();
  const balances = useXitBalances();
  const [copied, setCopied] = useState(false);

  const usdtWallet = Number(user?.wallet_balance || 0);
  const xitBalance = isBlockchainMode ? balances.walletTotal : balances.incomeBalance;
  const earned = Number(user?.total_earned || 0);
  const invested = Number(user?.total_invested || 0);
  const purchased = Number(user?.total_purchased || 0);

  const copyReferralCode = () => {
    if (!user?.referral_code) return;
    navigator.clipboard.writeText(user.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="space-y-6">
      {/* Profile hero */}
      <div className="relative overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-[#1a1208] via-[#121820] to-[#0a0e17] p-6 sm:p-8">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 left-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-orange-500/30">
              <span className="text-3xl font-black text-white uppercase">
                {user?.username?.charAt(0) || 'U'}
              </span>
            </div>
            <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 border-[#121820] flex items-center justify-center ${
              user?.is_active ? 'bg-emerald-500' : 'bg-amber-500'
            }`}>
              {user?.is_active
                ? <ShieldCheck className="w-3.5 h-3.5 text-white" />
                : <ShieldOff className="w-3.5 h-3.5 text-white" />}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-300 text-[11px] font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Member Profile
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">{user?.username}</h1>
            <p className="text-gray-400 text-sm mt-1 truncate">{user?.email}</p>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                user?.is_active
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
              }`}>
                {user?.is_active ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
                {user?.is_active ? 'Active Member' : 'Pending Activation'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-800/60 border border-gray-700 text-gray-400 text-xs">
                <Calendar className="w-3.5 h-3.5" />
                Since {memberSince}
              </span>
            </div>
          </div>

          {/* Referral code box */}
          <div className="sm:text-right shrink-0">
            <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">Your Referral Code</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-mono text-orange-400 tracking-wider">{user?.referral_code}</span>
              <button
                onClick={copyReferralCode}
                className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/25 text-orange-400 hover:bg-orange-500/20 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <Link
              to="/referral"
              className="inline-flex items-center gap-1 text-xs text-orange-400/70 hover:text-orange-300 mt-2 transition-colors"
            >
              Share referral link <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {!isBlockchainMode && (
          <StatCard icon={Wallet} label="USDT Wallet" value={usdtWallet} suffix="USDT" accent="text-emerald-400" border="border-emerald-500/20" bg="from-emerald-600/10" />
        )}
        <StatCard
          icon={Coins}
          label={isBlockchainMode ? 'Wallet XIT' : 'Free XIT'}
          value={xitBalance}
          suffix="XIT"
          accent="text-orange-400"
          border="border-orange-500/20"
          bg="from-orange-600/10"
        />
        <StatCard icon={TrendingUp} label="Total Earned" value={earned} suffix="XIT" accent="text-cyan-400" border="border-cyan-500/20" bg="from-cyan-600/10" />
        <StatCard icon={Coins} label="Total Invested" value={invested} accent="text-purple-400" border="border-purple-500/20" bg="from-purple-600/10" />
        <StatCard icon={ShoppingBag} label="Total Purchased" value={purchased} accent="text-blue-400" border="border-blue-500/20" bg="from-blue-600/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Account details */}
        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6">
          <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-400" />
            Account Details
          </h3>
          <dl className="space-y-3">
            <InfoRow icon={User} label="Username" value={user?.username || '—'} />
            <InfoRow icon={Mail} label="Email" value={user?.email || '—'} />
            <InfoRow icon={Phone} label="Phone" value={user?.phone || 'Not added'} muted={!user?.phone} />
            <InfoRow icon={Calendar} label="Member Since" value={memberSince} />
          </dl>
        </div>

        {/* Wallet & referral */}
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-[#0a1512] to-[#111827] p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                Blockchain Wallet
              </h3>
              <p className="text-gray-500 text-xs mb-4">Connect MetaMask for on-chain buy & sell (testnet/real mode)</p>

              {user?.wallet_address ? (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3 mb-4">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Linked Address</p>
                  <p className="text-emerald-300 font-mono text-xs break-all">{user.wallet_address}</p>
                </div>
              ) : (
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 mb-4">
                  <p className="text-gray-500 text-xs">No wallet linked yet</p>
                </div>
              )}

              <WalletConnectButton />
            </div>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-orange-400" />
              Referral Info
            </h3>
            <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/5 border border-orange-500/20 rounded-xl px-4 py-4">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Referral Code</p>
              <p className="text-2xl font-bold font-mono text-orange-400">{user?.referral_code}</p>
              {!user?.is_active && (
                <p className="text-amber-400/80 text-xs mt-2">Buy tokens to activate and start sponsoring</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/change-password"
          className="flex items-center justify-between p-5 rounded-2xl border border-gray-800 bg-[#111827] hover:border-orange-500/30 hover:bg-orange-500/5 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Change Password</p>
              <p className="text-xs text-gray-500">Update your login credentials</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/tokens"
          className="flex items-center justify-between p-5 rounded-2xl border border-gray-800 bg-[#111827] hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
              <Coins className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">My XIT Tokens</p>
              <p className="text-xs text-gray-500">View wallet & token summary</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix = 'XIT',
  accent,
  border,
  bg,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix?: string;
  accent: string;
  border: string;
  bg: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border ${border} bg-gradient-to-br ${bg} to-[#111827] p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${accent}`} />
        <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
      </div>
      <p className={`text-xl font-bold tabular-nums ${accent}`}>{value.toFixed(2)}</p>
      <p className="text-gray-600 text-[10px] mt-0.5">{suffix}</p>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  muted,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 bg-gray-900/40 rounded-xl px-4 py-3 border border-gray-800/50">
      <dt className="flex items-center gap-2 text-sm text-gray-500 shrink-0">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </dt>
      <dd className={`text-sm text-right break-all ${muted ? 'text-gray-600' : 'text-white font-medium'}`}>
        {value}
      </dd>
    </div>
  );
}
