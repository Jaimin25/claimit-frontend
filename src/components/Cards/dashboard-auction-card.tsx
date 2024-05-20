'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaClock, FaGavel, FaWallet } from 'react-icons/fa';
import { HiUsers } from 'react-icons/hi';

import { getAuctionEndTime } from '@/lib/utils';

import { UserAuctionsProps } from '../Dashboard/myauctions';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';

export default function DashboardAuctionCard({
  auction,
}: {
  auction: UserAuctionsProps;
}) {
  const [endTime, setEndTime] = useState('--:--:--');

  useEffect(() => {
    if (auction.endingDate && auction.auctionStatus === 'ACTIVE') {
      const interval = setInterval(
        () => setEndTime(getAuctionEndTime(auction.endingDate)),
        1000
      );

      return () => clearInterval(interval);
    }
  }, [auction.auctionStatus, auction.endingDate]);

  return (
    <div>
      <Card>
        <div className="flex flex-col lg:flex-row">
          <div>
            <div className="flex h-52 w-full items-center justify-center lg:h-full lg:w-44">
              <Image
                height={250}
                width={200}
                src={auction.imagesUrl[0]!}
                alt="img1"
                className="h-full w-full rounded-tl-md  rounded-tr-md object-cover lg:rounded-bl-md lg:rounded-tr-none"
              />
            </div>
          </div>
          <div>
            <CardHeader>
              <p className="text-2xl font-semibold">
                {auction.title}{' '}
                {auction.auctionStatus !== 'ACTIVE' &&
                  `(${auction.auctionStatus})`}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 lg:grid-cols-1">
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
            </CardContent>
            <CardFooter className="space-x-4">
              <Button variant={'default'}>Manage</Button>
              <Link href={`/auctions/view/${auction.id}`}>
                <Button variant={'secondary'}>View</Button>
              </Link>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
}
