import path from 'path';
import dotenv from 'dotenv';
import { setupCLI } from './lib/cli/flags';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export async function main() {
  setupCLI();
}

main();
