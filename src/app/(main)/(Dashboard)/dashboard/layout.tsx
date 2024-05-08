import React from 'react';
import Link from 'next/link';
import { FaChevronDown } from 'react-icons/fa';
import { IoMdList } from 'react-icons/io';
import { MdAccountBalanceWallet, MdAccountCircle } from 'react-icons/md';
import { RiAuctionFill } from 'react-icons/ri';

import Sidebar from '@/components/Dashboard/sidebar';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
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
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>
              Navigation <FaChevronDown className="mx-2" />
            </MenubarTrigger>
            <MenubarContent>
              <Link href={'/dashboard/accountdetails'}>
                <MenubarItem className="flex items-center gap-2">
                  <MdAccountCircle size={24} />
                  Account Details
                </MenubarItem>
              </Link>
              <Link href={'/dashboard/wallet'}>
                <MenubarItem className="flex items-center gap-2">
                  <MdAccountBalanceWallet size={24} />
                  Wallet
                </MenubarItem>
              </Link>
              <Link href={'/dashboard/myauctions'}>
                <MenubarItem className="flex items-center gap-2">
                  <RiAuctionFill size={24} />
                  My Auctions
                </MenubarItem>
              </Link>
              <Link href={'/dashboard/mybids'}>
                <MenubarItem className="flex items-center gap-2">
                  <IoMdList size={24} />
                  My Bids
                </MenubarItem>
              </Link>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <div className="children-container h-full w-full p-6 lg:w-5/6">
        {children}
      </div>
    </div>
  );
}
