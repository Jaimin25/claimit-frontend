'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

import { Config } from '@/lib/config';
import { useMutation } from '@tanstack/react-query';

import AuctionBiddersSection from './Sections/auction-bidders-section';
import AuctionClaimSection from './Sections/auction-claim-section';
import AuctionDetailsSection from './Sections/auction-details-section';
import AuctionImagesSection from './Sections/auction-images-section';
import AuctionOwnerSection from './Sections/auction-owner-section';

interface AuctionDetailsProps {
  id: string;
  title: string;
  description: string;
  imagesUrl: string[];
  buyPrice: string;
  basePrice: string;
  auctionStatus: string;
  startingDate: Date;
  endingDate: Date;
  city: string;
  state: string;
  country: string;
  user: {
    username: string;
    profilePicUrl: string;
    city: string;
    state: string;
    country: string;
    createdAt: Date;
  };
  bid: {
    amount: string;
    createdAt: Date;
    user: {
      username: string;
      profilePicUrl: string;
    };
  };
  createdAt: Date;
}

const fetchAuctionDetails = async (auctionId: string) => {
  return await axios.get(`${Config.APP_URL}/api/auction/getAuctionById`, {
    params: {
      auctionId: auctionId,
    },
  });
};

export default function AuctionDetails({ auctionId }: { auctionId: string }) {
  const [auctionDetails, setAuctionDetails] = useState<AuctionDetailsProps>();

  const auctionDetailsMutation = useMutation({
    mutationFn: fetchAuctionDetails,
    onSuccess: async (res) => {
      const data = await res.data;
      if (data.statusCode === 200) {
        setAuctionDetails(data.auctionDetails);
      }
    },
    onError: (error) => toast.error(`${error.name}: ${error.message}`),
  });

  useEffect(() => {
    auctionDetailsMutation.mutate(auctionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="flex w-full lg:w-3/4">
        <div className="flex w-full flex-col justify-center gap-8">
          <AuctionImagesSection
            isLoading={auctionDetailsMutation.isPending}
            images={!auctionDetails ? [''] : auctionDetails.imagesUrl}
          />
          <AuctionDetailsSection isLoading={auctionDetailsMutation.isPending} />
          <AuctionOwnerSection isLoading={auctionDetailsMutation.isPending} />
        </div>
      </div>
      <div className="flex w-full lg:w-1/4">
        <div className="flex w-full flex-col gap-8">
          <AuctionClaimSection isLoading={auctionDetailsMutation.isPending} />
          <AuctionBiddersSection isLoading={auctionDetailsMutation.isPending} />
        </div>
      </div>
    </div>
  );
}
