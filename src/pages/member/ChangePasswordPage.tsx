import { useState } from 'react';
import { KeyRound, Eye, EyeOff, Check, AlertCircle, Shield, Lock } from 'lucide-react';
import { api } from '@/lib/api';
import { PageHero } from '@/components/member/MemberUI';

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      await api.auth.changePassword(currentPassword, newPassword);
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const strength = newPassword.length >= 8 ? 'strong' : newPassword.length >= 6 ? 'medium' : newPassword.length > 0 ? 'weak' : 'none';

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHero badge="Account Security" badgeIcon={Shield} title="Change Password" subtitle="Update your login password to keep your account secure" />

      {message && (
        <div className={`flex items-center gap-2 rounded-2xl px-5 py-4 text-sm ${
          message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-3xl border border-gray-800 bg-[#111827] p-6 sm:p-8 space-y-5">
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex items-center gap-3 pb-4 border-b border-gray-800">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <KeyRound className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Update Password</h3>
            <p className="text-xs text-gray-500">Minimum 6 characters required</p>
          </div>
        </div>

        <PasswordField label="Current Password" value={currentPassword} onChange={setCurrentPassword} show={show} onToggle={() => setShow(!show)} />
        <PasswordField label="New Password" value={newPassword} onChange={setNewPassword} show={show} onToggle={() => setShow(!show)} />
        <PasswordField label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} show={show} onToggle={() => setShow(!show)} />

        {newPassword.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-500">Password strength</span>
              <span className={strength === 'strong' ? 'text-emerald-400' : strength === 'medium' ? 'text-amber-400' : 'text-red-400'}>
                {strength === 'none' ? '' : strength.charAt(0).toUpperCase() + strength.slice(1)}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden flex gap-0.5">
              <div className={`h-full flex-1 rounded-full transition-all ${newPassword.length >= 1 ? (strength === 'weak' ? 'bg-red-500' : strength === 'medium' ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-gray-800'}`} />
              <div className={`h-full flex-1 rounded-full transition-all ${newPassword.length >= 6 ? (strength === 'medium' ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-gray-800'}`} />
              <div className={`h-full flex-1 rounded-full transition-all ${strength === 'strong' ? 'bg-emerald-500' : 'bg-gray-800'}`} />
            </div>
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full relative overflow-hidden bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-semibold py-3.5 rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2">
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Update Password
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, onToggle }: {
  label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
      <div className="relative">
        <input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-900/60 border border-gray-700 rounded-xl px-4 py-3 pr-12 text-white text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all" required />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
