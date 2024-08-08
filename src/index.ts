const { Select } = require('enquirer');

import path from 'path';
import dotenv from 'dotenv';
import { spawn } from 'child_process';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export async function getGitAction() {
  try {
    const commandList: Map<string, string> = new Map([
      ['create an issue', './gitScripts/gitIssue.js'],
      ['create a pull request', './gitScripts/gitPR.js'],
      ['synchronize a fork branch with a remote branch', './gitScripts/syncBranch.js'],
      ['clean redundant issue branches', './gitScripts/cleanIssueBranches.js'],
    ]);

    const choices = Array.from(commandList).map(([key]) => key);

    const choice = await new Select({
      message: 'choose action',
      choices,
    }).run();

    const command = spawn('node', [path.join(__dirname, commandList.get(choice) as string)], {
      stdio: 'inherit',
      detached: false,
    });

    command.on('close', (code) => {
      if (process.env.NODE_ENV === 'test') {
        console.log(`child process exited with code ${code}`);
      }
    });
  } catch {}
}

getGitAction();
