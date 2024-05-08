import React from 'react';
import Link from 'next/link';
import { FaChevronDown } from 'react-icons/fa';
import { IoMdList } from 'react-icons/io';
import { MdAccountBalanceWallet, MdAccountCircle } from 'react-icons/md';
import { RiAuctionFill } from 'react-icons/ri';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';

export default function MobileNav() {
  return (
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
  );
}
