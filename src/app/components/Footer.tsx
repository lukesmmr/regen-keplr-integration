import { Button } from '@/components/ui/button';
import { useWallet } from '@/context/WalletContext';

export default function Footer() {
  const { address, disconnectWallet } = useWallet();

  return (
    <footer className='row-start-3 flex gap-6 flex-wrap items-center justify-center'>
      &copy; {new Date().getFullYear()} for Regen Network
      {address && (
        <Button onClick={disconnectWallet} variant='destructive' size='sm'>
          Disconnect Keplr
        </Button>
      )}
    </footer>
  );
}
