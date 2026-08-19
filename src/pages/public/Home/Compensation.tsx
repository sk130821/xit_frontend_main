import { Network, Award, Users, TrendingUp, Check, Layers, Coins } from 'lucide-react';
import Section from './Section';

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

const howItWorks = [
  { icon: Users, title: '1. Refer & Build', desc: 'Share your referral code. When someone signs up with your code, they become your Level 1 referral. Their referrals become your Level 2, and so on up to 15 levels.' },
  { icon: Coins, title: '2. Network Purchases', desc: 'When anyone in your 15-level network buys tokens, a commission is automatically calculated based on their level relative to you.' },
  { icon: TrendingUp, title: '3. Auto Distribution', desc: 'Commission is instantly credited to your wallet. No manual claims needed. Every transaction is verifiable on-chain.' },
];

export default function Compensation() {
  const totalCommission = commissionData.reduce((sum, r) => sum + r.percentage, 0);

  return (
    <Section id="compensation">
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 bg-[#f3ba2f]/10 border border-[#f3ba2f]/20 rounded-full px-3 sm:px-4 py-1.5 mb-4">
          <Award className="w-4 h-4 text-[#f3ba2f] shrink-0" />
          <span className="text-xs sm:text-sm text-[#f3ba2f] font-medium">15-Level Referral System</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Compensation Plan</h2>
        <p className="text-sm sm:text-base text-white mt-4 max-w-2xl mx-auto">
          Every member who introduces XIT to others helps grow real demand, utility, and reach — and is rewarded through XIT's official rewards plan.
        </p>
      </div>

      <div className="bg-gradient-to-br from-[#f3ba2f]/10 to-[#d4a017]/10 border border-[#f3ba2f]/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-5">How It Works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {howItWorks.map((item) => (
            <div key={item.title} className="bg-gray-900/40 rounded-2xl p-4 sm:p-5">
              <item.icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#f3ba2f] mb-3" />
              <h4 className="text-sm font-semibold text-white mb-2">{item.title}</h4>
              <p className="text-xs text-white leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white">Commission Rates by Level</h3>
        <p className="text-sm sm:text-base text-white mt-2">
          Total commission across all 15 levels: <span className="text-[#f3ba2f] font-bold">{totalCommission.toFixed(1)}%</span>
        </p>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden mb-6 sm:mb-8">
        <div className="overflow-x-auto -mx-0">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/30">
                <th className="text-left text-xs sm:text-sm font-medium text-white px-3 sm:px-6 py-3">Level</th>
                <th className="text-left text-xs sm:text-sm font-medium text-white px-3 sm:px-6 py-3 hidden sm:table-cell">Description</th>
                <th className="text-right text-xs sm:text-sm font-medium text-white px-3 sm:px-6 py-3">Commission %</th>
                <th className="text-right text-xs sm:text-sm font-medium text-white px-3 sm:px-6 py-3">Example (100 XIT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {commissionData.map((row) => {
                const example = (100 * row.percentage) / 100;
                return (
                  <tr key={row.level} className="hover:bg-gray-800/20 transition-all">
                    <td className="px-3 sm:px-6 py-3 sm:py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-800 flex items-center justify-center text-[10px] sm:text-xs font-bold text-white shrink-0">L{row.level}</div>
                        <span className="text-xs sm:text-sm text-white font-medium whitespace-nowrap">Level {row.level}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-3.5 hidden sm:table-cell">
                      <span className="text-sm text-white">{row.level === 1 ? 'Direct referral' : `${row.level} levels deep`}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-3.5 text-right">
                      <span className="text-xs sm:text-sm font-bold text-[#f3ba2f]">{row.percentage}%</span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-3.5 text-right">
                      <span className="text-xs sm:text-sm text-cyan-400 font-medium whitespace-nowrap">{example.toFixed(2)} XIT</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-800 bg-gray-900/30">
                <td colSpan={2} className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-white">Total (All 15 Levels)</td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-right text-sm sm:text-base font-bold text-[#f3ba2f]">{totalCommission.toFixed(1)}%</td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-right text-sm sm:text-base font-bold text-cyan-400 whitespace-nowrap">{totalCommission.toFixed(2)} XIT</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 sm:p-8">
        <div className="flex items-start gap-3 sm:gap-4 mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#f3ba2f]/10 flex items-center justify-center flex-shrink-0">
            <Network className="w-5 h-5 sm:w-6 sm:h-6 text-[#f3ba2f]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2">If your Level 1 referral buys 100 tokens:</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-white">
              <li className="flex items-start sm:items-center gap-2"><Check className="w-4 h-4 text-[#f3ba2f] shrink-0 mt-0.5 sm:mt-0" /> You (Level 1 upline) earn <span className="text-[#f3ba2f] font-medium">5 XIT</span> (5%)</li>
              <li className="flex items-start sm:items-center gap-2"><Check className="w-4 h-4 text-[#f3ba2f] shrink-0 mt-0.5 sm:mt-0" /> Your upline at Level 2 earns <span className="text-[#f3ba2f] font-medium">3 XIT</span> (3%)</li>
              <li className="flex items-start sm:items-center gap-2"><Check className="w-4 h-4 text-[#f3ba2f] shrink-0 mt-0.5 sm:mt-0" /> Level 3 upline earns <span className="text-[#f3ba2f] font-medium">2 XIT</span> (2%)</li>
              <li className="flex items-start sm:items-center gap-2"><Check className="w-4 h-4 text-[#f3ba2f] shrink-0 mt-0.5 sm:mt-0" /> Total across all 15 levels: <span className="text-[#f3ba2f] font-bold">{totalCommission.toFixed(2)} XIT</span></li>
            </ul>
          </div>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-4 text-xs sm:text-sm text-white">
          <p className="flex items-start gap-2">
            <Layers className="w-4 h-4 text-[#f3ba2f] flex-shrink-0 mt-0.5" />
            Every member's contribution goes directly toward strengthening the XIT ecosystem — funding liquidity, ongoing development, and global adoption efforts.
          </p>
        </div>
      </div>
    </Section>
  );
}
