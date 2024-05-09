import React from 'react';
import Link from 'next/link';
import {
  RiAuctionLine,
  RiFacebookLine,
  RiInstagramLine,
  RiTwitterLine,
} from 'react-icons/ri';

import { APP_NAME } from '@/lib/config';

import { Button } from '../ui/button';

export default function Footer() {
  return (
    <footer className="border-top-gray-200 flex flex-col gap-4 border bg-white px-20 pb-4 pt-8">
      <div className="flex justify-between">
        <div className="flex flex-col justify-center gap-2">
          <div className="items-center justify-center">
            <Link href={'/'}>
              <div className="flex items-center justify-center gap-1">
                <RiAuctionLine size={28} />
                <h2 className="text-3xl">{APP_NAME}</h2>
              </div>
            </Link>
          </div>
          <div className="border border-black/50" />
          <div className="flex gap-1">
            <Button variant={'link'}>
              <RiInstagramLine size={24} />
            </Button>
            <Button variant={'link'}>
              <RiFacebookLine size={24} />
            </Button>
            <Button variant={'link'}>
              <RiTwitterLine size={24} />
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex flex-col gap-2 text-center">
            <Link href={'/marketplace'} className="hover:underline">
              Buy Item
            </Link>
            <Link href={'*'} className="hover:underline">
              Sell Item
            </Link>
            <Link href={'*'} className="hover:underline">
              Privacy Policy
            </Link>
            <Link href={'/contact'} className="hover:underline">
              Contact Us
            </Link>
            <Link href={'*'} className="hover:underline">
              About Us
            </Link>
          </div>
        </div>
      </div>
      <div>
        <p className="text-center">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
