import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';

export default function AuctionImagesSectionSkele() {
  return (
    <div className="flex w-full justify-center">
      <Carousel className="w-full max-w-64 sm:max-w-lg lg:max-w-3xl">
        <CarouselContent className="w-full">
          {Array.from({ length: 1 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="w-full p-0">
                  <CardContent className="flex aspect-video items-center justify-center p-0">
                    <Skeleton className="h-full w-full" />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
