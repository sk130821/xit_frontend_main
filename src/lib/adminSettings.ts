export interface SettingItem {
  setting_key: string;
  setting_value: string;
  description: string;
}

export const BLOCKCHAIN_KEYS = new Set([
  'platform_mode',
  'token_name',
  'token_symbol',
  'token_price',
  'liquidity_amount',
  'bep20_contract_address',
  'token_decimals',
  'payment_token_address',
  'payment_token_symbol',
  'payment_decimals',
  'chain_id',
  'chain_name',
  'rpc_url',
  'block_explorer_url',
  'admin_treasury_wallet',
  'admin_payout_wallet',
]);

export function buildSettingsList(s: Record<string, string>): SettingItem[] {
  return [
    { setting_key: 'platform_mode', setting_value: s.platform_mode || 'demo', description: 'Platform mode: demo, testnet, or real' },
    { setting_key: 'token_name', setting_value: s.token_name || 'XIT Token', description: 'Token display name' },
    { setting_key: 'token_symbol', setting_value: s.token_symbol || 'XIT', description: 'Token symbol' },
    { setting_key: 'token_price', setting_value: s.token_price, description: 'Price per XIT token in USD/BNB equivalent' },
    { setting_key: 'liquidity_amount', setting_value: s.liquidity_amount || '0', description: 'Liquidity pool amount (display/admin record)' },
    { setting_key: 'bep20_contract_address', setting_value: s.bep20_contract_address || '', description: 'XIT BEP-20 token contract address' },
    { setting_key: 'token_decimals', setting_value: s.token_decimals || '18', description: 'XIT token decimal places' },
    { setting_key: 'payment_token_address', setting_value: s.payment_token_address || '', description: 'BEP-20 USDT contract (required for buy). Mainnet: 0x55d398326f99059fF775485246999027B3197955' },
    { setting_key: 'payment_token_symbol', setting_value: s.payment_token_symbol || 'USDT', description: 'Payment token symbol — use USDT (BNB native pay disabled)' },
    { setting_key: 'payment_decimals', setting_value: s.payment_decimals || '18', description: 'USDT decimals on BSC (usually 18)' },
    { setting_key: 'chain_id', setting_value: s.chain_id || '56', description: 'BSC chain ID (56=mainnet/real, 97=testnet)' },
    { setting_key: 'chain_name', setting_value: s.chain_name || 'BNB Smart Chain', description: 'Network display name' },
    { setting_key: 'rpc_url', setting_value: s.rpc_url || '', description: 'JSON-RPC URL (mainnet: https://bsc-dataseed.binance.org/)' },
    { setting_key: 'block_explorer_url', setting_value: s.block_explorer_url || 'https://bscscan.com', description: 'Block explorer base URL' },
    { setting_key: 'admin_treasury_wallet', setting_value: s.admin_treasury_wallet || '', description: 'Wallet that receives USDT buy payments from members' },
    { setting_key: 'admin_payout_wallet', setting_value: s.admin_payout_wallet || '', description: 'Wallet that sends tokens on sell (uses treasury if empty)' },
    { setting_key: 'referral_bonus_percent', setting_value: s.referral_bonus_percent || '5', description: 'Direct sponsor referral bonus % on token purchase' },
    { setting_key: 'min_referral_purchase', setting_value: s.min_referral_purchase || '100', description: 'Minimum purchase for referral bonus to trigger' },
    { setting_key: 'lock_period_days', setting_value: s.lock_period_days, description: 'Lock period in days for lock plan' },
    { setting_key: 'flexible_lock_days', setting_value: s.flexible_lock_days, description: 'Lock period for 20% locked in flexible plan' },
    { setting_key: 'min_purchase', setting_value: s.min_purchase || '1', description: 'Minimum token purchase amount' },
    { setting_key: 'min_investment', setting_value: s.min_investment || '1', description: 'Minimum investment amount' },
    { setting_key: 'flexible_min_tokens', setting_value: s.flexible_min_tokens || '100', description: 'Minimum tokens for Flexible plan and MLM income' },
    { setting_key: 'min_wallet_xit_for_income', setting_value: s.min_wallet_xit_for_income || '100', description: 'Minimum XIT in member wallet to receive level and reward income (ROI always pays)' },
    { setting_key: 'admin_charge_percent', setting_value: s.admin_charge_percent, description: 'Admin charge percentage on token sales' },
  ];
}

export function settingsToMap(items: SettingItem[]): Record<string, string> {
  const map: Record<string, string> = {};
  items.forEach((item) => (map[item.setting_key] = item.setting_value));
  return map;
}
