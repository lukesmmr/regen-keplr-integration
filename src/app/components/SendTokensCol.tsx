import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { useWallet } from '@/context/WalletContext';
import PoweredByKeplr from './PoweredByKeplr';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

type SendFormData = {
  recipientAddress: string;
  amount: number;
};

export default function SendCard() {
  const { address, balance } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<SendFormData>();

  const onSubmit = (data: SendFormData) => {
    console.log('Sending tokens...', address, balance, data);
    // TODO: Implement token sending logic
    setIsOpen(false);
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            className="w-full bg-[#98C5B1] hover:bg-[#7BA696] text-white font-medium py-6 rounded-lg mt-auto"
            onClick={() => setIsOpen(true)}
          >
            START
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send REGEN Tokens</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="recipientAddress">Recipient Address</Label>
              <Input id="recipientAddress" {...register("recipientAddress")} />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="amount">Amount (REGEN)</Label>
              <Input id="amount" type="number" step="0.000001" {...register("amount", { valueAsNumber: true })} />
            </div>
            <Button type="submit">Confirm</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="md:hidden mt-auto mt-[10%]">
        <PoweredByKeplr />
      </div>
    </div>
  );
}
