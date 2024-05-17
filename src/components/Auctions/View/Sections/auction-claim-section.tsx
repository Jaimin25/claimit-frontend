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
}: {
  isLoading: boolean;
}) {
  const [endTime, setEndTime] = useState('nill');

  const deadline = 'June 1, 2024';

  useEffect(() => {
    const interval = setInterval(
      () => setEndTime(getAuctionEndTime(deadline).replace('(Until ends)', '')),
      1000
    );

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <AuctionClaimSkeletonSkele />;
  }

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <Button variant={'outline'}>Bid</Button>
          <Button variant={'default'}>Buy ₹2000</Button>
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
              <p className="font-semibold">You are not alone!</p>
              <div className="flex items-center gap-2">
                <HiUsers /> <p>10</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
