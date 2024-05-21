'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';

import AuctionCards from '@/components/Cards/auction-cards';
import AuctionCardsSkeleton from '@/components/Skeletons/auction-cards-skeleton';
import { Button } from '@/components/ui/button';
import { Config } from '@/lib/config';
import { useMutation } from '@tanstack/react-query';

interface FeaturedAuctionProps {
  id: string;
  title: string;
  description: string;
  imagesUrl: string[];
  buyPrice: string;
  basePrice: string;
  endingDate: string;
  user: {
    username: string;
    profilePicUrl: string;
  };
  bids: {
    id: number;
  }[];
}

const fetchFeaturedAuctions = async () => {
  return await axios.get(`${Config.API_URL}/marketplace/getFeaturedAuctions`);
};

export default function FeatureSection() {
  const [featuredAuctions, setFeaturedAuctions] =
    useState<FeaturedAuctionProps[]>();

  const fetchFeaturedAuctionsMutation = useMutation({
    mutationFn: fetchFeaturedAuctions,
    onSuccess: async (res) => {
      const data = await res.data;
      console.log(data);

      if (data.statusCode === 200) {
        setFeaturedAuctions(data.featuredAuctions);
      }
    },
    onError: (error) => toast.error(`${error.name}: ${error.message}`),
  });

  useEffect(() => {
    fetchFeaturedAuctionsMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 space-y-6 bg-white p-8">
      <h3 className="text-3xl font-semibold">Featured Auctions</h3>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {!featuredAuctions || fetchFeaturedAuctionsMutation.isPending
          ? new Array(6).fill(0).map((_, i) => <AuctionCardsSkeleton key={i} />)
          : featuredAuctions.map((item, i) => (
              <AuctionCards key={i} auction={item} />
            ))}
      </div>
      <div className="flex w-full justify-center">
        <Link href={'/marketplace'}>
          <Button variant={'link'} className="text-lg">
            Explore More →
          </Button>
        </Link>
      </div>
    </div>
  );
}
