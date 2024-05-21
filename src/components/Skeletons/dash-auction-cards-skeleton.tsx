import { FaClock, FaGavel, FaWallet } from 'react-icons/fa';
import { HiUsers } from 'react-icons/hi';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashAuctionCardsSkele() {
  return (
    <div>
      <Card>
        <div className="flex flex-col lg:flex-row">
          <div>
            <Skeleton className="flex h-52 w-full items-center justify-center rounded-b-none rounded-tl-md rounded-tr-md object-cover lg:h-full lg:w-44 lg:rounded-bl-md lg:rounded-tr-none" />
          </div>
          <div className="w-full">
            <CardHeader>
              <Skeleton className="h-6 w-4/5 sm:w-2/3" />
            </CardHeader>
            <CardContent>
              <div className="grid w-full gap-2 lg:grid-cols-1">
                <div className="flex items-center gap-2">
                  <FaGavel size={20} className="fill-emerald-500" />
                  <Skeleton className="h-6 w-3/5 sm:w-2/5" />
                </div>
                <div className="flex items-center gap-2">
                  <FaWallet size={20} className="fill-amber-500" />
                  <Skeleton className="h-6 w-3/5 sm:w-2/5" />
                </div>
                <div className="flex items-center gap-2">
                  <HiUsers size={20} className="fill-violet-500" />
                  <Skeleton className="h-6 w-3/5 sm:w-2/5" />
                </div>
                <div className="flex items-center gap-2">
                  <FaClock size={20} className="fill-blue-500" />
                  <Skeleton className="h-6 w-3/5 sm:w-2/5" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="space-x-4">
              <Button variant={'default'} disabled>
                Manage
              </Button>
              <Button variant={'secondary'} disabled>
                View
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
}
