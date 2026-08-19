import type { ReactNode } from 'react';
import { Target, Eye, Heart, Globe, Users, Cpu, Link2 } from 'lucide-react';
import GoldenWaveDots from './GoldenWaveDots';

const values = [
  { icon: Target, title: 'Our Mission', desc: 'To build a transparent, community-first digital currency where value is created through genuine utility, disciplined scarcity, and global adoption — not empty promises.' },
  { icon: Eye, title: 'Our Vision', desc: 'To grow XIT Token from a single token into a complete digital ecosystem — including our own blockchain network and real-world service platforms — trusted by a global community that grew with us from day one.' },
  { icon: Heart, title: 'Our Values', desc: 'Transparency by architecture. Utility by design. Growth led by community. We believe in rewarding every member of the network, from Level 1 to Level 15, equally and automatically.' },
];

const tokenInfo = [
  { label: 'Token Name', value: 'XIT Token' },
  { label: 'Ticker', value: 'XIT' },
  { label: 'Network', value: 'BNB Smart Chain' },
  { label: 'Standard', value: 'BEP-20' },
  { label: 'Supply Model', value: 'Fixed' },
  { label: 'Transparency', value: '100%' },
  { label: 'Architecture', value: 'Smart Contract' },
  { label: 'Community', value: 'Global' },
];

function GlassCard({
  children,
  className = '',
  delay,
}: {
  children: ReactNode;
  className?: string;
  delay?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#05080f]/40 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:-translate-y-1 hover:border-white/20 hover:bg-[#05080f]/50 transition-all duration-300 animate-about-fade ${className}`}
      style={{ animationDelay: delay }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,_rgba(243,186,47,0.16),_transparent_55%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden py-12 scroll-mt-20 sm:scroll-mt-24 bg-[#05080f]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#05080f] via-[#070b14] to-[#05080f]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(243,186,47,0.08),_transparent_55%)]" />
      <GoldenWaveDots />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f3ba2f]/30 bg-[#f3ba2f]/10 px-3.5 py-1.5 mb-4 animate-about-fade">
            <Link2 className="w-3.5 h-3.5 text-[#f3ba2f]" />
            <p className="text-xs sm:text-sm text-[#f3ba2f] font-medium uppercase tracking-widest">About XIT Token</p>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white animate-about-fade [animation-delay:80ms]">
            Built on <span className="text-[#f3ba2f] animate-hero-glow">Trust.</span>
          </h2>
          <p className="text-sm sm:text-base text-white mt-4 max-w-2xl mx-auto animate-about-fade [animation-delay:140ms]">
            XIT Token is a decentralized digital ecosystem built on BNB Smart Chain, created with one core belief: the future of digital value must be transparent, verifiable and owned by its community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
          {values.map((item, i) => (
            <GlassCard key={item.title} delay={`${180 + i * 90}ms`}>
              <div className="p-5 sm:p-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#f3ba2f]/10 border border-[#f3ba2f]/25 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(243,186,47,0.15)]">
                  <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#f3ba2f]" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-sm text-white leading-relaxed">{item.desc}</p>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-8">
          <GlassCard delay="420ms">
            <div className="p-5 sm:p-8">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#f3ba2f]/10 blur-2xl group-hover:bg-[#f3ba2f]/20 transition-colors" />
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#f3ba2f]/10 border border-[#f3ba2f]/25 flex items-center justify-center shrink-0 animate-about-spin-slow">
                  <Globe className="w-6 h-6 text-[#f3ba2f]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Global Community</h3>
                  <p className="text-sm text-white leading-relaxed">
                    Launched from Dubai, XIT's community already spans across multiple countries and continents, with no geographic restriction on who can join. Anyone, anywhere in the world with a compatible wallet can become part of the XIT community.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
          <GlassCard delay="500ms">
            <div className="p-5 sm:p-8">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#f3ba2f]/10 blur-2xl group-hover:bg-[#f3ba2f]/20 transition-colors" />
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#f3ba2f]/10 border border-[#f3ba2f]/25 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-[#f3ba2f]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Community Powered</h3>
                  <p className="text-sm text-white leading-relaxed">
                    XIT's strength comes from its community. Every member who introduces XIT to others helps grow the project's real-world demand, utility, and reach — which is exactly what drives XIT's long-term value.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        <GlassCard delay="580ms">
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-[#f3ba2f]" />
              <p className="text-xs sm:text-sm font-semibold text-[#f3ba2f] uppercase tracking-widest">Token Overview</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {tokenInfo.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-5 hover:border-[#f3ba2f]/40 hover:bg-[#f3ba2f]/5 transition-all duration-300"
                >
                  <p className="text-[10px] sm:text-xs text-white/70 mb-1 uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm sm:text-base font-semibold text-white break-words">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
