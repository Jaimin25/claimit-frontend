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

interface MarketplaceAuctionContextProps {
  auctions: AuctionDetailsProps[] | null;
  loading: boolean;
  setFilterValue: (value: {
    searchInput: string;
    category: string;
    sortTypeAuction: string;
    sortTypePrice: string;
  }) => void;
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

export function MarketplaceAuctionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [auctions, setAuctions] = useState<AuctionDetailsProps[] | null>(null);
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

  const setFilterValue = (value: {
    searchInput: string;
    category: string;
    sortTypeAuction: string;
    sortTypePrice: string;
  }) => {
    console.log(value);
  };

  return (
    <MarketplaceAuctionContext.Provider
      value={{
        auctions,
        loading:
          fetchAllMarketplaceAuctionsMutation.isPending || auctions === null,
        setFilterValue,
      }}
    >
      {children}
    </MarketplaceAuctionContext.Provider>
  );
}
