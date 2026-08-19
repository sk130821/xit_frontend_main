import { Check } from 'lucide-react';
import GlobeVisual from './GlobeVisual';

const phases = [
  { badge: 'FOUNDATION', status: 'Active', title: 'Foundation', items: ['Smart contract development & independent security audit', 'Website, whitepaper & brand identity launch', 'XIT deployment on BNB Smart Chain; contract verified on BscScan', 'dApp v1 — wallet connect, dashboard and ecosystem stats', 'Community channels go live'] },
  { badge: 'UPCOMING', status: 'Upcoming', title: 'Growth', items: ['Community expansion all over the world', 'Blockchain literacy educational content series', 'Community events & ambassador program', 'Live transparency dashboard', 'Strategic partnership announcements'] },
  { badge: 'UPCOMING', status: 'Upcoming', title: 'Expansion', items: ['PancakeSwap listing & liquidity pool activation', 'XIT staking pools launch', 'First public buyback & burn event', 'Multi-language platform rollout', 'Global community meetups & recognition events'] },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="relative overflow-hidden py-12 scroll-mt-20 sm:scroll-mt-24 bg-[#05080f]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img
          src="/images/xit_banner.jpg"
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#05080f]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05080f]/55 via-transparent to-[#05080f]/20" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <div>
            <p className="text-xs sm:text-sm text-[#f3ba2f] font-medium uppercase tracking-widest mb-3">Roadmap</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold text-white leading-tight">
              Growth Plan
            </h2>
            <p className="text-sm sm:text-base text-white mt-4 max-w-xl">
              From launch to a global ecosystem — real technology ships before each next phase.
            </p>

            <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
              {phases.map((phase) => (
                <div
                  key={phase.title}
                  className="rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-[2px] p-4 sm:p-5 hover:border-[#f3ba2f]/35 hover:bg-white/[0.07] transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className={`text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full ${phase.status === 'Active' ? 'bg-[#f3ba2f]/20 text-[#f3ba2f]' : 'bg-white/10 text-white'}`}>
                        {phase.badge}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white">{phase.title}</h3>
                    </div>
                    <span className={`text-xs font-medium ${phase.status === 'Active' ? 'text-[#f3ba2f]' : 'text-white/80'}`}>
                      {phase.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {phase.items.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-xs sm:text-sm text-white">
                        <Check className="w-4 h-4 text-[#f3ba2f] flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <GlobeVisual className="min-h-[280px] sm:min-h-[420px] lg:min-h-[560px] order-first lg:order-last" />
        </div>
      </div>
    </section>
  );
}
