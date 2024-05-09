'use client';

import React, { useEffect, useState } from 'react';

import AuctionBiddersSection from './Sections/auction-bidders-section';
import AuctionClaimSection from './Sections/auction-claim-section';
import AuctionDetailsSection from './Sections/auction-details-section';
import AuctionImagesSection from './Sections/auction-images-section';
import AuctionOwnerSection from './Sections/auction-owner-section';

export default function AuctionDetails() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="flex w-full lg:w-3/4">
        <div className="flex w-full flex-col justify-center gap-8">
          <AuctionImagesSection isLoading={isLoading} />
          <AuctionDetailsSection isLoading={isLoading} />
          <AuctionOwnerSection isLoading={isLoading} />
        </div>
      </div>
      <div className="flex w-full lg:w-1/4">
        <div className="flex w-full flex-col gap-8">
          <AuctionClaimSection isLoading={isLoading} />
          <AuctionBiddersSection isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
