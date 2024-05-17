import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaClock, FaGavel, FaWallet } from 'react-icons/fa';
import { HiUsers } from 'react-icons/hi';
import { LuImageOff } from 'react-icons/lu';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { getAuctionEndTime } from '@/lib/utils';

export default function AuctionCards() {
  const [endTime, setEndTime] = useState('nill');

  const deadline = 'June 1, 2024';

  useEffect(() => {
    const interval = setInterval(() => {
      setEndTime(getAuctionEndTime(deadline));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardContent className="pt-8">
        <div className="flex flex-col gap-4">
          <div className="w-30 flex h-48 items-center justify-center bg-gray-200">
            <LuImageOff size={24} />
          </div>
          <div className="flex gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="https://github.com/jaimin25.png" />
              <AvatarFallback>CJ</AvatarFallback>
            </Avatar>
            <p>User Name</p>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-semibold">Title</p>
            <div className="flex items-center gap-2">
              <FaGavel size={20} className="fill-emerald-500" />
              ₹1000 (Bid price)
            </div>
            <div className="flex items-center gap-2">
              <FaWallet size={20} className="fill-amber-500" />
              ₹2000 (Buy price)
            </div>
            <div className="flex items-center gap-2">
              <HiUsers size={20} className="fill-violet-500" />
              <p>10</p>
            </div>
            <div className="flex items-center gap-2">
              <FaClock size={20} className="fill-blue-500" />
              <p>{endTime}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="w-full space-x-4">
        <Link href={`/auctions/view/id-2414`} className="w-full">
          <Button variant={'outline'} className="w-full">
            Bid
          </Button>
        </Link>
        <Link href={`/auctions/view/id-2414`} className="w-full">
          <Button variant={'default'} className="w-full">
            Buy
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
