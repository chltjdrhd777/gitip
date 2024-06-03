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
      ['synchronize a fork branch with a remote branch', './gitScripts/syncBranch.mjs'],
      ['clean redundant issue branches', './gitScripts/cleanIssueBranches.mjs'],
    ]);

    const choices = Array.from(commandList).map(([key]) => key);

    const choice = await new Select({
      message: 'choose action',
      choices,
    }).run();

    const command = spawn('node', [path.join(__dirname, commandList.get(choice) as string)], {
      stdio: 'inherit',
      detached: true,
    });

    // command.stdout.on('data', (data) => {
    //   console.log(data.toString());
    // });

    // command.stderr.on('data', (data) => {
    //   console.error(data.toString());
    // });

    command.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  } catch {}
}

getGitAction();
