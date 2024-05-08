import React from 'react';

import MobileNav from '@/components/Dashboard/mobile-nav';
import Sidebar from '@/components/Dashboard/sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center lg:flex-row">
      <div className="sidebar-container hidden h-full w-1/6 border-r border-gray-200 bg-white p-6 lg:block">
        <Sidebar />
      </div>
      <div className="block w-full p-6 lg:hidden">
        <MobileNav />
      </div>
      <div className="children-container h-full w-full p-6 lg:w-5/6">
        {children}
      </div>
    </div>
  );
}
