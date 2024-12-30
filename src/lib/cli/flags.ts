import { Command } from 'commander';
import { showVersion } from './versionHandler';
import { forkRepoHandler } from './forkRepoHandler';
import { originRepoHandler } from './originRepoHandler';

const program = new Command();

export async function setupCLI() {
  program.name('gitip-cli').description('A Node.js library with CLI flag controls for github issues and pull request');

  // Handle origin repository
  program.option('-o, --origin', 'Handle origin repository');
  program.option('-v, --version', 'Display the current version');

  program.parse(process.argv);

  const options = program.opts();

  if (options.version) {
    showVersion();
    process.exit(0);
  }

  if (options.origin) {
    await originRepoHandler();
  } else {
    await forkRepoHandler();
  }

  // Handle fork repository
  // program.option('-f, --fork', 'Handle fork repository').action(async (options) => {
  //   if (options.fork) {
  //     await forkRepoHandler();
  //   }
  // });

  program.parse(process.argv);
}
