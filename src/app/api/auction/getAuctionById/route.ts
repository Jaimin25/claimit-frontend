import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

import { Config } from '@/lib/config';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const auctionId = searchParams.get('auctionId');

  axios.defaults.withCredentials = true;
  const res = await axios.get(`${Config.API_URL}/auction/getAuctionById`, {
    withCredentials: true,
    headers: {
      cookie: `session=${req.cookies.get('session')?.value}`,
    },
    params: {
      auctionId: auctionId,
    },
  });

  const resData = await res.data;

  return NextResponse.json(resData);
}
