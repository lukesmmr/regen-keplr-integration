import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { useWallet } from '@/context/WalletContext';
import { toast } from 'sonner'
export default function AccountCard() {
  const { address, balance, disconnectWallet } = useWallet();

  // Shorten the wallet address for a cleaner display
  const shortenedAddress = address ? `${address.slice(0, 10)}...${address.slice(-4)}` : '';

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Image 
          src="/logo_Regen_Network-cropped.png"
          alt="Regen Network Logo"
          width={112}
          height={48}
        />
      </div>
      
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-600">ACCOUNT BALANCE</span>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-medium">{balance || '0.000'}</span>
          <span className="text-xl text-gray-400">REGEN</span>
        </div>
        <span className="text-gray-500">[Market Value]</span>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="font-mono">{shortenedAddress}</span>
        <Button 
          variant="outline" 
          size="sm"
          className="text-green-600 bg-green-100 hover:bg-green-200 hover:text-green-700"
          onClick={() => {
            navigator.clipboard.writeText(address);
            toast('Copied!', {
              description: 'Wallet address copied to clipboard.'
            });
          }}
        >
          COPY
        </Button>
      </div>

      <div className="flex items-center gap-1 text-sm text-gray-500 mt-4">
        <span>Powered by</span>
        <Image
          src="/keplr-monochrome-dark.svg"
          alt="Keplr Logo"
          width={75}
          height={25}
        />
      </div>

      <Button onClick={disconnectWallet} variant="destructive" className="mt-10">
        Disconnect Keplr
      </Button>
    </div>
  );
}
