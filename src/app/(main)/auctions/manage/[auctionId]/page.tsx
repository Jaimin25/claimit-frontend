import React from 'react';

import ManageAuctions from '@/components/Auctions/Manage/manage-auctions';

export default function ManageAuctionPage({
  params,
}: {
  params: { auctionId: string };
}) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <ManageAuctions auctionId={params.auctionId} />
    </div>
  );
}
