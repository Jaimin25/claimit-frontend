'use client';

import { useEffect, useState } from 'react';

import AuctionCards from '@/components/Cards/auction-cards';
import AuctionCardsSkeleton from '@/components/Skeletons/auction-cards-skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function Marketplace() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="flex-1 space-y-6">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {isLoading
          ? new Array(6).fill(0).map((_, i) => <AuctionCardsSkeleton key={i} />)
          : new Array(10).fill(0).map((_, i) => <AuctionCards key={i} />)}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem className=" rounded bg-white shadow-sm">
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem className=" rounded bg-white shadow-sm">
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem className=" rounded bg-white shadow-sm">
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem className=" rounded bg-white shadow-sm">
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
