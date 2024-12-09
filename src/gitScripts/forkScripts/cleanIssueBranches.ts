import { createFindRemoteAliasErrorMessage, findRemoteAlias, sleep } from '@/utils';
import { executeCommand } from '@/utils/common-utils/executeCommand';
import extractRemoteIssueBranches from '@/utils/github-utils/extractRemoteIssueBranches';
import fetchBranchesWithPrune, {
  createFetchBranchesWithPruneErrorMessage,
} from '@/utils/github-utils/fetchBranchesWithPrune';

const ora = require('ora-classic');

const FORK_REPO_OWNER = process.env.FORK_REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const ISSUE_BRANCH_TO_CLEAN_PATTERN = '.*/.*-#?\\d+$';
const CLEANUP_SUCCESS_MESSAGE = '🧽 all issue branches are cleaned up';

(async () => {
  const spinner = ora('please wait for cleaning\n').start();
  await sleep(1000);

  //1. find remote alias for fork repository
  const forkRepoRemoteAlias = findRemoteAlias(`${FORK_REPO_OWNER}/${REPO_NAME}`, {
    onError: () => console.error(createFindRemoteAliasErrorMessage({ targetRepo: 'fork' })),
  });

  //2. fetch branches from fork repository (remove unused branches from local by --prune flag)
  fetchBranchesWithPrune(forkRepoRemoteAlias, {
    onError: () => console.error(createFetchBranchesWithPruneErrorMessage({ forkRepoRemoteAlias })),
  });

  //3. extract all issue branches with -#issueNumber suffix
  const allRemoteIssueBranches = extractRemoteIssueBranches(ISSUE_BRANCH_TO_CLEAN_PATTERN, {
    onSuccess: () => spinner.stop(),
  });
  const refinedBranchNames = (allRemoteIssueBranches as string)
    .split('\n')
    .filter((e) => !!e)
    .map((e) => e.trim().replace(`${forkRepoRemoteAlias}/`, ''));

  //4. delete all remote issue branches
  await Promise.all(
    refinedBranchNames.map((issueName) => {
      executeCommand(`git push ${forkRepoRemoteAlias} --delete ${issueName}`, { exitWhenError: false });
    }),
  );

  //5. delete all local issue branches
  executeCommand("git branch | grep 'issue-' | xargs git branch -D", { exitWhenError: false });

  spinner.stop();
  console.log(CLEANUP_SUCCESS_MESSAGE);
})();
