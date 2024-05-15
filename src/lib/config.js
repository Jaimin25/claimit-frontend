export const Config = {
  APP_NAME: 'Claimit',
  APP_URL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://claimit.vercel.app',
  API_URL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/api/v1'
      : 'https://claimit-backend.onrender.com',
};
