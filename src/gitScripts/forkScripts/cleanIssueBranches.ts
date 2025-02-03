import {
  checkCurrentBranchIsIssueBranch,
  confirmToDeleteBranches,
  createFindRemoteAliasErrorMessage,
  deleteRemoteBranches,
  findRemoteAlias,
} from '@/service';
import extractIssueBranches from '@/service/github-service/extractIssueBranches';
import fetchBranch, { createFetchBranchErrorMessage } from '@/service/github-service/fetchBranch';
import { sleep } from '@/utils';
import { deleteLocalBranches } from '@/service/github-service/deleteLocalBranches';

const ora = require('ora-classic');

/**@PRE_REQUISITE */
const FORK_REPO_OWNER = process.env.FORK_REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const CLEANUP_SUCCESS_MESSAGE = '\n🧽 all cleanup process is finished';

(async () => {
  checkCurrentBranchIsIssueBranch();

  await confirmToDeleteBranches();

  const spinner = ora('please wait for cleaning\n').start();
  await sleep(1000);

  //1. find remote alias for fork repository
  const forkRepoRemoteAlias = findRemoteAlias(`${FORK_REPO_OWNER}/${REPO_NAME}`, {
    onError: () => console.error(createFindRemoteAliasErrorMessage({ targetRepo: 'fork' })),
  });

  //2. fetch branches from fork repository (remove unused branches from local by --prune flag)
  fetchBranch(
    { remoteAlias: forkRepoRemoteAlias },
    {
      onError: () => console.error(createFetchBranchErrorMessage({ remoteAlias: forkRepoRemoteAlias })),
    },
  );

  //3. delete all local issue branches (if exists)
  const allLocalIssueBranches = extractIssueBranches(
    { type: 'local' },
    {
      onSuccess: () => spinner.stop(),
    },
  );
  deleteLocalBranches(allLocalIssueBranches);

  //4. delete all remote issue branches (if exists)
  const allRemoteIssueBranches = extractIssueBranches(
    { type: 'remote', remoteAlias: forkRepoRemoteAlias },
    {
      onSuccess: () => spinner.stop(),
      replacer: (branchName) => branchName.replace(`${forkRepoRemoteAlias}/`, ''),
    },
  );

  deleteRemoteBranches(allRemoteIssueBranches, forkRepoRemoteAlias);

  spinner.stop();
  console.log(CLEANUP_SUCCESS_MESSAGE);
})();
