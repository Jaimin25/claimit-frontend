'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

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

interface FilterProps {
  searchInput: string;
  category: string;
  sortTypeAuction: string;
  sortTypePrice: string;
}

interface MarketplaceAuctionContextProps {
  auctions: AuctionDetailsProps[] | null;
  loading: boolean;
  setFilterValue: (value: FilterProps) => void;
  pagesCount: number | undefined;
  setAuctionsOffset: (value: number) => void;
}

const MarketplaceAuctionContext = createContext<MarketplaceAuctionContextProps>(
  {
    auctions: null,
    loading: false,
    setFilterValue: () => {},
    pagesCount: 1,
    setAuctionsOffset: () => {},
  }
);

export const useMarketplaceAuction = () => {
  return useContext(MarketplaceAuctionContext);
};

const fetchMarketplaceAuctions = async ({
  filterValues,
  offset,
}: {
  filterValues: FilterProps;
  offset: number;
}) => {
  return await axios.get(
    `${Config.APP_URL}/api/marketplace/fetchMarketplaceAuctionsWithFilter`,
    { params: { offset, ...filterValues } }
  );
};

export function MarketplaceAuctionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [auctions, setAuctions] = useState<AuctionDetailsProps[] | null>(null);
  const [filterVal, setFilterVal] = useState<FilterProps>({
    category: '',
    searchInput: '',
    sortTypeAuction: '',
    sortTypePrice: '',
  });
  const [pagesCount, setPagesCount] = useState<number>();

  const fetchAllMarketplaceAuctionsMutation = useMutation({
    mutationFn: fetchMarketplaceAuctions,
    onSuccess: async (res) => {
      const data = await res.data;

      if (data.statusCode === 200) {
        setAuctions(data.allAuctions);
        setPagesCount(data.pages as number);
      } else {
        toast.error(data.statusMessage);
      }
    },
    onError: (error) => toast.error(`${error.name}: ${error.message}`),
  });

  useEffect(() => {
    fetchAllMarketplaceAuctionsMutation.mutate({
      filterValues: filterVal,
      offset: searchParams.get('offset')
        ? Number(searchParams.get('offset'))
        : 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const setFilterValue = (value: FilterProps) => {
    // console.log(value);
    // if (
    //   !value.searchInput &&
    //   !value.category &&
    //   !value.sortTypeAuction &&
    //   !value.sortTypePrice
    // ) {
    //   if (tempAuctions) {
    //     setAuctions(tempAuctions);
    //   }
    //   return;
    // }
    setFilterVal(value);
    fetchAllMarketplaceAuctionsMutation.mutate({
      filterValues: value,
      offset: 0,
    });
    router.push(`/marketplace?offset=0`);
  };

  const setAuctionsOffset = (value: number) => {
    router.push(`/marketplace?offset=${value}`);
    // fetchAllMarketplaceAuctionsMutation.mutate({
    //   filterValues: filterVal,
    //   offset: value,
    // });
  };

  return (
    <MarketplaceAuctionContext.Provider
      value={{
        auctions,
        loading:
          fetchAllMarketplaceAuctionsMutation.isPending || auctions === null,
        setFilterValue,
        pagesCount,
        setAuctionsOffset,
      }}
    >
      {children}
    </MarketplaceAuctionContext.Provider>
  );
}
