'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
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

import { ManageAuctionProps } from '../Auctions/Manage/manage-auctions';
import { Calendar } from '../ui/calendar';

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
  { label: 'Laptop', value: 'laptop' },
  { label: 'Mobile', value: 'mobile' },
] as const;

const manageAuctionFormSchema = z.object({
  title: z.string().trim().min(1, { message: 'Please fill this field' }),
  description: z.string().trim().min(1, { message: 'Please fill this field' }),
  img1:
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
  img2:
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

const updateAuctionDetails = async (formValues: FormData) => {
  return await axios.post(
    `${Config.APP_URL}/api/auction/updateAuctionDetails`,
    formValues,
    {
      withCredentials: true,
    }
  );
};

export default function ManageAuctionForm({
  manageAuctionDetails,
  auctionId,
}: {
  manageAuctionDetails: ManageAuctionProps;
  auctionId: string;
}) {
  const [toastId, setToastId] = useState<string | number>();

  const [initialValues, setInitialValues] =
    useState<Partial<ManageAuctionProps>>();

  const manageAuctionForm = useForm<z.infer<typeof manageAuctionFormSchema>>({
    resolver: zodResolver(manageAuctionFormSchema),
  });

  const updateAuctionDetailsMutation = useMutation({
    mutationFn: updateAuctionDetails,
    onSuccess: async (res) => {
      const data = await res.data;

      if (data.statusCode === 200) {
        const auctionDetails: ManageAuctionProps = data.auctionDetails;
        type UnAllowedKeys = 'imagesUrl';

        const unWantedKeys: UnAllowedKeys[] = ['imagesUrl'];

        const iniVals: Partial<ManageAuctionProps> = {};

        for (const key in auctionDetails) {
          if (!unWantedKeys.includes(key as UnAllowedKeys)) {
            const typedKey = key as keyof ManageAuctionProps;
            if (typedKey === 'startingDate' || typedKey === 'endingDate') {
              iniVals[typedKey] = new Date(auctionDetails[typedKey]).toString();
            } else {
              iniVals[typedKey] = auctionDetails[typedKey] as string & string[];
            }
          }
        }
        setInitialValues(iniVals);
        if (auctionDetails.imagesUrl[0]) {
          setPreview1(auctionDetails.imagesUrl[0]);
        }
        if (auctionDetails.imagesUrl[1]) {
          setPreview2(auctionDetails.imagesUrl[1] as string);
        }
        if (auctionDetails.imagesUrl[2]) {
          setPreview2(auctionDetails.imagesUrl[2] as string);
        }
        if (auctionDetails.imagesUrl[3]) {
          setPreview4(auctionDetails.imagesUrl[3] as string);
        }
        toast.success(data.statusMessage, { id: toastId });
        manageAuctionForm.setValue('img1', '');
        manageAuctionForm.setValue('img2', '');
        manageAuctionForm.setValue('img3', '');
        manageAuctionForm.setValue('img4', '');
      } else {
        toast.error(data.statusMessage, { id: toastId });
      }
    },
    onError: (error) =>
      toast.error(`${error.name}: ${error.message}`, { id: toastId }),
  });

  const onSubmit = (values: z.infer<typeof manageAuctionFormSchema>) => {
    values.img1 = values.img1[0];
    values.img2 = values.img2[0];
    values.img3 = values.img3[0];
    values.img4 = values.img4[0];

    const formData = new FormData();

    const changedFields: Partial<ManageAuctionProps> = {};

    type UnAllowedKeys = 'auctionStatus';

    const unWantedKeys: UnAllowedKeys[] = ['auctionStatus'];

    for (const key in initialValues) {
      if (!unWantedKeys.includes(key as UnAllowedKeys)) {
        const typedKey = key as keyof z.infer<typeof manageAuctionFormSchema>;
        if (typedKey === 'endingDate' || typedKey === 'startingDate') {
          if (
            new Date(values[typedKey]).toLocaleDateString() !==
            new Date(String(initialValues![typedKey])).toLocaleDateString()
          ) {
            changedFields[typedKey] = String(values[typedKey]);
          }
        } else if (
          String(values[typedKey]) !== String(initialValues[typedKey])
        ) {
          changedFields[typedKey] = values[typedKey] as string & string[];
        }
      }
    }

    if (
      Object.keys(changedFields).length === 0 &&
      !values.img1 &&
      !values.img2 &&
      !values.img3 &&
      !values.img4
    ) {
      return toast.error('Nothing to update!');
    }

    const json = JSON.stringify(changedFields);

    if (values.img1) {
      formData.append('img1', values.img1);
    }
    if (values.img2) {
      formData.append('img2', values.img2);
    }
    if (values.img3) {
      formData.append('img3', values.img3);
    }
    if (values.img4) {
      formData.append('img4', values.img4);
    }
    formData.append('updateAuctionData', json);
    formData.append('auctionId', auctionId);
    formData.append('auctionStatus', initialValues?.auctionStatus as string);

    updateAuctionDetailsMutation.mutate(formData);

    const currentToastId = toast.loading('Updating...');
    setToastId(currentToastId);
  };

  const [preview1, setPreview1] = useState('');
  const img1FileRef = manageAuctionForm.register('img1');

  const [preview2, setPreview2] = useState('');
  const img2FileRef = manageAuctionForm.register('img2');

  const [preview3, setPreview3] = useState('');
  const img3FileRef = manageAuctionForm.register('img3');

  const [preview4, setPreview4] = useState('');
  const img4FileRef = manageAuctionForm.register('img4');

  useEffect(() => {
    manageAuctionForm.setValue('title', manageAuctionDetails.title);
    manageAuctionForm.setValue('description', manageAuctionDetails.description);
    manageAuctionForm.setValue('category', manageAuctionDetails.category);
    setPreview1(manageAuctionDetails.imagesUrl[0]!);
    setPreview2(manageAuctionDetails.imagesUrl[1]!);
    if (manageAuctionDetails.imagesUrl[2]) {
      setPreview3(manageAuctionDetails.imagesUrl[2]);
    }
    if (manageAuctionDetails.imagesUrl[3]) {
      setPreview4(manageAuctionDetails.imagesUrl[3]);
    }
    manageAuctionForm.setValue(
      'startingDate',
      new Date(new Date(manageAuctionDetails.startingDate).toUTCString())
    );
    manageAuctionForm.setValue(
      'endingDate',
      new Date(new Date(manageAuctionDetails.endingDate).toLocaleString())
    );
    manageAuctionForm.setValue(
      'basePrice',
      Number(manageAuctionDetails.basePrice)
    );
    manageAuctionForm.setValue(
      'buyPrice',
      Number(manageAuctionDetails.buyPrice)
    );
    manageAuctionForm.setValue('city', manageAuctionDetails.city);
    manageAuctionForm.setValue('state', manageAuctionDetails.state);
    manageAuctionForm.setValue('country', manageAuctionDetails.country);
    manageAuctionForm.setValue('zipcode', Number(manageAuctionDetails.zipcode));

    type UnAllowedKeys = 'imagesUrl';

    const unWantedKeys: UnAllowedKeys[] = ['imagesUrl'];

    const iniVals: Partial<ManageAuctionProps> = {};

    for (const key in manageAuctionDetails) {
      if (!unWantedKeys.includes(key as UnAllowedKeys)) {
        const typedKey = key as keyof ManageAuctionProps;
        iniVals[typedKey] = manageAuctionDetails[typedKey] as string & string[];
      }
    }
    setInitialValues(iniVals);
  }, [manageAuctionForm, manageAuctionDetails]);

  return (
    <>
      <div className="contact-form-container m-8 w-10/12 sm:w-8/12 md:w-6/12 lg:w-5/12">
        <Card>
          <CardHeader>
            <h3 className="text-3xl font-semibold">
              Manage Auction{' '}
              {initialValues?.auctionStatus !== 'ACTIVE' &&
                `(${initialValues?.auctionStatus})`}
            </h3>
          </CardHeader>
          <CardContent>
            <Form {...manageAuctionForm}>
              <form
                onSubmit={manageAuctionForm.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* TITLE FIELD*/}
                <FormField
                  control={manageAuctionForm.control}
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
                  control={manageAuctionForm.control}
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
                  control={manageAuctionForm.control}
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
                                      manageAuctionForm.setValue(
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
                    control={manageAuctionForm.control}
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
                    control={manageAuctionForm.control}
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
                    control={manageAuctionForm.control}
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
                    control={manageAuctionForm.control}
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
                  control={manageAuctionForm.control}
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
                              disabled={
                                manageAuctionDetails.auctionStatus !==
                                  'UPCOMING' ||
                                initialValues?.auctionStatus !== 'UPCOMING'
                              }
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
                            onSelect={field.onChange}
                            disabled={(date) =>
                              (date.getDate() !== new Date().getDate() &&
                                date <= new Date()) ||
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
                  control={manageAuctionForm.control}
                  name="endingDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Ending Date <span className="text-red-500">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger
                          asChild
                          disabled={!manageAuctionForm.getValues().startingDate}
                        >
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-[240px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                              disabled={
                                manageAuctionDetails.auctionStatus !==
                                  'ACTIVE' &&
                                manageAuctionDetails.auctionStatus !==
                                  'UPCOMING'
                              }
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
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const selectedDate = new Date(date);
                              const startingDate = new Date(
                                manageAuctionForm.getValues().startingDate
                              );

                              // Disable dates before the starting date and before '1900-01-01'
                              return (
                                selectedDate <= startingDate ||
                                selectedDate < new Date('1900-01-01')
                              );
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Day when auction will end
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* BASE PRICE FIELD*/}
                <FormField
                  control={manageAuctionForm.control}
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
                  control={manageAuctionForm.control}
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
                            ++manageAuctionForm.getValues().basePrice
                          )}
                          disabled={!manageAuctionForm.getValues().basePrice}
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
                  control={manageAuctionForm.control}
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
                  control={manageAuctionForm.control}
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
                  control={manageAuctionForm.control}
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
                                      manageAuctionForm.setValue(
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
                  control={manageAuctionForm.control}
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
                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      updateAuctionDetailsMutation.isPending ||
                      (manageAuctionDetails.auctionStatus !== 'ACTIVE' &&
                        manageAuctionDetails.auctionStatus !== 'UPCOMING')
                    }
                  >
                    Save
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
