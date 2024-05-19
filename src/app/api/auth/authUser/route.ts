import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

import { Config } from '@/lib/config';

export async function POST(req: NextRequest) {
  axios.defaults.withCredentials = true;
  const res = await axios.post(`${Config.API_URL}/authUser`, '', {
    withCredentials: true,
    headers: {
      cookie: `session=${req.cookies.get('session')?.value}`,
    },
  });

  const resData = await res.data;
  console.log(resData);
  return NextResponse.json(resData);
}
