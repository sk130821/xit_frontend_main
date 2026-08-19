import { Shield, TrendingUp, Users, HandCoins } from 'lucide-react';

const utilities = [
  { icon: Shield, title: 'Ecosystem Access', desc: 'XIT is the key that unlocks the XIT dApp and its features — holding the token means holding access to everything the ecosystem offers today and tomorrow.' },
  { icon: TrendingUp, title: 'Staking', desc: 'Planned staking pools will let holders lock XIT for defined periods and take part in ecosystem reward programs — encouraging long-term holding and reducing circulating supply.' },
  { icon: Users, title: 'Governance', desc: 'XIT will anchor community governance: holders propose, discuss and vote on ecosystem decisions, with every vote recorded transparently on-chain.' },
  { icon: HandCoins, title: 'Payments & Merchant Network', desc: 'A planned merchant layer will allow XIT to be used for payments across partner services — digital products, utilities and e-commerce integrations.' },
];

export default function Utilities() {
  return (
    <section id="utilities" className="relative overflow-hidden py-12 scroll-mt-20 sm:scroll-mt-24 bg-[#05080f]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img
          src="/images/section-1-banner.jpg"
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#05080f]/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05080f]/40 via-transparent to-[#05080f]/50" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm text-[#f3ba2f] font-medium uppercase tracking-widest mb-3">Utilities</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">XIT Utilities</h2>
          <p className="text-sm sm:text-base text-white mt-4 max-w-2xl mx-auto">XIT utility expands in planned phases — ecosystem access, staking, governance and a payment layer — so demand is built on usage.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {utilities.map((util) => (
            <div
              key={util.title}
              className="rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-[2px] p-5 sm:p-6 hover:border-white/25 hover:bg-white/[0.07] transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-[#f3ba2f]/10 flex items-center justify-center mb-4">
                <util.icon className="w-5 h-5 text-[#f3ba2f]" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{util.title}</h3>
              <p className="text-xs text-white leading-relaxed">{util.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
