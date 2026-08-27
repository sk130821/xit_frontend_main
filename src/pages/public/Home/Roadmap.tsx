import { Check } from 'lucide-react';
import GlobeVisual from './GlobeVisual';

const phases = [
  {
    badge: 'PHASE 01',
    subtitle: 'FOUNDATION',
    status: 'Active',
    title: 'Foundation',
    items: [
      'XIT token development',
      'Smart contract deployment',
      'Website & community launch',
      'Whitepaper',
      'Initial liquidity planning',
      'Security review',
    ],
  },
  {
    badge: 'PHASE 02',
    subtitle: 'COMMUNITY',
    status: 'Upcoming',
    title: 'Community',
    items: [
      'Global community development',
      'Marketing campaigns',
      'Referral ecosystem',
      'Leadership programs',
      'Strategic partnerships',
    ],
  },
  {
    badge: 'PHASE 03',
    subtitle: 'EXPANSION',
    status: 'Upcoming',
    title: 'Expansion',
    items: [
      'Additional token utilities',
      'NFT ecosystem',
      'Web3 applications',
      'Liquidity expansion',
      'Ecosystem partnerships',
    ],
  },
  {
    badge: 'PHASE 04',
    subtitle: 'GLOBAL ECOSYSTEM',
    status: 'Upcoming',
    title: 'Global Ecosystem',
    items: [
      'Digital products',
      'Expanded utility',
      'Global partnerships',
      'Community applications',
      'Broader Web3 ecosystem',
    ],
  },
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
            <p className="text-xs sm:text-sm text-[#f3ba2f] font-medium uppercase tracking-widest mb-3">XIT Roadmap</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold text-white leading-tight">
              Growth Plan
            </h2>
            <p className="text-sm sm:text-base text-white mt-4 max-w-xl">
              From foundation to a global Web3 ecosystem — building step by step with the community.
            </p>

            <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
              {phases.map((phase) => (
                <div
                  key={phase.badge}
                  className="rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-[2px] p-4 sm:p-5 hover:border-[#f3ba2f]/35 hover:bg-white/[0.07] transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className={`text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full ${phase.status === 'Active' ? 'bg-[#f3ba2f]/20 text-[#f3ba2f]' : 'bg-white/10 text-white'}`}>
                        {phase.badge}
                      </span>
                      <div>
                        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#f3ba2f]/80">
                          {phase.subtitle}
                        </p>
                        <h3 className="text-lg sm:text-xl font-bold text-white">{phase.title}</h3>
                      </div>
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
