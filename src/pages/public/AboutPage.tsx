import { Link } from 'react-router-dom';
import { Target, Eye, Heart, ArrowRight, Users, Shield, Globe, Check, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#0a0e17]">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-grid">
        <div className="absolute top-20 left-1/3 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-emerald-400 font-medium uppercase tracking-widest mb-3">About XIT Token</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Built on <span className="text-emerald-400">Trust.</span></h1>
          <p className="text-lg text-gray-400 mt-6 leading-relaxed max-w-2xl mx-auto font-light">
            XIT Token is a decentralized digital ecosystem built on BNB Smart Chain, created with one core belief: the future of digital value must be transparent, verifiable and owned by its community.
          </p>
        </div>
      </section>

      {/* Identity / Mission / Vision / Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Target, title: 'Our Mission', desc: 'To build a transparent, community-first digital currency where value is created through genuine utility, disciplined scarcity, and global adoption — not empty promises.' },
              { icon: Eye, title: 'Our Vision', desc: 'To grow XIT Token from a single token into a complete digital ecosystem — including our own blockchain network and real-world service platforms — trusted by a global community that grew with us from day one.' },
              { icon: Heart, title: 'Our Values', desc: 'Transparency by architecture. Utility by design. Growth led by community. We believe in rewarding every member of the network, from Level 1 to Level 15, equally and automatically.' },
            ].map((item, i) => (
              <div key={i} className="bg-[#111827] border border-gray-800 rounded-2xl p-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5">
                  <item.icon className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Difference — In a market crowded... */}
      <section className="py-16 bg-[#0d1220]">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-sm text-emerald-400 font-medium uppercase tracking-widest mb-3">05 / The Difference</p>
          <h2 className="text-3xl font-bold text-white mb-6">More Than a Protocol</h2>
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8">
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              In a market crowded with projects that promise everything and prove nothing, XIT Token takes the opposite approach. Every element of the protocol — token supply, distribution logic and ecosystem rules — is committed to audited smart contracts that anyone can inspect on-chain. There is no back office that can change the rules, and no central authority that can override the code. What the contract says is what happens. For everyone. Always.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              XIT Token is driven by a team with hands-on experience across blockchain engineering, product development and community operations. We believe great crypto projects are not built on marketing noise — they are built on working technology, honest communication and a community that grows because it genuinely believes in what is being built. That philosophy guides every line of code we write and every decision we make.
            </p>
          </div>
        </div>
      </section>

      {/* Growth Vision */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-sm text-emerald-400 font-medium uppercase tracking-widest mb-3">06 / Growth Vision</p>
          <h2 className="text-3xl font-bold text-white mb-6">Built for Longevity</h2>
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 space-y-4">
            <p className="text-sm text-gray-400 leading-relaxed">
              Our long-term goal is straightforward: to grow XIT Token's real, market-driven value over time — through genuine community adoption, expanding utility, and disciplined supply management, not artificial promises.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Every part of XIT's design — the fixed supply, the burn model, the phased distribution, and our roadmap — is built with this single goal in mind: sustainable value growth once XIT reaches the open market.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              As XIT's community, real-world utility, and exchange presence grow, our shared goal is to grow XIT's real market value substantially over the long term. We won't quote a guaranteed number — no responsible project can promise that — but our fixed and transparent pricing policy, our disciplined burn model, and our complete public roadmap are all built around one goal: genuine, demand-driven growth for every member who believes in XIT's long-term vision.
            </p>
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="py-16 bg-[#0d1220]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8">
              <Globe className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Global Community</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Launched from Dubai, XIT's community already spans across multiple countries and continents, with no geographic restriction on who can join. Anyone, anywhere in the world with a compatible wallet can become part of the XIT community.
              </p>
            </div>
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8">
              <Users className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Community Powered</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                XIT's strength comes from its community. Every member who introduces XIT to others helps grow the project's real-world demand, utility, and reach — which is exactly what drives XIT's long-term value. In return, community builders are rewarded through XIT's official rewards plan for the genuine effort of growing the ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Token Overview */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-sm text-emerald-400 font-medium uppercase tracking-widest mb-3">Token Overview</p>
          <h2 className="text-3xl font-bold text-white mb-6">Token Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Token Name', value: 'XIT Token' },
              { label: 'Ticker', value: 'XIT' },
              { label: 'Network', value: 'BNB Smart Chain' },
              { label: 'Standard', value: 'BEP-20' },
              { label: 'Supply Model', value: 'Fixed' },
              { label: 'Transparency', value: '100%' },
              { label: 'Architecture', value: 'Smart Contract' },
              { label: 'Community', value: 'Global' },
            ].map((item, i) => (
              <div key={i} className="bg-[#111827] border border-gray-800 rounded-2xl p-5">
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className="text-base font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Join builders, holders and believers shaping the future of decentralized value — together.</h2>
          <p className="text-gray-400 mb-6">Start your journey with XIT Token today.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium px-7 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 group">
            Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
