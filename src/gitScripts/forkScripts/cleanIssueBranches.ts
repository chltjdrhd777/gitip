import { createFindRemoteAliasErrorMessage, findRemoteAlias, sleep } from '@/utils';
import { executeCommand } from '@/utils/common-utils/executeCommand';

const ora = require('ora-classic');

const FORK_REPO_OWNER = process.env.FORK_REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;

(async () => {
  const spinner = ora('please wait for cleaning').start();
  await sleep(1000);

  //0. branch remote update and checkout
  const forkRepoRemoteAlias = findRemoteAlias(`${FORK_REPO_OWNER}/${REPO_NAME}`, {
    onError: () => console.error(createFindRemoteAliasErrorMessage({ targetRepo: 'fork' })),
  });

  executeCommand(`git fetch --prune ${forkRepoRemoteAlias}`);
  executeCommand('git checkout feature');

  //1. delete all remote issue branches
  const getAllOriginIssueBranches = executeCommand(`git branch -r | grep '${forkRepoRemoteAlias}/issue-'`)?.toString();

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
