import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AuctionBiddersSection() {
  return (
    <div>
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Bidders</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div className="flex items-center gap-2" key={i}>
                  <div>
                    <Avatar>
                      <AvatarImage src={'https://github.com/jaimin25.png'} />
                      <AvatarFallback>CJ</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold">Username</p>
                    <div className="flex gap-2">
                      <p>₹1200</p> • <p>1 min ago</p>
                    </div>
                  </div>
                </div>
              ))}
            <Button variant={'outline'}>View More</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
