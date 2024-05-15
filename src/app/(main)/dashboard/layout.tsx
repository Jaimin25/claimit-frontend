import React from 'react';

import MobileNav from '@/components/Dashboard/mobile-nav';
import Sidebar from '@/components/Dashboard/sidebar';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-6 p-6 lg:flex-row">
      <div className="sidebar-container sticky top-20 hidden h-1/2 w-1/6 lg:block">
        <Sidebar />
      </div>
      <div className="block w-full p-6 lg:hidden">
        <MobileNav />
      </div>
      <div className="children-container h-full w-full lg:w-5/6">
        {children}
      </div>
    </div>
  );
}
