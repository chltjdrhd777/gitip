import { ColorCode } from '@/constants/colors';
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
  REPO_OWNER = '',
  REPO_NAME = '',
}: {
  REPO_OWNER?: string;
  REPO_NAME?: string;
}) {
  return `\n🚫 Failed to push to ${REPO_OWNER}/${REPO_NAME} repository.\n
  ${ColorCode.yellow('hint: Updates were rejected because the tip of your current branch is behind')}
  ${ColorCode.yellow('its remote counterpart. Integrate the remote changes (e.g.')}
  ${ColorCode.yellow('git pull ...) before pushing again.')}
  ${ColorCode.yellow('See the "Note about fast-forwards" in "git push --help" for details.')}
  `;
}

export function createPushToTargetBranchSuccessMessage() {
  return `\n✅ Pushed changes to target repository`;
}
