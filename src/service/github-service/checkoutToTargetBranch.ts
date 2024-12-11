import { executeCommand } from '@/utils/common-utils/executeCommand';
import { checkBranchExistence } from './checkBranchExistence';
import { checkCurrentBranch } from './checkCurrentBranch';
import { Callbacks } from '@/types';
import { PROCESS_EXIT } from '@/utils/common-utils';

interface CheckoutToTargetBranchConfig extends Callbacks {}

export async function checkoutToTargetBranch(
  branchName: string,
  checkoutToTargetBranchConfig?: CheckoutToTargetBranchConfig,
) {
  const { onError } = checkoutToTargetBranchConfig ?? {};

  try {
    const currentBranch = checkCurrentBranch(checkoutToTargetBranchConfig);
    const isExistFeatureBranch = await checkBranchExistence(branchName);

    if (!isExistFeatureBranch) {
      console.log(`🕹 no ${branchName} branch, checkout to ${branchName} branch creating`);
      executeCommand('git checkout -b feature', checkoutToTargetBranchConfig);
    }

    if (currentBranch?.toString().replace(/\s/, '') !== branchName) {
      console.log(`🕹 current branch is not ${branchName} branch, checkout to ${branchName} branch`);
      executeCommand('git checkout feature', checkoutToTargetBranchConfig);
    }
  } catch (err) {
    onError?.(err);
    PROCESS_EXIT();
  }
}

export function createCheckoutToTargetBranchErrorMessage({ BRANCH_NAME = '' }: { BRANCH_NAME?: string }) {
  return console.error(`\n🚫 Failed to checkout ${BRANCH_NAME}`);
}
