import { Suspense } from 'react';

import Marketplace from '@/components/Marketplace/marketplace';
import Sidebar from '@/components/Marketplace/sidebar';
import { MarketplaceAuctionsProvider } from '@/components/Providers/marketplace-auctions-provider';

export default function MarketplacePage() {
  return (
    <Suspense>
      <MarketplaceAuctionsProvider>
        <div className="flex w-full flex-col gap-8 p-8 lg:flex-row">
          <div className="w-full lg:w-2/6">
            <Sidebar />
          </div>
          <div className="w-full">
            <Marketplace />
          </div>
        </div>
      </MarketplaceAuctionsProvider>
    </Suspense>
  );
}
