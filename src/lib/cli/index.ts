import { Command } from 'commander';
import { getVersion, showVersion } from './versionHandler';
import { GitipCommandType } from '@/types';
import { forkRepoHandler, originRepoHandler } from './repoHandler';
import { envStore } from '@/service/environment';
import { ColorCode } from '@/constants/colors';

export class GitipCLIController {
  private program: Command = new Command().name('gitip-cli');

  public async initializeCLI() {
    this.setCommands();
    this.parseArgs();
  }

  private setCommands() {
    this.setVersionCommand();
    this.setHelpCommand();

    this.setDefaultAction();
    this.setInitCommand();
    this.setIssueCommand();
    this.setPullRequestCommand();
    this.setSyncCommand();
    this.setCleanCommand();
  }

  private printMode() {
    const isOrigin = envStore.hasOriginFlag();

    console.log(`\n🔍 ${ColorCode.magenta('[Current mode]')}: ${ColorCode.white(isOrigin ? 'origin' : 'fork')}\n`);
  }

  private setVersionCommand() {
    this.program.command('version').description('Show the current version').action(showVersion);
    this.program.version(`🔔 Version: ${getVersion()}`, '-v, --version', 'Display the current version');
  }

  private setHelpCommand() {
    this.program
      .helpOption('-h, --help', 'Show this help message and exit')
      .addHelpText(
        'beforeAll',
        '\n🌟 Welcome to gitip-cli! Manage GitHub repositories and pull requests efficiently.\n',
      );
  }

  private setDefaultAction() {
    const defaultActionHandler = async () => {
      envStore.load();

      const isOrigin = envStore.hasOriginFlag();

      this.printMode();

      isOrigin ? await originRepoHandler.run() : await forkRepoHandler.run();
    };

    this.program.action(defaultActionHandler);
  }

  private setInitCommand() {
    this.program
      .command('init')
      .description('Initialize .env file with required environment variables')
      .action(envStore.init);
  }

  private setIssueCommand() {
    this.mountCommand('issue', ['i', 'issue']);
  }

  private setPullRequestCommand() {
    this.mountCommand('pr', ['p', 'pull']);
  }

  private setSyncCommand() {
    this.mountCommand('sync', ['s', 'sync']);
  }

  private setCleanCommand() {
    this.mountCommand('clean', ['c', 'clean']);
  }

  /** helpers */
  private parseArgs = () => this.program.parse(process.argv);

  private mountCommand = (commandType: GitipCommandType, commandList: string[]) => {
    const actionHandler = async () => {
      envStore.load();

      const isOrigin = envStore.hasOriginFlag();

      this.printMode();

      isOrigin ? await originRepoHandler.run(commandType) : await forkRepoHandler.run(commandType);
    };

    commandList.forEach((command) => {
      this.program.command(command).action(actionHandler);
    });
  };
}

const gitipCLIController = new GitipCLIController();

export { gitipCLIController };
