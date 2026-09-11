import { useState, useEffect } from 'react';
import { Link2, Save, Wallet, CheckCircle2, FlaskConical, Globe, Zap } from 'lucide-react';
import { api } from '@/lib/api';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { PLATFORM_MODES, BSC_TESTNET_PRESET, BSC_MAINNET_PRESET } from '@/lib/constants';
import { BLOCKCHAIN_KEYS, buildSettingsList, settingsToMap, type SettingItem } from '@/lib/adminSettings';
import AdminMessage from '@/components/AdminMessage';
import type { BlockchainConfig } from '@/types';

export default function AdminBlockchain() {
  const { admin } = useAdminAuth();
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [settingValues, setSettingValues] = useState<Record<string, string>>({});
  const [blockchainStatus, setBlockchainStatus] = useState<BlockchainConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (admin) loadData();
  }, [admin]);

  const loadData = async () => {
    try {
      const [settingsMap, chainStatus] = await Promise.all([
        api.user.settings(),
        api.admin.blockchainStatus(),
      ]);
      const items = buildSettingsList(settingsMap as Record<string, string>).filter((s) =>
        BLOCKCHAIN_KEYS.has(s.setting_key)
      );
      setSettings(items);
      setSettingValues(settingsToMap(items));
      setBlockchainStatus(chainStatus as BlockchainConfig);
    } catch (err) {
      console.error('Blockchain settings load error:', err);
    }
  };

  const updateSetting = async (key: string) => {
    setLoading(true);
    setMessage(null);
    try {
      await api.admin.updateSetting(key, settingValues[key]);
      setMessage({ type: 'success', text: `Setting "${key}" updated successfully` });
      await loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const applyNetworkPreset = async (preset: typeof BSC_TESTNET_PRESET, mode: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const updates = { ...preset, platform_mode: mode };
      for (const [key, value] of Object.entries(updates)) {
        await api.admin.updateSetting(key, value);
      }
      setMessage({ type: 'success', text: `${preset.chain_name || mode} preset applied (${mode} mode)` });
      await loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!admin) return null;

  const activeMode = (settingValues.platform_mode || 'demo').toLowerCase();

  const setPlatformMode = async (mode: string) => {
    setLoading(true);
    setMessage(null);
    try {
      await api.admin.updateSetting('platform_mode', mode);
      setSettingValues({ ...settingValues, platform_mode: mode });
      setMessage({ type: 'success', text: `${mode.charAt(0).toUpperCase() + mode.slice(1)} mode activated` });
      await loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Blockchain & Wallet Configuration</h1>
        <p className="text-gray-400 text-sm mt-1">Platform mode, token contract, network and wallet addresses</p>
      </div>

      <AdminMessage message={message} />

      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">Platform Mode</h3>
            <p className="text-xs text-gray-500 mt-0.5">Currently active mode is highlighted below</p>
          </div>
          <ActiveModeBadge mode={activeMode} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <ModeCard
            mode="demo"
            activeMode={activeMode}
            title="Demo Mode"
            description="Free internal tokens — no MetaMask required"
            icon={FlaskConical}
            onSelect={() => setPlatformMode('demo')}
            loading={loading}
          />
          <ModeCard
            mode="testnet"
            activeMode={activeMode}
            title="Testnet Mode"
            description="BSC Testnet — real tx flow, no real money"
            icon={Zap}
            onSelect={() => applyNetworkPreset(BSC_TESTNET_PRESET, 'testnet')}
            loading={loading}
          />
          <ModeCard
            mode="real"
            activeMode={activeMode}
            title="Real Mode"
            description="BSC Mainnet — production with real funds"
            icon={Globe}
            onSelect={() => applyNetworkPreset(BSC_MAINNET_PRESET, 'real')}
            loading={loading}
          />
        </div>
      </div>

      <div className="bg-[#111827] border border-orange-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Link2 className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Network & Wallets</h3>
        </div>

        {blockchainStatus && (
          <div className="space-y-4 mb-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-sm text-gray-400">
                Admin on-chain balances · {blockchainStatus.chainName || 'Network'} (id {blockchainStatus.chainId})
              </p>
              <button
                type="button"
                onClick={() => loadData()}
                className="text-xs text-orange-400 hover:text-orange-300 border border-orange-500/30 rounded-lg px-3 py-1.5"
              >
                Refresh balances
              </button>
            </div>

            {(() => {
              const bal = blockchainStatus.adminBalances;
              const fmt = (v: string | null | undefined, digits = 4) => {
                if (v == null || v === '') return '—';
                const n = Number(v);
                if (!Number.isFinite(n)) return v;
                return n.toLocaleString(undefined, { maximumFractionDigits: digits });
              };
              const payout = bal?.payout;
              const treasury = bal?.treasury;
              const same = bal?.sameWallet ?? true;
              const xitSym = bal?.tokenSymbol || blockchainStatus.tokenSymbol || 'XIT';
              const paySym = bal?.paymentSymbol || blockchainStatus.paymentTokenSymbol || 'USDT';

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-orange-500/20 space-y-3">
                    <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
                      Payout wallet {same ? '(treasury same)' : ''}
                    </p>
                    <p className="text-[11px] font-mono text-gray-500 truncate">
                      {payout?.address || blockchainStatus.adminPayoutWallet || 'Not set'}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-[10px] text-gray-500">{xitSym}</p>
                        <p className="text-base font-bold text-white">{fmt(payout?.xit ?? blockchainStatus.onChainBalance)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500">{paySym}</p>
                        <p className="text-base font-bold text-emerald-400">{fmt(payout?.usdt)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500">BNB</p>
                        <p className="text-base font-bold text-yellow-400">{fmt(payout?.bnb, 6)}</p>
                      </div>
                    </div>
                  </div>

                  {!same && (
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-cyan-500/20 space-y-3">
                      <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Treasury wallet</p>
                      <p className="text-[11px] font-mono text-gray-500 truncate">
                        {treasury?.address || blockchainStatus.adminTreasuryWallet || 'Not set'}
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-[10px] text-gray-500">{xitSym}</p>
                          <p className="text-base font-bold text-white">{fmt(treasury?.xit)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500">{paySym}</p>
                          <p className="text-base font-bold text-emerald-400">{fmt(treasury?.usdt)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500">BNB</p>
                          <p className="text-base font-bold text-yellow-400">{fmt(treasury?.bnb, 6)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 md:col-span-2 flex flex-wrap gap-4 items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Admin Private Key (.env)</p>
                      <p className={`text-sm font-semibold ${blockchainStatus.hasPrivateKey ? 'text-emerald-400' : 'text-red-400'}`}>
                        {blockchainStatus.hasPrivateKey ? 'Configured' : 'Not set — add ADMIN_PRIVATE_KEY to backend .env'}
                      </p>
                    </div>
                    <p className="text-[11px] text-gray-500 max-w-md">
                      XIT = members ko buy/ROI bhejne ke liye · {paySym} = buy payments · BNB = gas.
                      Failed buy (USDT paid, XIT not received): member Buy page → “Already paid USDT? Complete purchase” with same amount/plan + tx hash — no second payment.
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settings.map((setting) => (
            <div
              key={setting.setting_key}
              className={`bg-gray-900/50 rounded-xl p-4 border ${setting.setting_key.includes('wallet') ? 'border-orange-500/20' : 'border-gray-800'}`}
            >
              <label className="block text-sm text-gray-300 font-medium mb-1 flex items-center gap-1.5">
                {setting.setting_key.includes('wallet') && <Wallet className="w-3.5 h-3.5 text-orange-400" />}
                {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </label>
              <p className="text-xs text-gray-500 mb-3">{setting.description}</p>
              <div className="flex gap-2">
                {setting.setting_key === 'platform_mode' ? (
                  <div className="flex-1 flex items-center gap-2">
                    <select
                      value={settingValues[setting.setting_key] || 'demo'}
                      onChange={(e) => setSettingValues({ ...settingValues, [setting.setting_key]: e.target.value })}
                      className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none"
                    >
                      {PLATFORM_MODES.map((m) => (
                        <option key={m} value={m}>
                          {m.charAt(0).toUpperCase() + m.slice(1)} Mode
                        </option>
                      ))}
                    </select>
                    <ActiveModeBadge mode={activeMode} small />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={settingValues[setting.setting_key] || ''}
                    onChange={(e) => setSettingValues({ ...settingValues, [setting.setting_key]: e.target.value })}
                    className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-orange-500 outline-none"
                    placeholder={setting.setting_key.includes('wallet') ? '0x...' : ''}
                  />
                )}
                <button
                  onClick={() => updateSetting(setting.setting_key)}
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-400 text-white px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MODE_STYLES: Record<string, { bg: string; border: string; text: string; glow: string; label: string }> = {
  demo: {
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500 ring-2 ring-emerald-500/40',
    text: 'text-emerald-400',
    glow: 'shadow-lg shadow-emerald-500/20',
    label: 'Demo',
  },
  testnet: {
    bg: 'bg-yellow-500/15',
    border: 'border-yellow-500 ring-2 ring-yellow-500/40',
    text: 'text-yellow-400',
    glow: 'shadow-lg shadow-yellow-500/20',
    label: 'Testnet',
  },
  real: {
    bg: 'bg-red-500/15',
    border: 'border-red-500 ring-2 ring-red-500/40',
    text: 'text-red-400',
    glow: 'shadow-lg shadow-red-500/20',
    label: 'Real',
  },
};

function ActiveModeBadge({ mode, small }: { mode: string; small?: boolean }) {
  const style = MODE_STYLES[mode] || MODE_STYLES.demo;
  const dotColor = mode === 'testnet' ? 'bg-yellow-400' : mode === 'real' ? 'bg-red-400' : 'bg-emerald-400';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${style.bg} ${style.text} border ${
        mode === 'testnet' ? 'border-yellow-500/50' : mode === 'real' ? 'border-red-500/50' : 'border-emerald-500/50'
      } ${small ? 'px-2.5 py-1 text-xs' : 'px-4 py-1.5 text-sm'}`}
    >
      <span className={`w-2 h-2 rounded-full ${dotColor} animate-pulse`} />
      Active: {style.label}
    </span>
  );
}

function ModeCard({
  mode,
  activeMode,
  title,
  description,
  icon: Icon,
  onSelect,
  loading,
}: {
  mode: string;
  activeMode: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
  loading: boolean;
}) {
  const isActive = activeMode === mode;
  const style = MODE_STYLES[mode] || MODE_STYLES.demo;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={loading}
      className={`relative text-left rounded-xl p-4 border transition-all disabled:opacity-50 ${
        isActive
          ? `${style.bg} ${style.border} ${style.glow}`
          : 'bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-900/70'
      }`}
    >
      {isActive && (
        <span className={`absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold ${style.text}`}>
          <CheckCircle2 className="w-4 h-4" />
          Active
        </span>
      )}
      <Icon className={`w-6 h-6 mb-2 ${isActive ? style.text : 'text-gray-500'}`} />
      <p className={`font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>{title}</p>
      <p className="text-xs text-gray-500 mt-1 pr-12">{description}</p>
    </button>
  );
}
