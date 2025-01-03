import { Callbacks } from '@/types';
import { executeCommand } from '@/utils/common-utils';

interface CheckCurrentBranchConfig extends Callbacks {}

export function checkCurrentBranch(checkCurrentBranchConfig?: CheckCurrentBranchConfig) {
  return executeCommand('git branch --show-current', checkCurrentBranchConfig)?.toString();
}
