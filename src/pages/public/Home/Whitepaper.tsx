import { Link } from 'react-router-dom';
import { Lock, Unlock, TrendingUp, Check, ArrowRight, Coins, Clock, Percent, AlertCircle, BookOpen, Download } from 'lucide-react';
import FooterDust from '@/components/FooterDust';
import { WHITEPAPER_PDF_DOWNLOAD_NAME, WHITEPAPER_PDF_URL } from '@/lib/constants';

const allocations = [
  { label: 'Community Presale', percent: 70, color: 'bg-[#f3ba2f]', purpose: 'Direct distribution to the founding community' },
  { label: 'Rewards Pool', percent: 10, color: 'bg-[#d4a017]', purpose: 'Community rewards & compensation plan' },
  { label: 'Team & Founders', percent: 10, color: 'bg-blue-500', purpose: 'Core team allocation' },
  { label: 'Liquidity', percent: 5, color: 'bg-cyan-500', purpose: 'Reserved for exchange liquidity at listing' },
  { label: 'Marketing & Airdrops', percent: 5, color: 'bg-purple-500', purpose: 'Global awareness campaigns and giveaways' },
];

function PlanRow({ icon: Icon, label, value }: { icon: typeof TrendingUp; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="w-4 h-4 text-white shrink-0" />
        <span className="text-xs sm:text-sm text-white truncate">{label}</span>
      </div>
      <span className="text-xs sm:text-sm font-semibold whitespace-nowrap text-white">{value}</span>
    </div>
  );
}

export default function Whitepaper() {
  return (
    <section id="whitepaper" className="relative overflow-hidden py-12 scroll-mt-20 sm:scroll-mt-24 bg-[#070504]">
      <FooterDust />
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-[#f3ba2f]/10 border border-[#f3ba2f]/20 rounded-full px-3 sm:px-4 py-1.5 mb-4">
            <BookOpen className="w-4 h-4 text-[#f3ba2f] shrink-0" />
            <span className="text-xs sm:text-sm text-[#f3ba2f] font-medium">Whitepaper</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Tokenomics & Investment Plans</h2>
          <p className="text-sm sm:text-base text-white mt-4 max-w-2xl mx-auto">
            Fixed supply, transparent distribution, and honest pricing until public exchange listing.
          </p>
          <a
            href={WHITEPAPER_PDF_URL}
            download={WHITEPAPER_PDF_DOWNLOAD_NAME}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#f3ba2f] hover:bg-[#ffd24a] text-[#05080f] font-semibold px-6 py-3 text-sm sm:text-base transition-all shadow-lg shadow-[#f3ba2f]/20"
          >
            <Download className="w-4 h-4 shrink-0" />
            Download Whitepaper (PDF)
          </a>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#05080f]/40 backdrop-blur-xl p-5 sm:p-8 mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-[#f3ba2f] mb-3">Token Allocation</h3>
          <p className="text-sm text-white leading-relaxed mb-6">
            XIT Token's total token supply is allocated transparently across the following categories. Every allocation serves a specific purpose in the ecosystem's growth and sustainability.
          </p>
          <div className="space-y-3">
            {allocations.map((alloc) => (
              <div key={alloc.label} className="bg-white/[0.04] rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{alloc.label}</span>
                  <span className="text-sm font-bold text-[#f3ba2f]">{alloc.percent}%</span>
                </div>
                <div className="w-full bg-black/30 rounded-full h-2 mb-2">
                  <div className={`h-2 rounded-full ${alloc.color}`} style={{ width: `${alloc.percent}%` }} />
                </div>
                <p className="text-xs text-white">{alloc.purpose}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="rounded-2xl sm:rounded-3xl border-2 border-[#f3ba2f]/25 bg-[#05080f]/40 backdrop-blur-xl p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#f3ba2f]/15 flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-[#f3ba2f]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold text-white">Lock Plan</h3>
                <p className="text-xs sm:text-sm text-[#f3ba2f]">3X Return · 0.82% Daily ROI</p>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <PlanRow icon={TrendingUp} label="Total Return" value="3X (300%)" />
              <PlanRow icon={Percent} label="Daily ROI" value="0.82%" />
              <PlanRow icon={Clock} label="Lock Period" value="365 days (admin set)" />
              <PlanRow icon={Coins} label="Min Investment" value="100 XIT" />
              <PlanRow icon={Lock} label="Sellable During Lock" value="0% — Cannot sell" />
            </div>
            <div className="space-y-2 mb-6">
              {['Guaranteed 3X return', 'Higher daily ROI rate (0.82%)', 'Best for long-term holders', 'ROI claimable daily'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-white">
                  <Check className="w-4 h-4 text-[#f3ba2f] flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <Link to="/login" className="w-full bg-[#f3ba2f] hover:bg-[#ffd24a] text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 group">
              Choose Lock Plan <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border-2 border-blue-500/25 bg-[#05080f]/40 backdrop-blur-xl p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-500/15 flex items-center justify-center shrink-0">
                <Unlock className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold text-white">Flexible Plan</h3>
                <p className="text-xs sm:text-sm text-blue-300">2X Return · 0.53% Daily ROI</p>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <PlanRow icon={TrendingUp} label="Total Return" value="2X (200%)" />
              <PlanRow icon={Percent} label="Daily ROI" value="0.53%" />
              <PlanRow icon={Clock} label="Lock Period (20%)" value="365 days" />
              <PlanRow icon={Coins} label="Min Investment" value="100 XIT" />
              <PlanRow icon={Unlock} label="Sellable Immediately" value="80% sellable" />
            </div>
            <div className="space-y-2 mb-6">
              {['80% tokens sellable anytime', '20% locked for 1 year', 'Best for flexible access', 'ROI claimable daily'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-white">
                  <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <Link to="/login" className="w-full bg-blue-500 hover:bg-blue-400 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 group">
              Choose Flexible Plan <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 backdrop-blur-sm p-5">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-white leading-relaxed">
            XIT is a utility token and does not represent any assured income, profit or return. This whitepaper is for informational purposes only and does not constitute financial, legal or tax advice. Participate responsibly.
          </p>
        </div>
      </div>
    </section>
  );
}
