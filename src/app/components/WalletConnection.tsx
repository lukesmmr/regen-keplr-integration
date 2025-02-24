import { Button } from '@/components/ui/button';
import { useWallet } from '@/context/WalletContext';

export default function WalletConnection() {
  const { connectWallet, error } = useWallet();

  return (
    <div className='h-full flex flex-col items-center justify-center gap-4'>
      {error && <p className='text-red-500'>{error}</p>}
      <Button onClick={connectWallet}>Connect Keplr</Button>
    </div>
  );
}
