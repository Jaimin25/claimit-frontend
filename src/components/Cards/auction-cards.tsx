import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaClock, FaGavel, FaWallet } from 'react-icons/fa';
import { HiUsers } from 'react-icons/hi';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { getAuctionEndTime } from '@/lib/utils';

import { AuctionDetailsProps } from '../Marketplace/marketplace';

export default function AuctionCards({
  auction,
}: {
  auction: AuctionDetailsProps;
}) {
  const [endTime, setEndTime] = useState('--:--:--');

  useEffect(() => {
    const interval = setInterval(() => {
      setEndTime(getAuctionEndTime(auction.endingDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [auction.endingDate]);

  return (
    <Card>
      <CardContent className="pt-8">
        <div className="flex flex-col gap-4">
          <div className="w-30 flex h-48 items-center justify-center rounded-md bg-gray-200">
            <Image
              height={250}
              width={200}
              src={auction.imagesUrl[0]!}
              alt="img1"
              className="h-full w-full rounded-md object-cover"
            />
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={auction.user.profilePicUrl}
                className="object-cover"
              />
              <AvatarFallback>CJ</AvatarFallback>
            </Avatar>
            <p>{auction.user.username}</p>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-semibold">{auction.title}</p>
            <div className="flex items-center gap-2">
              <FaGavel size={20} className="fill-emerald-500" />₹
              {auction.basePrice} (Bid price)
            </div>
            <div className="flex items-center gap-2">
              <FaWallet size={20} className="fill-amber-500" />₹
              {auction.buyPrice} (Buy price)
            </div>
            <div className="flex items-center gap-2">
              <HiUsers size={20} className="fill-violet-500" />
              <p>{auction.bids.length}</p>
            </div>
            <div className="flex items-center gap-2">
              <FaClock size={20} className="fill-blue-500" />
              <p>{endTime}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="w-full space-x-4">
        <Link href={`/auctions/view/${auction.id}`} className="w-full">
          <Button variant={'outline'} className="w-full">
            Bid
          </Button>
        </Link>
        <Link href={`/auctions/view/${auction.id}`} className="w-full">
          <Button variant={'default'} className="w-full">
            Buy
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
