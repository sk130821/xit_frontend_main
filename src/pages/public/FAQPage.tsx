import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    category: 'About XIT Token',
    questions: [
      { q: 'What is XIT Token?', a: 'XIT Token is a transparent, community-powered decentralized ecosystem built on BNB Smart Chain. The platform is designed to provide users with access to technology-driven services, educational resources, and secure digital tools within an accessible online ecosystem — featuring 15-level referral commissions and dual investment plans with daily ROI.' },
      { q: 'Who developed XIT Token?', a: 'XIT Token was developed by a team of technology professionals and blockchain enthusiasts with experience in digital systems, software development, and online platform management.' },
      { q: 'What network is XIT built on?', a: 'XIT is a BEP-20 token on the BNB Smart Chain, chosen for its low transaction fees and fast confirmation times.' },
    ],
  },
  {
    category: 'Blockchain & Technology',
    questions: [
      { q: 'What are smart contracts?', a: 'Smart contracts are self-executing digital agreements stored on a blockchain. They automatically execute predefined conditions without the need for intermediaries, ensuring secure, transparent, and efficient transactions.' },
      { q: 'What is decentralization?', a: 'Decentralization is a system where control and decision-making are distributed across a network instead of being managed by a single authority. It improves security, transparency, reliability, and gives users greater control over their digital assets and data.' },
      { q: 'What is an ICO?', a: 'An Initial Coin Offering is how a new cryptocurrency project raises early support and distributes its tokens directly to its community, before the token is available on any public exchange.' },
      { q: 'How does XIT ensure transparency?', a: 'Every rule governing XIT — supply, distribution and utility — is committed to publicly auditable smart contracts. No hidden ledgers. No manual control. What the contract says is what happens — for everyone, always. All ecosystem metrics are published through on-chain data and public dashboards.' },
    ],
  },
  {
    category: 'Investment Plans',
    questions: [
      { q: 'What is the difference between Lock Plan and Flexible Plan?', a: 'Lock Plan gives 3X return with 0.82% daily ROI but all tokens are locked for 365 days. Flexible Plan gives 2X return with 0.53% daily ROI, where 80% of tokens are sellable immediately and only 20% are locked for 1 year.' },
      { q: 'What is the minimum investment amount?', a: 'The minimum investment for both plans is 100 XIT tokens.' },
      { q: 'How does daily ROI work?', a: 'ROI accrues daily based on your investment amount and the plan\'s daily rate. You can claim your ROI once per day for each active investment by clicking the "Claim ROI" button on the Invest page.' },
      { q: 'Can I have multiple investments at the same time?', a: 'Yes, you can create as many investments as you want, in either plan, as long as you have sufficient wallet balance.' },
    ],
  },
  {
    category: 'Buying & Selling',
    questions: [
      { q: 'How do I buy XIT tokens?', a: 'Go to the "Buy Tokens" page after logging in. Enter the amount you want to purchase (minimum 10 XIT). When you buy tokens, commissions are automatically distributed to your 15-level upline.' },
      { q: 'What is the 10% admin charge on sales?', a: 'When you sell tokens, 10% of the sale amount is deducted as an admin charge. For example, if you sell 100 tokens, 10 tokens go to the admin and you receive 90 tokens worth of value.' },
      { q: 'Which tokens can I sell?', a: 'You can sell tokens from your wallet balance (purchased tokens) and sellable tokens from your Flexible Plan investments (80%). Lock Plan tokens cannot be sold until the lock period ends.' },
    ],
  },
  {
    category: 'Referral Commissions',
    questions: [
      { q: 'How are commissions distributed?', a: 'When anyone in your 15-level downline purchases tokens, the system automatically calculates the commission based on their level and credits it to your wallet instantly. No manual claiming needed. Every transaction is verifiable on-chain.' },
      { q: 'What are the commission rates?', a: 'Level 1: 5%, Level 2: 3%, Level 3: 2%, Level 4: 1.5%, Level 5: 1%, and decreasing rates down to Level 15 at 0.1%. Total commission across all 15 levels is 16.9%.' },
      { q: 'Do I earn commission on investments or only on purchases?', a: 'Commissions are distributed on token purchases only. When your referral buys tokens, you get commission. When they invest those tokens, no additional commission is generated.' },
    ],
  },
  {
    category: 'Security & Account',
    questions: [
      { q: 'Is my account secure?', a: 'Yes, we use JWT-based authentication and encrypted password storage. All token operations use database transactions with row-level locking to prevent race conditions and ensure balance integrity. Non-custodial design — the platform never takes possession of user funds.' },
      { q: 'Why does my account say "Pending Activation"?', a: 'For security and compliance, all new accounts must be activated by a platform admin before they can buy, invest, or sell tokens. This prevents fraud and ensures a safe environment for all users.' },
      { q: 'What if I forget my password?', a: 'Contact the platform admin through the Contact page. They can help you reset your password after verifying your identity.' },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const toggle = (key: string) => setOpenIndex(openIndex === key ? null : key);

  return (
    <div className="bg-[#0a0e17]">
      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden bg-grid">
        <div className="absolute top-20 left-1/3 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">Frequently Asked Questions</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">FAQ</h1>
          <p className="text-lg text-gray-400 mt-6 font-light">Everything you need to know about XIT Token and the ecosystem.</p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          {faqs.map((section, sIdx) => (
            <div key={sIdx}>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                {section.category}
              </h2>
              <div className="space-y-2">
                {section.questions.map((faq, qIdx) => {
                  const key = `${sIdx}-${qIdx}`;
                  const isOpen = openIndex === key;
                  return (
                    <div key={key} className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
                      <button onClick={() => toggle(key)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-800/30 transition-all">
                        <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                        <ChevronDown className={`w-5 h-5 text-emerald-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && <div className="px-5 pb-4"><p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p></div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h2>
          <p className="text-gray-400 mb-6">Contact our support team or check out the platform.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="w-full sm:w-auto bg-[#111827] hover:bg-gray-800 border border-gray-700 text-white font-medium px-7 py-3 rounded-xl transition-all">Contact Us</Link>
            <Link to="/" className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium px-7 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 group flex items-center justify-center gap-2">
              Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
