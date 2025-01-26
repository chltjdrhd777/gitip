import { Command } from 'commander';
import { showVersion } from './versionHandler';
import { PROCESS_EXIT } from '@/utils';
import { GitipCommandType } from '@/types';
import { forkRepoHandler, originRepoHandler } from './repoHandler';

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
    this.setIssueCommand();
    this.setPullRequestCommand();
    this.setSyncCommand();
    this.setCleanCommand();
  }

  private setVersionCommand() {
    const actionHandler = () => {
      showVersion();
      PROCESS_EXIT();
    };

    this.program.option('-v, --version', 'Display the current version').action(actionHandler);
    this.program.command('version').action(actionHandler);
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
    const defaultActionHandler = async (flagOptions: Record<string, any>) => {
      flagOptions.origin ? await originRepoHandler.run() : await forkRepoHandler.run();
    };

    this.program.option('-o, --origin', 'Handle origin repository').action(defaultActionHandler);
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
  private getOptionValues = () => this.program.opts();

  private mountCommand = (commandType: GitipCommandType, commandList: string[]) => {
    const actionHandler = async () => {
      const flagOptions = this.getOptionValues();

      flagOptions.origin ? await originRepoHandler.run(commandType) : await forkRepoHandler.run(commandType);
    };

    commandList.forEach((command) => {
      this.program.command(command).action(actionHandler);
    });
  };
}

const gitipCLIController = new GitipCLIController();

export { gitipCLIController };
