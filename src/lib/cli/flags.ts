import { Command } from 'commander';
import { showVersion } from './versionHandler';
import { forkRepoHandler } from './forkRepoHandler';
import { originRepoHandler } from './originRepoHandler';

const program = new Command();

export function setupCLI(): void {
  program.name('gitip-cli').description('A Node.js library with CLI flag controls for github issues and pull request');

  // // Handle origin repository
  program.option('-o, --origin', 'Handle origin repository').action(async (options) => {
    if (options.origin) {
      await originRepoHandler();
    }
  });

  // Handle fork repository
  program.option('-f, --fork', 'Handle fork repository').action(async (options) => {
    if (options.fork) {
      await forkRepoHandler();
    }
  });

  // Handle version display
  program.option('-v, --version', 'Display the current version').action(() => {
    showVersion();
    process.exit(0);
  });

  program.parse(process.argv);
}
