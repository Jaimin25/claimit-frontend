import React from 'react';

import Sidebar from '@/components/Dashboard/sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full">
      <Sidebar />
      {children}
    </div>
  );
}
