import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

import { Config } from '@/lib/config';

export async function POST(req: NextRequest) {
  const { startingFrom, endingFrom } = await req.json();
  axios.defaults.withCredentials = true;
  const res = await axios.post(
    `${Config.API_URL}/user/getUserBalanceTransactions`,
    { startingFrom, endingFrom },
    {
      withCredentials: true,
      headers: {
        cookie: `session=${req.cookies.get('session')?.value}`,
      },
    }
  );

  const resData = await res.data;

  return NextResponse.json(resData);
}
