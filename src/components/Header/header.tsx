'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiLogOut } from 'react-icons/fi';
import { IoMenu } from 'react-icons/io5';
import { RiAuctionLine } from 'react-icons/ri';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Config } from '@/lib/config';
import { useMutation } from '@tanstack/react-query';

import { useUser } from '../Providers/user-provider';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const signOutUser = async () => {
  return await axios.post(`${Config.APP_URL}/api/auth/signout`);
};

export default function Header() {
  const router = useRouter();
  const [toastId, setToastId] = useState<string | number>();

  const { isAuthenticated, user, signOut } = useUser();

  const mutation = useMutation({
    mutationFn: signOutUser,
    onSuccess: async (res) => {
      const data = await res.data;

      if (data.statusCode === 200) {
        toast.success(data.statusMessage, {
          id: toastId,
        });
        router.push('/');
        router.refresh();
        signOut();
      } else {
        toast.error(data.statusMessage, {
          id: toastId,
        });
      }
    },
    onError: (error) =>
      toast.error(`${error.name}: ${error.message}`, { id: toastId }),
  });

  const onLogoutClick = () => {
    mutation.mutate();
    const currentToastId = toast.loading('Signing out...');
    setToastId(currentToastId);
  };

  return (
    <nav className="fixed top-0 z-50 flex h-[48px] w-full items-center border border-b-gray-200 bg-white px-4 py-7 md:px-8">
      <Link href={'/'}>
        <div className="flex items-center gap-1">
          <RiAuctionLine size={28} className="fill-violet-600" />
          <h2 className="text-3xl">{Config.APP_NAME}</h2>
        </div>
      </Link>
      <div className="flex-1" />
      <div className="hidden lg:flex">
        <Link href={'/auctions/create'}>
          <Button variant={'outline'}>Sell on claimit</Button>
        </Link>
        <Link href={'/marketplace'}>
          <Button variant={'link'}>Marketplace</Button>
        </Link>
        <Link href={'/contact'}>
          <Button variant={'link'}>Contact Us</Button>
        </Link>
        <Link href={'/faq'}>
          <Button variant={'link'}>FAQs</Button>
        </Link>
        {!isAuthenticated && (
          <Link href={'/signin'}>
            <Button variant={'default'}>Sign In</Button>
          </Link>
        )}
        {isAuthenticated && (
          <Menubar className="border-none">
            <MenubarMenu>
              <MenubarTrigger>
                <Avatar>
                  <AvatarFallback>{user?.initials}</AvatarFallback>
                  <AvatarImage
                    src={user?.profilePicUrl}
                    className="object-cover"
                  />
                </Avatar>
              </MenubarTrigger>
              <MenubarContent>
                <Link href={'/dashboard/accountdetails'}>
                  <MenubarItem>Dashboard</MenubarItem>
                </Link>
                <MenubarSeparator />
                <MenubarItem
                  onClick={onLogoutClick}
                  disabled={mutation.isPending}
                >
                  <div className="flex items-center gap-2">
                    <FiLogOut />
                    Logout
                  </div>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        )}
      </div>
      <div className="flex lg:hidden">
        <Menubar className="border-none">
          <MenubarMenu>
            <MenubarTrigger className="border-none p-3 hover:cursor-pointer">
              <IoMenu size={24} />
            </MenubarTrigger>
            <MenubarContent>
              <Link href={'/auctions/create'}>
                <MenubarItem>Sell</MenubarItem>
              </Link>
              <Link href={'/marketplace'}>
                <MenubarItem>Marketplace</MenubarItem>
              </Link>
              <Link href="/contact">
                <MenubarItem>Contact Us</MenubarItem>
              </Link>
              <Link href={'/faq'}>
                <MenubarItem>FAQs</MenubarItem>
              </Link>
              <MenubarSeparator />
              {isAuthenticated && (
                <>
                  {' '}
                  <Link href={'/dashboard/accountdetails'}>
                    <MenubarItem>Dashboard</MenubarItem>
                  </Link>
                  <MenubarSeparator />
                  <MenubarItem
                    onClick={onLogoutClick}
                    disabled={mutation.isPending}
                  >
                    <div className="flex items-center gap-2">
                      <FiLogOut />
                      Logout
                    </div>
                  </MenubarItem>
                </>
              )}
              {!isAuthenticated && (
                <Link href={'/signin'}>
                  <MenubarItem>
                    <div className="flex items-center gap-2">
                      <FiLogOut />
                      Sign In
                    </div>
                  </MenubarItem>
                </Link>
              )}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </nav>
  );
}
