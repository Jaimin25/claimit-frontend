'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

import ManageAuctionForm from '@/components/Forms/manage-auctions-form';
import { Config } from '@/lib/config';
import { useMutation } from '@tanstack/react-query';

export interface ManageAuctionProps {
  title: string;
  description: string;
  category: string;
  auctionStatus: string;
  imagesUrl: string[];
  buyPrice: string;
  basePrice: string;
  startingDate: string;
  endingDate: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  img1: string;
  img2: string;
  img3: string;
  img4: string;
}

const fetchManageAuctionsDetails = async (auctionId: string) => {
  return await axios.post(
    `${Config.APP_URL}/api/auction/fetchManageAuctionDetails`,
    { auctionId },
    {
      withCredentials: true,
    }
  );
};

export default function ManageAuctions({ auctionId }: { auctionId: string }) {
  const [auctionDetails, setAuctionDetails] = useState<ManageAuctionProps>();

  const manageAuctionDetailsMutation = useMutation({
    mutationFn: fetchManageAuctionsDetails,
    onSuccess: async (res) => {
      const data = await res.data;
      if (data.statusCode === 200) {
        setAuctionDetails(data.auctionDetails as ManageAuctionProps);
        toast.success('Auction Found');
      } else {
        toast.error(data.statusMessage);
      }
    },
    onError: (error) => toast.error(`${error.name}: ${error.message}`),
  });

  useEffect(() => {
    manageAuctionDetailsMutation.mutate(auctionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ManageAuctionForm
      manageAuctionDetails={auctionDetails}
      auctionId={auctionId}
    />
  );
}
