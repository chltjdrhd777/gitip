import { executeCommand } from '@/utils/common-utils/executeCommand';
import { checkBranchExistence } from './checkBranchExistence';

export async function checkoutToTargetBranch(branchName: string) {
  const currentBranch = executeCommand('git branch --show-current');
  const isExistFeatureBranch = await checkBranchExistence(branchName);

  if (!isExistFeatureBranch) {
    executeCommand('git checkout -b feature');
  }

  if (currentBranch?.toString().replace(/\s/, '') !== branchName) {
    executeCommand('git checkout feature');
  }
}
