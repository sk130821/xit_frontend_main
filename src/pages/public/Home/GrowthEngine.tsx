import { Globe, Layers, TrendingUp } from 'lucide-react';
import FooterDust from '@/components/FooterDust';

const fronts = [
  { icon: Globe, title: 'Advertising & Awareness', desc: 'Ongoing marketing campaigns to introduce XIT to new communities, countries, and audiences. Building a transparent brand and track record that make people want to be part of XIT.' },
  { icon: Layers, title: 'Demand & Utility', desc: 'Expanding the real-world use cases for XIT through our roadmap — wallet, blockchain, booking platform, and beyond. The more the XIT ecosystem is used, the more XIT is needed.' },
  { icon: TrendingUp, title: 'Popularity & Trust', desc: 'This is the honest engine behind XIT\'s growth — advertising reach, popularity, and real demand — not artificial price manipulation. Building a transparent brand that makes people want to be part of XIT.' },
];

export default function GrowthEngine() {
  return (
    <section id="growth" className="relative overflow-hidden py-12 scroll-mt-20 sm:scroll-mt-24 bg-[#070504]">
      <FooterDust />
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm text-[#f3ba2f] font-medium uppercase tracking-widest mb-3">Growth Engine</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Why This Matters — Demand & Supply, Explained Simply</h2>
        </div>

        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-[#05080f]/40 backdrop-blur-xl p-5 sm:p-8 md:p-12">
          <p className="text-sm text-white leading-relaxed mb-6 sm:mb-8">
            We are not sitting back and waiting — the XIT team is actively working on three fronts to build genuine, lasting value for XIT:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 mb-6 sm:mb-8">
            {fronts.map((item) => (
              <div key={item.title}>
                <item.icon className="w-7 h-7 text-[#f3ba2f] mb-3" />
                <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-white leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6">
            <p className="text-sm text-white leading-relaxed">
              This is basic, time-tested economics: when supply of something goes down while demand for it stays the same or grows, its value tends to rise. XIT Token is designed around this exact principle — a shrinking, disciplined supply combined with a growing, global community of holders and users.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
