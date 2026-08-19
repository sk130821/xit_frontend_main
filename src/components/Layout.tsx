import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  ArrowDownToLine,
  Network,
  History,
  LogOut,
  Home,
  Coins,
  TrendingUp,
  PieChart,
  Gift,
  Layers,
  Award,
  Share2,
  User,
  KeyRound,
  DollarSign,
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import WalletConnectButton from '@/components/WalletConnectButton';
import { useAuth } from '@/context/AuthContext';

const menuSections = [
  {
    title: 'MAIN',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/tokens', label: 'My XIT Tokens', icon: Coins },
      { to: '/buy', label: 'Buy & Invest', icon: ShoppingCart },
      { to: '/investments', label: 'Investment History', icon: History },
    ],
  },
  {
    title: 'INCOME',
    items: [
      { to: '/income/daily', label: 'Daily ROI Income', icon: TrendingUp },
      { to: '/income/breakdown', label: 'Income Breakdown', icon: PieChart },
      { to: '/income/referral', label: 'Referral Income', icon: Gift },
      { to: '/income/level', label: '15 Level Plan', icon: Layers },
      { to: '/income/reward', label: 'Reward Bonus', icon: Award },
    ],
  },
  {
    title: 'TOKEN',
    items: [
      { to: '/sell', label: 'Sell Tokens', icon: ArrowDownToLine },
      { to: '/transactions', label: 'Transaction History', icon: DollarSign },
    ],
  },
  {
    title: 'NETWORK',
    items: [
      { to: '/network', label: 'My Team', icon: Network },
      { to: '/referral', label: 'Referral Link', icon: Share2 },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [
      { to: '/profile', label: 'My Profile', icon: User },
      { to: '/change-password', label: 'Change Password', icon: KeyRound },
    ],
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#0a0a0a] border-r border-gray-900 flex flex-col z-50">
        {/* Brand + Member */}
        <div className="px-5 py-5 border-b border-gray-900">
          <div className="flex items-center gap-3 mb-4">
            <BrandLogo size="sm" />
            <div>
              <p className="text-xs text-gray-500">XIT Token Member</p>
              <p className="text-sm font-bold text-orange-400 truncate">{user?.username}</p>
            </div>
          </div>
          <span className="inline-block text-[10px] font-bold tracking-widest text-orange-400 border border-orange-500/40 rounded-full px-3 py-1">
            MEMBER
          </span>
          {!user?.is_active && (
            <p className="mt-2 text-[10px] text-amber-400/90 leading-snug">
              Pending — buy to activate, then sell & refer
            </p>
          )}
        </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <NavLink
            to="/home"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-orange-400 hover:bg-gray-900/50 mb-3 transition-all"
          >
            <Home className="w-4 h-4" />
            Website
          </NavLink>

          {menuSections.map((section) => (
            <div key={section.title} className="mb-4">
              <p className="px-3 py-2 text-[10px] font-bold tracking-widest text-orange-500/70 uppercase">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30 shadow-sm shadow-orange-500/5'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/60 border border-transparent'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-900">
          <p className="text-[11px] text-gray-600 truncate mb-3 px-1">{user?.email}</p>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-950/60 hover:text-red-300 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-64 min-h-screen bg-[#0a0e17]">
        <div className="sticky top-0 z-40 bg-[#0a0e17]/90 backdrop-blur border-b border-gray-800/60 px-8 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Balance: <span className="text-emerald-400 font-semibold">{Number(user?.wallet_balance || 0).toFixed(2)} USDT</span>
            <span className="text-gray-600 mx-2">·</span>
            <span className="text-orange-400 font-semibold">{(Number(user?.xit_balance || 0) + Number(user?.plan_sellable || 0)).toFixed(2)} XIT sellable</span>
          </div>
          <WalletConnectButton />
        </div>
        <div className="p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
