'use client';

import { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';
import { HiUsers } from 'react-icons/hi';

import AuctionClaimSkeletonSkele from '@/components/Skeletons/AuctionDetailsSkeletons/auction-claim-section-skele';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getAuctionEndTime } from '@/lib/utils';

export default function AuctionClaimSection({
  isLoading,
  bidders,
  buyPrice,
  auctionStatus,
  deadline,
  title,
}: {
  isLoading: boolean;
  bidders: number;
  buyPrice: string;
  auctionStatus: string;
  deadline: string;
  title: string;
}) {
  const [endTime, setEndTime] = useState('--:--:--');

  useEffect(() => {
    if (deadline && auctionStatus === 'ACTIVE') {
      const interval = setInterval(() => {
        setEndTime(
          getAuctionEndTime(deadline.toString()).replace('(Until ends)', '')
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [deadline, auctionStatus]);

  if (isLoading) {
    return <AuctionClaimSkeletonSkele />;
  }

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <Button variant={'outline'} disabled={auctionStatus !== 'ACTIVE'}>
            Bid
          </Button>
          <Button variant={'default'} disabled={auctionStatus !== 'ACTIVE'}>
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
                    : 'You are not alone!'}
              </p>
              <div className="flex items-center gap-2">
                <HiUsers /> <p>{auctionStatus !== 'ACTIVE' ? '--' : bidders}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
