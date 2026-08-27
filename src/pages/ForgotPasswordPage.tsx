import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import BrandLogo from '@/components/BrandLogo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const data: any = await api.auth.forgotPassword(email.trim());
      setSuccess(data.message || 'If this email is registered, you will receive a reset link from support@xittoken.co');
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 relative overflow-hidden bg-grid">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-xit-gold/10 rounded-full blur-[120px]" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <BrandLogo size="xl" showTagline className="mb-2" />
        </div>

        <div className="bg-black/60 backdrop-blur-xl border border-xit-gold/25 rounded-2xl p-8 shadow-xit-gold">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-5 h-5 text-xit-gold" />
            <h1 className="text-xl font-bold text-white">Forgot Password</h1>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            Enter your registered email. We will send a reset link from <span className="text-xit-gold-light">support@xittoken.co</span>.
          </p>

          {success && (
            <div className="mb-4 flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg px-4 py-3">
              <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
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
              <label className="block text-sm text-xit-gold/70 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-xit-gold/20 rounded-xl px-4 py-3 text-white text-sm focus:border-xit-blue outline-none"
                placeholder="you@example.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-xit-gold-light via-xit-gold to-xit-gold-dark text-black font-semibold py-3 rounded-xl disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-xit-gold-light">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
