'use client';

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

import { useMarketplaceAuction } from '../Providers/marketplace-auctions-provider';

export default function Marketplace() {
  const { auctions, loading } = useMarketplaceAuction();

  return (
    <div className="flex-1 space-y-6">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {!auctions || loading
          ? new Array(12)
              .fill(0)
              .map((_, i) => <AuctionCardsSkeleton key={i} />)
          : auctions?.map((item, i) => <AuctionCards key={i} auction={item} />)}
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
