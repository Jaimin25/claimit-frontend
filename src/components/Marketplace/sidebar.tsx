import React from 'react';
import { FaSearch } from 'react-icons/fa';

import { Card, CardContent, CardHeader } from '../ui/card';
import { Input } from '../ui/input';

export default function Sidebar() {
  return (
    <div className="sticky top-20 ">
      <Card className="h-full">
        <CardHeader>Filter</CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <FaSearch />
            <Input placeholder="Search auctions..." />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
