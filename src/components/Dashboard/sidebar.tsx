import React from 'react';
import Link from 'next/link';
import { IoMdList } from 'react-icons/io';
import { MdAccountBalanceWallet, MdAccountCircle } from 'react-icons/md';
import { RiAuctionFill } from 'react-icons/ri';

import { Button } from '../ui/button';

export default function Sidebar() {
  return (
    <div className="sidebar-container h-full w-1/6 border-r border-gray-200 bg-white p-6">
      <div className="flex flex-col gap-2">
        <Link href={'/dashboard/accountdetails'}>
          <Button variant={'ghost'} className="flex w-full justify-start gap-2">
            <MdAccountCircle size={24} />
            Account Details
          </Button>
        </Link>
        <Link href={'/dashboard/wallet'}>
          <Button variant={'ghost'} className="flex w-full justify-start gap-2">
            <MdAccountBalanceWallet size={24} />
            Wallet
          </Button>
        </Link>
        <Link href={'/dashboard/myauctions'}>
          <Button variant={'ghost'} className="flex w-full justify-start gap-2">
            <RiAuctionFill size={24} />
            My Auctions
          </Button>
        </Link>
        <Link href={'/dashboard/mybids'}>
          <Button variant={'ghost'} className="flex w-full justify-start gap-2">
            <IoMdList size={24} />
            My Bids
          </Button>
        </Link>
      </div>
    </div>
  );
}
