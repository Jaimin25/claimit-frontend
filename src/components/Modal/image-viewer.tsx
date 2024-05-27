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
      <DialogContent className="w-full max-w-5xl border-none p-0">
        <Image
          src={imgUrl}
          width={100}
          alt={imgUrl}
          className="h-full w-full"
          height={100}
          loading={'lazy'}
          unoptimized
        />
      </DialogContent>
    </Dialog>
  );
}
