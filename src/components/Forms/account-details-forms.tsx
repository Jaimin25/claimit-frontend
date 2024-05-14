'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCheck, FaEdit } from 'react-icons/fa';
import { LuChevronsUpDown } from 'react-icons/lu';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUser } from '../Providers/user-provider';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const countries = [
  { label: 'India', value: 'india' },
  { label: 'Country2', value: 'country2' },
] as const;

const MAX_FILE_SIZE = 3000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const accountDetailsFormSchema = z.object({
  username: z.string().trim().min(1, { message: 'Please fill this field' }),
  profilepicurl:
    typeof window === 'undefined'
      ? z.any()
      : z
          .any()
          .optional()
          .refine(
            (files) =>
              files?.length == 1
                ? files?.[0]!.size <= MAX_FILE_SIZE
                  ? true
                  : false
                : true,

            `Max file size is 3MB.`
          )
          .refine(
            (files) =>
              files?.length == 1
                ? ACCEPTED_IMAGE_TYPES.includes(files?.[0]!.type)
                  ? true
                  : false
                : true,
            '.jpg, .jpeg, .png and .webp files are accepted.'
          ),
  firstname: z.string().trim().min(1, { message: 'Please fill this field' }),
  lastname: z.string().trim().min(1, { message: 'Please fill this field' }),
  email: z.string().trim().min(1, { message: 'Please fill this fiel' }).email(),
  phone: z.coerce.number().optional(),
  streetaddress: z
    .string()
    .trim()
    .min(1, { message: 'Please fill this field' }),
  city: z.string().trim().min(1, { message: 'Please fill this field' }),
  state: z.string().trim().min(1, { message: 'Please fill this field' }),
  country: z.string().trim().min(1, { message: 'Please fill this field' }),
  zipcode: z.coerce.number({ required_error: 'Please fill this field' }),
});

export default function AccountDetailsForm() {
  const { user } = useUser();

  const accountDetailsForm = useForm<z.infer<typeof accountDetailsFormSchema>>({
    resolver: zodResolver(accountDetailsFormSchema),
  });

  const onSubmit = (values: z.infer<typeof accountDetailsFormSchema>) => {
    console.log(values);
  };

  useEffect(() => {
    accountDetailsForm.setValue('username', user?.username as string);
    accountDetailsForm.setValue('firstname', user?.firstname as string);
    accountDetailsForm.setValue('lastname', user?.lastname as string);
    accountDetailsForm.setValue('email', user?.email as string);
    accountDetailsForm.setValue('phone', Number(user?.phoneno as string));
    accountDetailsForm.setValue('streetaddress', user?.streetAddress as string);
    accountDetailsForm.setValue('city', user?.city as string);
    accountDetailsForm.setValue('state', user?.state as string);
    accountDetailsForm.setValue('country', user?.country as string);
    accountDetailsForm.setValue('zipcode', Number(user?.zipcode as string));
  }, [user, accountDetailsForm]);

  const [preview, setPreview] = useState('');
  const fileRef = accountDetailsForm.register('profilepicurl');

  return (
    <div className="h-full w-full">
      <Card className="h-full">
        <CardHeader>
          <h3 className="text-3xl font-semibold">Account Details</h3>
        </CardHeader>
        <CardContent>
          <Form {...accountDetailsForm}>
            <form
              onSubmit={accountDetailsForm.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <h2 className="text-xl font-semibold">Basic Details</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* PROFILE PIC FIELD */}
                <FormField
                  control={accountDetailsForm.control}
                  name="profilepicurl"
                  render={({ field: { onChange } }) => (
                    <FormItem>
                      <FormLabel>Profile Pic</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Avatar className="h-32 w-32">
                            <AvatarImage src={preview} />
                            <AvatarFallback>IMG</AvatarFallback>
                          </Avatar>
                          <div className="flex items-center">
                            <label
                              htmlFor="profilePic"
                              className="rounded-md border border-gray-300 p-3 transition hover:cursor-pointer hover:bg-gray-100"
                            >
                              <FaEdit />
                            </label>
                            <Input
                              type="file"
                              {...fileRef}
                              accept="image/*"
                              className="hidden"
                              id="profilePic"
                              onChange={(e) => {
                                setPreview(
                                  URL.createObjectURL(
                                    e.target.files![0]!
                                  ).toString()
                                );
                                const dataTransfer = new DataTransfer();

                                // Add newly uploaded images
                                Array.from(e.target.files!).forEach((image) =>
                                  dataTransfer.items.add(image)
                                );

                                const files = dataTransfer.files;
                                onChange(files);
                              }}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* USERNAME FIELD */}
                <FormField
                  control={accountDetailsForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Username <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* FIRST NAME FIELD */}
                <FormField
                  control={accountDetailsForm.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        First name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="firstname" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* LAST NAME FIELD */}
                <FormField
                  control={accountDetailsForm.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Last name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="lastname" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* EMAIL FIELD */}
                <FormField
                  control={accountDetailsForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email <span className="text-red-500">*</span>{' '}
                        {!user?.emailVerified && '(Unverified)'}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PHONE NUMBER FIELD */}
                <FormField
                  control={accountDetailsForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This information will not be disclosed publicly
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* STREET ADDRESS FIELD */}
              <h2 className="text-xl font-semibold">Other Details</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={accountDetailsForm.control}
                  name="streetaddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Street Address <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea placeholder="address" {...field} />
                      </FormControl>
                      <FormDescription>
                        This information will not be disclosed publicly
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CITY FIELD */}
                <FormField
                  control={accountDetailsForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        City <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* STATE FIELD */}
                <FormField
                  control={accountDetailsForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        State <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="state" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* COUNTRY FIELD */}
                <FormField
                  control={accountDetailsForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Country <span className="text-red-500">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'w-[200px] justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? countries.find(
                                    (country) => country.value === field.value
                                  )?.label
                                : 'Select country'}
                              <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search country..." />
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                {countries.map((country) => (
                                  <CommandItem
                                    value={country.label}
                                    key={country.value}
                                    onSelect={() => {
                                      accountDetailsForm.setValue(
                                        'country',
                                        country.value
                                      );
                                    }}
                                  >
                                    <FaCheck
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        country.value === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {country.label}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ZIP CODE FIELD */}
                <FormField
                  control={accountDetailsForm.control}
                  name="zipcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Zip/Post Code <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="zip/post code"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Save</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
