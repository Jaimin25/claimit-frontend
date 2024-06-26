'use client';

import { SyntheticEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FaClock, FaWallet } from 'react-icons/fa';
import { HiUsers } from 'react-icons/hi';
import { toast } from 'sonner';

import { useSocket } from '@/components/Providers/socket-provider';
import { useUser } from '@/components/Providers/user-provider';
import AuctionClaimSkeletonSkele from '@/components/Skeletons/AuctionDetailsSkeletons/auction-claim-section-skele';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Config } from '@/lib/config';
import { getAuctionEndTime } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';

const placeUserBid = async ({
  amount,
  auctionId,
}: {
  amount: number;
  auctionId: string;
}) => {
  return await axios.post(
    `${Config.APP_URL}/api/user/placeUserBid`,
    { amount, auctionId },
    {
      withCredentials: true,
    }
  );
};

const buyAuctionItem = async ({ auctionId }: { auctionId: string }) => {
  return await axios.post(
    `${Config.APP_URL}/api/user/buyAuctionItem`,
    { auctionId },
    {
      withCredentials: true,
    }
  );
};

export default function AuctionClaimSection({
  isLoading,
  auctionId,
  bidders,
  buyPrice,
  basePrice,
  auctionStatus,
  deadline,
  title,
  highestBid,
}: {
  isLoading: boolean;
  auctionId: string;
  bidders: number;
  buyPrice: string;
  basePrice: number;
  auctionStatus: string;
  deadline: string;
  title: string;
  highestBid: number;
}) {
  const { isAuthenticated, user } = useUser();
  const { socket } = useSocket();

  const [endTime, setEndTime] = useState('--:--:--');
  const [bidValue, setBidValue] = useState(highestBid + 1);
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false);
  const [toastId, setToastId] = useState<string | number>();

  const currentDate = new Date().getTime();

  const placeUserBidMutation = useMutation({
    mutationFn: placeUserBid,
    onSuccess: async (res) => {
      const data = await res.data;

      if (data.statusCode === 200) {
        toast.success(data.statusMessage, { id: toastId });
        socket?.emit(`bid_placed`, {
          ...data.userBid,
          auctionId: auctionId,
          user: {
            username: user?.username,
            profilePicUrl: user?.profilePicUrl,
          },
        });
      } else if (data.statusMessage === 'Insufficient balance in wallet!') {
        toast.error(data.statusMessage, { id: toastId });
        setBalanceDialogOpen(true);
      } else {
        toast.error(data.statusMessage, { id: toastId });
      }
    },
    onError: (error) =>
      toast.error(`${error.name}: ${error.message}`, {
        id: toastId,
      }),
  });

  const buyAuctionItemMutation = useMutation({
    mutationFn: buyAuctionItem,
    onSuccess: async (res) => {
      const data = await res.data;

      if (data.statusCode === 200) {
        toast.success(data.statusMessage, { id: toastId });
      } else if (data.statusMessage === 'Insufficient balance in wallet!') {
        toast.error(data.statusMessage, { id: toastId });
        setBalanceDialogOpen(true);
      } else {
        toast.error(data.statusMessage, { id: toastId });
      }
    },
    onError: (error) =>
      toast.error(`${error.name}: ${error.message}`, {
        id: toastId,
      }),
  });

  useEffect(() => {
    if (
      deadline &&
      auctionStatus === 'ACTIVE' &&
      new Date(deadline).getTime() >= currentDate
    ) {
      const interval = setInterval(() => {
        setEndTime(
          getAuctionEndTime(deadline.toString()).replace('(Until ends)', '')
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [deadline, auctionStatus, currentDate]);

  const submitBid = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!bidValue) {
      toast.error('Please enter a valid number!');
      return;
    }

    if (bidValue <= highestBid) {
      toast.error('Value must be greater than the highest bid');
      return;
    }

    if (bidValue >= Number(buyPrice)) {
      toast.error(
        'Your bid value exceeded the buy price, maybe you should try proceeding with buying the item'
      );
      return;
    }

    if (bidders === 0) {
      if (bidValue < basePrice) {
        toast.error('Value must be greater than the base price');
        return;
      }
    }

    placeUserBidMutation.mutate({ amount: bidValue, auctionId });
    setBidValue(NaN);
    setBidDialogOpen(false);
    const currentToastId = toast.loading('Placing bid...');
    setToastId(currentToastId);
  };

  const onSubmitBuy = () => {
    buyAuctionItemMutation.mutate({ auctionId });
    setBuyDialogOpen(false);
    const currentToastId = toast.loading('Processing, please wait...');
    setToastId(currentToastId);
  };

  if (isLoading) {
    return <AuctionClaimSkeletonSkele />;
  }

  return (
    <>
      <div className="w-full">
        <Card className="w-full">
          <CardHeader>
            <h2 className="text-2xl font-semibold">{title}</h2>
            <Button
              variant={'default'}
              disabled={
                auctionStatus !== 'ACTIVE' ||
                currentDate >= new Date(deadline).getTime()
              }
              onClick={() => setBidDialogOpen(true)}
            >
              Bid
            </Button>
            <Button
              variant={'outline'}
              disabled={
                auctionStatus !== 'ACTIVE' ||
                currentDate >= new Date(deadline).getTime()
              }
              onClick={() => setBuyDialogOpen(true)}
            >
              Buy {auctionStatus === 'SOLD' ? '(SOLD)' : `(₹${buyPrice})`}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="font-semibold">Time running out!</p>
                <div className="flex items-center gap-2">
                  <FaClock /> <p>{endTime}</p>
                </div>
              </div>
              <div>
                <p className="font-semibold">
                  {auctionStatus !== 'ACTIVE'
                    ? 'Finished'
                    : bidders === 0
                      ? 'Start bidding!'
                      : 'Total bids'}
                </p>
                <div className="flex items-center gap-2">
                  <HiUsers />{' '}
                  <p>{auctionStatus !== 'ACTIVE' ? '--' : bidders}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Dialog open={bidDialogOpen} onOpenChange={setBidDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">
              {isAuthenticated ? 'Enter bid amount' : 'Please login'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={submitBid}>
            <DialogDescription className="space-y-2">
              {isAuthenticated ? (
                <>
                  <p className="text-lg font-semibold">
                    {bidders >= 1
                      ? `Highest bid: ₹${highestBid}`
                      : `Base price: ₹${basePrice}`}
                  </p>
                  <Input
                    placeholder="your bid..."
                    min={highestBid + 1}
                    value={bidValue}
                    onChange={(e) => setBidValue(Number(e.target.value))}
                    type="number"
                  />
                  <p>You must bid higher than the previous bid</p>
                </>
              ) : (
                'You must login to your account in order to place a bid or buy the item.'
              )}
            </DialogDescription>
            <DialogFooter>
              <Button
                type="button"
                variant={'outline'}
                onClick={() => setBidDialogOpen(false)}
              >
                Cancel
              </Button>
              {isAuthenticated ? (
                <Button type={'submit'}>Submit</Button>
              ) : (
                <Link href={'/signin'}>
                  <Button type={'button'}>Login</Button>
                </Link>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy {title}?</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to buy this item for{' '}
            <span className="font-semibold">₹{buyPrice}</span>?
          </DialogDescription>
          <DialogFooter>
            <Button variant={'outline'} onClick={() => setBuyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmitBuy}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={balanceDialogOpen} onOpenChange={setBalanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex gap-2">
              <FaWallet size={20} />
              <h2>Insufficient Balance</h2>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            You have insufficient balance in your wallet, please update the
            balance and proceed with the bid again.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant={'outline'}
              className="w-full"
              onClick={() => setBalanceDialogOpen(false)}
            >
              Cancel
            </Button>
            <Link href={'/dashboard/wallet'} className="w-full *:w-full">
              <Button variant={'default'}>Go to wallet</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
