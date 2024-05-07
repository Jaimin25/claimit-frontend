import React from 'react';
import { TrendingUp } from 'lucide-react';
import { FaUser } from 'react-icons/fa';
import { GiConfirmed } from 'react-icons/gi';
import { MdOutlinePendingActions } from 'react-icons/md';

import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <div className="flex h-screen w-full flex-1 flex-col items-center justify-center gap-4">
      <h1 className="text-center text-3xl">
        A marketplace where selling or buying old goods gets easier
      </h1>
      <div className="space-x-3">
        <Button variant={'outline'} className="w-36">
          Buy on Claimit
        </Button>
        <Button variant={'outline'} className="w-36">
          Sell on Claimit
        </Button>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Button
          variant={'outline'}
          className="flex h-36 w-36 flex-col space-x-2"
        >
          <div className="flex gap-2">
            <TrendingUp className="stroke-emerald-500" />
            100
          </div>
          Trending auctions
        </Button>
        <Button
          variant={'outline'}
          className="flex h-36 w-36 flex-col space-x-2 p-10"
        >
          <div className="flex gap-2">
            <MdOutlinePendingActions size={18} className="fill-orange-500" />
            100
          </div>
          Auctions ending
          <br /> soon
        </Button>
        <Button
          variant={'outline'}
          className="flex h-36 w-36 flex-col space-x-2"
        >
          <div className="flex gap-2">
            <GiConfirmed size={18} className="fill-sky-500" />
            100
          </div>
          Auctions sold
        </Button>
        <Button
          variant={'outline'}
          className="flex h-36 w-36 flex-col space-x-2"
        >
          <div className="flex gap-2">
            <FaUser className="fill-violet-500" />
            100
          </div>
          Registered users
        </Button>
      </div>
    </div>
  );
}
