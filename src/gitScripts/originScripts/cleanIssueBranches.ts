import { findRemoteAlias } from '@/utils';
import { executeCommand } from '@/utils/common-utils/executeCommand';

const ora = require('ora-classic');

const ORIGIN_REPO_OWNER = process.env.ORIGIN_REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;

(async () => {
  const spinner = ora('please wait for cleaning').start();

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve('wait');
    }, 1500);
  });

  //0. branch remote update and checkout
  const originRemoteAlias = await findRemoteAlias(`${ORIGIN_REPO_OWNER}/${REPO_NAME}`);
  if (!originRemoteAlias) {
    spinner.stop();

    return console.log(
      `🕹 No remote alias for "Origin" url. please add it first\nRun : \x1b[36mgit remote add origin {origin repository url}\x1b[0m`,
    );
  }

  executeCommand(`git fetch --prune ${originRemoteAlias}`);
  executeCommand('git checkout feature');

  //1. delete all remote issue branches
  const getAllOriginIssueBranches = executeCommand(`git branch -r | grep '${originRemoteAlias}/issue-'`)?.toString();

  if (!getAllOriginIssueBranches) {
    spinner.stop();
    return console.log('🧽 done');
  }

  const refinedBranchNames = getAllOriginIssueBranches
    .split('\n')
    .filter((e) => !!e)
    .map((e) => e.trim().replace(/origin\//, ''));

  refinedBranchNames.forEach(async (issueName) => {
    executeCommand(`git push origin --delete ${issueName}`);
  });

  //2. delete all local issue branches
  executeCommand("git branch | grep 'issue-' | xargs git branch -D");

  //3. fetch latest feature branch
  executeCommand('git fetch --prune origin');

  spinner.stop();
  console.log('🧽 done');
})();
