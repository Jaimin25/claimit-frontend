'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { MdRefresh } from 'react-icons/md';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { useUser } from '../Providers/user-provider';
import UserBidsSkeleton from '../Skeletons/user-bids-skeleton';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';

export default function MyBids() {
  const { userBids, refreshUserBids } = useUser();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!userBids) {
      refreshUserBids(offset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full w-full">
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <h3 className="text-3xl font-semibold">Your Bids</h3>
            <Button
              variant={'outline'}
              onClick={() => {
                if (!userBids) {
                  refreshUserBids(0);
                  setOffset(0);
                } else {
                  refreshUserBids(offset);
                }
              }}
            >
              <MdRefresh size={20} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* <div className="flex items-center gap-2"> */}
          {/*   <FaSearch /> */}
          {/*   <Input placeholder="Search auctions..." /> */}
          {/* </div> */}
          {userBids && userBids.length >= 0 ? (
            <div>
              <Table>
                <TableCaption>A list of your bids.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Auction Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userBids.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        <Link href={`/auctions/view/${item.auction.id}`}>
                          <Button variant={'link'} className="p-0">
                            {item.auction.title}
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell
                        className={cn(
                          'font-semibold',
                          item.auction.auctionStatus === 'ACTIVE'
                            ? 'text-green-500'
                            : 'text-red-500'
                        )}
                      >
                        {item.auction.auctionStatus}
                      </TableCell>
                      <TableCell>
                        ₹
                        {new Intl.NumberFormat('en-IN').format(
                          Number(item.amount)
                        )}
                      </TableCell>
                      <TableCell>
                        {moment(item.createdAt)
                          .format('MMMM Do, h:mm a')
                          .toString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex w-full justify-end gap-2">
                <Button
                  variant={'outline'}
                  onClick={() => {
                    setOffset(offset - 10);
                    refreshUserBids(offset - 10);
                  }}
                  disabled={offset === 0}
                >
                  Previous
                </Button>
                <Button
                  variant={'outline'}
                  onClick={() => {
                    setOffset(offset + 10);
                    refreshUserBids(offset + 10);
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : userBids && userBids.length === 0 ? (
            'No bids found!'
          ) : (
            <UserBidsSkeleton rows={6} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
