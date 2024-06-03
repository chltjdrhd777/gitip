import { executeCommand } from './executeCommand';

interface SyncForkBranchAndPullLocalBranchParams {
  FORK_REPO_OWNER?: string;
  REPO_NAME?: string;
  BRANCH_NAME?: string;
  upstreamRemoteAlias: string;
}
export default function syncForkBranchAndPullLocalBranch({
  FORK_REPO_OWNER,
  REPO_NAME,
  BRANCH_NAME,
  upstreamRemoteAlias,
}: SyncForkBranchAndPullLocalBranchParams) {
  executeCommand(`gh repo sync ${FORK_REPO_OWNER}/${REPO_NAME} -b ${BRANCH_NAME}`);
  executeCommand(`git pull ${upstreamRemoteAlias} ${BRANCH_NAME}`);
}
