import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

import { Config } from '@/lib/config';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchInput = searchParams.get('searchInput');
  const category = searchParams.get('category');
  const sortTypeAuction = searchParams.get('sortTypeAuction');
  const sortTypePrice = searchParams.get('sortTypePrice');
  try {
    const res = await axios.get(
      `${Config.API_URL}/marketplace/filterMarketplaceAuctions`,
      {
        withCredentials: true,
        headers: {
          cookie: `session=${req.cookies.get('session')?.value}`,
        },
        params: {
          searchInput,
          category,
          sortTypeAuction,
          sortTypePrice,
        },
      }
    );

    const resData = await res.data;

    return NextResponse.json(resData);
  } catch (err) {
    return NextResponse.json({
      statusCode: 500,
      statusMessage: (err as Error).message,
    });
  }
}
