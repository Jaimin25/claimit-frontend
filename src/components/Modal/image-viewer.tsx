import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';

import { Dialog, DialogContent } from '../ui/dialog';

export default function ImageViewer({
  imgUrl,
  open,
  setOpenChange,
}: {
  imgUrl: string;
  open: boolean;
  setOpenChange: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog onOpenChange={setOpenChange} open={open}>
      <DialogContent className="border-none p-0">
        <Image
          src={imgUrl}
          width={100}
          alt={imgUrl}
          className="h-full w-full"
          height={100}
          unoptimized
        />
      </DialogContent>
    </Dialog>
  );
}
