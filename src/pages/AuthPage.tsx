import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Wallet, Shield, Home, UserCheck, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import BrandLogo from '@/components/BrandLogo';
import {
  connectAndSignLogin,
  getWalletInstallUrl,
  shortenAddress,
  type WalletKind,
} from '@/lib/web3';

const WALLETS: {
  id: WalletKind;
  name: string;
  hint: string;
  accent: string;
}[] = [
  { id: 'metamask', name: 'MetaMask', hint: 'Browser extension / app', accent: 'from-orange-500/20 to-orange-600/5 border-orange-500/40' },
  { id: 'trust', name: 'Trust Wallet', hint: 'App browser or extension', accent: 'from-blue-500/20 to-blue-600/5 border-blue-500/40' },
  { id: 'tokenpocket', name: 'TokenPocket', hint: 'In-app browser', accent: 'from-sky-500/20 to-sky-600/5 border-sky-500/40' },
  { id: 'safepal', name: 'SafePal', hint: 'App / extension', accent: 'from-violet-500/20 to-violet-600/5 border-violet-500/40' },
];

export default function AuthPage() {
  const [referralCode, setReferralCode] = useState('');
  const [sponsorName, setSponsorName] = useState<string | null>(null);
  const [referralStatus, setReferralStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [referralError, setReferralError] = useState('');
  const [needsReferral, setNeedsReferral] = useState(false);
  const [pendingWallet, setPendingWallet] = useState<{
    address: string;
    signature: string;
    timestamp: number;
    kind: WalletKind;
  } | null>(null);
  const [loadingKind, setLoadingKind] = useState<WalletKind | null>(null);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loginWithToken } = useAuth();

  const refFromUrl = (searchParams.get('ref') || '').trim().toUpperCase();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  useEffect(() => {
    if (refFromUrl) {
      setReferralCode(refFromUrl);
      setNeedsReferral(true);
    }
  }, [refFromUrl]);

  useEffect(() => {
    const code = referralCode.trim();
    if (code.length < 4) {
      setSponsorName(null);
      setReferralStatus('idle');
      setReferralError('');
      return;
    }

    setReferralStatus('checking');
    setReferralError('');
    const timer = setTimeout(async () => {
      try {
        const data: any = await api.auth.verifyReferral(code);
        if (data.valid && data.sponsor) {
          setSponsorName(data.sponsor.username);
          setReferralStatus('valid');
          setReferralError('');
        } else {
          setSponsorName(null);
          setReferralStatus('invalid');
          setReferralError(data.error || 'Invalid referral code');
        }
      } catch (err: any) {
        setSponsorName(null);
        setReferralStatus('invalid');
        setReferralError(err.message || 'Invalid referral code');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [referralCode]);

  const finishLogin = async (
    address: string,
    signature: string,
    timestamp: number,
    code?: string,
  ) => {
    const data: any = await api.auth.walletLogin({
      address,
      signature,
      timestamp,
      referralCode: code || undefined,
    });
    await loginWithToken(data.token);
    navigate('/dashboard');
  };

  const handleConnect = async (kind: WalletKind) => {
    setError('');
    setLoadingKind(kind);
    try {
      const { address, signature, timestamp } = await connectAndSignLogin(kind);

      const status: any = await api.auth.walletStatus(address);
      if (status.registered) {
        await finishLogin(address, signature, timestamp);
        return;
      }

      // New wallet — need sponsor
      const code = referralCode.trim().toUpperCase() || refFromUrl;
      if (code && referralStatus === 'valid') {
        await finishLogin(address, signature, timestamp, code);
        return;
      }
      if (code && referralStatus !== 'valid') {
        // re-check once
        const v: any = await api.auth.verifyReferral(code);
        if (v.valid) {
          await finishLogin(address, signature, timestamp, code);
          return;
        }
      }

      setPendingWallet({ address, signature, timestamp, kind });
      setNeedsReferral(true);
      setError('Enter your sponsor referral code to complete first-time connect.');
    } catch (err: any) {
      if (err?.code === 'NO_PROVIDER' && err.installUrl) {
        setError(`${err.message} Opening download / wallet link…`);
        window.open(err.installUrl || getWalletInstallUrl(kind), '_blank');
      } else {
        setError(err.message || 'Wallet connect failed');
      }
    } finally {
      setLoadingKind(null);
    }
  };

  const handleConfirmSponsor = async () => {
    if (!pendingWallet) return;
    setError('');
    if (!referralCode.trim()) {
      setError('Sponsor referral code is required');
      return;
    }
    if (referralStatus !== 'valid') {
      setError('Please enter a valid referral code');
      return;
    }
    setLoadingKind(pendingWallet.kind);
    try {
      // Re-sign if message may be stale (>8 min) — otherwise reuse
      let { address, signature, timestamp } = pendingWallet;
      if (Date.now() - timestamp > 8 * 60 * 1000) {
        const fresh = await connectAndSignLogin(pendingWallet.kind);
        address = fresh.address;
        signature = fresh.signature;
        timestamp = fresh.timestamp;
      }
      await finishLogin(address, signature, timestamp, referralCode.trim().toUpperCase());
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoadingKind(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-xit-gold/10 via-transparent to-transparent" />
      <div className="absolute top-4 left-4 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex justify-center mb-4">
            <BrandLogo imgClassName="w-16 h-16" />
          </div>
          <h1 className="text-2xl font-bold text-white">Connect Wallet</h1>
          <p className="text-gray-400 text-sm mt-1">No email or password — your wallet is your account</p>
        </div>

        <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
          {(needsReferral || refFromUrl || pendingWallet) && (
            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                Sponsor referral code
                {refFromUrl ? <span className="text-emerald-400 normal-case">(from your invite link)</span> : null}
              </label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="Enter sponsor code"
                disabled={!!refFromUrl && referralStatus === 'valid' && !pendingWallet}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-xit-gold/50 uppercase tracking-wider disabled:opacity-70"
              />
              {referralStatus === 'checking' && (
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Checking…
                </p>
              )}
              {referralStatus === 'valid' && sponsorName && (
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> Sponsor: {sponsorName}
                </p>
              )}
              {referralStatus === 'invalid' && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {referralError}
                </p>
              )}
            </div>
          )}

          <div className="grid gap-3">
            {WALLETS.map((w) => (
              <button
                key={w.id}
                type="button"
                disabled={!!loadingKind}
                onClick={() => handleConnect(w.id)}
                className={`flex items-center gap-4 w-full p-4 rounded-xl border bg-gradient-to-r ${w.accent} hover:brightness-110 transition-all text-left disabled:opacity-60`}
              >
                <div className="w-11 h-11 rounded-xl bg-black/30 flex items-center justify-center">
                  {loadingKind === w.id ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Wallet className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold">{w.name}</div>
                  <div className="text-xs text-gray-400">{w.hint}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 shrink-0" />
              </button>
            ))}
          </div>

          {pendingWallet && (
            <div className="space-y-3 pt-2 border-t border-white/10">
              <p className="text-sm text-gray-300">
                Wallet ready: <span className="text-xit-gold font-mono">{shortenAddress(pendingWallet.address)}</span>
              </p>
              <button
                type="button"
                onClick={handleConfirmSponsor}
                disabled={!!loadingKind || referralStatus !== 'valid'}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-xit-gold-mid to-xit-gold-dark text-black font-semibold disabled:opacity-50"
              >
                {loadingKind ? 'Connecting…' : 'Confirm sponsor & enter dashboard'}
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
            <span className="inline-flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Signature login · no personal data
            </span>
            <Link to="/admin/login" className="text-gray-500 hover:text-xit-gold transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
