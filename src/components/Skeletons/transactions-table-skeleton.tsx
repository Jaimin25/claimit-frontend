import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Skeleton } from '../ui/skeleton';

export default function TransactionTableSkeleton({ rows }: { rows: number }) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead className="hidden items-center md:flex">ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="hidden items-center md:flex">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {new Array(rows).fill(0).map((_, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">
                <Skeleton className="h-6 w-full" />
              </TableCell>
              <TableCell className="hidden md:flex">
                <Skeleton className="h-6 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-full" />
              </TableCell>
              <TableCell className="hidden md:flex">
                <Skeleton className="h-6 w-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex w-full justify-end gap-2">
        <Button variant={'outline'} disabled>
          Previous
        </Button>
        <Button variant={'outline'} disabled>
          Next
        </Button>
      </div>
    </div>
  );
}
