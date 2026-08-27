function resolveApiUrl(): string {
  if (typeof window !== 'undefined') {
    const { hostname, protocol } = window.location;

    if (hostname === 'xittoken.co' || hostname === 'www.xittoken.co') {
      return 'https://back.xittoken.co/api';
    }

    if (hostname === 'back.xittoken.co') {
      return `${protocol}//${hostname}/api`;
    }
  }

  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
}

const API_URL = resolveApiUrl();

const USER_TOKEN_KEY = 'xit_token';
const ADMIN_TOKEN_KEY = 'xit_admin_token';

function getToken(): string | null {
  return localStorage.getItem(USER_TOKEN_KEY);
}

function setToken(token: string) {
  localStorage.setItem(USER_TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(USER_TOKEN_KEY);
}

function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

async function request<T = any>(path: string, options: RequestInit = {}, useAdmin = false): Promise<T> {
  const token = useAdmin ? getAdminToken() : getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }

  return data as T;
}

function adminRequest<T = any>(path: string, options: RequestInit = {}) {
  return request<T>(path, options, true);
}

export const api = {
  request,
  adminRequest,
  getToken,
  setToken,
  clearToken,
  getAdminToken,
  setAdminToken,
  clearAdminToken,

  auth: {
    signup: (body: { username: string; email: string; password: string; referralCode: string }) =>
      request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
    verifyReferral: (code: string) =>
      request(`/auth/verify-referral?code=${encodeURIComponent(code)}`),
    login: (body: { email: string; password: string }) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    walletStatus: (address: string) =>
      request(`/auth/wallet-status?address=${encodeURIComponent(address)}`),
    walletLogin: (body: {
      address: string;
      signature: string;
      timestamp: number;
      referralCode?: string;
    }) => request('/auth/wallet-login', { method: 'POST', body: JSON.stringify(body) }),
    forgotPassword: (email: string) =>
      request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (token: string, newPassword: string) =>
      request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword }) }),
    me: () => request('/auth/me'),
    changePassword: (currentPassword: string, newPassword: string) =>
      request('/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) }),
  },

  adminAuth: {
    login: (body: { email: string; password: string }) =>
      request('/admin/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    me: () => adminRequest('/admin/auth/me'),
  },

  tokens: {
    buy: (tokenAmount: number, planType: 'lock' | 'flexible') =>
      request('/tokens/buy', { method: 'POST', body: JSON.stringify({ tokenAmount, planType }) }),
  },

  investments: {
    create: (tokenAmount: number, planType: string) =>
      request('/investments/create', { method: 'POST', body: JSON.stringify({ tokenAmount, planType }) }),
    claimRoi: (investmentId: number) =>
      request('/investments/claim-roi', { method: 'POST', body: JSON.stringify({ investmentId }) }),
    list: () => request('/investments/list'),
    sell: (tokenAmount: number, txHash?: string, investmentId?: number) =>
      request('/investments/sell', {
        method: 'POST',
        body: JSON.stringify({ tokenAmount, txHash, investmentId }),
      }),
  },

  user: {
    network: () => request<import('@/types').NetworkResponse>('/user/network'),
    transactions: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<{ items: import('@/types').Transaction[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(`/user/transactions${qs}`);
    },
    levelBonusRates: () => request('/user/level-bonus-rates'),
    rewardTiers: () => request('/user/reward-tiers'),
    rewardStatus: () => request('/user/reward-status'),
    settings: () => request('/user/settings'),
  },

  admin: {
    stats: () => adminRequest('/admin/stats'),
    users: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return adminRequest(`/admin/users${qs}`);
    },
    userDetail: (id: number) => adminRequest(`/admin/users/${id}`),
    loginAsUser: (targetId: number) =>
      adminRequest('/admin/login-as-user', { method: 'POST', body: JSON.stringify({ targetId }) }),
    changePassword: (targetId: number, password: string) =>
      adminRequest('/admin/change-password', { method: 'POST', body: JSON.stringify({ targetId, password }) }),
    levelBonusRates: () => adminRequest('/admin/level-bonus-rates'),
    rewardTiers: () => adminRequest('/admin/reward-tiers'),
    creditDebit: (targetId: number, amount: number, action: string) =>
      adminRequest('/admin/credit-debit', { method: 'POST', body: JSON.stringify({ targetId, amount, action }) }),
    toggleActivation: (targetId: number, activate: boolean) =>
      adminRequest('/admin/toggle-activation', { method: 'POST', body: JSON.stringify({ targetId, activate }) }),
    updateLevelBonus: (level: number, percentage: number) =>
      adminRequest('/admin/update-level-bonus', { method: 'POST', body: JSON.stringify({ level, percentage }) }),
    updateRewardTier: (id: number, tierName: string, minVolume: number, requiredDirects: number, percentage: number) =>
      adminRequest('/admin/update-reward-tier', { method: 'POST', body: JSON.stringify({ id, tierName, minVolume, requiredDirects, percentage }) }),
    updateSetting: (key: string, value: string) =>
      adminRequest('/admin/update-setting', { method: 'POST', body: JSON.stringify({ key, value }) }),
    blockchainStatus: () => adminRequest('/blockchain/admin-status'),
    payoutPreview: (date?: string) => {
      const qs = date ? `?date=${encodeURIComponent(date)}` : '';
      return adminRequest(`/admin/payout/preview${qs}`);
    },
    payoutDebug: (date?: string) => {
      const qs = date ? `?date=${encodeURIComponent(date)}` : '';
      return adminRequest(`/admin/payout/debug${qs}`);
    },
    runPayout: (payoutDate?: string) =>
      adminRequest('/admin/payout/run', {
        method: 'POST',
        body: JSON.stringify(payoutDate ? { payoutDate } : {}),
      }),
    payoutRuns: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return adminRequest(`/admin/payout/runs${qs}`);
    },
    payoutDaily: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return adminRequest(`/admin/payout/daily${qs}`);
    },
    tradeHistory: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return adminRequest(`/admin/trades/history${qs}`);
    },
    tradeDaily: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return adminRequest(`/admin/trades/daily${qs}`);
    },
    businessReport: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return adminRequest(`/admin/reports/business${qs}`);
    },
  },

  blockchain: {
    config: () => request('/blockchain/config'),
    walletBalance: () => request('/blockchain/wallet-balance'),
    linkWallet: (walletAddress: string) =>
      request('/blockchain/link-wallet', { method: 'POST', body: JSON.stringify({ walletAddress }) }),
    verifyBuy: (txHash: string, tokenAmount: number, planType: 'lock' | 'flexible') =>
      request('/blockchain/verify-buy', { method: 'POST', body: JSON.stringify({ txHash, tokenAmount, planType }) }),
  },
};
