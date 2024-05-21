import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

import { Config } from '@/lib/config';

export async function GET(req: NextRequest) {
  axios.defaults.withCredentials = true;
  const res = await axios.get(
    `${Config.API_URL}/marketplace/fetchAllMarketplaceAuctions`,
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
