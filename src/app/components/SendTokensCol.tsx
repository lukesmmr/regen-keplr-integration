import Image from 'next/image';
import { useWallet } from '@/context/WalletContext';
import PoweredByKeplr from './PoweredByKeplr';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import SendTokensDialog from '@/app/components/SendTokensDialog';

type SendFormData = {
  recipientAddress: string;
  amount: number;
};

export default function SendCard() {
  const { sendTransaction } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendFormData>();

  return (
    <div className='h-full flex flex-col gap-6 p-10'>
      <div className='flex items-center justify-center'>
        <div className='p-4'>
          <Image
            src='/regen-round-x2.png'
            alt='Regen Network Logo'
            width={55}
            height={55}
          />
        </div>
      </div>

      <div className='text-center'>
        <h2 className='text-2xl font-medium'>
          Send <span className='font-semibold'>REGEN</span> Tokens
        </h2>
        <p className='text-gray-600 mt-4 max-w-md mx-auto'>
          Sending tokens on the Regen Redwood Testnet is fast and secure. Enter
          the recipient's address and the amount of REGEN you'd like to send.
          Once you confirm the transaction, Keplr will prompt you to sign and
          broadcast it.
        </p>
      </div>

      <SendTokensDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSend={async (data: SendFormData) => {
          try {
            const txHash = await sendTransaction(
              data.recipientAddress,
              data.amount.toString()
            );
            toast.success('Transaction Successful', {
              description: `Transaction Hash: ${txHash}`,
              duration: Infinity,
              dismissible: true,
              position: 'top-right',
              action: {
                label: "Close",
                onClick: () => toast.dismiss()
              }
            });
            return txHash;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
            toast.error('Transaction Failed', {
              description: errorMessage,
              duration: Infinity,
              dismissible: true, 
              position: 'top-right',
              action: {
                label: "Close",
                onClick: () => toast.dismiss()
              }
            });
            throw error;
          }
        }}
      />

      <div className='md:hidden mt-auto mt-[10%]'>
        <PoweredByKeplr />
      </div>
    </div>
  );
}
