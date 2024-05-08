'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

const identityProofFormSchema = z.object({
  aadharFilePdf:
    typeof window === 'undefined'
      ? z.any()
      : z
          .instanceof(FileList)
          .refine((files) => files?.length == 1, 'Image is required.')
          .refine(
            (files) => ['application/pdf'].includes(files?.[0]!.type),
            '.pdf files are accepted.'
          ),
  panPdf:
    typeof window === 'undefined'
      ? z.any()
      : z
          .instanceof(FileList)
          .refine((files) => files?.length == 1, 'Image is required.')
          .refine(
            (files) => ['application/pdf'].includes(files?.[0]!.type),
            '.pdf files are accepted.'
          ),
});

export default function Wallet() {
  const identityProofForm = useForm({
    resolver: zodResolver(identityProofFormSchema),
  });

  const onSubmit = (values: z.infer<typeof identityProofFormSchema>) => {
    console.log(values);
  };

  const aadharFileRef = identityProofForm.register('aadharFilePdf');
  const panFileRef = identityProofForm.register('panPdf');

  return (
    <div className="h-full w-full">
      <Card className="w-full">
        <CardHeader>
          <h3 className="text-3xl">Wallet</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Provide Some Proofs</h2>
            <p className="text-sm text-gray-500">
              These documents are required to verify your identity before you
              begin any transactions
            </p>
          </div>
          <Form {...identityProofForm}>
            <form
              onSubmit={identityProofForm.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={identityProofForm.control}
                name="aadharFilePdf"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Aadhar Card <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <div>
                          <Input
                            type="file"
                            {...aadharFileRef}
                            accept="application/pdf"
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={identityProofForm.control}
                name="panPdf"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Pan Card <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <div>
                          <Input
                            type="file"
                            {...panFileRef}
                            accept="application/pdf"
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
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
        </CardContent>
      </Card>
    </div>
  );
}
