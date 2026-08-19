import { Users, Lock, Network, TrendingUp, ArrowRight } from 'lucide-react';
import FooterDust from '@/components/FooterDust';

const steps = [
  { step: '01', tag: 'Getting Started', icon: Users, title: 'Connect', desc: 'Create your account with email and a referral code. Get your own unique referral link instantly. Set up your Web3 wallet and connect to the XIT dApp in seconds.' },
  { step: '02', tag: 'XIT Access', icon: Lock, title: 'Hold', desc: 'Acquire XIT and become part of the ecosystem — your gateway to every current and future utility. Buy tokens and invest in Lock (3X) or Flexible (2X) plan.' },
  { step: '03', tag: 'Utility', icon: Network, title: 'Participate', desc: 'Use XIT across the ecosystem for access and participation. Share your referral code, build your 15-level network, earn commissions on every token purchase in your downline.' },
  { step: '04', tag: 'Community', icon: TrendingUp, title: 'Grow', desc: 'Grow with a global community as new utilities, partnerships and integrations go live on the roadmap. Claim daily ROI, earn referral commissions, and build passive income.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-12 scroll-mt-20 sm:scroll-mt-24 bg-[#070504]">
      <FooterDust />
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm text-[#f3ba2f] font-medium uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Four Steps to Start Earning</h2>
          <p className="text-sm sm:text-base text-white mt-4 max-w-2xl mx-auto">Connect, hold, participate and grow — powered by verifiable blockchain infrastructure.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {steps.map((item, i) => (
            <div key={item.step} className="relative group">
              <div className="h-full rounded-2xl border border-white/10 bg-[#05080f]/40 backdrop-blur-xl p-5 sm:p-6 hover:border-white/20 hover:bg-[#05080f]/50 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f3ba2f]/20 to-[#f3ba2f]/5 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-[#f3ba2f]" />
                  </div>
                  <span className="text-3xl font-bold text-white/15">{item.step}</span>
                </div>
                <span className="text-[10px] text-[#f3ba2f]/70 uppercase tracking-wider font-medium">{item.tag}</span>
                <h3 className="text-lg font-semibold text-white mb-2 mt-1">{item.title}</h3>
                <p className="text-sm text-white leading-relaxed">{item.desc}</p>
              </div>
              {i < 3 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 w-6 h-6 items-center justify-center z-10">
                  <ArrowRight className="w-4 h-4 text-[#f3ba2f]/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
