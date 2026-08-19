import { Link } from 'react-router-dom';
import { Gift, ArrowRight } from 'lucide-react';
import FooterDust from '@/components/FooterDust';

export default function CTA() {
  return (
    <section id="cta" className="relative py-12 scroll-mt-20 sm:scroll-mt-24 bg-[#0a0e17]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#f3ba2f]/20 bg-[#070504] p-6 sm:p-10 md:p-12 text-center">
          <FooterDust />
          <div className="relative z-10">
            <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-[#f3ba2f] mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to Start Earning?</h2>
            <p className="text-sm sm:text-base text-white mb-6 sm:mb-8 max-w-xl mx-auto">
              The roadmap is public. The contracts are on-chain. Join a transparent ecosystem built for sustainable, community-driven growth. Create your account, get your referral code, and start building your network across 15 levels.
            </p>
            <Link
              to="/login"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-gradient-to-r from-[#f3ba2f] to-[#d4a017] hover:from-[#ffd24a] hover:to-[#f3ba2f] text-white font-medium px-6 sm:px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-[#f3ba2f]/20 group"
            >
              Create Free Account <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
