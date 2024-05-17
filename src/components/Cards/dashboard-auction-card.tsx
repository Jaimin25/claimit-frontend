'use client';
import { useEffect, useState } from 'react';
import { FaClock, FaGavel, FaWallet } from 'react-icons/fa';
import { HiUsers } from 'react-icons/hi';
import { LuImageOff } from 'react-icons/lu';

import { getAuctionEndTime } from '@/lib/utils';

import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';

export default function DashboardAuctionCard() {
  const [endTime, setEndTime] = useState('nill');

  const deadline = 'June 1, 2024';

  useEffect(() => {
    const interval = setInterval(
      () => setEndTime(getAuctionEndTime(deadline)),
      1000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Card>
        <div className="flex flex-col md:flex-row">
          <div>
            <div className="flex h-36 w-full items-center justify-center bg-gray-200 md:h-full md:w-36">
              <LuImageOff size={24} />
            </div>
          </div>
          <div>
            <CardHeader>
              <p className="text-2xl font-semibold">Title</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 lg:grid-cols-2">
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
            </CardContent>
            <CardFooter className="space-x-4">
              <Button variant={'default'}>Manage</Button>
              <Button variant={'secondary'}>View</Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
}
