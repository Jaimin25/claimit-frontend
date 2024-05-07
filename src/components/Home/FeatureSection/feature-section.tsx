'use client';

import { useEffect, useState } from 'react';

import AuctionCards from '@/components/Cards/auction-cards';
import AuctionCardsSkeleton from '@/components/Skeletons/auction-cards-skeleton';

export default function FeatureSection() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="flex-1 bg-white p-8">
      <div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {isLoading
            ? new Array(3)
                .fill(0)
                .map((_, i) => <AuctionCardsSkeleton key={i} />)
            : new Array(3).fill(0).map((_, i) => <AuctionCards key={i} />)}
        </div>
      </div>
    </div>
  );
}
