import { Link } from 'react-router-dom';
import {
  Wallet, TrendingUp, Users, Shield, ArrowRight, Zap,
  Lock, Unlock, Award, Check, Network, Gift, Eye, Layers,
  Cpu, HandCoins, Code, Globe,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-[#0a0e17]">
      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17] via-[#0d1220] to-[#0a0e17]" />
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">On-Chain Transparency · Controlled Growth · Community Powered</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
            The Future of Decentralized
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Crypto MLM Value</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mt-8 leading-relaxed max-w-3xl mx-auto font-light">
            XIT Token is a transparent, community-powered decentralized ecosystem with full on-chain transparency, disciplined token economics and community-driven growth — 15-level referral commissions and dual investment plans with daily ROI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link to="/" className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group">
              Get Started Now <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link to="/plans" className="w-full sm:w-auto bg-[#111827] hover:bg-gray-800 border border-gray-700 text-emerald-400 font-medium px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
              Explore Whitepaper
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            {[
              { icon: TrendingUp, label: 'Daily ROI', value: '0.82%', sub: 'Lock Plan' },
              { icon: Network, label: 'Referral Levels', value: '15', sub: 'Deep Network' },
              { icon: Wallet, label: 'Max Return', value: '3X', sub: 'Lock Plan' },
              { icon: Award, label: 'Top Commission', value: '5%', sub: 'Level 1' },
            ].map((stat, i) => (
              <div key={i} className="bg-[#111827]/60 backdrop-blur border border-gray-800 rounded-2xl p-5 text-center">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                <p className="text-[10px] text-gray-600 mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Six Core Pillars */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm text-emerald-400 font-medium uppercase tracking-widest mb-3">Core Pillars</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Six Pillars of XIT Token</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Six core pillars for a transparent, sustainable and community-powered ecosystem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Eye, title: 'Full On-Chain Transparency', desc: 'Every rule is encoded in audited smart contracts and verifiable on-chain — transparency is enforced by architecture, not policy. If it can\'t be verified on-chain, it doesn\'t count.' },
              { icon: Shield, title: 'Hard-Coded Discipline', desc: 'A fixed total supply with vesting locks and deflationary burn mechanics protects holders from supply shocks. We design for the next decade, not the next week.' },
              { icon: Users, title: 'Community as Stakeholders', desc: 'The ecosystem belongs to its holders. Every member who introduces XIT to others helps grow real demand, utility, and reach — driving long-term value.' },
              { icon: TrendingUp, title: 'Deflationary Utility', desc: 'Burning-based economic model combined with growing utility. When supply goes down while demand grows, value tends to rise. Simple, time-tested economics.' },
              { icon: Cpu, title: 'Utility-First Design', desc: 'XIT utility expands in planned phases — ecosystem access, investment plans, staking, and trading — so demand is built on real usage, not speculation.' },
              { icon: HandCoins, title: 'No Hidden Rules', desc: 'The whitepaper, tokenomics and contract addresses are all public. What you read is exactly what is deployed. No hidden ledgers. No manual control.' },
            ].map((pillar, i) => (
              <div key={i} className="group bg-[#111827] border border-gray-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-all">
                  <pillar.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{pillar.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem / The Solution */}
      <section className="py-24 bg-[#0d1220] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="max-w-5xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-red-400/70 font-medium uppercase tracking-widest mb-3">The Problem</p>
              <h2 className="text-2xl font-bold text-white mb-6">Why Most Crypto MLM Projects Fail</h2>
              <div className="space-y-4">
                {[
                  { title: 'The Transparency Gap', desc: 'Most digital-asset projects operate with opaque treasuries, unverifiable claims and centralized control — holders are asked to trust, never to verify.' },
                  { title: 'Undisciplined Supply', desc: 'Unlimited minting, sudden unlocks and undisclosed team allocations quietly destroy token value across the industry.' },
                  { title: 'Utility Deficit', desc: 'Many tokens launch with no real use case — value depends entirely on speculation rather than utility.' },
                  { title: 'Community Neglect', desc: 'Communities are treated as exit liquidity instead of stakeholders with a genuine voice.' },
                ].map((item, i) => (
                  <div key={i} className="border-l-2 border-red-400/20 pl-4">
                    <h3 className="text-sm font-semibold text-gray-300 mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-emerald-400 font-medium uppercase tracking-widest mb-3">The XIT Solution</p>
              <h2 className="text-2xl font-bold text-white mb-6">XIT Token answers each of these failures at the protocol level:</h2>
              <div className="space-y-4">
                {[
                  { title: 'Verifiable by Anyone', desc: 'Every rule is encoded in audited smart contracts and verifiable on-chain — transparency is enforced by architecture, not policy.' },
                  { title: 'Hard-Coded Discipline', desc: 'A fixed total supply with vesting locks and deflationary burn mechanics protects holders from supply shocks.' },
                  { title: 'Utility-First Design', desc: 'XIT utility expands in planned phases — ecosystem access, investment plans, staking, governance and a payment layer — so demand is built on usage.' },
                  { title: 'Community as Stakeholders', desc: 'Holders shape the ecosystem through a planned governance framework where proposals and votes live on-chain.' },
                ].map((item, i) => (
                  <div key={i} className="border-l-2 border-emerald-500/40 pl-4">
                    <h3 className="text-sm font-semibold text-emerald-400 mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Architecture */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm text-emerald-400 font-medium uppercase tracking-widest mb-3">Architecture</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Protocol Architecture</h2>
            <p className="text-gray-400 mt-4">Three layers powering the XIT Token ecosystem.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Code, title: 'Smart Contract Layer', desc: 'The core of XIT Token is a set of smart contracts governing token supply, transfers, vesting schedules and future utility modules. Contracts are immutable post-deployment; upgrades follow a transparent, community-visible process.' },
              { icon: Cpu, title: 'Application Layer', desc: 'A React-based decentralized application (dApp) provides the user interface — wallet connection, token dashboard, ecosystem statistics and, in later phases, staking and governance portals. The dApp reads directly from the blockchain; it never holds user funds.' },
              { icon: Eye, title: 'Transparency Layer', desc: 'All ecosystem metrics — circulating supply, burn history, treasury movements — are published through on-chain data and public dashboards, allowing independent verification at any time.' },
            ].map((layer, i) => (
              <div key={i} className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                  <layer.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{layer.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{layer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BNT Utilities / XIT Utilities */}
      <section className="py-24 bg-[#0d1220] relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="max-w-5xl mx-auto px-6 relative">
          <div className="text-center mb-12">
            <p className="text-sm text-emerald-400 font-medium uppercase tracking-widest mb-3">Utilities</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">XIT Utilities</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">BNT utility expands in planned phases — ecosystem access, staking, governance and a payment layer — so demand is built on usage.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Shield, title: 'Ecosystem Access', desc: 'XIT is the key that unlocks the XIT dApp and its features — holding the token means holding access to everything the ecosystem offers today and tomorrow.' },
              { icon: TrendingUp, title: 'Staking', desc: 'Planned staking pools will let holders lock XIT for defined periods and take part in ecosystem reward programs — encouraging long-term holding and reducing circulating supply.' },
              { icon: Users, title: 'Governance', desc: 'XIT will anchor community governance: holders propose, discuss and vote on ecosystem decisions, with every vote recorded transparently on-chain.' },
              { icon: HandCoins, title: 'Payments & Merchant Network', desc: 'A planned merchant layer will allow XIT to be used for payments across partner services — digital products, utilities and e-commerce integrations.' },
            ].map((util, i) => (
              <div key={i} className="bg-[#111827] border border-gray-800 rounded-2xl p-6 hover:border-emerald-500/20 transition-all">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                  <util.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{util.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{util.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — 4 Steps */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm text-emerald-400 font-medium uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Four Steps to Start Earning</h2>
            <p className="text-gray-400 mt-4">Connect, hold, participate and grow — powered by verifiable blockchain infrastructure.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { step: '01', tag: 'Getting Started', icon: Users, title: 'Connect', desc: 'Create your account with email and a referral code. Get your own unique referral link instantly. Set up your Web3 wallet and connect to the XIT dApp in seconds.' },
              { step: '02', tag: 'XIT Access', icon: Lock, title: 'Hold', desc: 'Acquire XIT and become part of the ecosystem — your gateway to every current and future utility. Buy tokens and invest in Lock (3X) or Flexible (2X) plan.' },
              { step: '03', tag: 'Utility', icon: Network, title: 'Participate', desc: 'Use XIT across the ecosystem for access and participation. Share your referral code, build your 15-level network, earn commissions on every token purchase in your downline.' },
              { step: '04', tag: 'Community', icon: TrendingUp, title: 'Grow', desc: 'Grow with a global community as new utilities, partnerships and integrations go live on the roadmap. Claim daily ROI, earn referral commissions, and build passive income.' },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 h-full hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="text-3xl font-bold text-gray-800">{item.step}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400/60 uppercase tracking-wider font-medium">{item.tag}</span>
                  <h3 className="text-lg font-semibold text-white mb-2 mt-1">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
                {i < 3 && <div className="hidden lg:flex absolute top-1/2 -right-3 w-6 h-6 items-center justify-center z-10"><ArrowRight className="w-4 h-4 text-gray-700" /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Engine — Three Fronts */}
      <section className="py-24 bg-[#0d1220] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="max-w-4xl mx-auto px-6 relative">
          <div className="text-center mb-12">
            <p className="text-sm text-emerald-400 font-medium uppercase tracking-widest mb-3">Growth Engine</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Why This Matters — Demand & Supply, Explained Simply</h2>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-8 md:p-12">
            <p className="text-sm text-gray-400 leading-relaxed mb-8">
              We are not sitting back and waiting — the XIT team is actively working on three fronts to build genuine, lasting value for XIT:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: Globe, title: 'Advertising & Awareness', desc: 'Ongoing marketing campaigns to introduce XIT to new communities, countries, and audiences. Building a transparent brand and track record that make people want to be part of XIT.' },
                { icon: Layers, title: 'Demand & Utility', desc: 'Expanding the real-world use cases for XIT through our roadmap — wallet, blockchain, booking platform, and beyond. The more the XIT ecosystem is used, the more XIT is needed.' },
                { icon: TrendingUp, title: 'Popularity & Trust', desc: 'This is the honest engine behind XIT\'s growth — advertising reach, popularity, and real demand — not artificial price manipulation. Building a transparent brand that makes people want to be part of XIT.' },
              ].map((item, i) => (
                <div key={i}>
                  <item.icon className="w-7 h-7 text-emerald-400 mb-3" />
                  <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-sm text-gray-400 leading-relaxed">
                This is basic, time-tested economics: when supply of something goes down while demand for it stays the same or grows, its value tends to rise. XIT Token is designed around this exact principle — a shrinking, disciplined supply combined with a growing, global community of holders and users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm text-emerald-400 font-medium uppercase tracking-widest mb-3">Roadmap</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Growth Plan</h2>
            <p className="text-gray-400 mt-4">From launch to a global ecosystem — real technology ships before each next phase.</p>
          </div>

          <div className="space-y-6">
            {[
              { badge: 'FOUNDATION', status: 'Active', title: 'Foundation', items: ['Smart contract development & independent security audit', 'Website, whitepaper & brand identity launch', 'XIT deployment on BNB Smart Chain; contract verified on BscScan', 'dApp v1 — wallet connect, dashboard and ecosystem stats', 'Community channels go live'] },
              { badge: 'UPCOMING', status: 'Upcoming', title: 'Growth', items: ['Community expansion all over the world', 'Blockchain literacy educational content series', 'Community events & ambassador program', 'Live transparency dashboard', 'Strategic partnership announcements'] },
              { badge: 'UPCOMING', status: 'Upcoming', title: 'Expansion', items: ['PancakeSwap listing & liquidity pool activation', 'XIT staking pools launch', 'First public buyback & burn event', 'Multi-language platform rollout', 'Global community meetups & recognition events'] },
            ].map((phase, i) => (
              <div key={i} className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${phase.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-500'}`}>
                      {phase.badge}
                    </span>
                    <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                  </div>
                  <span className={`text-xs font-medium ${phase.status === 'Active' ? 'text-emerald-400' : 'text-gray-500'}`}>
                    {phase.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {phase.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-gray-400">
                      <Check className="w-4 h-4 text-emerald-400/60 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-24 bg-[#0d1220] relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="max-w-4xl mx-auto px-6 relative">
          <div className="text-center mb-12">
            <p className="text-sm text-emerald-400 font-medium uppercase tracking-widest mb-3">Security</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Security & Trust</h2>
            <p className="text-gray-400 mt-4">Every feature ships with security-first engineering and independent auditing.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Shield, title: 'Independent Smart Contract Audit', desc: 'Independent smart contract audit prior to mainnet deployment ensures all code is verified and secure.' },
              { icon: Lock, title: 'Multi-Signature Control', desc: 'Multi-signature control on treasury operations — no single party can move funds alone.' },
              { icon: Eye, title: 'Publicly Verified Contracts', desc: 'Publicly verified contract addresses; bug-bounty program planned post-launch for ongoing security.' },
              { icon: Wallet, title: 'Non-Custodial Design', desc: 'Non-custodial design — the platform never takes possession of user funds. Your tokens stay in your wallet, under your control, at all times.' },
            ].map((item, i) => (
              <div key={i} className="bg-[#111827] border border-gray-800 rounded-2xl p-6 flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
            <div className="relative">
              <Gift className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-3">Ready to Start Earning?</h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                The roadmap is public. The contracts are on-chain. Join a transparent ecosystem built for sustainable, community-driven growth. Create your account, get your referral code, and start building your network across 15 levels.
              </p>
              <Link to="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 group">
                Create Free Account <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
            <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 leading-relaxed">
              Digital assets are volatile and involve market risk. XIT is a utility token and does not represent any assured income, profit or return. Nothing on this website constitutes financial, legal or tax advice. Participate responsibly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
