import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, UserPlus, LogIn, Eye, EyeOff, Check, Shield, Home, UserCheck, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import BrandLogo from '@/components/BrandLogo';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [sponsorName, setSponsorName] = useState<string | null>(null);
  const [referralStatus, setReferralStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [referralError, setReferralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loginWithToken } = useAuth();

  useEffect(() => { if (user) navigate('/dashboard'); }, [user, navigate]);
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralCode(ref.toUpperCase());
      setMode('signup');
    }
  }, [searchParams]);

  useEffect(() => {
    if (mode !== 'signup') return;

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
    }, 500);

    return () => clearTimeout(timer);
  }, [referralCode, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (mode === 'signup') {
        if (!username.trim()) { setError('Username is required'); setLoading(false); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
        if (!referralCode.trim()) { setError('Referral code is required'); setLoading(false); return; }
        if (referralStatus !== 'valid') { setError('Please enter a valid referral code'); setLoading(false); return; }
        const data = await api.auth.signup({ username, email, password, referralCode: referralCode.trim() });
        await loginWithToken(data.token);
        navigate('/dashboard');
      } else {
        const data = await api.auth.login({ email, password });
        await loginWithToken(data.token);
        navigate('/dashboard');
      }
    } catch (err: any) { setError(err.message || 'An error occurred'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 relative overflow-hidden bg-grid">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-xit-gold/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-xit-blue/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <BrandLogo size="xl" showTagline className="mb-2" />
        </div>

        <div className="bg-black/60 backdrop-blur-xl border border-xit-gold/25 rounded-2xl p-8 shadow-xit-gold ring-1 ring-xit-blue/10">
          <div className="flex gap-2 p-1 bg-black/50 rounded-xl mb-6 border border-xit-gold/10">
            <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'login' ? 'bg-gradient-to-r from-xit-gold-mid to-xit-gold-dark text-black shadow-lg shadow-xit-gold/30' : 'text-gray-400 hover:text-xit-gold-light'}`}>
              <LogIn className="w-4 h-4" />Login
            </button>
            <button onClick={() => { setMode('signup'); setError(''); setSuccess(''); }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'signup' ? 'bg-gradient-to-r from-xit-gold-mid to-xit-gold-dark text-black shadow-lg shadow-xit-gold/30' : 'text-gray-400 hover:text-xit-gold-light'}`}>
              <UserPlus className="w-4 h-4" />Sign Up
            </button>
          </div>

          {success && <div className="mb-4 flex items-center gap-2 bg-xit-gold/10 border border-xit-gold/30 text-xit-gold-light text-sm rounded-lg px-4 py-3"><Check className="w-4 h-4 flex-shrink-0" />{success}</div>}
          {error && <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm text-xit-gold/70 mb-1.5">Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-black/50 border border-xit-gold/20 rounded-xl px-4 py-3 text-white text-sm focus:border-xit-blue focus:ring-1 focus:ring-xit-blue/50 outline-none transition-all placeholder:text-gray-600" placeholder="Enter your username" required />
              </div>
            )}
            <div>
              <label className="block text-sm text-xit-gold/70 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/50 border border-xit-gold/20 rounded-xl px-4 py-3 text-white text-sm focus:border-xit-blue focus:ring-1 focus:ring-xit-blue/50 outline-none transition-all placeholder:text-gray-600" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm text-xit-gold/70 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/50 border border-xit-gold/20 rounded-xl px-4 py-3 pr-12 text-white text-sm focus:border-xit-blue focus:ring-1 focus:ring-xit-blue/50 outline-none transition-all placeholder:text-gray-600" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-xit-blue">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
            </div>
            {mode === 'signup' && (
              <div>
                <label className="block text-sm text-xit-gold/70 mb-1.5">
                  Referral Code <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className={`w-full bg-black/50 border rounded-xl px-4 py-3 text-white text-sm focus:ring-1 outline-none transition-all uppercase tracking-wider placeholder:text-gray-600 ${
                    referralStatus === 'valid'
                      ? 'border-xit-gold focus:border-xit-gold focus:ring-xit-gold/40'
                      : referralStatus === 'invalid'
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-xit-gold/20 focus:border-xit-blue focus:ring-xit-blue/50'
                  }`}
                  placeholder="Enter sponsor referral code"
                  required
                />
                {referralStatus === 'checking' && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-xit-blue/70">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Verifying referral code...
                  </div>
                )}
                {referralStatus === 'valid' && sponsorName && (
                  <div className="flex items-center gap-2 mt-2 bg-xit-gold/10 border border-xit-gold/30 text-xit-gold-light text-sm rounded-lg px-3 py-2">
                    <UserCheck className="w-4 h-4 flex-shrink-0" />
                    <span>Sponsor verified: <strong className="text-white">{sponsorName}</strong></span>
                    <Check className="w-4 h-4 ml-auto flex-shrink-0" />
                  </div>
                )}
                {referralStatus === 'invalid' && referralError && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-red-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {referralError}
                  </div>
                )}
              </div>
            )}
            <button
              type="submit"
              disabled={loading || (mode === 'signup' && (!referralCode.trim() || referralStatus !== 'valid'))}
              className="w-full bg-gradient-to-r from-xit-gold-light via-xit-gold to-xit-gold-dark hover:from-xit-gold hover:via-xit-gold-mid hover:to-xit-gold text-black font-semibold py-3 rounded-xl transition-all shadow-lg shadow-xit-gold/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <>{mode === 'login' ? 'Login' : 'Create Account'}<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>}
            </button>
            {mode === 'login' && (
              <Link
                to="/admin/login"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-xit-blue/30 text-xit-blue/80 hover:text-xit-blue-glow hover:border-xit-blue/60 hover:bg-xit-blue/5 transition-all text-sm font-medium"
              >
                <Shield className="w-4 h-4" />
                Admin Login
              </Link>
            )}
          </form>

          {mode === 'signup' && (
            <div className="mt-6 flex items-start gap-2 text-xs text-gray-500 bg-black/40 border border-xit-gold/10 rounded-lg p-3">
              <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-xit-gold/50" />
              <span>By signing up, you agree to participate in the XIT Token platform. Buy tokens to activate your account — until then sell & referral are disabled.</span>
            </div>
          )}
          <div className="mt-6 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-xit-blue transition-colors"><Home className="w-3.5 h-3.5" />Visit website</Link>
          </div>
        </div>
        <p className="text-center text-xit-gold/40 text-xs mt-6">© 2026 XIT Token (XIT). All rights reserved.</p>
      </div>
    </div>
  );
}
