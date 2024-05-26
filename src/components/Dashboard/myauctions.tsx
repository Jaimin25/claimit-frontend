'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'sonner';

import { Config } from '@/lib/config';
import { useMutation } from '@tanstack/react-query';

import DashboardAuctionCard from '../Cards/dashboard-auction-card';
import DashAuctionCardsSkele from '../Skeletons/dash-auction-cards-skeleton';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Input } from '../ui/input';

export interface UserAuctionsProps {
  id: string;
  title: string;
  description: string;
  imagesUrl: string[];
  buyPrice: string;
  basePrice: string;
  auctionStatus: string;
  startingDate: string;
  endingDate: string;
  city: string;
  state: string;
  country: string;
  bids: {
    id: number;
  }[];
  createdAt: Date;
}

const fetchUserAuctions = async () => {
  return await axios.get(`${Config.APP_URL}/api/user/getUserAuctionsById`);
};

export default function MyAuctions() {
  const [userAuctions, setUserAuctions] = useState<UserAuctionsProps[]>();

  const fetchUserAuctionsMutation = useMutation({
    mutationFn: fetchUserAuctions,
    onSuccess: async (res) => {
      const data = await res.data;

      if (data.statusCode === 200) {
        setUserAuctions(data.userAuctions as UserAuctionsProps[]);
      }
    },
    onError: (error) => toast.error(`${error.name}: ${error.message}`),
  });

  useEffect(() => {
    fetchUserAuctionsMutation.mutate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <div>
            {!fetchUserAuctionsMutation.isPending &&
            userAuctions &&
            userAuctions.length >= 1 ? (
              <div className="space-y-8">
                {userAuctions.filter((item) => item.auctionStatus === 'ACTIVE')
                  .length >= 1 && (
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">Active</h2>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {userAuctions
                        .filter((item) => item.auctionStatus === 'ACTIVE')
                        .map((item) => (
                          <DashboardAuctionCard key={item.id} auction={item} />
                        ))}
                    </div>
                  </div>
                )}
                {userAuctions.filter(
                  (item) => item.auctionStatus === 'UPCOMING'
                ).length >= 1 && (
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">Upcoming</h2>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {userAuctions
                        .filter((item) => item.auctionStatus === 'UPCOMING')
                        .map((item) => (
                          <DashboardAuctionCard key={item.id} auction={item} />
                        ))}
                    </div>
                  </div>
                )}
                {userAuctions.filter((item) => item.auctionStatus === 'SOLD')
                  .length >= 1 && (
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">Sold</h2>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {userAuctions
                        .filter((item) => item.auctionStatus === 'SOLD')
                        .map((item) => (
                          <DashboardAuctionCard key={item.id} auction={item} />
                        ))}
                    </div>
                  </div>
                )}
                {userAuctions.filter(
                  (item) => item.auctionStatus === 'FINISHED'
                ).length >= 1 && (
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">Finished</h2>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {userAuctions
                        .filter((item) => item.auctionStatus === 'FINISHED')
                        .map((item) => (
                          <DashboardAuctionCard key={item.id} auction={item} />
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <DashAuctionCardsSkele key={i} />
                  ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
