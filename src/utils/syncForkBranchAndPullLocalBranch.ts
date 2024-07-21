import { executeCommand } from './executeCommand';

interface SyncForkBranchAndPullLocalBranchParams {
  FORK_REPO_OWNER?: string;
  REPO_NAME?: string;
  BRANCH_NAME?: string;
  upstreamRemoteAlias?: string;
}
export default function syncForkBranchAndPullLocalBranch({
  FORK_REPO_OWNER,
  REPO_NAME,
  BRANCH_NAME,
  upstreamRemoteAlias,
}: SyncForkBranchAndPullLocalBranchParams) {
  const executeSync = executeCommand(`gh repo sync ${FORK_REPO_OWNER}/${REPO_NAME} -b ${BRANCH_NAME}`);
  if (executeSync === null) {
    console.log('failed to sync repo');
    throw new Error();
  }

  const executePull = executeCommand(`git pull ${upstreamRemoteAlias} ${BRANCH_NAME}`);
  if (executePull === null) {
    console.log('failed to git pull. please check the change status first');
    throw new Error();
  }
}
