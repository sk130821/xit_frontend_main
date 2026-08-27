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
        }],
      });
    } else {
      throw err;
    }
  }
}

export async function connectWallet(): Promise<string> {
  if (!window.ethereum) throw new Error('MetaMask not installed');
  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);
  return accounts[0];
}

export async function sendPayment(
  treasuryWallet: string,
  paymentAmount: string,
  paymentTokenAddress: string,
  paymentDecimals: number,
): Promise<string> {
  if (!window.ethereum) throw new Error('MetaMask not installed');

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  if (!paymentTokenAddress) {
    const tx = await signer.sendTransaction({
      to: treasuryWallet,
      value: ethers.parseUnits(paymentAmount, paymentDecimals),
    });
    const receipt = await tx.wait();
    return receipt!.hash;
  }

  const contract = new ethers.Contract(paymentTokenAddress, ERC20_ABI, signer);
  const amountWei = ethers.parseUnits(paymentAmount, paymentDecimals);
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
