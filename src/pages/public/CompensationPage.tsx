import { Link } from 'react-router-dom';
import { Network, Award, Users, TrendingUp, ArrowRight, Check, Layers, Coins } from 'lucide-react';

const commissionData = [
  { level: 1, percentage: 5.0 },
  { level: 2, percentage: 3.0 },
  { level: 3, percentage: 2.0 },
  { level: 4, percentage: 1.5 },
  { level: 5, percentage: 1.0 },
  { level: 6, percentage: 0.8 },
  { level: 7, percentage: 0.6 },
  { level: 8, percentage: 0.5 },
  { level: 9, percentage: 0.4 },
  { level: 10, percentage: 0.3 },
  { level: 11, percentage: 0.3 },
  { level: 12, percentage: 0.2 },
  { level: 13, percentage: 0.2 },
  { level: 14, percentage: 0.1 },
  { level: 15, percentage: 0.1 },
];

export default function CompensationPage() {
  const totalCommission = commissionData.reduce((sum, r) => sum + r.percentage, 0);

  return (
    <div className="bg-[#0a0e17]">
      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden bg-grid">
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">15-Level Referral System</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Compensation Plan</h1>
          <p className="text-lg text-gray-400 mt-6 max-w-2xl mx-auto font-light">
            XIT's strength comes from its community. Every member who introduces XIT to others helps grow the project's real-world demand, utility, and reach — which is exactly what drives XIT's long-term value. In return, community builders are rewarded through XIT's official rewards plan.
          </p>
        </div>
      </section>

      {/* How Commission Works */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-5">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Users, title: '1. Refer & Build', desc: 'Share your referral code. When someone signs up with your code, they become your Level 1 referral. Their referrals become your Level 2, and so on up to 15 levels.' },
                { icon: Coins, title: '2. Network Purchases', desc: 'When anyone in your 15-level network buys tokens, a commission is automatically calculated based on their level relative to you.' },
                { icon: TrendingUp, title: '3. Auto Distribution', desc: 'Commission is instantly credited to your wallet. No manual claims needed. Every transaction is verifiable on-chain.' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-900/40 rounded-2xl p-5">
                  <item.icon className="w-8 h-8 text-emerald-400 mb-3" />
                  <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Commission Table */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Commission Rates by Level</h2>
            <p className="text-gray-400 mt-3">Total commission across all 15 levels: <span className="text-emerald-400 font-bold">{totalCommission.toFixed(1)}%</span></p>
          </div>
          <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/30">
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-3">Level</th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-3">Description</th>
                  <th className="text-right text-sm font-medium text-gray-400 px-6 py-3">Commission %</th>
                  <th className="text-right text-sm font-medium text-gray-400 px-6 py-3">Example (100 XIT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {commissionData.map((row) => {
                  const example = (100 * row.percentage) / 100;
                  return (
                    <tr key={row.level} className="hover:bg-gray-800/20 transition-all">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-300">L{row.level}</div>
                          <span className="text-sm text-white font-medium">Level {row.level}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5"><span className="text-sm text-gray-400">{row.level === 1 ? 'Direct referral' : `${row.level} levels deep`}</span></td>
                      <td className="px-6 py-3.5 text-right"><span className="text-sm font-bold text-emerald-400">{row.percentage}%</span></td>
                      <td className="px-6 py-3.5 text-right"><span className="text-sm text-cyan-400 font-medium">{example.toFixed(2)} XIT</span></td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-800 bg-gray-900/30">
                  <td colSpan={2} className="px-6 py-4 text-sm font-bold text-white">Total (All 15 Levels)</td>
                  <td className="px-6 py-4 text-right text-base font-bold text-emerald-400">{totalCommission.toFixed(1)}%</td>
                  <td className="px-6 py-4 text-right text-base font-bold text-cyan-400">{totalCommission.toFixed(2)} XIT</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      {/* Example Scenario */}
      <section className="py-12 bg-[#0d1220]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Example Scenario</h2>
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Network className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">If your Level 1 referral buys 100 tokens:</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> You (Level 1 upline) earn <span className="text-emerald-400 font-medium">5 XIT</span> (5%)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Your upline at Level 2 earns <span className="text-emerald-400 font-medium">3 XIT</span> (3%)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Level 3 upline earns <span className="text-emerald-400 font-medium">2 XIT</span> (2%)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Total across all 15 levels: <span className="text-emerald-400 font-bold">{totalCommission.toFixed(2)} XIT</span></li>
                </ul>
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 text-sm text-gray-400">
              <p className="flex items-center gap-2"><Layers className="w-4 h-4 text-emerald-400 flex-shrink-0" />Every member's contribution goes directly toward strengthening the XIT ecosystem — funding liquidity, ongoing development, and global adoption efforts. This is real capital, going toward a real, actively-built project.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Distribution Sequence */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Distribution Sequence</h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              XIT's community presale and full distribution phase comes first, by design. Once this phase concludes, XIT will move into its next stage: listing on public cryptocurrency exchanges — beginning with decentralized exchanges, followed by centralized exchange applications as trading volume and community size grow.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              This sequence protects early community members by ensuring fair, complete distribution before open-market trading begins.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Start Building Your Network</h2>
          <p className="text-gray-400 mb-6">Create your account and get your referral code to start earning commissions across 15 levels.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium px-7 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 group">
            Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
