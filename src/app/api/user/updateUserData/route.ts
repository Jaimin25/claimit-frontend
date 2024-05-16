import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

import { Config } from '@/lib/config';

const cwd = process.cwd();

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  const newFd = new FormData();
  newFd.append('document', formData.get('document') as string);
  let filepath;
  if (file && typeof file !== 'string') {
    const ab = await file.arrayBuffer();
    const bf = Buffer.from(ab);
    filepath = path.join(cwd, 'upload', file.name) + Date.now();
    await fs.promises.writeFile(filepath, bf, {
      encoding: 'binary',
    });

    newFd.append('file', fs.createReadStream(filepath));
  }

  const res = await axios.post(`${Config.API_URL}/user/updateUserData`, newFd, {
    withCredentials: true,
    headers: {
      cookie: `session=${req.cookies.get('session')?.value}`,
      'Content-Type': req.headers.get('content-type'),
    },
  });

  const resData = await res.data;

  if (resData && filepath && fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }

  return NextResponse.json(resData);
}
