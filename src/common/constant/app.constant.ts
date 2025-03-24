import 'dotenv/config';

export const DATABASE_URL = process.env.DATABASE_URL;

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRED = process.env.ACCESS_TOKEN_EXPIRED;

export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRED = process.env.REFRESH_TOKEN_EXPIRED;

export const CLOUD_NAME = process.env.CLOUD_NAME;
export const API_KEY_CLOUD = process.env.API_KEY_CLOUD;
export const API_SECRET_CLOUD = process.env.API_SECRET_CLOUD;

export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
export const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
export const FACEBOOK_CALLBACK_URL = process.env.FACEBOOK_CALLBACK_URL;

export const ACCESS_KEY_MOMO = process.env.ACCESS_KEY_MOMO;
export const SECRET_KEY_MOMO = process.env.SECRET_KEY_MOMO as string;

export const REGEX_EMAIL =
  /(?=^[a-z0-9.]+@[a-z0-9.-]+\.[a-zA-Z]{2,6}$)(?=^.{1,40}$)/i;

console.log({
  DATABASE_URL,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRED,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRED,
});
