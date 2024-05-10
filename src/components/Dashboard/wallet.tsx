import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import IdentityVerificationForm from '../Forms/identity-verification-form';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';

export default function Wallet() {
  return (
    <div className="h-full w-full">
      <Card className="w-full">
        <CardHeader>
          <h3 className="text-3xl font-semibold">Wallet</h3>
        </CardHeader>
        <CardContent className="space-y-8">
          <IdentityVerificationForm />
          <div>
            <h2 className="text-xl font-semibold">Balance</h2>
            <div className="py-6">
              Current Balanace:<p className="text-lg font-semibold">₹99999</p>
            </div>
            <div className="space-x-4">
              <Button variant={'default'}>Add</Button>
              <Button variant={'secondary'}>Withdraw</Button>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Transactions</h2>
            <Table>
              <TableCaption>A list of your transacntions.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>ID</TableHead>
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
                        {i % 2 === 0 ? 'Deposit' : 'Withdraw'}
                      </TableCell>
                      <TableCell>ipx_f24n234Dh2</TableCell>
                      <TableCell>
                        {i % 2 === 0 ? (
                          <p className="text-green-500">+{i * 250}</p>
                        ) : (
                          <p className="text-red-500">-{i * 500}</p>
                        )}
                      </TableCell>
                      <TableCell>10 May, 2024 10:09:00 PM</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
