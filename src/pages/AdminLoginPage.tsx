import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BrandLogo from '@/components/BrandLogo';
import { ArrowRight, Eye, EyeOff, Home } from 'lucide-react';
import { api } from '@/lib/api';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminLoginPage() {
  const { loginWithToken } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data: any = await api.adminAuth.login({ email, password });
      await loginWithToken(data.token);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 relative overflow-hidden bg-grid">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-xit-blue/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-xit-gold/8 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <BrandLogo size="lg" className="mx-auto mb-3" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-xit-gold-light via-xit-gold to-xit-gold-dark bg-clip-text text-transparent">Admin Login</h1>
          <p className="text-xit-blue/70 mt-2 text-sm">XIT Token MLM Control Panel</p>
        </div>

        <div className="bg-black/60 backdrop-blur-xl border border-xit-gold/25 rounded-2xl p-8 shadow-xit-gold ring-1 ring-xit-blue/10">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-xit-gold/70 mb-1.5">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-xit-gold/20 rounded-xl px-4 py-3 text-white text-sm focus:border-xit-blue focus:ring-1 focus:ring-xit-blue/50 outline-none placeholder:text-gray-600"
                placeholder="admin@xit.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-xit-gold/70 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-xit-gold/20 rounded-xl px-4 pr-12 py-3 text-white text-sm focus:border-xit-blue focus:ring-1 focus:ring-xit-blue/50 outline-none placeholder:text-gray-600"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-xit-blue">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-xit-gold-light via-xit-gold to-xit-gold-dark hover:from-xit-gold hover:via-xit-gold-mid hover:to-xit-gold text-black font-semibold py-3 rounded-xl transition-all shadow-lg shadow-xit-gold/30 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <>Login to Admin Panel<ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs">
            <Link to="/" className="text-gray-500 hover:text-xit-gold-light transition-colors">Member Login →</Link>
            <Link to="/home" className="text-gray-500 hover:text-xit-blue flex items-center gap-1 transition-colors"><Home className="w-3.5 h-3.5" />Website</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
