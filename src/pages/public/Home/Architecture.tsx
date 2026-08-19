import { Code, Cpu, Eye } from 'lucide-react';
import FooterDust from '@/components/FooterDust';

const layers = [
  { icon: Code, title: 'Smart Contract Layer', desc: 'The core of XIT Token is a set of smart contracts governing token supply, transfers, vesting schedules and future utility modules. Contracts are immutable post-deployment; upgrades follow a transparent, community-visible process.' },
  { icon: Cpu, title: 'Application Layer', desc: 'A React-based decentralized application (dApp) provides the user interface — wallet connection, token dashboard, ecosystem statistics and, in later phases, staking and governance portals. The dApp reads directly from the blockchain; it never holds user funds.' },
  { icon: Eye, title: 'Transparency Layer', desc: 'All ecosystem metrics — circulating supply, burn history, treasury movements — are published through on-chain data and public dashboards, allowing independent verification at any time.' },
];

export default function Architecture() {
  return (
    <section id="architecture" className="relative overflow-hidden py-12 scroll-mt-20 sm:scroll-mt-24 bg-[#070504]">
      <FooterDust />
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm text-[#f3ba2f] font-medium uppercase tracking-widest mb-3">Architecture</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Protocol Architecture</h2>
          <p className="text-sm sm:text-base text-white mt-4">Three layers powering the XIT Token ecosystem.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {layers.map((layer) => (
            <div
              key={layer.title}
              className="group rounded-2xl border border-white/10 bg-[#05080f]/40 backdrop-blur-xl p-5 sm:p-6 hover:border-white/20 hover:bg-[#05080f]/50 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#f3ba2f]/10 flex items-center justify-center mb-4">
                <layer.icon className="w-6 h-6 text-[#f3ba2f]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{layer.title}</h3>
              <p className="text-sm text-white leading-relaxed">{layer.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
