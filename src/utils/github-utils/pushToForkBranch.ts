import { executeCommand } from '@/utils/common-utils/executeCommand';

export function pushToForkBranch(forkRemoteAlias: string, currentBranchName: string) {
  return executeCommand(`git push ${forkRemoteAlias} ${currentBranchName}`);
}
