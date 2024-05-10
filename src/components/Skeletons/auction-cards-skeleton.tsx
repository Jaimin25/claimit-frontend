import { FaClock, FaGavel, FaWallet } from 'react-icons/fa';
import { HiUsers } from 'react-icons/hi';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AuctionCardsSkeleton() {
  return (
    <Card>
      <CardContent className="pt-8">
        <div className="flex flex-col gap-4">
          <Skeleton>
            <div className="w-30 flex h-48 items-center justify-center"></div>
          </Skeleton>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="w-1/2" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <div className="flex items-center gap-2">
              <FaGavel size={20} className="fill-emerald-500" />
              <Skeleton className="h-6 w-2/5" />
            </div>
            <div className="flex items-center gap-2">
              <FaWallet size={20} className="fill-amber-500" />
              <Skeleton className="h-6 w-2/5" />
            </div>
            <div className="flex items-center gap-2">
              <HiUsers size={20} className="fill-violet-500" />
              <Skeleton className="h-6 w-2/5" />
            </div>
            <div className="flex items-center gap-2">
              <FaClock size={20} className="fill-blue-500" />
              <Skeleton className="h-6 w-2/5" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="w-full space-x-4">
        <Button variant={'outline'} className="w-full" disabled>
          Bid
        </Button>
        <Button variant={'default'} className="w-full" disabled>
          Buy
        </Button>
      </CardFooter>
    </Card>
  );
}
