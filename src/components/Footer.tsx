import { Link } from 'react-router-dom';
import FooterDust from './FooterDust';
import { WHITEPAPER_PDF_DOWNLOAD_NAME, WHITEPAPER_PDF_URL } from '@/lib/constants';


export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#f3ba2f]/10 bg-[#070504]">
      <FooterDust />
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="/images/xit_token_logo.png"
                alt=""
                className="h-[68px] md:h-[84px] w-auto object-contain"
              />
            </div>
            <p className="text-sm text-white leading-relaxed max-w-sm">
              Transparent · Verifiable · Community. A decentralized crypto MLM ecosystem built for sustainable, community-driven growth.
            </p>
          </div>
          <div>
            <h4 className="text-base font-semibold text-white mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><a href="/#home" className="text-sm text-white hover:text-[#f3ba2f] transition-colors">Home</a></li>
              <li><a href="/#about" className="text-sm text-white hover:text-[#f3ba2f] transition-colors">About Us</a></li>
              <li><a href="/#whitepaper" className="text-sm text-white hover:text-[#f3ba2f] transition-colors">Whitepaper</a></li>
              <li>
                <a
                  href={WHITEPAPER_PDF_URL}
                  download={WHITEPAPER_PDF_DOWNLOAD_NAME}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white hover:text-[#f3ba2f] transition-colors"
                >
                  Download Whitepaper (PDF)
                </a>
              </li>
              <li><a href="/#compensation" className="text-sm text-white hover:text-[#f3ba2f] transition-colors">Compensation Plan</a></li>
              <li><a href="/#roadmap" className="text-sm text-white hover:text-[#f3ba2f] transition-colors">Roadmap</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold text-white mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><a href="/#faq" className="text-sm text-white hover:text-[#f3ba2f] transition-colors">FAQ</a></li>
              <li><a href="/#contact" className="text-sm text-white hover:text-[#f3ba2f] transition-colors">Contact</a></li>
              <li><Link to="/privacy-policy" className="text-sm text-white hover:text-[#f3ba2f] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-white hover:text-[#f3ba2f] transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/login" className="text-sm text-white hover:text-[#f3ba2f] transition-colors">Connect Wallet</Link></li>
              
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold text-white mb-3">Get Started</h4>
            <p className="text-sm text-white mb-3">Join the XIT Token ecosystem today.</p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full sm:w-auto gap-2 text-sm font-medium bg-[#f3ba2f] hover:bg-[#ffd24a] text-white px-4 py-2.5 rounded-lg transition-all"
            >
              Connect Wallet
            </Link>
          </div>
        </div>
        <div className="mt-8 sm:mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs text-white">© 2026 XIT Token (XIT). All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
            <Link to="/privacy-policy" className="text-white hover:text-[#f3ba2f] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-white hover:text-[#f3ba2f] transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
