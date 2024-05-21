'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
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
}

const MarketplaceAuctionContext = createContext<MarketplaceAuctionContextProps>(
  {
    auctions: null,
    loading: false,
    setFilterValue: () => {},
  }
);

export const useMarketplaceAuction = () => {
  return useContext(MarketplaceAuctionContext);
};

const fetchMarketplaceAuctions = async () => {
  return await axios.get(
    `${Config.APP_URL}/api/marketplace/fetchMarketplaceAuctions`
  );
};

const filterMarketplaceAuctions = async (value: FilterProps) => {
  return await axios.get(
    `${Config.APP_URL}/api/marketplace/filterMarketplaceAuctions`,
    {
      params: value,
    }
  );
};

export function MarketplaceAuctionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [auctions, setAuctions] = useState<AuctionDetailsProps[] | null>(null);
  const [tempAuctions, setTempAuctions] = useState<
    AuctionDetailsProps[] | null
  >();

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

  const filterMarketplaceAuctionMutation = useMutation({
    mutationFn: filterMarketplaceAuctions,
    onSuccess: async (res) => {
      const data = await res.data;
      setTempAuctions(tempAuctions ? tempAuctions : auctions);
      if (data.statusCode === 200) {
        setAuctions(data.filteredAuctions);
      } else {
        setAuctions([]);
      }
    },
    onError: (error) => toast.error(`${error.name}: ${error.message}`),
  });

  useEffect(() => {
    fetchAllMarketplaceAuctionsMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setFilterValue = (value: FilterProps) => {
    console.log(value);
    if (
      !value.searchInput &&
      !value.category &&
      !value.sortTypeAuction &&
      !value.sortTypePrice
    ) {
      if (tempAuctions) {
        setAuctions(tempAuctions);
      }
      return;
    }
    filterMarketplaceAuctionMutation.mutate(value);
  };

  return (
    <MarketplaceAuctionContext.Provider
      value={{
        auctions,
        loading:
          fetchAllMarketplaceAuctionsMutation.isPending ||
          auctions === null ||
          filterMarketplaceAuctionMutation.isPending,
        setFilterValue,
      }}
    >
      {children}
    </MarketplaceAuctionContext.Provider>
  );
}
