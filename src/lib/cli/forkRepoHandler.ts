const { Select } = require('enquirer');

import path from 'path';
import { spawn } from 'child_process';
import { forkRepoCommandStore } from '@/constants/command/commandMap';

export async function forkRepoHandler() {
  try {
    const choices = forkRepoCommandStore.getAllCommandNames();

    const choice = await new Select({
      message: 'choose action',
      choices,
    }).run();

    const command = spawn(
      'node',
      [path.resolve(__dirname, '../..', forkRepoCommandStore.getScriptSource(choice) as string)],
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
