import * as dotenv from 'dotenv';

dotenv.config();

export const SERVER_URL = process.env.SERVER_URL;

export const JWT_SECRET = process.env.JWT_SECRET;
