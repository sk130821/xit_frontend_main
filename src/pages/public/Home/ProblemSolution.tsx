const problems = [
  { title: 'The Transparency Gap', desc: 'Most digital-asset projects operate with opaque treasuries, unverifiable claims and centralized control — holders are asked to trust, never to verify.' },
  { title: 'Undisciplined Supply', desc: 'Unlimited minting, sudden unlocks and undisclosed team allocations quietly destroy token value across the industry.' },
  { title: 'Utility Deficit', desc: 'Many tokens launch with no real use case — value depends entirely on speculation rather than utility.' },
  { title: 'Community Neglect', desc: 'Communities are treated as exit liquidity instead of stakeholders with a genuine voice.' },
];

const solutions = [
  { title: 'Verifiable by Anyone', desc: 'Every rule is encoded in audited smart contracts and verifiable on-chain — transparency is enforced by architecture, not policy.' },
  { title: 'Hard-Coded Discipline', desc: 'A fixed total supply with vesting locks and deflationary burn mechanics protects holders from supply shocks.' },
  { title: 'Utility-First Design', desc: 'XIT utility expands in planned phases — ecosystem access, investment plans, staking, governance and a payment layer — so demand is built on usage.' },
  { title: 'Community as Stakeholders', desc: 'Holders shape the ecosystem through a planned governance framework where proposals and votes live on-chain.' },
];

export default function ProblemSolution() {
  return (
    <section id="solution" className="relative overflow-hidden py-12 scroll-mt-20 sm:scroll-mt-24 bg-[#05080f]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-y-0 left-0 flex h-full w-[200%] animate-problem-bg">
          <img src="/images/Xit_bg_m.jpg" alt="" className="h-full w-1/2 object-cover object-center" />
          <img src="/images/Xit_bg_m.jpg" alt="" className="h-full w-1/2 object-cover object-center" />
        </div>
        <div className="absolute inset-0 bg-[#05080f]/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05080f]/40 via-transparent to-[#05080f]/50" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <div className="rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-[2px] p-5 sm:p-7">
            <p className="text-xs sm:text-sm text-red-400/80 font-medium uppercase tracking-widest mb-3">The Problem</p>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-5 sm:mb-6">Why Most Crypto MLM Projects Fail</h2>
            <div className="space-y-4">
              {problems.map((item) => (
                <div key={item.title} className="border-l-2 border-red-400/20 pl-4">
                  <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-white leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-[2px] p-5 sm:p-7">
            <p className="text-xs sm:text-sm text-[#f3ba2f] font-medium uppercase tracking-widest mb-3">The XIT Solution</p>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-5 sm:mb-6">XIT Token answers each of these failures at the protocol level:</h2>
            <div className="space-y-4">
              {solutions.map((item) => (
                <div key={item.title} className="border-l-2 border-[#f3ba2f]/40 pl-4">
                  <h3 className="text-sm font-semibold text-[#f3ba2f] mb-1">{item.title}</h3>
                  <p className="text-xs text-white leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
