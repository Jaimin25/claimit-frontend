import * as React from 'react';
import Image from 'next/image';

import ImageViewer from '@/components/Modal/image-viewer';
import AuctionImagesSectionSkele from '@/components/Skeletons/AuctionDetailsSkeletons/auction-images-section-skele';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

// const images = [
//   'https://geauction.com/wp-content/uploads/2018/07/5-Auction-Tips-for-Beginners2.jpg',
//   'https://www.shutterstock.com/image-vector/hands-holding-auction-paddles-vector-600nw-204944743.jpg',
// ];

export default function AuctionImagesSection({
  isLoading,
  images,
}: {
  isLoading: boolean;
  images: string[];
}) {
  const [open, setOpenChange] = React.useState(false);
  const [imgUrl, setImgUrl] = React.useState('');

  if (isLoading) {
    return <AuctionImagesSectionSkele />;
  }

  return (
    <div className="flex w-full items-center justify-center">
      <Carousel className="w-full max-w-64 sm:max-w-lg lg:max-w-3xl">
        <CarouselContent className="ml-0 w-full">
          {images.map((url, index) => (
            <CarouselItem key={index} className="p-0">
              <div className="p-1">
                <Card className="w-full">
                  <CardContent className="flex aspect-square items-center justify-center p-0 md:aspect-video">
                    <Image
                      src={url}
                      width={250}
                      alt={url}
                      className="h-full w-full rounded-md object-cover hover:cursor-pointer"
                      height={100}
                      onClick={() => {
                        setImgUrl(url);
                        setOpenChange(true);
                      }}
                      loading="lazy"
                      unoptimized
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
      <ImageViewer open={open} imgUrl={imgUrl} setOpenChange={setOpenChange} />
    </div>
  );
}
