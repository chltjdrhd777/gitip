import path from 'path';
import dotenv from 'dotenv';
import { gitipCLIController } from './lib/cli';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export async function main() {
  await gitipCLIController.initializeCLI();
}

main();
