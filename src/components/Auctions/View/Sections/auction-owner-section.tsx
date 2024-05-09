import React from 'react';

import AuctionOwnerSectionSkele from '@/components/Skeletons/AuctionDetailsSkeletons/auction-owner-section-skele';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AuctionOwnerSection({
  isLoading,
}: {
  isLoading: boolean;
}) {
  if (isLoading) {
    return <AuctionOwnerSectionSkele />;
  }

  return (
    <div className="w-full lg:max-w-xs">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={'https://github.com/jaimin25.png'} />
              <AvatarFallback>CJ</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold">Username</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <p>Mumbar, Maharashtra, India</p>
            <p>Joined 2 months ago</p>
            <p>Placed 100 bids so far</p>
            <p>Sold 10 items</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
