'use client';

import AuctionCards from '@/components/Cards/auction-cards';

export default function FeatureSection() {
  return (
    <div className="flex-1 bg-white p-8">
      <div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {new Array(3).fill(0).map((_, i) => (
            <AuctionCards key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
