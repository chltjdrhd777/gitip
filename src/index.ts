import { gitipCLIController } from './lib/cli';
import { envStore } from './service/environment';

export async function main() {
  envStore.load();

  await gitipCLIController.initializeCLI();
}

main();
