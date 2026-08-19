import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export function PageHero({
  badge,
  badgeIcon: BadgeIcon,
  title,
  subtitle,
  children,
}: {
  badge?: string;
  badgeIcon?: LucideIcon;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-[#1a1208] via-[#121820] to-[#0a0e17] p-6 sm:p-8">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 left-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-300 text-[11px] font-semibold uppercase tracking-wider mb-3">
              {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5" />}
              {badge}
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-gray-400 text-sm mt-2">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

export function HeroStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border px-4 py-3 min-w-[90px] ${accent ? 'border-orange-500/30 bg-orange-500/10' : 'border-gray-700 bg-gray-900/40'}`}>
      <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
      <p className={`text-lg font-bold mt-0.5 ${accent ? 'text-orange-300' : 'text-white'}`}>{value}</p>
    </div>
  );
}

export function TotalBanner({ label, value, suffix = 'XIT' }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-orange-500/25 bg-gradient-to-br from-[#1a1208] via-[#151820] to-[#0f1419] p-5 sm:p-6">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="relative">
        <p className="text-xs uppercase tracking-[0.15em] text-orange-300/70 font-medium">{label}</p>
        <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-300 via-amber-200 to-orange-400 bg-clip-text text-transparent tabular-nums mt-1">
          {value}
          <span className="text-orange-400/70 text-lg ml-2 font-semibold">{suffix}</span>
        </p>
      </div>
    </div>
  );
}

export function FilterPanel({ children, onClear, hasActiveFilters }: { children: React.ReactNode; onClear?: () => void; hasActiveFilters?: boolean }) {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 sm:p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">Filters</span>
        {hasActiveFilters && onClear && (
          <button onClick={onClear} className="flex items-center gap-1 text-xs text-gray-400 hover:text-orange-300 transition-colors">
            <X className="w-3.5 h-3.5" /> Clear all
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export function FilterChips({
  options,
  value,
  onChange,
  accent = 'emerald',
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  accent?: 'emerald' | 'orange' | 'purple' | 'blue';
}) {
  const activeClass = {
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20',
    orange: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20',
    purple: 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/20',
    blue: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20',
  }[accent];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
            value === opt.id ? activeClass : 'bg-gray-900/60 text-gray-400 border border-gray-700 hover:text-white hover:border-gray-600'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function PaginationBar({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-gray-800 bg-gray-900/20">
      <p className="text-xs text-gray-500">
        Showing {start}–{end} of {total}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum: number;
          if (totalPages <= 5) pageNum = i + 1;
          else if (page <= 3) pageNum = i + 1;
          else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
          else pageNum = page - 2 + i;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                page === pageNum ? 'bg-emerald-500 text-white' : 'border border-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle?: string }) {
  return (
    <div className="text-center py-16">
      <Icon className="w-12 h-12 text-gray-700 mx-auto mb-3" />
      <p className="text-gray-400 text-sm">{title}</p>
      {subtitle && <p className="text-gray-600 text-xs mt-1">{subtitle}</p>}
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="py-16 text-center">
      <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto" />
    </div>
  );
}

export function paginate<T>(items: T[], page: number, limit: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;
  return { items: items.slice(start, start + limit), total, totalPages, page: safePage };
}
