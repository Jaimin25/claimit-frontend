'use client';

import { cn } from '@/lib/utils';

import { AnimatedList } from '../magicui/animates-list';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface Item {
  name: string;
  description: string;
  description2?: string | null;
  avatar: string;
  time: string;
}

let notifications = [
  {
    name: 'User 1',
    description: 'Claimit has best support!',
    time: '15m ago',
    avatar: 'https://avatars.githubusercontent.com/u/59228569',
  },
  {
    name: 'User 2',
    description: 'Sold my atique stamps very fast and easily',
    time: '10m ago',
    avatar: 'https://avatars.githubusercontent.com/u/106103625',
  },
  {
    name: 'User 3',
    description: 'Claimit is really great!!',
    time: '2m ago',
    avatar: 'https://avatars.githubusercontent.com/u/20110627',
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({
  name,
  description,
  description2,
  avatar,
  time,
}: Item) => {
  return (
    <figure
      className={cn(
        'relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4',
        // animation styles
        'transition-all duration-200 ease-in-out hover:scale-[103%]',
        // light styles
        'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
        // dark styles
        'transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]'
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl">
          <Avatar>
            <AvatarImage src={avatar} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
          {description2 && (
            <p className="text-sm font-normal dark:text-white/60">
              {description2}
            </p>
          )}
        </div>
      </div>
    </figure>
  );
};

export function AnimatedListDemo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative flex h-[325px] w-full flex-col overflow-hidden rounded-lg p-6',
        className
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
    </div>
  );
}
