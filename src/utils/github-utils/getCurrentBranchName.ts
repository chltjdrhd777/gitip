import { DefaultConfig } from '@/types';
import { executeCommand } from '@/utils/common-utils/executeCommand';

interface GetCurrentBranchNameConfig extends DefaultConfig {}

export function getCurrentBranchName(getCurrentBranchNameConfig?: GetCurrentBranchNameConfig) {
  return executeCommand('git rev-parse --abbrev-ref HEAD', getCurrentBranchNameConfig)?.toString()?.trim() ?? '';
}

export function getCurrentBranchNameErrorMessage() {
  return `🚫 Current branch name is not found. please run this command from the root folder of your project`;
}
