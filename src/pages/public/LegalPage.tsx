import FooterDust from '@/components/FooterDust';
import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';


type LegalPageProps = {
  title: string;
  updated: string;
  children: ReactNode;
};

export default function LegalPage({ title, updated, children }: LegalPageProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <section className="relative overflow-hidden min-h-[100svh] pt-24 sm:pt-28 pb-12 sm:pb-16 bg-[#070504]">
      <FooterDust />
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6">
        <p className="text-xs sm:text-sm text-[#f3ba2f] font-medium uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-3xl sm:text-3xl md:text-4xl mb-5 font-bold text-white">{title}</h1>
        <div className="space-y-7 text-sm  text-white leading-relaxed">
          {children}
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-4">
          <Link to="/" className="text-sm text-[#f3ba2f] hover:underline">Back to Home</Link>
          <Link to="/privacy-policy" className="text-sm text-white hover:text-[#f3ba2f]">Privacy Policy</Link>
          <Link to="/terms" className="text-sm text-white hover:text-[#f3ba2f]">Terms & Conditions</Link>
        </div>
      </div>
    </section>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg sm:text-xl font-semibold text-[#f3ba2f] mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
