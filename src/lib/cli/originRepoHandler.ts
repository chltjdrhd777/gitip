const { Select } = require('enquirer');
import { originRepoCommandStore } from '@/constants/command/commandMap';

import path from 'path';
import { spawn } from 'child_process';
import { GitipCommandType } from '@/types';

export async function originRepoHandler(commandType?: GitipCommandType) {
  try {
    const sourceByCommandType = originRepoCommandStore.getScriptSourceByCommandType(commandType);

    const choices = originRepoCommandStore.getAllCommandNames();

    const choice = await new Select({
      message: 'choose action',
      choices,
    }).run();

    const command = spawn(
      'node',
      [path.resolve(__dirname, '../..', originRepoCommandStore.getScriptSource(choice) as string)],
      {
        stdio: 'inherit',
        detached: false,
      },
    );

    command.on('close', (code) => {
      if (process.env.NODE_ENV === 'test') {
        console.log(`child process exited with code ${code}`);
      }
    });
  } catch {}
}
