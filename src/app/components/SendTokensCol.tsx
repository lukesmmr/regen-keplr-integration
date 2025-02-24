import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { useWallet } from '@/context/WalletContext';

export default function SendCard() {
  const { address, balance } = useWallet();

  const handleSend = () => {
    console.log('Sending tokens...', address, balance);
  };

  return (
    <div className="h-full flex flex-col gap-6 p-10">
      <div className="flex items-center justify-center">
        <div className="p-4">
          <Image 
            src="/regen-round-x2.png"
            alt="Regen Network Logo"
            width={55}
            height={55}
          />
        </div>
      </div>
      
      <div className="text-center">
        <h2 className="text-2xl font-medium">Send <span className="font-semibold">REGEN</span> Tokens</h2>
        <p className="text-gray-600 mt-4 max-w-md mx-auto">
          Sending tokens on the Regen Redwood Testnet is fast and secure. Enter 
          the recipient's address and the amount of REGEN you'd like to send. Once
          you confirm the transaction, Keplr will prompt you to sign and broadcast it.
        </p>
      </div>

      <Button 
        className="w-full bg-[#98C5B1] hover:bg-[#7BA696] text-white font-medium py-6 rounded-lg mt-auto"
        onClick={handleSend}
      >
        START
      </Button>
    </div>
  );
}
