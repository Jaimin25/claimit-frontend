'use client';
import React, { useEffect, useState } from 'react';
import { FaClock, FaWallet } from 'react-icons/fa';
import { FaGavel } from 'react-icons/fa';
import { HiUsers } from 'react-icons/hi';
import { LuImageOff } from 'react-icons/lu';

import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';

export default function DashboardAuctionCard() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const deadline = 'May, 15, 2024';

  const getTime = (deadline: string) => {
    const time = Date.parse(deadline) - Date.now();

    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(deadline), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Card>
        <div className="flex">
          <div className="flex w-36 items-center justify-center bg-gray-200">
            <LuImageOff size={24} />
          </div>
          <div>
            <CardHeader>
              <p className="text-2xl font-semibold">Title</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
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
                  <p>
                    {days}d {hours}h {minutes}m {seconds}s
                  </p>
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
