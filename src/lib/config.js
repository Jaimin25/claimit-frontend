import { v2 as cloudinary } from 'cloudinary';

export const Config = {
  APP_NAME: 'Claimit',
  APP_URL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://claimit.vercel.app',
  API_URL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/api/v1'
      : 'https://claimit-backend.onrender.com/api/v1',
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };
