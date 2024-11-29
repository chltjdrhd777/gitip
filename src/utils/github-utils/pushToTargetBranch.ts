import { executeCommand } from '@/utils/common-utils/executeCommand';

export function pushToTargetBranch(targetBranchAlias: string, currentBranchName: string) {
  return executeCommand(`git push ${targetBranchAlias} ${currentBranchName}`);
}
