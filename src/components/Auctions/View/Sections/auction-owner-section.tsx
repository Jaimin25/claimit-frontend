import AuctionOwnerSectionSkele from '@/components/Skeletons/AuctionDetailsSkeletons/auction-owner-section-skele';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { timeSince } from '@/lib/utils';

export default function AuctionOwnerSection({
  isLoading,
  user,
  totalBids,
  totalAuctions,
  createdAt,
}: {
  isLoading: boolean;
  user: {
    username: string;
    profilePicUrl: string;
    city: string;
    state: string;
    country: string;
    createdAt: Date;
  };
  totalBids: number;
  totalAuctions: number;
  createdAt: Date;
}) {
  if (isLoading) {
    return <AuctionOwnerSectionSkele />;
  }

  return (
    <div className="w-full lg:max-w-xs">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user.profilePicUrl} />
              <AvatarFallback>CJ</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold">{user.username}</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <p>
              {user.city}, {user.state}, {user.country}
            </p>
            <p>Joined {timeSince(createdAt)}</p>
            <p>Placed {totalBids} bids so far</p>
            <p>{totalAuctions} items on auctions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
