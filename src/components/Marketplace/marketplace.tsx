'use client';

import { useSearchParams } from 'next/navigation';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';

import AuctionCards from '@/components/Cards/auction-cards';
import AuctionCardsSkeleton from '@/components/Skeletons/auction-cards-skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';

import { useMarketplaceAuction } from '../Providers/marketplace-auctions-provider';
import { Button } from '../ui/button';

export default function Marketplace() {
  const { auctions, loading, pagesCount, setAuctionsOffset } =
    useMarketplaceAuction();
  const searchParams = useSearchParams();
  const offset = Number(searchParams.get('offset'));

  return (
    <div className="flex-1 space-y-6">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {!auctions || loading ? (
          new Array(9).fill(0).map((_, i) => <AuctionCardsSkeleton key={i} />)
        ) : auctions.length >= 1 ? (
          auctions?.map((item, i) => <AuctionCards key={i} auction={item} />)
        ) : (
          <div>No auctions found!</div>
        )}
      </div>
      {pagesCount! > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem className="rounded-full bg-white shadow-sm">
              <Button
                variant={'ghost'}
                disabled={offset === 0}
                onClick={() => setAuctionsOffset(offset - 1)}
              >
                <GrFormPrevious size={18} /> Previous
              </Button>
            </PaginationItem>
            {new Array(pagesCount).fill(0).map((_, i) => (
              <PaginationItem
                className=" rounded-full bg-white shadow-sm"
                key={i}
              >
                <Button
                  variant={i === offset ? 'default' : 'ghost'}
                  onClick={() => setAuctionsOffset(i)}
                  className="rounded-full"
                >
                  {i + 1}
                </Button>
              </PaginationItem>
            ))}
            {/* <PaginationItem className=" rounded bg-white shadow-sm"> */}
            {/*   <PaginationEllipsis /> */}
            {/* </PaginationItem> */}
            <PaginationItem className=" rounded-full bg-white shadow-sm">
              <Button
                variant={'ghost'}
                disabled={offset === pagesCount! - 1}
                onClick={() => setAuctionsOffset(offset + 1)}
              >
                Next
                <GrFormNext size={18} />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
