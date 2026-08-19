import { LucideIcon } from 'lucide-react';

export function AdminPageHero({
  badge,
  badgeIcon: BadgeIcon,
  title,
  subtitle,
  children,
}: {
  badge: string;
  badgeIcon: LucideIcon;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-[#0d1525] via-[#111827] to-[#0a0e17] p-6 sm:p-8">
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-[11px] font-semibold uppercase tracking-wider mb-3">
            <BadgeIcon className="w-3.5 h-3.5" />
            {badge}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
          <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AdminSummaryCard({
  label,
  value,
  sub,
  icon: Icon,
  color = 'blue',
}: {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  color?: 'blue' | 'emerald' | 'orange' | 'purple' | 'cyan' | 'amber';
}) {
  const styles = {
    blue: 'border-blue-500/25 from-blue-600/10 text-blue-300',
    emerald: 'border-emerald-500/25 from-emerald-600/10 text-emerald-300',
    orange: 'border-orange-500/25 from-orange-600/10 text-orange-300',
    purple: 'border-purple-500/25 from-purple-600/10 text-purple-300',
    cyan: 'border-cyan-500/25 from-cyan-600/10 text-cyan-300',
    amber: 'border-amber-500/25 from-amber-600/10 text-amber-300',
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br to-[#111827] p-5 ${styles[color]}`}>
      <div className="flex items-start justify-between mb-3">
        <Icon className={`w-5 h-5 opacity-80 ${styles[color].split(' ').pop()}`} />
      </div>
      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

export function AdminFilterBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 flex flex-wrap gap-3 items-end">
      {children}
    </div>
  );
}

export function AdminFilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 min-w-[140px]">
      <label className="text-[10px] uppercase tracking-wider text-gray-500">{label}</label>
      {children}
    </div>
  );
}

export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`bg-gray-900/60 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50 ${props.className || ''}`}
    />
  );
}

export function AdminSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`bg-gray-900/60 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50 ${props.className || ''}`}
    />
  );
}

export function AdminPagination({
  page,
  totalPages,
  total,
  onPage,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
      <p className="text-xs text-gray-500">{total} records · Page {page} of {totalPages}</p>
      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="px-3 py-1.5 rounded-lg text-xs border border-gray-700 text-gray-400 disabled:opacity-40 hover:border-blue-500/40 hover:text-blue-300"
        >
          Previous
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
          className="px-3 py-1.5 rounded-lg text-xs border border-gray-700 text-gray-400 disabled:opacity-40 hover:border-blue-500/40 hover:text-blue-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function fmtDate(d: string | Date) {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function fmtDateTime(d: string | Date) {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function fmtNum(n: number, digits = 2) {
  return Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
