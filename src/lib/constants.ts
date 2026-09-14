export const WHITEPAPER_PDF_URL = '/XIT%20WHITEPAPER.pdf';
export const WHITEPAPER_PDF_DOWNLOAD_NAME = 'XIT-WHITEPAPER.pdf';

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
    description: '80% sellable immediately. 20% becomes Flexible Lock for 1 year (0.82% daily, 4X, not sellable until complete). 0.53% daily ROI on the 80%.',
  },
} as const;

export function isRoiHoldPlan(planType: string) {
  return planType === 'lock' || planType === 'flexible_lock';
}

export function planTypeLabel(planType: string) {
  if (planType === 'lock') return 'Lock 3X → 400';
  if (planType === 'flexible_lock') return 'Flexible Lock';
  return 'Flexible 2X → 300';
}

export function planTypeShortLabel(planType: string) {
  if (planType === 'lock') return 'Lock Plan';
  if (planType === 'flexible_lock') return 'Flexible Lock';
  return 'Flexible 2X';
}

export function planTypeBadgeClass(planType: string) {
  if (planType === 'lock') return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
  if (planType === 'flexible_lock') return 'bg-amber-500/20 text-amber-200 border border-amber-500/30';
  return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
}

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
  admin_grant: 'Admin XIT Grant',
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
  admin_grant: 'text-orange-400',
  withdraw: 'text-yellow-400',
};

export const PLATFORM_MODES = ['demo', 'testnet', 'real'] as const;

export const BSC_USDT_MAINNET = '0x55d398326f99059fF775485246999027B3197955';
export const BSC_USDT_TESTNET = '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd';
/** Client XIT BEP-20 on BSC mainnet */
export const XIT_BEP20_MAINNET = '0x5bd95D6605cE909D6455D487BEaAD10d3f8F7A17';

export const BSC_TESTNET_PRESET: Record<string, string> = {
  chain_id: '97',
  chain_name: 'BSC Testnet',
  rpc_url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  block_explorer_url: 'https://testnet.bscscan.com',
  payment_token_address: BSC_USDT_TESTNET,
  payment_token_symbol: 'USDT',
  payment_decimals: '18',
};

export const BSC_MAINNET_PRESET: Record<string, string> = {
  chain_id: '56',
  chain_name: 'BNB Smart Chain',
  rpc_url: 'https://bsc-dataseed.binance.org/',
  block_explorer_url: 'https://bscscan.com',
  payment_token_address: BSC_USDT_MAINNET,
  payment_token_symbol: 'USDT',
  payment_decimals: '18',
  bep20_contract_address: XIT_BEP20_MAINNET,
};
