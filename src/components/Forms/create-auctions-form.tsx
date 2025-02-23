'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { CommandList } from 'cmdk';
import { formatDate } from 'date-fns';
import { useForm } from 'react-hook-form';
import { FaCheck, FaImage } from 'react-icons/fa';
import { LuChevronsUpDown } from 'react-icons/lu';
import { MdDateRange } from 'react-icons/md';
import { RiImageAddFill } from 'react-icons/ri';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
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
import { Config } from '@/lib/config';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import { useUser } from '../Providers/user-provider';
import { Calendar } from '../ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const MAX_FILE_SIZE = 3000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const countries = [
  { label: 'India', value: 'india' },
  { label: 'Country2', value: 'country2' },
] as const;

const categories = [
  { label: 'Vase', value: 'laptop' },
  { label: 'Stamps', value: 'mobile' },
] as const;

const createAuctionFormSchema = z.object({
  title: z.string().trim().min(1, { message: 'Please fill this field' }),
  description: z.string().trim().min(1, { message: 'Please fill this field' }),
  img1:
    typeof window === 'undefined'
      ? z.any()
      : z
          .instanceof(FileList)
          .refine((files) => files?.length == 1, 'Image is required.')
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
  img2:
    typeof window === 'undefined'
      ? z.any()
      : z
          .instanceof(FileList)
          .refine((files) => files?.length == 1, 'Image is required.')
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
              files.length == 1
                ? ACCEPTED_IMAGE_TYPES.includes(files?.[0]!.type)
                  ? true
                  : false
                : true,
            '.jpg, .jpeg, .png and .webp files are accepted.'
          ),
  img3:
    typeof window === 'undefined'
      ? z.any()
      : z
          .any()
          .optional()
          .refine(
            (files) =>
              files.length == 1
                ? files[0].size <= MAX_FILE_SIZE
                  ? true
                  : false
                : true,

            `Max file size is 3MB.`
          )
          .refine(
            (files) =>
              files.length == 1
                ? ACCEPTED_IMAGE_TYPES.includes(files?.[0]!.type)
                  ? true
                  : false
                : true,
            '.jpg, .jpeg, .png and .webp files are accepted.'
          ),
  img4:
    typeof window === 'undefined'
      ? z.any()
      : z
          .any()
          .optional()
          .refine(
            (files) =>
              files.length == 1
                ? files[0].size <= MAX_FILE_SIZE
                  ? true
                  : false
                : true,

            `Max file size is 3MB.`
          )
          .refine(
            (files) =>
              files.length == 1
                ? ACCEPTED_IMAGE_TYPES.includes(files?.[0]!.type)
                  ? true
                  : false
                : true,
            '.jpg, .jpeg, .png and .webp files are accepted.'
          ),
  category: z.string().trim().min(1, { message: 'Please fill this field' }),
  startingDate: z.date({ required_error: 'Please pickup a starting date' }),
  endingDate: z.date({ required_error: 'Please pickup a ending date' }),
  basePrice: z.coerce.number({ required_error: 'Please enter a base price' }),
  buyPrice: z.coerce.number({ required_error: 'Please enter a buy price' }),
  city: z.string().trim().min(1, { message: 'Please fill this field' }),
  state: z.string().trim().min(1, { message: 'Please fill this field' }),
  country: z.string().trim().min(1, { message: 'Please fill this field' }),
  zipcode: z.coerce.number({ required_error: 'Please fill this field' }),
});

const submitCreateAuctionForm = async (formValues: FormData) => {
  return await axios.post(`${Config.APP_URL}/api/auction/create`, formValues, {
    withCredentials: true,
  });
};

export default function CreateAuctionForm() {
  const [toastId, setToastId] = useState<string | number>();

  const [isChecked, setIsChecked] = useState(false);

  const [open, setIsOpen] = useState(false);

  const [ruleOpen, setIsRuleOpen] = useState(false);

  const [auctionId, setAuctionId] = useState('');

  const createAuctionForm = useForm<z.infer<typeof createAuctionFormSchema>>({
    resolver: zodResolver(createAuctionFormSchema),
  });

  const { user } = useUser();

  const createAuctionMutation = useMutation({
    mutationFn: submitCreateAuctionForm,
    onSuccess: async (res) => {
      const data = await res.data;

      if (data.statusCode === 200) {
        setIsOpen(true);
        setPreview1('');
        setPreview2('');
        setPreview3('');
        setPreview4('');
        toast.success(data.statusMessage, { id: toastId });
        // createAuctionForm.reset();
        setAuctionId(data.auctionId);
        setIsOpen(true);
      } else {
        toast.error(data.statusMessage, { id: toastId });
      }
    },
    onError: (error) =>
      toast.error(`${error.name}: ${error.message}`, { id: toastId }),
  });

  const showDialogOnSubmit = () => {
    setIsRuleOpen(true);
  };

  const onSubmit = (values: z.infer<typeof createAuctionFormSchema>) => {
    const currentToastId = toast.loading('Creating auction...');

    const formData = new FormData();

    values.img1 = values.img1[0];
    values.img2 = values.img2[0];
    values.img3 = values.img3[0];
    values.img4 = values.img4[0];

    formData.append('img1', values.img1);
    formData.append('img2', values.img2);

    if (values.img3) {
      formData.append('img3', values.img3);
    }
    if (values.img4) {
      formData.append('img4', values.img4);
    }

    const json = JSON.stringify({
      ...values,
      startingDate: values.startingDate.toDateString(),
      endingDate: values.endingDate.toDateString(),
    });
    formData.append('auctionData', json);

    createAuctionMutation.mutate(formData);
    setToastId(currentToastId);
  };

  const [preview1, setPreview1] = useState('');
  const img1FileRef = createAuctionForm.register('img1');

  const [preview2, setPreview2] = useState('');
  const img2FileRef = createAuctionForm.register('img2');

  const [preview3, setPreview3] = useState('');
  const img3FileRef = createAuctionForm.register('img3');

  const [preview4, setPreview4] = useState('');
  const img4FileRef = createAuctionForm.register('img4');

  useEffect(() => {
    createAuctionForm.setValue('city', user?.city as string);
    createAuctionForm.setValue('state', user?.state as string);
    createAuctionForm.setValue('country', user?.country as string);
    createAuctionForm.setValue('zipcode', user?.zipcode as number);
  }, [user, createAuctionForm]);

  return (
    <>
      <div className="contact-form-container m-8 w-10/12 sm:w-8/12 md:w-6/12 lg:w-5/12">
        <Card>
          <CardHeader>
            <h3 className="text-3xl font-semibold">Create Auction</h3>
          </CardHeader>
          <CardContent>
            <Form {...createAuctionForm}>
              <form
                onSubmit={createAuctionForm.handleSubmit(
                  showDialogOnSubmit,
                  () => {
                    toast.error('Please fill all the fields!');
                  }
                )}
                className="space-y-8"
              >
                {/* TITLE FIELD*/}
                <FormField
                  control={createAuctionForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Title <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="title" {...field} />
                      </FormControl>
                      <FormDescription>
                        A valid title which describes your auction
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* DESCRIPTION */}
                <FormField
                  control={createAuctionForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Description <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="description"
                          className="whitespace-pre-wrap"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a description with every possible details of
                        your auction item
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CATEGORY FIELD */}
                <FormField
                  control={createAuctionForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Category <span className="text-red-500">*</span>
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
                                ? categories.find(
                                    (category) => category.value === field.value
                                  )?.label
                                : 'Select category'}
                              <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search category..." />
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                {categories.map((category) => (
                                  <CommandItem
                                    value={category.label}
                                    key={category.value}
                                    onSelect={() => {
                                      createAuctionForm.setValue(
                                        'category',
                                        category.value
                                      );
                                    }}
                                  >
                                    <FaCheck
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        category.value === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {category.label}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Select a category under which auction item belongs
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* IMAGES: 1 & 2 FIELDs*/}
                <div className="flex flex-col gap-8 *:w-full sm:flex-row">
                  {/* IMAGE 1 FIELD*/}
                  <FormField
                    control={createAuctionForm.control}
                    name="img1"
                    render={({ field: { onChange } }) => (
                      <FormItem>
                        <FormLabel>
                          Image 1 <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="flex h-[250px] w-full gap-2">
                            <div className="flex h-[250px] w-full flex-col items-center gap-2">
                              {preview1 ? (
                                <Image
                                  src={preview1}
                                  width={250}
                                  height={250}
                                  alt={preview1}
                                  className="h-[200px] w-full object-cover"
                                />
                              ) : (
                                <label className="flex h-full w-full items-center justify-center rounded bg-gray-200">
                                  <FaImage size={24} />
                                </label>
                              )}
                              <label
                                htmlFor="img1Pic"
                                className="rounded-md border border-gray-300 p-3 transition hover:cursor-pointer hover:bg-gray-100"
                              >
                                <RiImageAddFill />
                              </label>

                              <Input
                                type="file"
                                {...img1FileRef}
                                accept="image/*"
                                className="hidden"
                                id="img1Pic"
                                onChange={(e) => {
                                  setPreview1(
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

                  {/* IMAGE 2 FIELD*/}
                  <FormField
                    control={createAuctionForm.control}
                    name="img2"
                    render={({ field: { onChange } }) => (
                      <FormItem>
                        <FormLabel>
                          Image 2 <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="flex h-[250px] w-full gap-2">
                            <div className="flex h-full w-full flex-col items-center gap-2">
                              {preview2 ? (
                                <Image
                                  src={preview2}
                                  width={500}
                                  height={200}
                                  alt={preview2}
                                  className="h-[200px] w-full object-cover"
                                />
                              ) : (
                                <label className="flex h-full w-full items-center justify-center rounded bg-gray-200">
                                  <FaImage size={24} />
                                </label>
                              )}
                              <label
                                htmlFor="img2Pic"
                                className="rounded-md border border-gray-300 p-3 transition hover:cursor-pointer hover:bg-gray-100"
                              >
                                <RiImageAddFill />
                              </label>
                              <Input
                                type="file"
                                {...img2FileRef}
                                accept="image/*"
                                className="hidden"
                                id="img2Pic"
                                onChange={(e) => {
                                  setPreview2(
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
                </div>

                {/* IMAGES: 3 & 4 FIELDs*/}
                <div className="flex flex-col gap-8 *:w-full md:flex-row">
                  {/* IMAGE 3 FIELD*/}
                  <FormField
                    control={createAuctionForm.control}
                    name="img3"
                    render={({ field: { onChange } }) => (
                      <FormItem>
                        <FormLabel>Image 3</FormLabel>
                        <FormControl>
                          <div className="flex h-[250px] w-full gap-2">
                            <div className="flex h-full w-full flex-col items-center gap-2">
                              {preview3 ? (
                                <Image
                                  src={preview3}
                                  width={220}
                                  height={200}
                                  alt={preview3}
                                  className="h-[200px] w-full object-cover"
                                />
                              ) : (
                                <label className="flex h-full w-full items-center justify-center rounded bg-gray-200">
                                  <FaImage size={24} />
                                </label>
                              )}
                              <label
                                htmlFor="img3Pic"
                                className="rounded-md border border-gray-300 p-3 transition hover:cursor-pointer hover:bg-gray-100"
                              >
                                <RiImageAddFill />
                              </label>
                              <Input
                                type="file"
                                {...img3FileRef}
                                accept="image/*"
                                className="hidden"
                                id="img3Pic"
                                onChange={(e) => {
                                  setPreview3(
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

                  {/* IMAGE 4 FIELD*/}
                  <FormField
                    control={createAuctionForm.control}
                    name="img4"
                    render={({ field: { onChange } }) => (
                      <FormItem>
                        <FormLabel>Image 4</FormLabel>
                        <FormControl>
                          <div className="flex h-[250px] w-full gap-2">
                            <div className="flex h-full w-full flex-col items-center gap-2">
                              {preview4 ? (
                                <Image
                                  src={preview4}
                                  width={220}
                                  height={200}
                                  alt={preview4}
                                  className="h-[200px] w-full object-cover"
                                />
                              ) : (
                                <label className="flex h-full w-full items-center justify-center rounded bg-gray-200">
                                  <FaImage size={24} />
                                </label>
                              )}
                              <label
                                htmlFor="img4Pic"
                                className="rounded-md border border-gray-300 p-3 transition hover:cursor-pointer hover:bg-gray-100"
                              >
                                <RiImageAddFill />
                              </label>
                              <Input
                                type="file"
                                {...img4FileRef}
                                accept="image/*"
                                className="hidden"
                                id="img4Pic"
                                onChange={(e) => {
                                  setPreview4(
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
                </div>

                {/* STARTING DATE FIELD*/}
                <FormField
                  control={createAuctionForm.control}
                  name="startingDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Starting Date <span className="text-red-500">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-[240px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                formatDate(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <MdDateRange className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            today={createAuctionForm.getValues().startingDate}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date <
                                new Date(new Date().setHours(0, 0, 0, 0)) ||
                              date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Day when auction will start
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ENDING DATE FIELD*/}
                <FormField
                  control={createAuctionForm.control}
                  name="endingDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Ending Date <span className="text-red-500">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger
                          asChild
                          disabled={!createAuctionForm.getValues().startingDate}
                        >
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-[240px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                formatDate(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <MdDateRange className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            today={
                              new Date(
                                createAuctionForm.getValues().startingDate
                              )
                            }
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const selectedDate = new Date(date);
                              const startingDate = new Date(
                                createAuctionForm.getValues().startingDate
                              );
                              const minAllowedDate = new Date(startingDate);
                              minAllowedDate.setDate(
                                startingDate.getDate() + 15
                              ); // Add 15 days to the starting date

                              // Disable dates before the minimum allowed date and before '1900-01-01'
                              return (
                                selectedDate <= startingDate ||
                                selectedDate > minAllowedDate ||
                                selectedDate < new Date('1900-01-01')
                              );
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Day when auction will end, can only select 15 days
                        further from starting date
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* BASE PRICE FIELD*/}
                <FormField
                  control={createAuctionForm.control}
                  name="basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Base Price <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="base price"
                          min={1}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A base price to bid on your auction
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* BUY PRICE FIELD*/}
                <FormField
                  control={createAuctionForm.control}
                  name="buyPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Buy Price <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="buy price"
                          min={Number(
                            ++createAuctionForm.getValues().basePrice
                          )}
                          disabled={!createAuctionForm.getValues().basePrice}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A buy price to directly buy your auction
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CITY FIELD*/}
                <FormField
                  control={createAuctionForm.control}
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

                {/* STATE FIELD*/}
                <FormField
                  control={createAuctionForm.control}
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
                  control={createAuctionForm.control}
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
                                      createAuctionForm.setValue(
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

                {/* ZIPCODE FIELD */}
                <FormField
                  control={createAuctionForm.control}
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
                <div className="items-top flex space-x-2">
                  <Checkbox
                    id="terms1"
                    onCheckedChange={() => setIsChecked(!isChecked)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms1"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Accept terms and conditions
                    </label>
                    <p className="text-sm text-muted-foreground">
                      You agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </div>
                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!isChecked || createAuctionMutation.isPending}
                  >
                    Create
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <Dialog open={ruleOpen} onOpenChange={setIsRuleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ℹ️ Basic information</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            The auction can only be edited till the time there are no bids made
            on it.
          </DialogDescription>
          <DialogFooter className="gap-2 *:w-full">
            <Button variant={'outline'}>Cancel</Button>
            <Button
              onClick={() => {
                setIsRuleOpen(false);
                onSubmit(createAuctionForm.getValues());
              }}
              variant={'default'}
            >
              Agree & Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🎉 Auction Created</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            You auction has been successfully created!
          </DialogDescription>
          <DialogFooter className="gap-2">
            <Link href={`/auctions/manage/${auctionId}`} className="w-full">
              <Button variant={'outline'} className="w-full">
                Manage
              </Button>
            </Link>
            <Link href={`/auctions/view/${auctionId}`} className="w-full">
              <Button variant={'default'} className="w-full">
                View
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
