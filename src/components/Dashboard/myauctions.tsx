import { FaSearch } from 'react-icons/fa';

import DashboardAuctionCard from '../Cards/dashboard-auction-card';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Input } from '../ui/input';

export default function MyAuctions() {
  return (
    <div className="h-full w-full">
      <Card className="h-full">
        <CardHeader>
          <h3 className="text-3xl font-semibold">My Auctions</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <FaSearch />
            <Input placeholder="Search auctions..." />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
