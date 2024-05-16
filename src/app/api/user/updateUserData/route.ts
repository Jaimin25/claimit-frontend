import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

import { Config } from '@/lib/config';

// const cwd = process.cwd();

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const imgFileBase64 = formData.get('profileImgFileBase64') as File;

  try {
    const newFd = new FormData();
    newFd.append('document', formData.get('document') as string);

    if (imgFileBase64 && typeof imgFileBase64 === 'string') {
      newFd.append(
        'profileImgFileBase64',
        formData.get('profileImgFileBase64') as string
      );
    }
    // let filepath;
    // if (file && typeof file !== 'string') {
    //   const uploadImage = await axios.post(
    //     `https://upload.imagekit.io/api/v1/files/upload`,
    //     formData
    //   );

    //   console.log(uploadImage);
    //   const ab = await file.arrayBuffer();
    //   const bf = Buffer.from(ab);
    //   filepath = join('/', 'tmp', file.name) + Date.now();
    //   console.log(filepath);
    //   await fs.promises.writeFile(filepath, bf, {
    //     encoding: 'binary',
    //   });

    //   newFd.append('file', fs.createReadStream(filepath));
    // }

    const res = await axios.post(
      `${Config.API_URL}/user/updateUserData`,
      newFd,
      {
        withCredentials: true,
        headers: {
          cookie: `session=${req.cookies.get('session')?.value}`,
          'Content-Type': req.headers.get('content-type'),
        },
      }
    );

    const resData = await res.data;

    // if (resData && filepath && fs.existsSync(filepath)) {
    //   fs.unlinkSync(filepath);
    // }
    return NextResponse.json(resData);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      statuCode: 404,
      statusMessage: (error as Error).stack,
    });
  }
}
