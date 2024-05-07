import { env } from '@/env';

export const APP_NAME = 'Claimit';

export const BASE_URL =
  env.NODE_ENV === 'development' ? 'https://localhost:3000' : '';
