'use client';

import AccountCard from '@/app/components/AccountCol';
import SendTokensCol from '@/app/components/SendTokensCol';
import { WalletProvider, useWallet } from '@/context/WalletContext';
import Footer from '@/app/components/Footer';
import WalletConnection from '@/app/components/WalletConnection';

function MainGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        <div className='mx-auto md:min-h-[420px] max-w-[820px] bg-[#EDF2FA] shadow-lg rounded-lg'>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function HomeContent() {
  const { address } = useWallet();

  return (
    <MainGrid>
      {address ? (
        <div className='flex flex-col md:grid md:grid-cols-2'>
          <div className='w-full h-full md:min-h-[420px] bg-white shadow-none md:shadow-[4px_0px_8px_-4px_rgba(0,0,0,0.1)]'>
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
