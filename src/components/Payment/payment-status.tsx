'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { IoWalletOutline } from 'react-icons/io5';
import { toast } from 'sonner';

import { Config } from '@/lib/config';
import { useMutation } from '@tanstack/react-query';

import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';

const fetchSessionStatus = async (sessionId: string) => {
  return await axios.post(
    `${Config.APP_URL}/api/stripe/checkSessionStatus`,
    { sessionId },
    {
      withCredentials: true,
    }
  );
};

export default function PaymentStatus() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const router = useRouter();
  const [sessionStatus, setSessionStatus] = useState();

  const fetchSessionStatusMutation = useMutation({
    mutationFn: fetchSessionStatus,
    onSuccess: async (res) => {
      const data = await res.data;
      if (data.statusCode === 200) {
        setSessionStatus(data.sessionStatus);
      }
    },
    onError: (error) => toast.error(`${error.name}: ${error.message}`),
  });

  useEffect(() => {
    if (!sessionId) {
      router.push('/dashboard/accountdetails');
      return;
    }
    fetchSessionStatusMutation.mutate(sessionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (!sessionStatus || fetchSessionStatusMutation.isPending) {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardDescription>Fetching...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>✅ Payment {sessionStatus}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            {sessionStatus !== 'complete'
              ? 'There was some problem processing the payment, you will get a email regarding the same. '
              : 'We appreciate for trusting us! A confirmation email will be sent to your registered mail. '}
            If you have any questions, please email{' '}
            <a
              href="mailto:claimit04@gmail.com"
              className="text-blue-500 underline"
            >
              claimit04@gmail.com
            </a>
            .
          </CardDescription>
        </CardContent>
        <CardFooter>
          <Link href={`/dashboard/wallet`}>
            <Button className="space-x-1">
              <IoWalletOutline /> <p>Go back to Dashboard</p>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
