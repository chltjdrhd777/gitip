import { PROCESS_EXIT, sleep } from '@/utils';
import { executeCommand } from '@/utils/common-utils/executeCommand';
import extractIssueBranches from '@/service/github-service/extractIssueBranches';
import fetchBranch, { createFetchBranchErrorMessage } from '@/service/github-service/fetchBranch';
import { createFindRemoteAliasErrorMessage, deleteRemoteBranches, findRemoteAlias } from '@/service';
import { ISSUE_BRANCH_TO_CLEAN_PATTERN } from '@/constants/regularExpression';
import { deleteLocalBranches } from '@/service/github-service/deleteLocalBranches';

const ora = require('ora-classic');

const ORIGIN_REPO_OWNER = process.env.ORIGIN_REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const CLEANUP_SUCCESS_MESSAGE = '\n🧽 all issue branches are cleaned up';

(async () => {
  const spinner = ora('please wait for cleaning\n').start();
  await sleep(1000);

  //1. find remote alias for fork repository
  const originRepoRemoteAlias = findRemoteAlias(`${ORIGIN_REPO_OWNER}/${REPO_NAME}`, {
    onError: () => console.error(createFindRemoteAliasErrorMessage({ targetRepo: 'origin' })),
  });

  //2. fetch branches from fork repository (remove unused branches from local by --prune flag)
  fetchBranch(
    { remoteAlias: originRepoRemoteAlias },
    {
      onError: () => console.error(createFetchBranchErrorMessage({ remoteAlias: originRepoRemoteAlias })),
    },
  );

  //3. extract all remote issue branches with -#issueNumber suffix
  const allRemoteIssueBranches = extractIssueBranches(ISSUE_BRANCH_TO_CLEAN_PATTERN, {
    target: 'remote',
    onSuccess: () => spinner.stop(),
  });
  const refinedRemoteBranchNames = allRemoteIssueBranches.map((e) => e.trim().replace(`${originRepoRemoteAlias}/`, ''));

  //4. delete all remote issue branches (if exists)
  deleteRemoteBranches(refinedRemoteBranchNames);

  //5. extract all local issue branches with -#issueNumber suffix
  const allLocalIssueBranches = extractIssueBranches(ISSUE_BRANCH_TO_CLEAN_PATTERN, {
    target: 'local',
    onSuccess: () => spinner.stop(),
  });
  const refinedLocalBranchNames = allLocalIssueBranches.map((e) => e.trim());

  //6. delete all local issue branches (if exists)
  deleteLocalBranches(refinedLocalBranchNames);

  spinner.stop();
  console.log(CLEANUP_SUCCESS_MESSAGE);
})();
