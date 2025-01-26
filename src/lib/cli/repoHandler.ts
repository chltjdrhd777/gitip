const { Select } = require('enquirer');

import path from 'path';
import { spawn } from 'child_process';
import { CommandStore } from '@/constants/command/CommandStore';
import { GitipCommandType } from '@/types';
import { forkRepoCommandStore, originRepoCommandStore } from '@/constants/command/commandMap';

export class RepoHandler {
  private store: CommandStore;

  constructor(store: CommandStore) {
    this.store = store;
  }

  async run(commandType?: GitipCommandType): Promise<void> {
    try {
      const sourcePathByCommandType = this.getSourcePathByCommandType(commandType);

      if (sourcePathByCommandType) {
        this.runScript(sourcePathByCommandType);
      } else {
        const choice = await this.selectCommand();

        this.runScript(this.store.getScriptSource(choice) as string);
      }
    } catch {}
  }

  private getSourcePathByCommandType = (commandType?: GitipCommandType): string | undefined => {
    return this.store.getScriptSourceByCommandType(commandType);
  };

  private selectCommand = async (): Promise<string> => {
    const choices = this.store.getAllCommandNames();

    const choice = await new Select({
      message: 'Choose an action to perform:',
      choices,
    }).run();

    return choice;
  };

  private runScript = (sourcePath: string): void => {
    const command = spawn('node', [path.resolve(__dirname, '../..', sourcePath)], {
      stdio: 'inherit',
      detached: false,
    });

    command.on('close', (code) => {
      if (process.env.NODE_ENV === 'test') {
        console.log(`Child process exited with code ${code}`);
      }
    });
  };
}

const forkRepoHandler = new RepoHandler(forkRepoCommandStore);
const originRepoHandler = new RepoHandler(originRepoCommandStore);

export { forkRepoHandler, originRepoHandler };
