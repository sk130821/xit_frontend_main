import { Eye, Shield, Users, TrendingUp, Cpu, HandCoins } from 'lucide-react';
import FooterDust from '@/components/FooterDust';

const pillars = [
  { icon: Eye, title: 'Full On-Chain Transparency', desc: 'Every rule is encoded in audited smart contracts and verifiable on-chain — transparency is enforced by architecture, not policy. If it can\'t be verified on-chain, it doesn\'t count.' },
  { icon: Shield, title: 'Hard-Coded Discipline', desc: 'A fixed total supply with vesting locks and deflationary burn mechanics protects holders from supply shocks. We design for the next decade, not the next week.' },
  { icon: Users, title: 'Community as Stakeholders', desc: 'The ecosystem belongs to its holders. Every member who introduces XIT to others helps grow real demand, utility, and reach — driving long-term value.' },
  { icon: TrendingUp, title: 'Deflationary Utility', desc: 'Burning-based economic model combined with growing utility. When supply goes down while demand grows, value tends to rise. Simple, time-tested economics.' },
  { icon: Cpu, title: 'Utility-First Design', desc: 'XIT utility expands in planned phases — ecosystem access, investment plans, staking, and trading — so demand is built on real usage, not speculation.' },
  { icon: HandCoins, title: 'No Hidden Rules', desc: 'The whitepaper, tokenomics and contract addresses are all public. What you read is exactly what is deployed. No hidden ledgers. No manual control.' },
];

export default function Pillars() {
  return (
    <section id="pillars" className="relative overflow-hidden py-12 scroll-mt-20 sm:scroll-mt-24 bg-[#070504]">
      <FooterDust />
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm text-[#f3ba2f] font-medium uppercase tracking-widest mb-3">Core Pillars</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Six Pillars of XIT Token</h2>
          <p className="text-sm sm:text-base text-white mt-4 max-w-2xl mx-auto">Six core pillars for a transparent, sustainable and community-powered ecosystem.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#05080f]/40 backdrop-blur-xl p-5 sm:p-6 hover:border-white/20 hover:bg-[#05080f]/50 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#f3ba2f]/10 flex items-center justify-center mb-4 group-hover:bg-[#f3ba2f]/20 transition-all">
                <pillar.icon className="w-6 h-6 text-[#f3ba2f]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{pillar.title}</h3>
              <p className="text-sm text-white leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
