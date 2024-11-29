import path from 'path';
import dotenv from 'dotenv';
import { forkRepoHandler } from './forkRepoHandler';
import { originRepoHandler } from './originRepoHandler';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export async function main() {
  const args = process.argv.slice(2);
  const isOriginRepo = args.includes('-origin') || args.includes('-o');

  if (isOriginRepo) {
    await originRepoHandler();
  } else {
    await forkRepoHandler();
  }
}

main();
