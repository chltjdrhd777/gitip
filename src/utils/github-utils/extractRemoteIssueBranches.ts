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
    onError: () => {
      console.error(createExtractRemoteIssueBranchesErrorMessage());
    },
  })
    ?.toString()
    .trim();

  if (!allRemoteIssueBranches) {
    onSuccess?.();
    return '';
    // console.log(createNoIssueBranchesToCleanUpMessage());
    // PROCESS_EXIT();
  }

  return allRemoteIssueBranches;
}

export function createNoIssueBranchesToCleanUpMessage() {
  return `🧽 no issue branches to clean up.`;
}

export function createExtractRemoteIssueBranchesErrorMessage() {
  return `\n🕹 No remote issue branches from remote cache(-r branches with -#issueNumber suffix). go on to the next step\n`;
}
