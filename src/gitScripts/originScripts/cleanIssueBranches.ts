import { sleep } from '@/utils';
import { executeCommand } from '@/utils/common-utils/executeCommand';
import extractIssueBranches from '@/service/github-service/extractIssueBranches';
import extractRemoteIssueBranches from '@/service/github-service/extractRemoteIssueBranches';
import fetchBranchesWithPrune, {
  createFetchBranchesWithPruneErrorMessage,
} from '@/service/github-service/fetchBranchesWithPrune';
import { createFindRemoteAliasErrorMessage, findRemoteAlias } from '@/service';

const ora = require('ora-classic');

const ORIGIN_REPO_OWNER = process.env.ORIGIN_REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const ISSUE_BRANCH_TO_CLEAN_PATTERN = '(.*/)?[^/]+-#?[0-9]+$';
const CLEANUP_SUCCESS_MESSAGE = '\n🧽 all issue branches are cleaned up';

(async () => {
  const spinner = ora('please wait for cleaning\n').start();
  await sleep(1000);

  //1. find remote alias for fork repository
  const originRepoRemoteAlias = findRemoteAlias(`${ORIGIN_REPO_OWNER}/${REPO_NAME}`, {
    onError: () => console.error(createFindRemoteAliasErrorMessage({ targetRepo: 'origin' })),
  });

  //2. fetch branches from fork repository (remove unused branches from local by --prune flag)
  fetchBranchesWithPrune(originRepoRemoteAlias, {
    onError: () => console.error(createFetchBranchesWithPruneErrorMessage({ remoteAlias: originRepoRemoteAlias })),
  });

  //3. extract all remote issue branches with -#issueNumber suffix
  const allRemoteIssueBranches = extractIssueBranches(ISSUE_BRANCH_TO_CLEAN_PATTERN, {
    target: 'remote',
    onSuccess: () => spinner.stop(),
  });
  const refinedRemoteBranchNames = allRemoteIssueBranches.map((e) => e.trim().replace(`${originRepoRemoteAlias}/`, ''));

  //4. delete all remote issue branches (if exists)
  refinedRemoteBranchNames.forEach((branchName) => {
    executeCommand(`git push ${originRepoRemoteAlias} --delete ${branchName}`, { exitWhenError: false });
  });

  //5. extract all local issue branches with -#issueNumber suffix
  const allLocalIssueBranches = extractIssueBranches(ISSUE_BRANCH_TO_CLEAN_PATTERN, {
    target: 'local',
    onSuccess: () => spinner.stop(),
  });
  const refinedLocalBranchNames = allLocalIssueBranches.map((e) => e.trim());

  //6. delete all local issue branches (if exists)
  refinedLocalBranchNames.forEach((branchName) => {
    executeCommand(`git branch -D ${branchName}`, { exitWhenError: false });
  });

  spinner.stop();
  console.log(CLEANUP_SUCCESS_MESSAGE);
})();
