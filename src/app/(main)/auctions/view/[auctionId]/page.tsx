import React from 'react';

import AuctionDetails from '@/components/Auctions/View/auction-details';

export default function AuctionDetailsPage({
  params,
}: {
  params: { auctionId: string };
}) {
  return (
    <div className="w-full p-8">
      <AuctionDetails auctionId={params.auctionId} />
    </div>
  );
}
