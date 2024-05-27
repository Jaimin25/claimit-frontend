import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';

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
      secure: true,
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

  const auctionId = formData.get('auctionId');

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

  const checkAuctionStatus = await axios.get(
    `${Config.API_URL}/auction/checkIfAuctionIsEditable`,
    {
      withCredentials: true,
      headers: {
        cookie: `session=${req.cookies.get('session')?.value}`,
      },
      params: {
        auctionId,
      },
    }
  );

  const checkAunctionStatusData = await checkAuctionStatus.data;

  if (
    checkAunctionStatusData.statusCode !== 200 &&
    checkAunctionStatusData.statusMessage !== 'Can edit the auction!'
  ) {
    return NextResponse.json(checkAunctionStatusData);
  }

  const img1 = formData.get('img1') as File;
  const img2 = formData.get('img2') as File;

  const img3 = formData.get('img3') as File;
  const img4 = formData.get('img4') as File;

  const imgUrls: string[] = [];

  if (img1) {
    const uploadImg1 = await uploadAuctionImage(img1, 'img1_' + auctionId);

    if (uploadImg1.status === true) {
      imgUrls.push((uploadImg1.message as UploadApiResponse).secure_url);
    }
  }

  if (img2) {
    const uploadImg2 = await uploadAuctionImage(img2, 'img2_' + auctionId);

    if (uploadImg2.status === true) {
      imgUrls.push((uploadImg2.message as UploadApiResponse).secure_url);
    }
  }

  if (img3) {
    const uploadImg3 = await uploadAuctionImage(img3, 'img3_' + auctionId);

    if (uploadImg3.status === true) {
      imgUrls.push((uploadImg3.message as UploadApiResponse).secure_url);
    }
  }

  if (img4) {
    const uploadImg4 = await uploadAuctionImage(img4, 'img4_' + auctionId);

    if (uploadImg4.status === true) {
      imgUrls.push((uploadImg4.message as UploadApiResponse).secure_url);
    }
  }

  const dataToSend =
    imgUrls.length >= 1
      ? {
          ...JSON.parse(formData.get('updateAuctionData') as string),
          id: auctionId,
          status: formData.get('auctionStatus'),
          imagesUrl: imgUrls,
        }
      : {
          ...JSON.parse(formData.get('updateAuctionData') as string),
          id: auctionId,
          status: formData.get('auctionStatus'),
        };

  const createAucRes = await axios.post(
    `${Config.API_URL}/auction/updateAuctionDetails`,
    dataToSend,
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
