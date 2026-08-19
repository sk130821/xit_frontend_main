import { Link } from 'react-router-dom';
import { Lock, Unlock, TrendingUp, Check, ArrowRight, Coins, Clock, Percent, AlertCircle, BookOpen, Eye, Shield, Cpu, Layers } from 'lucide-react';

export default function PlansPage() {
  return (
    <div className="bg-[#0a0e17]">
      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden bg-grid">
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">Whitepaper</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Whitepaper</h1>
          <p className="text-lg text-gray-400 mt-6 max-w-2xl mx-auto font-light">
            Fixed supply, transparent distribution, and honest pricing until public exchange listing. Everything you need to know about the XIT Token ecosystem.
          </p>
        </div>
      </section>

      {/* Abstract */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-emerald-400 mb-3">01 / Abstract</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              XIT Token is a transparent, community-powered decentralized ecosystem built on BNB Smart Chain. It features full on-chain transparency, disciplined token economics, and community-driven growth. The platform combines a 15-level referral commission system with dual investment plans offering daily ROI — creating genuine utility and demand rather than relying on speculation.
            </p>
          </div>
        </div>
      </section>

      {/* Protocol Architecture */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-xl font-bold text-emerald-400 mb-3">02 / Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
            {[
              { icon: Shield, title: 'Smart Contract Layer', desc: 'The core of XIT Token is a set of smart contracts governing token supply, transfers, vesting schedules and future utility modules. Contracts are immutable post-deployment; upgrades follow a transparent, community-visible process.' },
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

      {/* Token / Tokenomics */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-xl font-bold text-emerald-400 mb-3">03 / Tokenomics</h2>
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 mt-6">
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              XIT Token's total token supply is allocated transparently across the following categories. Every allocation serves a specific purpose in the ecosystem's growth and sustainability.
            </p>
            <div className="space-y-3">
              {[
                { label: 'Community Presale', percent: 70, color: 'bg-emerald-500', purpose: 'Direct distribution to the founding community' },
                { label: 'Rewards Pool', percent: 10, color: 'bg-teal-500', purpose: 'Community rewards & compensation plan' },
                { label: 'Team & Founders', percent: 10, color: 'bg-blue-500', purpose: 'Core team allocation' },
                { label: 'Liquidity', percent: 5, color: 'bg-cyan-500', purpose: 'Reserved for exchange liquidity at listing' },
                { label: 'Marketing & Airdrops', percent: 5, color: 'bg-purple-500', purpose: 'Global awareness campaigns and giveaways' },
              ].map((alloc, i) => (
                <div key={i} className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{alloc.label}</span>
                    <span className="text-sm font-bold text-emerald-400">{alloc.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                    <div className={`h-2 rounded-full ${alloc.color}`} style={{ width: `${alloc.percent}%` }} />
                  </div>
                  <p className="text-xs text-gray-500">{alloc.purpose}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Utility Model (Phased) */}
      <section className="py-12 bg-[#0d1220]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-xl font-bold text-emerald-400 mb-3">04 / Utility Model (Phased)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {[
              { title: 'Ecosystem Access', desc: 'XIT is the key that unlocks the XIT dApp and its features — holding the token means holding access to everything the ecosystem offers today and tomorrow.' },
              { title: 'Investment Plans', desc: 'Two investment plans — Lock (3X return, 0.82% daily ROI) and Flexible (2X return, 0.53% daily ROI) — create real demand for XIT through active usage.' },
              { title: 'Staking', desc: 'Planned staking pools will let holders lock XIT for defined periods and take part in ecosystem reward programs — encouraging long-term holding and reducing circulating supply.' },
              { title: 'Governance', desc: 'XIT will anchor community governance: holders propose, discuss and vote on ecosystem decisions, with every vote recorded transparently on-chain.' },
              { title: 'DEX Trading & Liquidity', desc: 'Listing on decentralized exchanges such as PancakeSwap will enable open-market trading, liquidity provision and transparent price discovery for XIT.' },
              { title: 'Payments & Merchant Network', desc: 'A planned merchant layer will allow XIT to be used for payments across partner services — digital products, utilities and e-commerce integrations.' },
              { title: 'Community Programs', desc: 'Community programs, events and recognition initiatives will run on XIT — connecting token utility to real community culture.' },
              { title: 'Deflationary Utility', desc: 'Deflationary burn events tied to ecosystem activity steadily reduce total supply — usage itself strengthens the token economy.' },
              { title: 'Future Integrations', desc: 'XIT is designed for future NFT integrations, cross-chain bridges and partner protocols without changing the core contract.' },
            ].map((util, i) => (
              <div key={i} className="bg-[#111827] border border-gray-800 rounded-xl p-5 hover:border-emerald-500/20 transition-all">
                <h3 className="text-sm font-semibold text-white mb-2">{util.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{util.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Plans */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-xl font-bold text-emerald-400 mb-3">05 / Investment Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-6">
            {/* Lock Plan */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-2 border-emerald-500/20 rounded-3xl p-8 relative overflow-hidden">
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
                    <Lock className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div><h3 className="text-2xl font-bold text-white">Lock Plan</h3><p className="text-sm text-emerald-300">3X Return · 0.82% Daily ROI</p></div>
                </div>
                <div className="space-y-3 mb-6">
                  <PlanRow icon={TrendingUp} label="Total Return" value="3X (300%)" highlight />
                  <PlanRow icon={Percent} label="Daily ROI" value="0.82%" highlight />
                  <PlanRow icon={Clock} label="Lock Period" value="365 days (admin set)" />
                  <PlanRow icon={Coins} label="Min Investment" value="100 XIT" />
                  <PlanRow icon={Lock} label="Sellable During Lock" value="0% — Cannot sell" />
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4 mb-6">
                  <p className="text-xs text-gray-400 leading-relaxed">Invest 100 tokens. They are locked for the admin-set period. You earn 0.82% daily ROI. At the end, you receive a total of 300 tokens (3X your investment).</p>
                </div>
                <div className="space-y-2 mb-6">
                  {['Guaranteed 3X return', 'Higher daily ROI rate (0.82%)', 'Best for long-term holders', 'ROI claimable daily'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />{item}</div>
                  ))}
                </div>
                <Link to="/" className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 group">Choose Lock Plan <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></Link>
              </div>
            </div>
            {/* Flexible Plan */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-2 border-blue-500/20 rounded-3xl p-8 relative overflow-hidden">
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/15 flex items-center justify-center">
                    <Unlock className="w-7 h-7 text-blue-400" />
                  </div>
                  <div><h3 className="text-2xl font-bold text-white">Flexible Plan</h3><p className="text-sm text-blue-300">2X Return · 0.53% Daily ROI</p></div>
                </div>
                <div className="space-y-3 mb-6">
                  <PlanRow icon={TrendingUp} label="Total Return" value="2X (200%)" highlight />
                  <PlanRow icon={Percent} label="Daily ROI" value="0.53%" highlight />
                  <PlanRow icon={Clock} label="Lock Period (20%)" value="365 days" />
                  <PlanRow icon={Coins} label="Min Investment" value="100 XIT" />
                  <PlanRow icon={Unlock} label="Sellable Immediately" value="80% sellable" />
                </div>
                <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-4 mb-6">
                  <p className="text-xs text-gray-400 leading-relaxed">Invest 100 tokens. 80 tokens are sellable anytime, 20 tokens locked for 1 year. You earn 0.53% daily ROI. At the end, you receive 200 tokens (2X). 10% admin charge on sales.</p>
                </div>
                <div className="space-y-2 mb-6">
                  {['80% tokens sellable anytime', '20% locked for 1 year', 'Best for flexible access', 'ROI claimable daily'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300"><Check className="w-4 h-4 text-blue-400 flex-shrink-0" />{item}</div>
                  ))}
                </div>
                <Link to="/" className="w-full bg-blue-500 hover:bg-blue-400 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 group">Choose Flexible Plan <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase */}
      <section className="py-12 bg-[#0d1220]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-xl font-bold text-emerald-400 mb-3">06 / Purchase</h2>
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 mt-6">
            <p className="text-sm text-gray-400 leading-relaxed mb-6">Buying XIT during the presale phase is simple and takes only a few minutes:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { step: '1', title: 'Connect Wallet', desc: 'Set up a Web3 wallet such as MetaMask or Trust Wallet and connect to the XIT dApp.' },
                { step: '2', title: 'Buy Tokens', desc: 'Purchase XIT tokens through the Buy Tokens page. Commissions auto-distribute to your 15-level upline.' },
                { step: '3', title: 'Start Earning', desc: 'Invest in a plan, claim daily ROI, and share your referral code to build your network.' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-900/50 rounded-xl p-5">
                  <span className="text-2xl font-bold text-emerald-400/30">{item.step}</span>
                  <h3 className="text-sm font-semibold text-white mb-2 mt-1">{item.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Legal Note */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-xl font-bold text-emerald-400 mb-3">Legal Note & Risk Disclosure</h2>
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 mt-6">
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              XIT is a utility token intended for use within the XIT Token ecosystem. It is not a security, deposit or instrument of assured return. Digital assets are volatile; their value can rise or fall. Participants are responsible for compliance with the laws of their own jurisdiction. This whitepaper is for informational purposes only and does not constitute financial, legal or tax advice.
            </p>
            <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mt-4">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500 leading-relaxed">
                Cryptocurrency values depend on the market. XIT Token does not guarantee any specific investment return. This section describes our roadmap and vision, not a promise of financial outcome. Participate responsibly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PlanRow({ icon: Icon, label, value, highlight }: { icon: any; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2"><Icon className="w-4 h-4 text-gray-500" /><span className="text-sm text-gray-400">{label}</span></div>
      <span className={`text-sm font-semibold ${highlight ? 'text-white' : 'text-gray-300'}`}>{value}</span>
    </div>
  );
}
