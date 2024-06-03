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
  BACKEND_URL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000'
      : 'https://claimit-backend.onrender.com/',
  CLOUDINARY_NAME: 'dfekfdfbb',
  CLOUDINARY_API_KEY: '146218175858287',
  CLOUDINARY_API_SECRET: 'u4qkQAxiY5MTe4oy8OXHv5F9vjM',
};
