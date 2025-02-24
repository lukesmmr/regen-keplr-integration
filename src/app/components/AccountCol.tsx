import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/context/WalletContext';
import { toast } from 'sonner';
import PoweredByKeplr from './PoweredByKeplr';

export default function AccountCard() {
  const { address, balance, regenPrice } = useWallet();

  // Shorten the wallet address for a cleaner display
  const shortenedAddress = address
    ? `${address.slice(0, 12)}...${address.slice(-4)}`
    : '';

  // Calculate the market value in USD (if regenPrice is available)
  const marketValue =
    regenPrice && balance ? parseFloat(balance) * regenPrice : 0;

  return (
    <div className='h-full flex flex-col gap-4 p-10'>
      <div className='flex items-center gap-2'>
        <Image
          src='/logo_Regen_Network-cropped.svg'
          alt='Regen Network Logo'
          width={112}
          height={48}
          className='sm:w-[112px] sm:h-[48px] w-[173px] h-[74px]'
        />
      </div>

      <div className='flex flex-col gap-0'>
        <span className='text-14px text-gray-600 font-bold font-["Open Sans"]'>ACCOUNT BALANCE</span>
        <div className='flex items-baseline gap-2'>
          <span className='text-4xl font-medium'>{balance || '0.000'}</span>
          <span className='text-xl text-gray-400'>REGEN</span>
        </div>
        {/* Display the USD market value if available */}
        <span className='text-xl text-gray-500'>
          {regenPrice ? `$${marketValue.toFixed(2)}` : 'Fetching price...'}
        </span>
      </div>

      <div className='flex items-center gap-4 text-sm'>
        <span className='font-["Open Sans"] font-semibold text-[16px] uppercase text-gray-500 mt-[30px]'>{shortenedAddress}</span>
        <Button
          variant='outline'
          size='sm'
          className='py-1.5 px-3 bg-[#98C5B1] hover:bg-[#7BA696] text-white hover:text-white mt-[30px]'
          onClick={() => {
            navigator.clipboard.writeText(address);
            toast('Copied!', {
              description: '📋 Wallet address copied to clipboard! ✨',
              position: 'top-right',
            });
          }}
        >
          COPY
        </Button>
      </div>

      {/* Render PoweredByKeplr component only on desktop */}
      <div className='hidden md:block mt-auto'>
        <PoweredByKeplr />
      </div>
    </div>
  );
}
