'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';

import { Textarea } from '../ui/textarea';

const contactFormSchema = z.object({
  fullname: z.string().trim().min(1, { message: 'Please fill this field' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Please fill this field' })
    .email(),
  subject: z
    .string()
    .trim()
    .min(1, { message: 'Please fill this field' })
    .max(50),
  message: z.string().trim().min(1, { message: 'Please fill this field' }),
});
export default function ContactForm() {
  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { fullname: '', email: '', subject: '', message: '' },
  });

  const onSubmit = (values: z.infer<typeof contactFormSchema>) => {
    console.log(values);
  };

  return (
    <div className="contact-form-container m-8 w-10/12 sm:w-8/12 md:w-6/12 lg:w-5/12">
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-semibold">Contact Us</h3>
        </CardHeader>
        <CardContent>
          <Form {...contactForm}>
            <form
              onSubmit={contactForm.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={contactForm.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Fullname <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="your fullname" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={contactForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={contactForm.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Subject <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="subject of your message" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={contactForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Message <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="enter a message with proper details"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
