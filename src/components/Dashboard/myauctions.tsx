'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'sonner';

import { Config } from '@/lib/config';
import { useMutation } from '@tanstack/react-query';

import DashboardAuctionCard from '../Cards/dashboard-auction-card';
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {userAuctions?.map((item, i) => (
              <DashboardAuctionCard key={i} auction={item} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
