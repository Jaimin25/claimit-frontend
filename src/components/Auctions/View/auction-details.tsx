import React from 'react';

import AuctionBiddersSection from './Sections/auction-bidders-section';
import AuctionClaimSection from './Sections/auction-claim-section';
import AuctionDetailsSection from './Sections/auction-details-section';
import AuctionImagesSection from './Sections/auction-images-section';
import AuctionOwnerSection from './Sections/auction-owner-section';

export default function AuctionDetails() {
  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="flex w-full lg:w-3/4">
        <div className="flex flex-col justify-center gap-8">
          <AuctionImagesSection />
          <AuctionDetailsSection />
          <AuctionOwnerSection />
        </div>
      </div>
      <div className="flex w-full lg:w-1/4">
        <div className="flex w-full flex-col gap-8">
          <AuctionClaimSection />
          <AuctionBiddersSection />
        </div>
      </div>
    </div>
  );
}
