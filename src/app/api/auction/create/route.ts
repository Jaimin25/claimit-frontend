import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import ShortUniqueId from 'short-unique-id';

import { Config } from '@/lib/config';

async function uploadAuctionImage(file: File, publicId: string) {
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
      cloud_name: Config.CLOUDINARY_NAME,
      api_key: Config.CLOUDINARY_API_KEY,
      api_secret: Config.CLOUDINARY_API_SECRET,
    });
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: 'auto',
          invalidate: true,
          public_id: publicId,
          overwrite: true,
          folder: 'auction_pics',
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
  const formData = await req.formData();

  const checkAccount = await axios.post(
    `${Config.API_URL}/auction/checkEmailVerifiedAndActive`,
    '',
    {
      withCredentials: true,
      headers: {
        cookie: `session=${req.cookies.get('session')?.value}`,
      },
    }
  );

  const checkAccountData = await checkAccount.data;

  if (
    checkAccountData.statusCode !== 200 &&
    checkAccountData.statusMessage !== 'Can create auctions!'
  ) {
    return NextResponse.json(checkAccountData);
  }

  const img1 = formData.get('img1') as File;
  const img2 = formData.get('img2') as File;

  const img3 = formData.get('img3') as File;
  const img4 = formData.get('img4') as File;
  const shortUuid = new ShortUniqueId({ length: 25 });
  const auctShortId = shortUuid.rnd();

  const uploadImg1 = await uploadAuctionImage(img1, 'img1_' + auctShortId);
  const uploadImg2 = await uploadAuctionImage(img2, 'img2_' + auctShortId);

  const imgUrls: string[] = [];

  if (uploadImg1.status === true) {
    imgUrls.push((uploadImg1.message as UploadApiResponse).url);
  } else {
    return NextResponse.json({
      statusCode: 500,
      statusMessage: 'Problem uploading images',
    });
  }

  if (uploadImg2.status === true) {
    imgUrls.push((uploadImg2.message as UploadApiResponse).url);
  }

  if (img3) {
    const uploadImg3 = await uploadAuctionImage(img3, 'img3_' + auctShortId);

    if (uploadImg3.status === true) {
      imgUrls.push((uploadImg3.message as UploadApiResponse).url);
    }
  }

  if (img4) {
    const uploadImg4 = await uploadAuctionImage(img4, 'img4_' + auctShortId);

    if (uploadImg4.status === true) {
      imgUrls.push((uploadImg4.message as UploadApiResponse).url);
    }
  }

  const createAucRes = await axios.post(
    `${Config.API_URL}/auction/createAuction`,
    {
      ...JSON.parse(formData.get('auctionData') as string),
      id: auctShortId,
      imagesUrl: imgUrls,
    },
    {
      withCredentials: true,
      headers: {
        cookie: `session=${req.cookies.get('session')?.value}`,
      },
    }
  );

  const createAucData = await createAucRes.data;
  return NextResponse.json(createAucData);
}
