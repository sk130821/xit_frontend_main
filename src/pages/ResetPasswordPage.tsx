import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import BrandLogo from '@/components/BrandLogo';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Invalid reset link. Request a new one from forgot password page.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const data: any = await api.auth.resetPassword(token, password);
      setSuccess(data.message || 'Password updated successfully');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 relative overflow-hidden bg-grid">
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-xit-blue/10 rounded-full blur-[120px]" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <BrandLogo size="xl" showTagline className="mb-2" />
        </div>

        <div className="bg-black/60 backdrop-blur-xl border border-xit-gold/25 rounded-2xl p-8 shadow-xit-gold">
          <div className="flex items-center gap-3 mb-2">
            <KeyRound className="w-5 h-5 text-xit-gold" />
            <h1 className="text-xl font-bold text-white">Reset Password</h1>
          </div>
          <p className="text-sm text-gray-400 mb-6">Choose a new password for your account.</p>

          {!token && (
            <div className="mb-4 flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Missing reset token. Use the link from your email or request a new one.
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg px-4 py-3">
              <Check className="w-4 h-4 flex-shrink-0" />
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-xit-gold/70 mb-1.5">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-xit-gold/20 rounded-xl px-4 py-3 text-white text-sm focus:border-xit-blue outline-none"
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm text-xit-gold/70 mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-black/50 border border-xit-gold/20 rounded-xl px-4 py-3 text-white text-sm focus:border-xit-blue outline-none"
                placeholder="Repeat password"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !token}
              className="w-full bg-gradient-to-r from-xit-gold-light via-xit-gold to-xit-gold-dark text-black font-semibold py-3 rounded-xl disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-2 text-sm">
            <Link to="/forgot-password" className="text-gray-400 hover:text-xit-gold-light">Request new reset link</Link>
            <Link to="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-xit-gold-light">
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
