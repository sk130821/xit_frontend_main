import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Users,
  LogOut,
  LayoutDashboard,
  Layers,
  Link2,
  Zap,
  History,
  ShoppingCart,
  ExternalLink,
  Settings,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { useAdminAuth } from '@/context/AdminAuthContext';

const menuSections = [
  {
    title: 'OVERVIEW',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    ],
  },
  {
    title: 'PAYOUTS',
    items: [
      { to: '/admin/payout', label: 'ROI Payout', icon: Zap },
      { to: '/admin/payout-history', label: 'Payout History', icon: History },
    ],
  },
  {
    title: 'REPORTS',
    items: [
      { to: '/admin/reports', label: 'Business Report', icon: BarChart3 },
      { to: '/admin/trades', label: 'Buy & Sell History', icon: ShoppingCart },
    ],
  },
  {
    title: 'PLATFORM',
    items: [
      { to: '/admin/mlm', label: 'MLM Control', icon: Layers },
      { to: '/admin/blockchain', label: 'Blockchain & Wallet', icon: Link2 },
    ],
  },
  {
    title: 'MEMBERS',
    items: [
      { to: '/admin/users', label: 'User Management', icon: Users },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { admin, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleSignOut = () => {
    signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 max-w-[85vw] bg-[#0a0a0a] border-r border-gray-900 flex flex-col z-50 transition-transform duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Brand + Admin */}
        <div className="px-5 py-5 border-b border-gray-900">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <BrandLogo size="sm" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">XIT Token Admin</p>
                <p className="text-sm font-bold text-blue-400 truncate">{admin?.username || 'Admin'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900/60"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <span className="inline-block text-[10px] font-bold tracking-widest text-blue-400 border border-blue-500/40 rounded-full px-3 py-1">
            ADMIN PANEL
          </span>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 scrollbar-thin">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-4">
              <p className="px-3 py-2 text-[10px] font-bold tracking-widest text-blue-500/70 uppercase">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/5'
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

          {/* Quick link */}
          <div className="mb-4">
            <p className="px-3 py-2 text-[10px] font-bold tracking-widest text-blue-500/70 uppercase">
              QUICK LINK
            </p>
            <a
              href="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/5 border border-transparent hover:border-emerald-500/20 transition-all"
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Member App</span>
            </a>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-900">
          <p className="text-[11px] text-gray-600 truncate mb-3 px-1">{admin?.email}</p>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-950/60 hover:text-red-300 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 min-h-screen bg-[#0a0e17]">
        <div className="sticky top-0 z-30 bg-[#0a0e17]/90 backdrop-blur border-b border-gray-800/60 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-gray-900/60 shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 min-w-0">
              <BarChart3 className="w-4 h-4 text-blue-400/70 shrink-0 hidden sm:block" />
              <span className="truncate">
                Admin Control · <span className="text-blue-400 font-medium">XIT Token MLM</span>
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-600 shrink-0">
            <Settings className="w-3.5 h-3.5" />
            <span>ROI auto-runs 12:00 AM IST</span>
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
