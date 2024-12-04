import { DefaultConfig } from '@/types';
import { executeCommand } from '@/utils/common-utils/executeCommand';

interface PushToTargetBranchConfig extends DefaultConfig {}

export function pushToTargetBranch(
  targetBranchAlias: string,
  currentBranchName: string,
  config?: PushToTargetBranchConfig,
) {
  return executeCommand(`git push ${targetBranchAlias} ${currentBranchName}`, {
    execSyncOptions: { stdio: 'ignore' },
    ...config,
  });
}

export function createPushToTargetBranchErrorMessage({
  FORK_REPO_OWNER = '',
  REPO_NAME = '',
}: {
  FORK_REPO_OWNER?: string;
  REPO_NAME?: string;
}) {
  return `\n🚫 Failed to push to ${FORK_REPO_OWNER}/${REPO_NAME} repository. please check your env again`;
}
