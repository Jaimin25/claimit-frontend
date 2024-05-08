import React from 'react';
import Link from 'next/link';
import { FiLogOut } from 'react-icons/fi';
import { IoMenu } from 'react-icons/io5';
import { RiAuctionLine } from 'react-icons/ri';

import { Button } from '@/components/ui/button';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { APP_NAME } from '@/lib/config';

export default function Header() {
  return (
    <nav className="fixed top-0 z-50 flex h-[48px] w-full items-center border border-b-gray-200 bg-white px-4 py-7 md:px-8">
      <Link href={'/'}>
        <div className="flex items-center gap-1">
          <RiAuctionLine size={28} />
          <h2 className="text-3xl">{APP_NAME}</h2>
        </div>
      </Link>
      <div className="flex-1" />
      <div className="hidden lg:flex">
        <Link href={'/marketplace'}>
          <Button variant={'link'}>Marketplace</Button>
        </Link>
        <Link href={'/contact'}>
          <Button variant={'link'}>Contact Us</Button>
        </Link>
        <Button variant={'link'}>FAQs</Button>
        <Link href={'/signin'}>
          <Button variant={'outline'}>Sign In</Button>
        </Link>
      </div>
      <div className="flex lg:hidden">
        <Menubar className="border-none">
          <MenubarMenu>
            <MenubarTrigger className="border-none p-1 hover:cursor-pointer">
              <IoMenu size={24} />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Sell</MenubarItem>
              <MenubarItem>
                <Link href={'/marketplace'}>Marketplace</Link>
              </MenubarItem>
              <Link href="/contact">
                <MenubarItem>Contact Us</MenubarItem>
              </Link>
              <MenubarItem>FAQs</MenubarItem>
              <MenubarSeparator />
              <Link href={'/signin'}>
                <MenubarItem>
                  <div className="flex items-center gap-2">
                    <FiLogOut />
                    Logout / Sign In
                  </div>
                </MenubarItem>
              </Link>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </nav>
  );
}
