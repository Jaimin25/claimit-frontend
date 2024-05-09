import * as React from 'react';
import Image from 'next/image';

import AuctionImagesSectionSkele from '@/components/Skeletons/AuctionDetailsSkeletons/auction-images-section-skele';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const images = [
  'https://geauction.com/wp-content/uploads/2018/07/5-Auction-Tips-for-Beginners2.jpg',
  'https://www.shutterstock.com/image-vector/hands-holding-auction-paddles-vector-600nw-204944743.jpg',
];

export default function AuctionImagesSection({
  isLoading,
}: {
  isLoading: boolean;
}) {
  const [open, setOpenChange] = React.useState(false);
  const [imgUrl, setImgUrl] = React.useState('');

  if (isLoading) {
    return <AuctionImagesSectionSkele />;
  }

  return (
    <div className="flex w-full justify-center">
      <Carousel className="w-full max-w-64 sm:max-w-lg lg:max-w-3xl">
        <CarouselContent className="w-full">
          {images.map((url, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="w-full">
                  <CardContent className="flex aspect-video items-center justify-center p-6">
                    <Image
                      src={url}
                      width={250}
                      alt={url}
                      className="h-full w-full hover:cursor-pointer"
                      height={100}
                      onClick={() => {
                        setImgUrl(url);
                        setOpenChange(true);
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <Dialog onOpenChange={setOpenChange} open={open}>
        <DialogContent className="border-none p-0">
          <Image
            src={imgUrl}
            width={250}
            alt={imgUrl}
            className="h-full w-full"
            height={100}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
