'use client';

import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import AuctionCards from '@/components/Cards/auction-cards';
import AuctionCardsSkeleton from '@/components/Skeletons/auction-cards-skeleton';

import { Input } from '../ui/input';

export default function Marketpalce() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center gap-2">
        <FaSearch />
        <Input placeholder="Search auctions..." />
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {isLoading
          ? new Array(6).fill(0).map((_, i) => <AuctionCardsSkeleton key={i} />)
          : new Array(10).fill(0).map((_, i) => <AuctionCards key={i} />)}
      </div>
    </div>
  );
}
