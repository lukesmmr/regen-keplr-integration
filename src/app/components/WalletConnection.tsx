import { Button } from '@/components/ui/button';
import { useWallet } from '@/context/WalletContext';
import Image from 'next/image';
import PoweredByKeplr from './PoweredByKeplr';

export default function WalletConnection() {
  const { connectWallet, error } = useWallet();

  return (
    <>
      <div className="flex items-center justify-center">
        <Image
          className='pt-6'
          src='/logo_Regen_Network-cropped.svg'
          alt='Regen Network Logo'
          width={168}
          height={72}
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <Button onClick={connectWallet}>Connect your Wallet</Button>
        {error && <p className='text-red-500'>{error}</p>}
      </div>
      <div className='mt-auto'>
        <PoweredByKeplr />
      </div>
    </>
  );
}
