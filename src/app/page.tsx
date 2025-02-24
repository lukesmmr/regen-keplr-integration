'use client';

import AccountCard from '@/app/components/AccountCol';
import SendTokensCol from '@/app/components/SendTokensCol';
import { Button } from '@/components/ui/button';
import { WalletProvider, useWallet } from '@/context/WalletContext';

function MainGrid({ children }: { children: React.ReactNode }) {
  const { address, disconnectWallet } = useWallet();

  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        <div className='mx-auto min-h-[420px] max-w-[820px] bg-[#EDF2FA] shadow-lg rounded-lg'>
          {children}
        </div>
      </main>
      <footer className='row-start-3 flex gap-6 flex-wrap items-center justify-center'>
        &copy; {new Date().getFullYear()} for Regen Network
        {address && (
          <Button
            onClick={disconnectWallet}
            variant='destructive'
            size='sm'
          >
            Disconnect Keplr
          </Button>
        )}
      </footer>
    </div>
  );
}

function WalletConnection() {
  const { connectWallet, error } = useWallet();

  return (
    <div className='h-full flex flex-col items-center justify-center gap-4'>
      {error && <p className='text-red-500'>{error}</p>}
      <Button onClick={connectWallet}>Connect Keplr</Button>
    </div>
  );
}

function HomeContent() {
  const { address } = useWallet();

  return (
    <MainGrid>
      {address ? (
        <div className='grid grid-cols-2'>
          <div className='w-full h-full min-h-[420px] bg-white shadow-[4px_0px_8px_-4px_rgba(0,0,0,0.1)]'>
            <AccountCard />
          </div>
          <div className='w-full'>
            <SendTokensCol />
          </div>
        </div>
      ) : (
        <WalletConnection />
      )}
    </MainGrid>
  );
}

export default function Home() {
  return (
    <WalletProvider>
      <HomeContent />
    </WalletProvider>
  );
}
