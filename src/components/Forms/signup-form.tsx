'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { CommandList } from 'cmdk';
import { useForm } from 'react-hook-form';
import { FaCheck } from 'react-icons/fa';
import { LuChevronsUpDown } from 'react-icons/lu';
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

const countries = [
  { label: 'India', value: 'india' },
  { label: 'Country2', value: 'country2' },
] as const;

const signUpFormSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, { message: 'Username must be of atleast 3 chars' })
      .refine((s) => !s.includes(' '), 'Username should not have spaces'),
    firstname: z.string().trim().min(1, { message: 'Please fill this field' }),
    lastname: z.string().trim().min(1, { message: 'Please fill this field' }),
    email: z
      .string()
      .trim()
      .min(1, { message: 'Please fill this field' })
      .email(),
    phone: z.coerce.number().optional(),
    password: z.string().trim().min(6),
    cpassword: z.string().trim().min(6),
    streetaddress: z
      .string()
      .trim()
      .min(1, { message: 'Please fill this field' }),
    city: z.string().trim().min(1, { message: 'Please fill this field' }),
    state: z.string().trim().min(1, { message: 'Please fill this field' }),
    country: z.string().trim().min(1, { message: 'Please fill this field' }),
    zipcode: z.coerce.number({ required_error: 'Please fill this field' }),
  })
  .refine((data) => data.password === data.cpassword, {
    message: "Passwords don't match",
    path: ['cpassword'],
  });

async function signUpSubmit(values: z.infer<typeof signUpFormSchema>) {
  return await axios.post(`${Config.API_URL}/signup`, {
    username: values.username,
    firstname: values.firstname,
    lastname: values.lastname,
    phoneno: String(values.phone),
    email: values.email,
    password: values.password,
    streetAddress: values.streetaddress,
    city: values.city,
    state: values.state,
    country: values.country,
    zipcode: String(values.zipcode),
  });
}

export default function SignUpForm() {
  const router = useRouter();

  const [toastId, setToastId] = useState<string | number>();

  const mutation = useMutation({
    mutationFn: signUpSubmit,
    onSuccess: (res) => {
      const data = res.data;

      if (data.statusCode === 200) {
        signUpForm.reset();
        router.push('/signin');

        toast.success('Account created successfully!', { id: toastId });
        setTimeout(() => {
          toast.success(
            'A verification mail has been sent at your registered email!',
            { duration: 3000 }
          );
        }, 1500);
      } else {
        toast.error(data.statusMessage, { id: toastId });
      }
    },
    onError: (error) =>
      toast.error(`${error.name}: ${error.message}`, { id: toastId }),
  });

  const [isChecked, setIsChecked] = useState(false);

  const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
  });

  const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
    mutation.mutate(values);
    const currentToastId = toast.loading('Creating account...');
    setToastId(currentToastId);
  };

  return (
    <div className="contact-form-container m-8 w-10/12 sm:w-8/12 lg:w-5/12">
      <Card>
        <CardHeader>
          <h3 className="text-3xl font-semibold">Sign Up</h3>
        </CardHeader>
        <CardContent>
          <Form {...signUpForm}>
            <form
              onSubmit={signUpForm.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              {/* USERNAME FIELD */}
              <FormField
                control={signUpForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Username <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormDescription>Enter a proper username</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* FIRST NAME FIELD */}
              <FormField
                control={signUpForm.control}
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
                control={signUpForm.control}
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
                control={signUpForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a valid email, it will be used to verify your
                      account and send you notifications
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PHONE NO. FIELD */}
              <FormField
                control={signUpForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PASSWORD FIELD */}
              <FormField
                control={signUpForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CPASSWORD FIELD */}
              <FormField
                control={signUpForm.control}
                name="cpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Confirm Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* STREET ADDRESS FIELD */}
              <FormField
                control={signUpForm.control}
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
                control={signUpForm.control}
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
                control={signUpForm.control}
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
                control={signUpForm.control}
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
                                    signUpForm.setValue(
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
                control={signUpForm.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Zip/Post Code <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
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
                  disabled={!isChecked || mutation.isPending}
                >
                  Register
                </Button>
              </div>
              <div className="flex w-full justify-center">
                <p>
                  Already have an account?{' '}
                  <Link href={'/signin'} className="underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
