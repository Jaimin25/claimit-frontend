import React from 'react';
import Link from 'next/link';
import { RiAuctionLine } from 'react-icons/ri';

import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/config';

export default function Header() {
  return (
    <nav className="fixed top-0 flex h-[48px] w-full items-center border border-b-gray-200 bg-white px-8 py-7">
      <Link href={'/'}>
        <div className="flex items-center gap-1">
          <RiAuctionLine size={28} />
          <h2 className="text-3xl">{APP_NAME}</h2>
        </div>
      </Link>
      <div className="flex-1" />
      <div className="gap flex">
        <Button variant={'link'}>Marketplace</Button>
        <Button variant={'link'}>Contact</Button>
        <Button variant={'link'}>FAQs</Button>
        <Button variant={'outline'}>Sign In</Button>
      </div>
    </nav>
  );
}
