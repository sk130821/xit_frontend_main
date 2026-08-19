import { useState } from 'react';
import { Share2, Copy, Check, Gift, AlertCircle, Lock, Sparkles, QrCode, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { PageHero, HeroStat } from '@/components/member/MemberUI';

export default function ReferralLinkPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const canSponsor = !!user?.is_active;
  const referralLink = `${window.location.origin}/?ref=${user?.referral_code}`;

  const copyLink = () => {
    if (!canSponsor) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCode = () => {
    if (!user?.referral_code) return;
    navigator.clipboard.writeText(user.referral_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHero badge="Grow Your Team" badgeIcon={Share2} title="Referral Link" subtitle="Share your link and earn referral + level + reward bonus">
        <HeroStat label="Status" value={canSponsor ? 'Active' : 'Pending'} accent={canSponsor} />
      </PageHero>

      {!canSponsor && (
        <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-2xl px-5 py-4 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-200">Buy to Activate Account</p>
            <p className="mt-1 text-amber-400/80">Buy tokens once to auto-activate. Until then your referral code won't work for new signups.</p>
            <Link to="/buy" className="inline-flex items-center gap-1 mt-2 text-orange-400 hover:text-orange-300 text-xs font-semibold">
              Buy & Invest now <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Referral code card */}
        <div className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 ${
          canSponsor ? 'border-orange-500/30 bg-gradient-to-br from-[#1a1208] via-[#151820] to-[#0f1419]' : 'border-gray-700 bg-[#111827] opacity-80'
        }`}>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Gift className={`w-5 h-5 ${canSponsor ? 'text-orange-400' : 'text-gray-500'}`} />
              <h3 className="text-lg font-semibold text-white">Your Referral Code</h3>
              {!canSponsor && (
                <span className="ml-auto flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-full">
                  <Lock className="w-3 h-3" /> Inactive
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mb-2">
              <p className={`text-4xl font-black font-mono tracking-wider ${canSponsor ? 'text-orange-400' : 'text-gray-500'}`}>
                {user?.referral_code}
              </p>
              <button onClick={copyCode} className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/25 text-orange-400 hover:bg-orange-500/20 transition-colors">
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-gray-500 text-xs">New members enter this code during signup</p>
          </div>
        </div>

        {/* Referral link card */}
        <div className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 ${
          canSponsor ? 'border-emerald-500/25 bg-gradient-to-br from-[#0a1512] to-[#111827]' : 'border-gray-700 bg-[#111827] opacity-80'
        }`}>
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <QrCode className={`w-5 h-5 ${canSponsor ? 'text-emerald-400' : 'text-gray-500'}`} />
              <h3 className="text-lg font-semibold text-white">Shareable Link</h3>
            </div>
            <div className="bg-gray-900/60 border border-gray-700 rounded-xl px-4 py-3 mb-4">
              <p className="text-xs text-gray-500 font-mono break-all leading-relaxed">
                {canSponsor ? referralLink : 'Activate account to get your referral link'}
              </p>
            </div>
            <button onClick={copyLink} disabled={!canSponsor}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white px-5 py-3.5 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 transition-all">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Link Copied!' : 'Copy Referral Link'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">How Referral Works</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { step: '1', title: 'Activate', desc: 'Buy tokens once — account auto-activates' },
            { step: '2', title: 'Share Link', desc: 'Send referral link to new members' },
            { step: '3', title: 'They Sign Up', desc: 'New member registers with your code' },
            { step: '4', title: 'Referral Bonus', desc: 'Earn % when they buy tokens' },
            { step: '5', title: 'Level Bonus', desc: 'Earn from 15 levels when they claim ROI' },
            { step: '6', title: 'Reward Bonus', desc: 'Team volume tiers unlock extra rewards' },
          ].map((item) => (
            <div key={item.step} className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
              <span className="inline-flex w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/25 text-orange-400 text-xs font-bold items-center justify-center mb-2">
                {item.step}
              </span>
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
