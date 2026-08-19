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

declare global {
  interface Window {
    ethereum?: any;
  }
}
