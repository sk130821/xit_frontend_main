import { Check, AlertCircle } from 'lucide-react';

export default function AdminMessage({ message }: { message: { type: 'success' | 'error'; text: string } | null }) {
  if (!message) return null;

  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
        message.type === 'success'
          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
          : 'bg-red-500/10 border border-red-500/30 text-red-400'
      }`}
    >
      {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {message.text}
    </div>
  );
}
