export default function AdminStat({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    cyan: 'text-cyan-400',
    orange: 'text-orange-400',
  };

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">{label}</span>
        <Icon className={`w-4 h-4 ${colorMap[color]} opacity-70`} />
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}
