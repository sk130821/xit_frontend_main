import { ethers } from 'ethers';

export const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

export const BSC_TESTNET = {
  chainId: 97,
  chainName: 'BSC Testnet',
  rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  explorerUrl: 'https://testnet.bscscan.com',
};

export const BSC_MAINNET = {
  chainId: 56,
  chainName: 'BNB Smart Chain',
  rpcUrl: 'https://bsc-dataseed.binance.org/',
  explorerUrl: 'https://bscscan.com',
};

/** Official USDT only — never accept random “USDT” contracts */
export const OFFICIAL_USDT: Record<number, string> = {
  56: '0x55d398326f99059fF775485246999027B3197955',
  97: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
};

export function resolveOfficialUsdt(chainId: number): string {
  const addr = OFFICIAL_USDT[Number(chainId)];
  if (!addr) {
    throw new Error(`No official USDT for chain ${chainId}. Use BNB Smart Chain (56).`);
  }
  return addr.toLowerCase();
}

export function shortenAddress(addr: string) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export async function switchNetwork(chainId: number, chainName: string, rpcUrl: string) {
  if (!window.ethereum) throw new Error('MetaMask not installed');

  const hexChainId = `0x${chainId.toString(16)}`;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: hexChainId }],
    });
  } catch (err: any) {
    if (err.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: hexChainId,
          chainName,
          rpcUrls: [rpcUrl],
          nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
          blockExplorerUrls: chainId === 56
            ? ['https://bscscan.com']
            : ['https://testnet.bscscan.com'],
        }],
      });
    } else {
      throw err;
    }
  }
}

/** Ensure wallet is on the platform chain (never Ethereum mainnet for XIT buys). */
export async function ensurePlatformNetwork(chainId: number, chainName: string, rpcUrl: string) {
  if (!window.ethereum) throw new Error('MetaMask not installed');
  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== Number(chainId)) {
    await switchNetwork(chainId, chainName, rpcUrl);
  }
}

export async function connectWallet(): Promise<string> {
  if (!window.ethereum) throw new Error('MetaMask not installed');
  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);
  return String(accounts[0]).toLowerCase();
}

/** Active injected wallet address (lowercase), or null if not connected. */
export async function getActiveWalletAddress(): Promise<string | null> {
  if (!window.ethereum) return null;
  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send('eth_accounts', []);
  if (!accounts?.[0]) return null;
  return String(accounts[0]).toLowerCase();
}

/**
 * Pay treasury in USDT (BEP-20) only — native BNB/ETH payments are disabled.
 */
export async function sendPayment(
  treasuryWallet: string,
  paymentAmount: string,
  paymentTokenAddress: string,
  paymentDecimals: number,
  network?: { chainId: number; chainName: string; rpcUrl: string },
  expectedPayer?: string | null,
): Promise<string> {
  if (!window.ethereum) throw new Error('MetaMask not installed');

  if (!paymentTokenAddress || !/^0x[a-fA-F0-9]{40}$/i.test(paymentTokenAddress)) {
    throw new Error(
      'USDT payment token is not configured. Admin must set payment_token_address (BSC USDT).'
    );
  }

  if (network) {
    await ensurePlatformNetwork(network.chainId, network.chainName, network.rpcUrl);
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const net = await provider.getNetwork();
  const activeChainId = network ? Number(network.chainId) : Number(net.chainId);

  if (network && Number(net.chainId) !== Number(network.chainId)) {
    throw new Error(
      `Wrong network. Switch MetaMask to ${network.chainName} (chain ${network.chainId}), not Ethereum.`
    );
  }

  // Reject fake USDT — only official contract for this chain
  const official = resolveOfficialUsdt(activeChainId);
  if (paymentTokenAddress.toLowerCase() !== official) {
    throw new Error(
      `Fake USDT blocked. Only official token allowed: ${official}`
    );
  }

  const signer = await provider.getSigner();
  const payer = (await signer.getAddress()).toLowerCase();
  if (expectedPayer && payer !== String(expectedPayer).toLowerCase()) {
    throw new Error(
      `Wrong wallet in MetaMask. Switch to ${expectedPayer} before paying USDT.`
    );
  }

  const contract = new ethers.Contract(official, ERC20_ABI, signer);
  const amountWei = ethers.parseUnits(paymentAmount, paymentDecimals);

  const balance: bigint = await contract.balanceOf(payer);
  if (balance < amountWei) {
    throw new Error(
      `Insufficient USDT balance. Need ${paymentAmount} USDT on BNB Smart Chain (BEP-20).`
    );
  }

  const tx = await contract.transfer(treasuryWallet, amountWei);
  const receipt = await tx.wait();
  return receipt!.hash;
}

/** Send XIT tokens from user wallet to admin pool (sell). */
export async function sendXitTokens(
  adminWallet: string,
  tokenAmount: string,
  xitContractAddress: string,
  tokenDecimals: number,
): Promise<string> {
  if (!window.ethereum) throw new Error('MetaMask not installed');
  if (!xitContractAddress) throw new Error('XIT contract address not configured');

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(xitContractAddress, ERC20_ABI, signer);
  const amountWei = ethers.parseUnits(tokenAmount, tokenDecimals);
  const tx = await contract.transfer(adminWallet, amountWei);
  const receipt = await tx.wait();
  return receipt!.hash;
}

/** Read XIT token balance from connected wallet on-chain. */
export async function getXitOnChainBalance(
  walletAddress: string,
  contractAddress: string,
  rpcUrl: string,
  decimals = 18,
): Promise<number> {
  if (!walletAddress || !contractAddress || !rpcUrl) return 0;

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
  const balance = await contract.balanceOf(walletAddress);
  return parseFloat(ethers.formatUnits(balance, decimals));
}

export type WalletKind = 'metamask' | 'trust' | 'tokenpocket' | 'safepal';

export function buildWalletLoginMessage(wallet: string, timestamp: number) {
  return (
    `XIT Token Login\n` +
    `Wallet: ${wallet}\n` +
    `Timestamp: ${timestamp}\n` +
    `Only sign this message on xittoken.co to authenticate.`
  );
}

function pickInjectedProvider(kind: WalletKind): any | null {
  const eth = window.ethereum;
  if (!eth) return null;

  const list: any[] = eth.providers?.length ? [...eth.providers] : [eth];

  const match = (p: any) => {
    if (kind === 'metamask') return p.isMetaMask && !p.isTokenPocket && !p.isSafePal && !p.isTrust;
    if (kind === 'trust') return p.isTrust || p.isTrustWallet;
    if (kind === 'tokenpocket') return p.isTokenPocket;
    if (kind === 'safepal') return p.isSafePal || p.isSafepal;
    return false;
  };

  const found = list.find(match);
  if (found) return found;

  // Fallback: single injected provider (mobile in-app browsers)
  if (list.length === 1) return list[0];
  if (kind === 'metamask' && eth.isMetaMask) return eth;
  return eth;
}

export function getWalletInstallUrl(kind: WalletKind): string {
  const dapp = typeof window !== 'undefined' ? window.location.href : 'https://xittoken.co/login';
  const encoded = encodeURIComponent(dapp);
  switch (kind) {
    case 'metamask':
      return `https://metamask.app.link/dapp/${typeof window !== 'undefined' ? window.location.host : 'xittoken.co'}${typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/login'}`;
    case 'trust':
      return `https://link.trustwallet.com/open_url?coin_id=20000714&url=${encoded}`;
    case 'tokenpocket':
      return `https://tokenpocket.pro/`;
    case 'safepal':
      return `https://www.safepal.com/download`;
    default:
      return 'https://xittoken.co/login';
  }
}

/** Connect injected wallet + sign login message. Returns checksum-normalized lowercase address + signature. */
export async function connectAndSignLogin(kind: WalletKind): Promise<{
  address: string;
  signature: string;
  timestamp: number;
}> {
  const provider = pickInjectedProvider(kind);
  if (!provider) {
    const err: any = new Error(`${kind} wallet not found. Open this site inside the wallet browser or install the extension.`);
    err.code = 'NO_PROVIDER';
    err.installUrl = getWalletInstallUrl(kind);
    throw err;
  }

  const accounts: string[] = await provider.request({ method: 'eth_requestAccounts' });
  if (!accounts?.[0]) throw new Error('No wallet account selected');

  const browser = new ethers.BrowserProvider(provider);
  const signer = await browser.getSigner();
  const address = ethers.getAddress(await signer.getAddress()).toLowerCase();
  const timestamp = Date.now();
  const message = buildWalletLoginMessage(address, timestamp);
  const signature = await signer.signMessage(message);

  return { address, signature, timestamp };
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
