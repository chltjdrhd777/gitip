import { gitipCLIController } from './lib/cli';

export async function main() {
  await gitipCLIController.initializeCLI();
}

main();
