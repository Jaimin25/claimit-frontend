import React from 'react';
import { FaClock } from 'react-icons/fa';
import { HiUsers } from 'react-icons/hi';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AuctionClaimSkeletonSkele() {
  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <Button variant={'outline'} disabled>
            Bid
          </Button>
          <Button variant={'default'} disabled>
            Buy{' '}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="font-semibold">Time running out!</p>
              <div className="flex items-center gap-2">
                <FaClock /> <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <div>
              <p className="font-semibold">You are not alone!</p>
              <div className="flex items-center gap-2">
                <HiUsers />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
