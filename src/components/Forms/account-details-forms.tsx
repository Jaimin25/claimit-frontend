'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { FaCheck, FaEdit } from 'react-icons/fa';
import { LuChevronsUpDown } from 'react-icons/lu';
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
import { Config } from '@/lib/config';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import ImageViewer from '../Modal/image-viewer';
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
  profilepicfile:
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
  email: z
    .string()
    .trim()
    .min(1, { message: 'Please fill this field' })
    .email(),
  phoneno: z.coerce.number().optional(),
  streetAddress: z
    .string()
    .trim()
    .min(1, { message: 'Please fill this field' }),
  city: z.string().trim().min(1, { message: 'Please fill this field' }),
  state: z.string().trim().min(1, { message: 'Please fill this field' }),
  country: z.string().trim().min(1, { message: 'Please fill this field' }),
  zipcode: z.coerce.number({ required_error: 'Please fill this field' }),
});

const sendVerificationMail = async () => {
  return await axios.post(
    `${Config.APP_URL}/api/auth/resendVerificationMail`,
    '',
    {
      withCredentials: true,
    }
  );
};

const sendUpdateUserData = async (values: FormData) => {
  return await axios.post(`${Config.APP_URL}/api/user/updateUserData`, values, {
    withCredentials: true,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
};

type AccountDataProp = {
  username: string;
  firstname: string;
  lastname: string;
  phoneno: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
};

export default function AccountDetailsForm() {
  const accountDetailsForm = useForm<z.infer<typeof accountDetailsFormSchema>>({
    resolver: zodResolver(accountDetailsFormSchema),
  });

  const [open, setOpenChange] = useState(false);

  const [initialValues, setInitialValues] =
    useState<Partial<AccountDataProp>>();

  const [toastId, setToastId] = useState<string | number>();

  const [preview, setPreview] = useState('');
  const fileRef = accountDetailsForm.register('profilepicfile');

  const { user, updateUserData } = useUser();

  const mutation = useMutation({
    mutationFn: sendVerificationMail,
    onSuccess: async (res) => {
      const data = await res.data;

      if (data.statusCode === 200) {
        toast.success(data.statusMessage, { id: toastId });
      } else {
        toast.error(data.statusMessage, { id: toastId });
      }
    },
    onError: (error) =>
      toast.error(`${error.name}: ${error.message}`, { id: toastId }),
  });

  const updateUserMutation = useMutation({
    mutationFn: sendUpdateUserData,
    onSuccess: async (res) => {
      const data = await res.data;

      if (data.statusCode === 200) {
        toast.success(data.statusMessage, {
          id: toastId,
        });
        updateUserData(data.userData[0]);
        setPreview(user?.profilePicUrl as string);

        accountDetailsForm.reset();
        setInitialValues(data.userData[0] as AccountDataProp);
      } else {
        toast.error(data.statusMessage, { id: toastId });
      }
    },
    onError: (error) =>
      toast.error(`${error.name}: ${error.message}`, { id: toastId }),
  });

  const onSubmit = async (values: z.infer<typeof accountDetailsFormSchema>) => {
    values.profilepicfile = values.profilepicfile[0] as File;
    const formData = new FormData();

    const changedFields: Partial<AccountDataProp> = {};

    for (const key in initialValues) {
      const typedKey = key as keyof AccountDataProp;
      if (String(values[typedKey]) !== String(initialValues[typedKey])) {
        changedFields[typedKey] = String(values[typedKey]);
      }
    }

    if (Object.keys(changedFields).length === 0 && !values.profilepicfile) {
      return toast.error('Nothing to update!');
    }

    const json = JSON.stringify(changedFields);

    if (values.profilepicfile) {
      formData.append('profileImgFile', values.profilepicfile);
    }
    formData.append('document', json);

    updateUserMutation.mutate(formData);

    const currentToastId = toast.loading('Updating profile...');
    setToastId(currentToastId);
  };

  useEffect(() => {
    setPreview(user?.profilePicUrl as string);
    type UnAllowedKeys =
      | 'initials'
      | 'emailVerified'
      | 'accountStatus'
      | 'accountType'
      | 'profilePicUrl'
      | 'identityVerified'
      | 'role';

    const unWantedKeys: UnAllowedKeys[] = [
      'initials',
      'accountStatus',
      'accountType',
      'emailVerified',
      'identityVerified',
      'profilePicUrl',
      'role',
    ];
    const iniVals: Partial<AccountDataProp> = {};

    for (const key in user) {
      if (!unWantedKeys.includes(key as UnAllowedKeys)) {
        const typedKey = key as keyof AccountDataProp;
        accountDetailsForm.setValue(typedKey, user[typedKey]);
        iniVals[typedKey] = user[typedKey] as string;
      }
    }
    setInitialValues(iniVals);
  }, [user, accountDetailsForm]);

  return (
    <>
      <div className="h-full w-full">
        <Card className="h-full">
          <CardHeader>
            <h3 className="text-3xl font-semibold">Account Details</h3>
          </CardHeader>
          <CardContent>
            <Form {...accountDetailsForm}>
              <form
                onSubmit={accountDetailsForm.handleSubmit(onSubmit, () => {
                  toast.error('Please fill all the fields!');
                })}
                className="space-y-8"
              >
                <h2 className="text-xl font-semibold">Basic Details</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* PROFILE PIC FIELD */}
                  <FormField
                    control={accountDetailsForm.control}
                    name="profilepicfile"
                    render={({ field: { onChange } }) => (
                      <FormItem>
                        <FormLabel>Profile Pic</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Avatar
                              className="h-32 w-32"
                              onClick={() => {
                                setOpenChange(true);
                              }}
                            >
                              <AvatarImage
                                src={preview}
                                alt={preview}
                                key={preview}
                                className="object-cover"
                              />
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
                        {!user?.emailVerified && (
                          <Button
                            variant={'link'}
                            type="button"
                            className="px-0 underline"
                            onClick={() => {
                              mutation.mutate();
                              const currentToastId =
                                toast.loading('Sending mail...');
                              setToastId(currentToastId);
                            }}
                            disabled={mutation.isPending}
                          >
                            Resend verification mail
                          </Button>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* PHONE NUMBER FIELD */}
                  <FormField
                    control={accountDetailsForm.control}
                    name="phoneno"
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
                    name="streetAddress"
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
                <Button
                  type="submit"
                  disabled={mutation.isPending || updateUserMutation.isPending}
                >
                  Save
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <ImageViewer open={open} imgUrl={preview} setOpenChange={setOpenChange} />
    </>
  );
}
