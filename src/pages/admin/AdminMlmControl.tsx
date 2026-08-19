import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Gift, Layers, Award } from 'lucide-react';
import { api } from '@/lib/api';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { BLOCKCHAIN_KEYS, buildSettingsList, settingsToMap, type SettingItem } from '@/lib/adminSettings';
import AdminMessage from '@/components/AdminMessage';
import type { LevelBonusRate, RewardTier } from '@/types';

export default function AdminMlmControl() {
  const { admin } = useAdminAuth();
  const [levelRates, setLevelRates] = useState<LevelBonusRate[]>([]);
  const [rewardTiers, setRewardTiers] = useState<RewardTier[]>([]);
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [settingValues, setSettingValues] = useState<Record<string, string>>({});
  const [editingLevel, setEditingLevel] = useState<number | null>(null);
  const [levelValue, setLevelValue] = useState('');
  const [editingTier, setEditingTier] = useState<number | null>(null);
  const [tierForm, setTierForm] = useState({ tierName: '', minVolume: '', requiredDirects: '3', percentage: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (admin) loadData();
  }, [admin]);

  const loadData = async () => {
    try {
      const [ratesData, tiersData, settingsMap] = await Promise.all([
        api.admin.levelBonusRates(),
        api.admin.rewardTiers(),
        api.user.settings(),
      ]);
      setLevelRates(ratesData as LevelBonusRate[]);
      setRewardTiers(tiersData as RewardTier[]);

      const items = buildSettingsList(settingsMap as Record<string, string>).filter(
        (s) => !BLOCKCHAIN_KEYS.has(s.setting_key)
      );
      setSettings(items);
      setSettingValues(settingsToMap(items));
    } catch (err) {
      console.error('MLM control load error:', err);
    }
  };

  const updateLevelBonus = async (level: number) => {
    setLoading(true);
    setMessage(null);
    try {
      await api.admin.updateLevelBonus(level, parseFloat(levelValue));
      setMessage({ type: 'success', text: `Level ${level} ROI bonus updated to ${levelValue}%` });
      setEditingLevel(null);
      await loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const updateRewardTier = async (id: number) => {
    setLoading(true);
    setMessage(null);
    try {
      await api.admin.updateRewardTier(
        id,
        tierForm.tierName,
        parseFloat(tierForm.minVolume),
        parseInt(tierForm.requiredDirects),
        parseFloat(tierForm.percentage)
      );
      setMessage({ type: 'success', text: 'Reward tier updated successfully' });
      setEditingTier(null);
      await loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
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

  if (!admin) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">MLM Control</h1>
        <p className="text-gray-400 text-sm mt-1">Income types, plans, limits and commission structure</p>
      </div>

      <AdminMessage message={message} />

      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <SettingsIcon className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Platform Settings</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settings.map((setting) => (
            <div key={setting.setting_key} className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <label className="block text-sm text-gray-300 font-medium mb-1">
                {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </label>
              <p className="text-xs text-gray-500 mb-3">{setting.description}</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settingValues[setting.setting_key] || ''}
                  onChange={(e) => setSettingValues({ ...settingValues, [setting.setting_key]: e.target.value })}
                  className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
                <button
                  onClick={() => updateSetting(setting.setting_key)}
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Gift className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Referral Bonus (Income Type 1)</h3>
        </div>
        <p className="text-gray-400 text-sm">
          Direct sponsor gets {settingValues.referral_bonus_percent || '5'}% when downline buys ≥
          {settingValues.min_referral_purchase || '100'} tokens. Edit values in Platform Settings above.
        </p>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Layers className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Level Bonus on ROI (Income Type 2)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {levelRates.map((rate) => (
            <div key={rate.level} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Level {rate.level}</span>
                {editingLevel !== rate.level && (
                  <button
                    onClick={() => {
                      setEditingLevel(rate.level);
                      setLevelValue(String(rate.percentage));
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </button>
                )}
              </div>
              {editingLevel === rate.level ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={levelValue}
                    onChange={(e) => setLevelValue(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-white focus:border-emerald-500 outline-none"
                  />
                  <button
                    onClick={() => updateLevelBonus(rate.level)}
                    disabled={loading}
                    className="bg-emerald-500 text-white px-2 py-1.5 rounded-lg text-xs"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <p className="text-xl font-bold text-emerald-400">{Number(rate.percentage)}%</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Award className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Reward Bonus Tiers (Income Type 3)</h3>
        </div>
        <p className="text-gray-400 text-sm mb-4">Requires 3+ direct referrals. Bonus = % of member's own ROI when claiming.</p>
        <div className="space-y-3">
          {rewardTiers.map((tier) => (
            <div key={tier.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              {editingTier === tier.id ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <input
                    placeholder="Name"
                    value={tierForm.tierName}
                    onChange={(e) => setTierForm({ ...tierForm, tierName: e.target.value })}
                    className="bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none"
                  />
                  <input
                    placeholder="Min Volume"
                    type="number"
                    value={tierForm.minVolume}
                    onChange={(e) => setTierForm({ ...tierForm, minVolume: e.target.value })}
                    className="bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none"
                  />
                  <input
                    placeholder="Directs Required"
                    type="number"
                    value={tierForm.requiredDirects}
                    onChange={(e) => setTierForm({ ...tierForm, requiredDirects: e.target.value })}
                    className="bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none"
                  />
                  <input
                    placeholder="ROI %"
                    type="number"
                    step="0.01"
                    value={tierForm.percentage}
                    onChange={(e) => setTierForm({ ...tierForm, percentage: e.target.value })}
                    className="bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none"
                  />
                  <button
                    onClick={() => updateRewardTier(tier.id)}
                    disabled={loading}
                    className="bg-yellow-500 text-black px-3 py-2 rounded-lg text-sm font-medium"
                  >
                    Save
                  </button>
                  <button onClick={() => setEditingTier(null)} className="text-gray-400 text-sm">
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{tier.tier_name}</p>
                    <p className="text-xs text-gray-500">
                      {tier.required_directs} directs · {(tier.min_volume / 1000).toFixed(0)}K volume
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-yellow-400 font-bold">{tier.percentage}% of ROI</span>
                    <button
                      onClick={() => {
                        setEditingTier(tier.id);
                        setTierForm({
                          tierName: tier.tier_name,
                          minVolume: String(tier.min_volume),
                          requiredDirects: String(tier.required_directs),
                          percentage: String(tier.percentage),
                        });
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
