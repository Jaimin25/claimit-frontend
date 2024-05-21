import React from 'react';

import AuctionBidderSectionSkele from '@/components/Skeletons/AuctionDetailsSkeletons/auction-bidders-section-skele';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { timeSince } from '@/lib/utils';

export default function AuctionBiddersSection({
  isLoading,
  bids,
}: {
  isLoading: boolean;
  bids: {
    id: number;
    amount: string;
    createdAt: Date;
    user: {
      username: string;
      profilePicUrl: string;
    };
  }[];
}) {
  if (isLoading) {
    return <AuctionBidderSectionSkele />;
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Bidders</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bids.length >= 1
              ? bids.map((item) => (
                  <div className="flex items-center gap-2" key={item.id}>
                    <div>
                      <Avatar>
                        <AvatarImage src={item.user.profilePicUrl} />
                        <AvatarFallback>CJ</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-lg font-semibold">
                        {item.user.username}
                      </p>
                      <div className="flex gap-2">
                        <p>₹{item.amount}</p> •{' '}
                        <p>{timeSince(item.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))
              : 'No Bidders!'}
            {bids.length > 5 && <Button variant={'outline'}>View More</Button>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
