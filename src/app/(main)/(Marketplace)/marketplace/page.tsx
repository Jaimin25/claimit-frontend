import React from 'react';

import Marketplace from '@/components/Marketplace/marketplace';
import Sidebar from '@/components/Marketplace/sidebar';

export default function MarketplacePage() {
  return (
    <div className="flex w-full gap-8 p-8">
      <div className="w-2/6">
        <Sidebar />
      </div>
      <div className="w-full">
        <Marketplace />
      </div>
    </div>
  );
}
