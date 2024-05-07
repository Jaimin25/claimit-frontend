'use client';

import { useEffect, useState } from 'react';

import AuctionCards from '@/components/Cards/auction-cards';
import AuctionCardsSkeleton from '@/components/Skeletons/auction-cards-skeleton';
import { Button } from '@/components/ui/button';

export default function FeatureSection() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="flex-1 space-y-6 bg-white p-8">
      <h3 className="text-3xl font-semibold">Trending Auctions</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {isLoading
          ? new Array(6).fill(0).map((_, i) => <AuctionCardsSkeleton key={i} />)
          : new Array(6).fill(0).map((_, i) => <AuctionCards key={i} />)}
      </div>
      <div className="flex w-full justify-center">
        <Button variant={'link'} className="text-lg">
          Explore More →
        </Button>
      </div>
    </div>
  );
}
