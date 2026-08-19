import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';


export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const el = document.querySelector(location.hash);
    el?.scrollIntoView({ behavior: 'smooth' });
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
