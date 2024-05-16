import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

import { Config } from '@/lib/config';

export async function POST(req: NextRequest) {
  const data = await req.json();

  const res = await axios.post(`${Config.API_URL}/signin`, {
    emailOrPhone: data.emailOrPhone,
    password: data.password,
  });

  const resData = await res.data;

  if (resData.statusCode === 200) {
    const cookie = res.headers['set-cookie'];
    const [, secondCookie] = cookie!;

    // Extract the actual cookie value (session data) from the string:
    const sessionData = secondCookie?.split('=')[1]?.split(';')[0]; // Assuming the format is "session=data"

    const store = cookies();
    store.set('session', `${sessionData}`);

    return NextResponse.json(resData);
  } else {
    return NextResponse.json(resData);
  }
}
