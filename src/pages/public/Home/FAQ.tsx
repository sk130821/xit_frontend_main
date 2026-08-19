import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import FooterDust from '@/components/FooterDust';

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
      { q: 'How does XIT ensure transparency?', a: 'Every rule governing XIT — supply, distribution and utility — is committed to publicly auditable smart contracts. No hidden ledgers. No manual control. What the contract says is what happens — for everyone, always.' },
    ],
  },
  {
    category: 'Investment Plans',
    questions: [
      { q: 'What is the difference between Lock Plan and Flexible Plan?', a: 'Lock Plan gives 3X return with 0.82% daily ROI but all tokens are locked for 365 days. Flexible Plan gives 2X return with 0.53% daily ROI, where 80% of tokens are sellable immediately and only 20% are locked for 1 year.' },
      { q: 'What is the minimum investment amount?', a: 'The minimum investment for both plans is 100 XIT tokens.' },
      { q: 'How does daily ROI work?', a: 'ROI accrues daily based on your investment amount and the plan\'s daily rate. You can claim your ROI once per day for each active investment by clicking the "Claim ROI" button on the Invest page.' },
    ],
  },
  {
    category: 'Referral Commissions',
    questions: [
      { q: 'How are commissions distributed?', a: 'When anyone in your 15-level downline purchases tokens, the system automatically calculates the commission based on their level and credits it to your wallet instantly. No manual claiming needed.' },
      { q: 'What are the commission rates?', a: 'Level 1: 5%, Level 2: 3%, Level 3: 2%, Level 4: 1.5%, Level 5: 1%, and decreasing rates down to Level 15 at 0.1%. Total commission across all 15 levels is 16.9%.' },
    ],
  },
  {
    category: 'Security & Account',
    questions: [
      { q: 'Is my account secure?', a: 'Yes, we use JWT-based authentication and encrypted password storage. Non-custodial design — the platform never takes possession of user funds.' },
      { q: 'Why does my account say "Pending Activation"?', a: 'For security and compliance, all new accounts must be activated by a platform admin before they can buy, invest, or sell tokens.' },
    ],
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const toggle = (key: string) => setOpenIndex(openIndex === key ? null : key);

  return (
    <section id="faq" className="relative overflow-hidden py-12 scroll-mt-20 sm:scroll-mt-24 bg-[#070504]">
      <FooterDust />
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-[#f3ba2f]/10 border border-[#f3ba2f]/20 rounded-full px-3 sm:px-4 py-1.5 mb-4 max-w-full">
            <HelpCircle className="w-4 h-4 text-[#f3ba2f] shrink-0" />
            <span className="text-xs sm:text-sm text-[#f3ba2f] font-medium">Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">FAQ</h2>
          <p className="text-sm sm:text-base text-white mt-4">Everything you need to know about XIT Token and the ecosystem.</p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {faqs.map((section, sIdx) => (
            <div key={section.category}>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 sm:h-6 bg-[#f3ba2f] rounded-full shrink-0" />
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.questions.map((faq, qIdx) => {
                  const key = `${sIdx}-${qIdx}`;
                  const isOpen = openIndex === key;
                  return (
                    <div key={key} className="rounded-xl overflow-hidden border border-white/10 bg-[#05080f]/40 backdrop-blur-xl">
                      <button type="button" onClick={() => toggle(key)} className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 sm:py-4 text-left hover:bg-white/5 transition-all">
                        <span className="text-sm font-medium text-white">{faq.q}</span>
                        <ChevronDown className={`w-5 h-5 text-[#f3ba2f] flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-4">
                          <p className="text-sm text-white leading-relaxed">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
