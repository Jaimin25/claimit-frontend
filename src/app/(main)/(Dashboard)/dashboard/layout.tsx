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
      <div className="children-container h-full w-5/6 p-6">{children}</div>
    </div>
  );
}
