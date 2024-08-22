import { config } from 'dotenv';

config();

export const MyConfig = {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    SALT: process.env.SALT,
    PHOTO_PATH: process.env.PHOTO_PATH,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
};
