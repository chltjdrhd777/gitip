import dotenv from 'dotenv';
import path from 'path';

export default function loadEnv() {
  const environment = process.env.NODE_ENV;
  const envFilePath = environment ? `.env.${environment}` : '.env';

  dotenv.config({ path: path.resolve(process.cwd(), envFilePath) });
}
