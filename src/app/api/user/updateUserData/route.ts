import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

import { Config } from '@/lib/config';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const imgFileBase64 = formData.get('profileImgFileBase64') as File;
  console.log(req.headers);
  try {
    const newFd = new FormData();
    newFd.append('document', formData.get('document') as string);

    if (imgFileBase64 && typeof imgFileBase64 === 'string') {
      newFd.append(
        'profileImgFileBase64',
        formData.get('profileImgFileBase64') as string
      );
    }

    const res = await axios.post(
      `${Config.API_URL}/user/updateUserData`,
      JSON.stringify({
        document: formData.get('document') as string,
        profileImgFileBase64: formData.get('profileImgFileBase64') as string,
      }),
      {
        withCredentials: true,
        headers: {
          cookie: `session=${req.cookies.get('session')?.value}`,
          // 'content-length': contentLength,
        },
      }
    );

    const resData = await res.data;

    return NextResponse.json(resData);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      statuCode: 404,
      statusMessage: (error as Error).stack,
    });
  }
}
