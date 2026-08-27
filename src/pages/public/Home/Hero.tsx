import { Link } from 'react-router-dom';
import { FileText, Download } from 'lucide-react';
import GalaxyBg from './GalaxyBg';
import GlobeVisual from './GlobeVisual';
import { WHITEPAPER_PDF_DOWNLOAD_NAME, WHITEPAPER_PDF_URL } from '@/lib/constants';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-0 sm:min-h-[100svh] overflow-hidden scroll-mt-20 sm:scroll-mt-24 bg-[#05080f]"
    >
      <div className="absolute inset-0 bg-[#05070f]" />
      <GalaxyBg />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 pt-20 sm:pt-28 lg:pt-32 pb-5 sm:pb-8 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 xl:gap-12 items-center">
          <div className="text-center lg:text-left animate-hero-fade-up order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-white leading-[1.12] tracking-tight">
              Best Selling ICO
              <br />
              Future Of Trading
              <br />
              <span className="inline-block mt-1 sm:mt-2 text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-[#f3ba2f] drop-shadow-[0_0_28px_rgba(243,186,47,0.35)] animate-hero-glow">
                XIT Token
              </span>
            </h1>

            <p className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-white leading-relaxed max-w-xl mx-auto lg:mx-0">
              Transparent on-chain ecosystem with 15-level referral commissions and dual investment plans.
              Disciplined tokenomics, community-powered growth — built for the next decade of crypto value.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href="#whitepaper"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto min-w-0 sm:min-w-[160px] px-3 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white text-[#05080f] font-semibold text-xs sm:text-base hover:bg-[#f3ba2f] transition-all shadow-lg"
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                White Paper
              </a>
              <a
                href={WHITEPAPER_PDF_URL}
                download={WHITEPAPER_PDF_DOWNLOAD_NAME}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto min-w-0 sm:min-w-[160px] px-3 sm:px-7 py-3 sm:py-3.5 rounded-full border border-white/20 text-white font-semibold text-xs sm:text-base hover:bg-white/10 transition-all"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                Download PDF
              </a>
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full sm:w-auto min-w-0 sm:min-w-[160px] px-3 sm:px-7 py-3 sm:py-3.5 rounded-full border border-[#f3ba2f]/50 text-[#f3ba2f] font-semibold text-xs sm:text-base hover:bg-[#f3ba2f]/10 transition-all"
              >
                Connect Wallet
              </Link>
            </div>
          </div>

          <GlobeVisual className="order-2 animate-hero-fade-up [animation-delay:160ms] min-h-[200px] sm:min-h-[420px] lg:min-h-[560px]" />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0e17] to-transparent" />
    </section>
  );
}
