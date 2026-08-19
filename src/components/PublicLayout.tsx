import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard } from 'lucide-react';

import BrandLogo from '@/components/BrandLogo';

const navLinks = [
  { to: '/home', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/plans', label: 'Whitepaper' },
  { to: '/compensation', label: 'Compensation' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#0a0e17] text-gray-100">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#0a0e17]/95 backdrop-blur-xl border-b border-gray-800/60' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2.5 group">
            <BrandLogo size="sm" />
            <span className="text-xl font-bold text-white tracking-tight hidden sm:inline">XIT<span className="text-emerald-400">Token</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === link.to ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all hover:bg-gray-800/50">Login</Link>
            <Link to="/" className="text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-5 py-2 rounded-lg transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />Get Started
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-400 hover:text-white p-2">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-[#0d1220] border-b border-gray-800 px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${location.pathname === link.to ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>{link.label}</Link>
            ))}
            <div className="pt-2 flex gap-3">
              <Link to="/" className="flex-1 text-center text-sm font-medium text-gray-300 hover:text-white px-4 py-2.5 rounded-lg border border-gray-700">Login</Link>
              <Link to="/" className="flex-1 text-center text-sm font-medium bg-emerald-500 text-white px-4 py-2.5 rounded-lg">Get Started</Link>
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t border-gray-800/60 bg-[#0d1220]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center"><Wallet className="w-4 h-4 text-white" /></div>
                <span className="text-lg font-bold text-white">XIT<span className="text-emerald-400">Token</span></span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">Transparent · Verifiable · Community. A decentralized crypto MLM ecosystem built for sustainable, community-driven growth.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-gray-500 hover:text-emerald-400 transition-colors">Home</Link></li>
                <li><Link to="/about" className="text-sm text-gray-500 hover:text-emerald-400 transition-colors">About Us</Link></li>
                <li><Link to="/plans" className="text-sm text-gray-500 hover:text-emerald-400 transition-colors">Whitepaper</Link></li>
                <li><Link to="/compensation" className="text-sm text-gray-500 hover:text-emerald-400 transition-colors">Compensation Plan</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/faq" className="text-sm text-gray-500 hover:text-emerald-400 transition-colors">FAQ</Link></li>
                <li><Link to="/contact" className="text-sm text-gray-500 hover:text-emerald-400 transition-colors">Contact</Link></li>
                <li><Link to="/" className="text-sm text-gray-500 hover:text-emerald-400 transition-colors">Login</Link></li>
                <li><Link to="/" className="text-sm text-gray-500 hover:text-emerald-400 transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Get Started</h4>
              <p className="text-sm text-gray-500 mb-3">Join the XIT Token ecosystem today.</p>
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg transition-all">Create Account</Link>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-gray-800/60 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-600">© 2026 XIT Token (XIT). All rights reserved.</p>
            <p className="text-xs text-gray-600">Decentralized Crypto MLM Ecosystem</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
