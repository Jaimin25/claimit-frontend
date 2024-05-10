import Link from 'next/link';
import { BiConfused } from 'react-icons/bi';
import { IoHomeOutline } from 'react-icons/io5';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
      <h2 className="flex items-center gap-2 text-2xl font-semibold">
        <p>Oops! Looks like you are lost</p> <BiConfused size={24} />
      </h2>
      <p>This page could not be found</p>
      <Link href="/">
        <Button className="flex items-center gap-2">
          <IoHomeOutline size={20} /> <p>Go to home</p>
        </Button>
      </Link>
    </div>
  );
}
