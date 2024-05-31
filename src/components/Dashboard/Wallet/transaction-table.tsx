import React from 'react';
import moment from 'moment';

import { CustomerBalanceTransactionsProps } from '@/components/Providers/user-provider';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export default function TransactionTable({
  transactions,
}: {
  transactions: CustomerBalanceTransactionsProps[] | undefined;
}) {
  return (
    <div>
      <Table>
        <TableCaption>A list of your transacntions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead className="hidden items-center md:flex">ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="hidden items-center md:flex">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions!.map((item, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">
                {item.description ? item.description : 'NA'}
              </TableCell>
              <TableCell className="hidden md:flex">{item.id}</TableCell>
              <TableCell>
                <p
                  className={cn(
                    'font-semibold',
                    item.description === 'deposit'
                      ? 'text-green-500'
                      : 'text-red-500'
                  )}
                >
                  {item.description === 'deposit'
                    ? `+ ₹${new Intl.NumberFormat('en-IN').format(item.amount)}`
                    : `- ₹${new Intl.NumberFormat('en-IN').format(item.amount)}`}
                </p>
              </TableCell>
              <TableCell className="hidden md:flex">
                {moment(item.createdAt * 1000)
                  .format('MMMM Do, h:mm a')
                  .toString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
