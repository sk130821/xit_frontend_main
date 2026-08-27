import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard } from 'lucide-react';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#whitepaper', label: 'Whitepaper' },
  { href: '#compensation', label: 'Compensation' },
  { href: '#roadmap', label: 'Roadmap' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('#home');
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = navLinks.map((link) => link.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(`#${visible[0].target.id}`);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5] },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleNavClick = (href: string) => {
    setActive(href);
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/70 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-[69px] md:h-[90px] flex items-center justify-between gap-3">
          <a href="/#home" onClick={() => handleNavClick('#home')} className="flex items-center shrink-0 min-w-0">
            <img
              src="/images/xit_token_logo.png"
              alt="XIT Token"
              className="h-[68px] md:h-[84px] w-auto max-w-[140px] md:max-w-[200px] object-contain"
            />
          </a>

          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={`/${link.href}`}
                onClick={() => handleNavClick(link.href)}
                className={`px-2.5 xl:px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  active === link.href ? 'text-[#f3ba2f] bg-[#f3ba2f]/10' : 'text-white hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            {/* <Link to="/login" className="text-sm font-medium text-white hover:text-white px-3 xl:px-4 py-2 rounded-lg transition-all hover:bg-white/5">
              Login
            </Link> */}
            <Link
              to="/login"
              className="text-sm font-medium bg-gradient-to-r from-[#f3ba2f] to-[#d4a017] hover:from-[#ffd24a] hover:to-[#f3ba2f] text-white px-4 xl:px-5 py-3 rounded-lg transition-all shadow-lg shadow-[#f3ba2f]/20 flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden xl:inline">Connect Wallet</span>
              <span className="xl:hidden">Connect</span>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-white hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 z-[60] h-full w-[min(280px,85vw)] bg-black/95 backdrop-blur-xl border-r border-white/10 lg:hidden transition-transform duration-300 ease-out flex flex-col ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 sm:h-20 px-4 sm:px-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <img src="/images/xit_token_logo.png" alt="XIT Token" className="h-14 sm:h-18 w-auto max-w-[240px] object-contain" />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="text-white hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={`/${link.href}`}
              onClick={() => handleNavClick(link.href)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active === link.href ? 'text-[#f3ba2f] bg-[#f3ba2f]/10' : 'text-white hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="p-3 sm:p-4 border-t border-white/10 space-y-2 shrink-0">
          {/* <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="block text-center text-sm font-medium text-white hover:text-white px-4 py-2.5 rounded-xl border border-white/10"
          >
            Login
          </Link> */}
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="block text-center text-sm font-medium bg-gradient-to-r from-[#f3ba2f] to-[#d4a017] text-white px-4 py-2.5 rounded-xl"
          >
            Connect Wallet
          </Link>
        </div>
      </aside>
    </>
  );
}
