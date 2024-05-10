'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
            (files) =>
              files?.length == 1
                ? ['application/pdf'].includes(files?.[0]!.type)
                  ? true
                  : false
                : true,
            '.pdf files are accepted.'
          ),
  panPdf:
    typeof window === 'undefined'
      ? z.any()
      : z
          .instanceof(FileList)
          .refine((files) => files?.length == 1, 'File is required.')
          .refine(
            (files) =>
              files.length == 1
                ? ['application/pdf'].includes(files?.[0]!.type)
                  ? true
                  : false
                : true,
            '.pdf files are accepted.'
          ),
});

export default function IdentityVerificationForm() {
  const identityProofForm = useForm({
    resolver: zodResolver(identityProofFormSchema),
  });

  const onSubmit = (values: z.infer<typeof identityProofFormSchema>) => {
    console.log(values);
  };

  const aadharFileRef = identityProofForm.register('aadharFilePdf');
  const panFileRef = identityProofForm.register('panPdf');

  return (
    <>
      {' '}
      <div>
        <h2 className="text-xl font-semibold">Provide Some Proofs</h2>
        <p className="text-sm text-gray-500">
          These documents are required to verify your identity before you begin
          any transactions
        </p>
      </div>
      <Form {...identityProofForm}>
        <form
          onSubmit={identityProofForm.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* AADHAR FIELD */}
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
                <FormDescription>
                  Upload a .pdf of your aadhar card
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PAN FIELD */}
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
                <FormDescription>
                  Upload a .pdf of your pan card
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
