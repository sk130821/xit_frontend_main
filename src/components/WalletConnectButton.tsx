import { Wallet, Loader2 } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { shortenAddress } from '@/lib/web3';

export default function WalletConnectButton() {
  const { connectedAddress, connecting, isBlockchainMode, connect, config } = useWallet();

  if (!isBlockchainMode) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/60 border border-gray-700 text-xs text-gray-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        Demo Mode
      </div>
    );
  }

  if (connectedAddress) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs">
        <Wallet className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-emerald-400 font-medium">{shortenAddress(connectedAddress)}</span>
        <span className="text-gray-500">|</span>
        <span className="text-gray-400 capitalize">{config?.platformMode}</span>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={connecting}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-medium hover:bg-orange-500/20 transition-all disabled:opacity-50"
    >
      {connecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wallet className="w-3.5 h-3.5" />}
      Connect MetaMask
    </button>
  );
}
