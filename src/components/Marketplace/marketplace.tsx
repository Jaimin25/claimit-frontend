'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

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
import { Config } from '@/lib/config';
import { useMutation } from '@tanstack/react-query';

export interface AuctionDetailsProps {
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
    user: {
      username: string;
      profilePicUrl: string;
    };
  }[];
}

const fetchMarketplaceAuctions = async () => {
  return await axios.get(
    `${Config.API_URL}/marketplace/fetchAllMarketplaceAuctions`
  );
};

export default function Marketplace() {
  const [auctions, setAuctions] = useState<AuctionDetailsProps[]>();
  const fetchAllMarketplaceAuctionsMutation = useMutation({
    mutationFn: fetchMarketplaceAuctions,
    onSuccess: async (res) => {
      const data = await res.data;
      if (data.statusCode === 200) {
        setAuctions(data.allAuctions);
      }
    },
    onError: (error) => toast.error(`${error.name}: ${error.message}`),
  });

  useEffect(() => {
    fetchAllMarketplaceAuctionsMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 space-y-6">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {!auctions || fetchAllMarketplaceAuctionsMutation.isPending
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
