import React from 'react';
import { FaSearch } from 'react-icons/fa';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Input } from '../ui/input';

export default function MyBids() {
  return (
    <div className="h-full w-full">
      <Card className="h-full">
        <CardHeader>
          <h3 className="text-3xl font-semibold">Your Bids</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <FaSearch />
            <Input placeholder="Search auctions..." />
          </div>
          <Table>
            <TableCaption>A list of your bids.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(10)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Button variant={'link'} className="p-0">
                        Title of auction
                      </Button>
                    </TableCell>
                    <TableCell>On-going</TableCell>
                    <TableCell>₹250.00</TableCell>
                    <TableCell>10 May, 2024 10:09:00 PM</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
