'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { AiOutlineShop } from 'react-icons/ai';
import { BiConfused } from 'react-icons/bi';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Config } from '@/lib/config';
import { useMutation } from '@tanstack/react-query';

import AuctionBiddersSection from './Sections/auction-bidders-section';
import AuctionClaimSection from './Sections/auction-claim-section';
import AuctionDetailsSection from './Sections/auction-details-section';
import AuctionImagesSection from './Sections/auction-images-section';
import AuctionOwnerSection from './Sections/auction-owner-section';

export interface AuctionDetailsProps {
  id: string;
  title: string;
  description: string;
  imagesUrl: string[];
  buyPrice: string;
  basePrice: string;
  auctionStatus: string;
  startingDate: string;
  endingDate: string;
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
    bids: { id: number }[];
    auctions: { id: string }[];
  };
  bids: {
    id: number;
    amount: string;
    createdAt: Date;
    user: {
      username: string;
      profilePicUrl: string;
    };
  }[];
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
  const [error, setError] = useState();

  const auctionDetailsMutation = useMutation({
    mutationFn: fetchAuctionDetails,
    onSuccess: async (res) => {
      const data = await res.data;
      if (data.statusCode === 200) {
        setAuctionDetails(data.auctionDetails);
      } else {
        setError(data.statusMessage);
      }
    },
    onError: (error) => toast.error(`${error.name}: ${error.message}`),
  });

  useEffect(() => {
    auctionDetailsMutation.mutate(auctionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error && error === 'No auction found with the provided id!') {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
        <h2 className="flex items-center gap-2 text-2xl font-semibold">
          <p>Oops! Looks like you are lost</p> <BiConfused size={24} />
        </h2>
        <p>The auction could not be found</p>
        <Link href="/marketplace?offset=0">
          <Button className="flex items-center gap-2">
            <AiOutlineShop size={20} /> <p>Go to marketplace</p>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="flex w-full lg:w-3/4">
        <div className="flex w-full flex-col justify-center gap-8">
          <AuctionImagesSection
            isLoading={auctionDetailsMutation.isPending || !auctionDetails}
            images={auctionDetails?.imagesUrl as string[]}
          />
          <AuctionDetailsSection
            isLoading={auctionDetailsMutation.isPending || !auctionDetails}
            description={auctionDetails?.description as string}
          />
          <AuctionOwnerSection
            isLoading={auctionDetailsMutation.isPending || !auctionDetails}
            user={auctionDetails?.user as AuctionDetailsProps['user']}
            totalBids={auctionDetails?.user!.bids!.length as number}
            totalAuctions={auctionDetails?.user!.auctions!.length as number}
            createdAt={auctionDetails?.user!.createdAt as Date}
          />
        </div>
      </div>
      <div className="flex w-full lg:w-1/4">
        <div className="flex w-full flex-col gap-8">
          <AuctionClaimSection
            isLoading={auctionDetailsMutation.isPending || !auctionDetails}
            bidders={auctionDetails?.bids!.length as number}
            deadline={auctionDetails?.endingDate as string}
            auctionStatus={auctionDetails?.auctionStatus as string}
            buyPrice={auctionDetails?.buyPrice as string}
            title={auctionDetails?.title as string}
          />
          <AuctionBiddersSection
            isLoading={auctionDetailsMutation.isPending || !auctionDetails}
            bids={auctionDetails?.bids as AuctionDetailsProps['bids']}
          />
        </div>
      </div>
    </div>
  );
}
