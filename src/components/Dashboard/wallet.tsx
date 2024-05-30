'use client';

import { useState } from 'react';
import axios from 'axios';
import { CommandList } from 'cmdk';
import { FaCheck } from 'react-icons/fa';
import { LuChevronsUpDown } from 'react-icons/lu';
import { MdRefresh } from 'react-icons/md';
import { toast } from 'sonner';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Config } from '@/lib/config';
import { stripePromise } from '@/lib/stripe';
import { cn } from '@/lib/utils';
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query';

import IdentityVerificationForm from '../Forms/identity-verification-form';
import { useUser } from '../Providers/user-provider';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';

const curreny = [
  {
    value: 'inr',
    label: 'INR',
  },
];

const fetchStripeClientSecret = async (value: {
  amount: number;
  currency: string;
}) => {
  return await axios.post(
    `${Config.APP_URL}/api/stripe/fetchDepositStripeClientSecret`,
    value,
    {
      withCredentials: true,
    }
  );
};

const expireSession = async (sessionId: string) => {
  return await axios.post(
    `${Config.APP_URL}/api/stripe/expireSession`,
    { sessionId },
    {
      withCredentials: true,
    }
  );
};

export default function Wallet() {
  const { user, userBalance, refreshUserBalance } = useUser();
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>();
  const [stripeSessionId, setStripeSessionId] = useState<string | null>();
  const [amountDialogOpen, setAmountDialogOpen] = useState(false);
  const [amount, setAmount] = useState<number>();

  const [open, setOpen] = useState(false);
  const [currencyValue, setCurrencyValue] = useState('');

  const [toastId, setToastId] = useState<string | number>();

  const fetchStripeClientSecretMutation = useMutation({
    mutationFn: fetchStripeClientSecret,
    onSuccess: async (res) => {
      const data = await res.data;
      console.log(data);
      if (data.statusCode === 200) {
        setStripeClientSecret(data.clientSecret);
        setStripeSessionId(data.sessionId);
        setAmountDialogOpen(false);
        toast.success('Payment session created!', { id: toastId });
      } else {
        toast.error(data.statusMessage, { id: toastId });
      }
    },
    onError: (error) =>
      toast.error(`${error.name}: ${error.message}`, { id: toastId }),
  });

  const expireSessionMutation = useMutation({
    mutationFn: expireSession,
    onSuccess: async (res) => {
      const data = await res.data;
      console.log(data);
      if (data.statusCode === 200) {
        setStripeClientSecret(null);
        setStripeSessionId(null);
        setAmount(undefined);
        setCurrencyValue('');
        setAmountDialogOpen(false);
        toast.success('Payment session cancelled!', { id: toastId });
      } else {
        toast.error(data.statusMessage, { id: toastId });
      }
    },
    onError: (error) =>
      toast.error(`${error.name}: ${error.message}`, { id: toastId }),
  });

  const onProceed = () => {
    if (!currencyValue) {
      return toast.error('Please select a currency');
    }

    if (!amount) {
      return toast.error('Please enter a valid amount');
    }

    const currentToastId = toast.loading(
      'Please wait while creating session...<br />Do not close the window!'
    );
    setToastId(currentToastId);
    fetchStripeClientSecretMutation.mutate({
      amount: amount,
      currency: currencyValue,
    });
  };

  const expireCurrentSession = () => {
    const currentToastId = toast.loading(
      'Please wait while cancelling current session...<br />Do not close the window!'
    );
    setToastId(currentToastId);
    expireSessionMutation.mutate(stripeSessionId as string);
  };

  if (stripeClientSecret && stripeSessionId) {
    return (
      <Card>
        <CardContent>
          <div className="h-full w-full" id="checkout">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret: stripeClientSecret }}
              key={stripeClientSecret}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={expireCurrentSession}>Cancel</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <>
      <div className="h-full w-full">
        <Card className="w-full">
          <CardHeader>
            <h3 className="text-3xl font-semibold">Wallet</h3>
          </CardHeader>
          <CardContent className="space-y-8">
            {user && !user?.identityVerified && <IdentityVerificationForm />}
            <div>
              <div className="flex items-center  gap-2">
                <h2 className="text-xl font-semibold">Balance</h2>
                <Button
                  variant={'outline'}
                  onClick={refreshUserBalance}
                  disabled={!userBalance}
                >
                  <MdRefresh size={20} />
                </Button>
              </div>
              <div className="py-6">
                Current Balanace:{' '}
                {userBalance ? (
                  <p className="text-lg font-semibold">
                    ₹
                    {new Intl.NumberFormat('en-IN').format(Number(userBalance))}
                  </p>
                ) : (
                  <Skeleton className="h-6 w-1/2 sm:w-1/4 md:w-1/5" />
                )}
              </div>
              <div className="space-x-2">
                <Button
                  variant={'default'}
                  onClick={() => setAmountDialogOpen(true)}
                >
                  Add
                </Button>
                <Button variant={'secondary'}>Withdraw</Button>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">Transactions </h2>
                <Button variant={'outline'}>
                  <MdRefresh size={20} />
                </Button>
              </div>
              <Table>
                <TableCaption>A list of your transacntions.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array(10)
                    .fill(0)
                    .map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          {i % 2 === 0 ? 'Deposit' : 'Withdraw'}
                        </TableCell>
                        <TableCell>ipx_f24n234Dh2</TableCell>
                        <TableCell>
                          {i % 2 === 0 ? (
                            <p className="text-green-500">+{i * 250}</p>
                          ) : (
                            <p className="text-red-500">-{i * 500}</p>
                          )}
                        </TableCell>
                        <TableCell>10 May, 2024 10:09:00 PM</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <Dialog open={amountDialogOpen} onOpenChange={setAmountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add amount</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="space-y-2">
              <p>
                NOTE: You can only withdraw the money once there are no bids
                from this account!
              </p>
              <div className="flex items-center gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-[200px] justify-between',
                        !currencyValue && 'text-muted-foreground'
                      )}
                    >
                      {currencyValue
                        ? curreny.find((c) => c.value === currencyValue)?.label
                        : 'Select currency'}
                      <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search currency..." />
                      <CommandEmpty>No currency found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {curreny.map((c) => (
                            <CommandItem
                              value={c.value}
                              key={c.value}
                              onSelect={(currentValue) => {
                                setCurrencyValue(
                                  currentValue === currencyValue
                                    ? ''
                                    : currentValue
                                );
                                setOpen(false);
                              }}
                            >
                              <FaCheck
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  c.value === currencyValue
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {c.label}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Input
                  type="number"
                  placeholder="1000..."
                  value={amount}
                  min={0}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button
              variant={'outline'}
              onClick={() => setAmountDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={'default'}
              onClick={onProceed}
              disabled={fetchStripeClientSecretMutation.isPending}
            >
              Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
