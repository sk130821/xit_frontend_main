export const PLAN_CONFIG = {
  lock: {
    name: 'Lock Plan (3X)',
    profitMultiplier: 3,
    totalMultiplier: 4,
    dailyRoi: 0.82,
    sellablePercent: 0,
    lockedPercent: 100,
    description: '100% locked until admin-set period. 3X profit — 100 tokens becomes 400 total with 0.82% daily ROI.',
  },
  flexible: {
    name: 'Flexible Plan (2X)',
    profitMultiplier: 2,
    totalMultiplier: 3,
    dailyRoi: 0.53,
    sellablePercent: 80,
    lockedPercent: 20,
    description: '80% sellable immediately, 20% locked for 1 year. 2X profit — 100 tokens becomes 300 total with 0.53% daily ROI.',
  },
} as const;

export function calcTotalReturn(amount: number, plan: typeof PLAN_CONFIG[keyof typeof PLAN_CONFIG]) {
  return amount * plan.totalMultiplier;
}

export const TRANSACTION_LABELS: Record<string, string> = {
  buy: 'Buy & Invest',
  sell: 'Token Sale',
  invest: 'Investment',
  roi: 'ROI Income',
  referral_bonus: 'Referral Bonus',
  level_bonus: 'Level Bonus',
  reward_bonus: 'Reward Bonus',
  commission: 'Commission',
  admin_credit: 'Admin Credit',
  admin_debit: 'Admin Debit',
  withdraw: 'Withdrawal',
};

export const TRANSACTION_COLORS: Record<string, string> = {
  buy: 'text-blue-400',
  sell: 'text-orange-400',
  invest: 'text-purple-400',
  roi: 'text-green-400',
  referral_bonus: 'text-cyan-400',
  level_bonus: 'text-teal-400',
  reward_bonus: 'text-yellow-400',
  commission: 'text-cyan-400',
  admin_credit: 'text-emerald-400',
  admin_debit: 'text-red-400',
  withdraw: 'text-yellow-400',
};

export const PLATFORM_MODES = ['demo', 'testnet', 'real'] as const;

export const BSC_TESTNET_PRESET: Record<string, string> = {
  chain_id: '97',
  chain_name: 'BSC Testnet',
  rpc_url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  block_explorer_url: 'https://testnet.bscscan.com',
  payment_token_symbol: 'BNB',
  payment_decimals: '18',
};

export const BSC_MAINNET_PRESET: Record<string, string> = {
  chain_id: '56',
  chain_name: 'BNB Smart Chain',
  rpc_url: 'https://bsc-dataseed.binance.org/',
  block_explorer_url: 'https://bscscan.com',
  payment_token_symbol: 'BNB',
  payment_decimals: '18',
};
