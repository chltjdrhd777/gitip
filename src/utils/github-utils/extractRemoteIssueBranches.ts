import { DefaultConfig } from '@/types';
import { PROCESS_EXIT, executeCommand } from '../common-utils';

interface ExtractRemoteIssueBranchesConfig extends DefaultConfig {}

export default function extractRemoteIssueBranches(
  ISSUE_BRANCH_TO_CLEAN_PATTERN: string,
  extractRemoteIssueBranchesConfig?: ExtractRemoteIssueBranchesConfig,
) {
  const { onSuccess } = extractRemoteIssueBranchesConfig ?? {};

  const allRemoteIssueBranches = executeCommand(`git branch -r | grep -E '${ISSUE_BRANCH_TO_CLEAN_PATTERN}'`, {
    exitWhenError: false,
    onError: (err) => {
      console.error(err);
      console.error(createExtractRemoteIssueBranchesErrorMessage());
      PROCESS_EXIT();
    },
  })?.toString();

  if (!allRemoteIssueBranches) {
    console.log(createNoIssueBranchesToCleanUpMessage());

    onSuccess?.();
    PROCESS_EXIT();
  }

  return allRemoteIssueBranches;
}

export function createNoIssueBranchesToCleanUpMessage() {
  return `🧽 no issue branches to clean up.`;
}

export function createExtractRemoteIssueBranchesErrorMessage() {
  return `\n🚫 Failed to extract remote issue branches(branches with -#issueNumber suffix).\n please check your branches on fork repository first\n`;
}
