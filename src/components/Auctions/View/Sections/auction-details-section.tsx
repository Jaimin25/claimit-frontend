import React from 'react';

import AuctionDetailsSectionSkele from '@/components/Skeletons/AuctionDetailsSkeletons/auction-details-section-skele';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AuctionDetailsSection({
  isLoading,
  description,
}: {
  isLoading: boolean;
  description: string;
}) {
  if (isLoading) {
    return <AuctionDetailsSectionSkele />;
  }

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Details</h2>
        </CardHeader>
        <CardContent>
          <p className="whitespace-break-spaces">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
