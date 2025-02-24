import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

type SendFormData = {
  recipientAddress: string;
  amount: number;
};

interface SendTokensDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSend: (data: SendFormData) => Promise<string>;
}

export default function SendTokensDialog({
  isOpen,
  setIsOpen,
  onSend,
}: SendTokensDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SendFormData>();

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      reset({
        recipientAddress: '',
        amount: undefined,
      });
    }
  }, [isOpen, reset]);

  // State to indicate that the transaction is pending approval/signature.
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Wrapper function that handles form submission.
  const onFormSubmit = async (data: SendFormData) => {
    setIsSubmitting(true);
    try {
      // Wait for the transaction to be signed and broadcasted.
      await onSend(data);
      // Only close the modal on successful transaction
      setIsOpen(false);
    } catch (error) {
      // Keep modal open if there's an error
      // Errors are already handled in onSend (i.e. via toast notifications)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className='w-full bg-[#98C5B1] hover:bg-[#7BA696] text-white font-medium py-6 rounded-lg mt-auto'
          onClick={() => setIsOpen(true)}
        >
          START
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send REGEN Tokens</DialogTitle>
          <DialogDescription>
            Enter the recipient's address and the amount of REGEN tokens you
            want to send.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-4'>
          <div className='grid w-full items-center gap-1.5'>
            <Label htmlFor='recipientAddress'>Recipient Address</Label>
            <Input
              placeholder='regen1k8c2m5cn322akk5wy8lpt87dd2f4yh9zced8cw'
              id='recipientAddress'
              {...register('recipientAddress', {
                required: 'Recipient address is required',
                pattern: {
                  value: /^regen1[a-zA-Z0-9]{38}$/,
                  message:
                    "Invalid address format (starts with 'regen1' and 45 characters long)",
                },
              })}
            />
            {errors.recipientAddress && (
              <p className='text-sm text-red-500'>
                {errors.recipientAddress.message}
              </p>
            )}
          </div>
          <div className='grid w-full items-center gap-1.5'>
            <Label htmlFor='amount'>Amount (REGEN)</Label>
            <Input
              id='amount'
              placeholder='Enter amount in REGEN...'
              type='number'
              step='0.000001'
              {...register('amount', {
                required: 'Amount is required',
                valueAsNumber: true,
                min: {
                  value: 0.000001,
                  message: 'Amount must be at least 0.000001 REGEN',
                },
                validate: (value) =>
                  value > 0 || 'Amount must be greater than 0',
              })}
            />
            {errors.amount && (
              <p className='text-sm text-red-500'>{errors.amount.message}</p>
            )}
          </div>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? <>Waiting for approval...</> : 'Confirm'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
