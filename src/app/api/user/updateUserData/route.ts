import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import FormData from 'form-data';

import { Config } from '@/lib/config';

async function uploadProfilePic(file: File, publicId: string) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  // const res = await cloudinary.uploader
  //   .upload_stream({
  //     resource_type: 'auto',
  //     invalidate: true,
  //     overwrite: true,
  //     public_id: publicId,
  //     folder: 'profile_pics',
  //   })
  //   .end(buffer);
  return new Promise<{
    status: boolean;
    message: UploadApiResponse | UploadApiErrorResponse | undefined;
  }>((resolve, reject) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: 'auto',
          invalidate: true,
          overwrite: true,
          public_id: publicId,
          folder: 'profile_pics',
        },
        onDone
      )
      .end(buffer);
    function onDone(
      error: UploadApiErrorResponse | undefined,
      result: UploadApiResponse | undefined
    ) {
      if (error) {
        return reject({ status: false, message: error });
      }
      return resolve({ status: true, message: result });
    }
  });
}

export async function POST(req: NextRequest) {
  console.log(
    process.env.CLOUDINARY_NAME,
    process.env.CLOUDINARY_API_KEY,
    process.env.CLOUDINARY_API_SECRET
  );
  const formData = await req.formData();
  const profileImgFile = formData.get('profileImgFile') as File;

  try {
    const newFd = new FormData();
    newFd.append('document', formData.get('document') as string);
    if (profileImgFile && typeof profileImgFile !== 'string') {
      const res = await axios.post(
        `${Config.API_URL}/user/getProfilePicPublicId`,
        '',
        {
          withCredentials: true,
          headers: {
            cookie: `session=${req.cookies.get('session')?.value}`,
            // 'content-length': contentLength,
          },
        }
      );
      const data = await res.data;

      if (data.statusCode === 200) {
        const uploadImg = await uploadProfilePic(
          profileImgFile,
          data.statusMessage
        );

        if (uploadImg.status === false) {
          return NextResponse.json({
            statuseCode: (uploadImg.message as UploadApiErrorResponse)
              .http_code,
            statusMessage: (uploadImg.message as UploadApiErrorResponse)
              .message,
          });
        }

        if (uploadImg.status && uploadImg.message!.url) {
          formData.append('profilePicUrl', uploadImg.message?.url);
        }
      } else {
        return NextResponse.json({
          statusCode: 500,
          statusMessage: data.statusMessage,
        });
      }
    }

    const res = await axios.post(
      `${Config.API_URL}/user/updateUserData`,
      JSON.stringify({
        document: formData.get('document'),
        profilePicUrl: formData.get('profilePicUrl'),
      }),
      {
        withCredentials: true,
        headers: {
          cookie: `session=${req.cookies.get('session')?.value}`,
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
