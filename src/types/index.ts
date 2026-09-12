export interface User {
  id: number;
  username: string;
  email: string | null;
  phone: string | null;
  wallet_address: string | null;
  referral_code: string;
  sponsor_id: number | null;
  wallet_balance: number;
  xit_balance?: number;
  total_earned: number;
  total_invested: number;
  total_purchased?: number;
  plan_sellable?: number;
  plan_locked?: number;
  lock_roi_held?: number;
  platform_mode?: string;
  on_chain_xit_balance?: number | null;
  total_sellable?: number | null;
  is_active: boolean;
  created_at: string;
}

export interface Admin {
  id: number;
  username: string;
  email: string;
  created_at?: string;
}

export interface Investment {
  id: number;
  user_id: number;
  plan_type: 'lock' | 'flexible' | 'flexible_lock';
  token_amount: number;
  total_return: number;
  daily_roi_rate: number;
  roi_received: number;
  sellable_amount: number;
  locked_amount: number;
  start_date: string;
  end_date: string;
  last_roi_date: string;
  status: 'active' | 'completed' | 'cancelled';
  income_eligible?: boolean;
  created_at: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  type: 'buy' | 'sell' | 'invest' | 'roi' | 'referral_bonus' | 'level_bonus' | 'reward_bonus' | 'commission' | 'admin_credit' | 'admin_debit' | 'withdraw';
  amount: number;
  description: string | null;
  related_user_id: number | null;
  investment_id: number | null;
  tx_hash: string | null;
  chain_id: number | null;
  on_chain_status: 'pending' | 'confirmed' | 'failed' | 'demo' | null;
  created_at: string;
  plan_type?: 'lock' | 'flexible' | 'flexible_lock' | null;
  investment_token_amount?: number | null;
  investment_daily_roi?: number | null;
}

export interface BlockchainConfig {
  platformMode: string;
  bep20ContractAddress: string;
  paymentTokenAddress: string;
  paymentTokenSymbol: string;
  chainId: number;
  chainName: string;
  rpcUrl: string;
  blockExplorerUrl: string;
  adminTreasuryWallet: string;
  adminPayoutWallet: string;
  tokenDecimals: number;
  paymentDecimals: number;
  tokenPrice: number;
  tokenName: string;
  tokenSymbol: string;
  liquidityAmount: string;
  onChainBalance?: string | null;
  requiresWallet?: boolean;
  hasPrivateKey?: boolean;
  adminBalances?: {
    chainId: number;
    chainName: string;
    tokenSymbol: string;
    paymentSymbol: string;
    sameWallet: boolean;
    payout: { address: string | null; xit: string | null; usdt: string | null; bnb: string | null };
    treasury: { address: string | null; xit: string | null; usdt: string | null; bnb: string | null };
  };
}

export interface LevelBonusRate {
  level: number;
  percentage: number;
  updated_at: string;
}

export interface RewardTier {
  id: number;
  tier_name: string;
  min_volume: number;
  required_directs: number;
  percentage: number;
}

export interface ReferralNetworkMember {
  user_id: number;
  username: string;
  email: string;
  level: number;
  is_direct?: boolean;
  wallet_balance: number;
  is_active: boolean;
  created_at: string;
  total_invested: number;
  total_purchased: number;
  self_business: number;
  team_business: number;
  total_business: number;
}

export interface NetworkLevelStat {
  level: number;
  members: number;
  self_business: number;
  team_business: number;
  total_business: number;
  active_investment: number;
  level_bonus_percent: number;
  estimated_daily_downline_roi: number;
  estimated_daily_level_income: number;
  received_level_income: number;
}

export interface NetworkSummary {
  total_members: number;
  active_members: number;
  direct_count: number;
  direct_self_business: number;
  total_self_business: number;
  total_team_business: number;
  estimated_daily_level_income?: number;
  level_stats: NetworkLevelStat[];
}

export interface NetworkResponse {
  members: ReferralNetworkMember[];
  summary: NetworkSummary;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  phone: string | null;
  wallet_address: string | null;
  referral_code: string;
  xit_balance: number;
  plan_tokens: number;
  plan_sellable: number;
  plan_locked: number;
  total_xit: number;
  plan_types: string[];
  total_earned: number;
  total_invested: number;
  total_purchased: number;
  is_active: boolean;
  created_at: string;
  sponsor_name: string | null;
  sponsor_code: string | null;
  direct_count: number;
  team_size: number;
  member_status: 'invested' | 'not_invested';
}

export interface AdminUsersSummary {
  total_members: number;
  active_members: number;
  with_investment: number;
  total_purchased: number;
  total_xit_free: number;
  total_plan_tokens: number;
  total_xit: number;
}

export interface AdminUsersResponse {
  summary: AdminUsersSummary;
  users: AdminUser[];
}

export interface AdminMemberDetail {
  user: AdminUser & {
    buy_tx_count: number;
    total_income: number;
  };
  investments: Investment[];
  income: Transaction[];
  team: Array<{
    id: number;
    username: string;
    email: string;
    referral_code: string;
    total_invested: number;
    total_purchased: number;
    is_active: boolean;
    created_at: string;
    level: number;
  }>;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DirectLegBusiness {
  user_id: number;
  username: string;
  self_business: number;
  team_business: number;
  total_business: number;
}

export interface RewardStatus {
  direct_count: number;
  direct_volume: number;
  direct_legs: DirectLegBusiness[];
  current_tier: { id: number; tier_name: string; percentage: number } | null;
  tiers: (RewardTier & { qualified: boolean; qualifying_count: number })[];
}
