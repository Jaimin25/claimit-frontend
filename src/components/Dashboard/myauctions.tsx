import React from 'react';

import DashboardAuctionCard from '../Cards/dashboard-auction-card';
import { Card, CardContent, CardHeader } from '../ui/card';

export default function MyAuctions() {
  return (
    <div className="h-full w-full">
      <Card className="h-full">
        <CardHeader>
          <h3 className="text-3xl font-semibold">My Auctions</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <DashboardAuctionCard key={i} />
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
