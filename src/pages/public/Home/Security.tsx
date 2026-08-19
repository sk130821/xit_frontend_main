import { Shield, Lock, Eye, Wallet } from 'lucide-react';

const items = [
  { icon: Shield, title: 'Independent Smart Contract Audit', desc: 'Independent smart contract audit prior to mainnet deployment ensures all code is verified and secure.' },
  { icon: Lock, title: 'Multi-Signature Control', desc: 'Multi-signature control on treasury operations — no single party can move funds alone.' },
  { icon: Eye, title: 'Publicly Verified Contracts', desc: 'Publicly verified contract addresses; bug-bounty program planned post-launch for ongoing security.' },
  { icon: Wallet, title: 'Non-Custodial Design', desc: 'Non-custodial design — the platform never takes possession of user funds. Your tokens stay in your wallet, under your control, at all times.' },
];

export default function Security() {
  return (
    <section id="security" className="relative overflow-hidden py-12 scroll-mt-20 sm:scroll-mt-24 bg-[#05080f]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img
          src="/images/xit-our-mission.jpg"
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#05080f]/45" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm text-[#f3ba2f] font-medium uppercase tracking-widest mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Security</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Security & Trust</h2>
          <p className="text-sm sm:text-base text-white mt-4 max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Every feature ships with security-first engineering and independent auditing.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {items.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/20 bg-black/55 backdrop-blur-md p-4 sm:p-6 flex gap-3 sm:gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#f3ba2f]/15 border border-[#f3ba2f]/25 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-[#f3ba2f]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-white leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
