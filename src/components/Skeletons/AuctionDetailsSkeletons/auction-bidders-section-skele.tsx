import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AuctionBidderSectionSkele() {
  return (
    <div>
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Bidders</h2>
        </CardHeader>
        <CardContent>
          <div className="w-full space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div className="flex w-full items-center gap-2" key={i}>
                  <div>
                    <Skeleton className="h-11 w-11 rounded-full" />
                  </div>
                  <div className="flex w-full flex-col space-y-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-5 w-2/5" />
                  </div>
                </div>
              ))}
            <Button variant={'outline'}>View More</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
