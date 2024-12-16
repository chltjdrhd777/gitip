import { checkBranchExistence } from './checkBranchExistence';
import { Callbacks } from '@/types';
import { PROCESS_EXIT } from '@/utils/common-utils';
import switchBranch from './switchBranch';
import { getCurrentBranchName } from './getCurrentBranchName';

interface CheckoutToTargetBranchConfig extends Callbacks {}

export async function checkoutToTargetBranch(
  branchName: string,
  checkoutToTargetBranchConfig?: CheckoutToTargetBranchConfig,
) {
  const { onError } = checkoutToTargetBranchConfig ?? {};

  try {
    const currentBranch = getCurrentBranchName(checkoutToTargetBranchConfig);
    const existTargetBranch = await checkBranchExistence(branchName);

    if (!existTargetBranch) {
      switchBranch({ branchName, flags: ['-c'] }, checkoutToTargetBranchConfig);
      return;
    }

    if (currentBranch !== branchName) {
      switchBranch({ branchName }, checkoutToTargetBranchConfig);
      return;
    }
  } catch (err) {
    onError?.(err);
    PROCESS_EXIT();
  }
}

export function createCheckoutToTargetBranchErrorMessage({ branchName = '' }: { branchName?: string }) {
  return console.error(`\n🚫 Failed to switch to ${branchName}.`);
}
