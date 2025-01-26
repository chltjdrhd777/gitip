import { DefaultConfig } from '@/types';
import { executeCommand } from '@/utils/common-utils';

interface ExtractIssueBranchesConfig extends DefaultConfig {
  target?: 'local' | 'remote';
  replacer?: (branchName: string) => string; // Optional replacer function
}

export default function extractIssueBranches(
  ISSUE_BRANCH_TO_CLEAN_PATTERN: string,
  extractIssueBranchesConfig?: ExtractIssueBranchesConfig,
) {
  const { onSuccess, target, replacer } = extractIssueBranchesConfig ?? {};
  const flag = target === 'remote' ? '-r' : '';

  const allIssueBranches = executeCommand(
    `git branch ${flag} | grep -E '${ISSUE_BRANCH_TO_CLEAN_PATTERN}' | sed 's/^\* //'`,
    {
      exitWhenError: false,
      onError: () => {
        console.error(createExtractRemoteIssueBranchesErrorMessage(target));
      },
    },
  )
    ?.toString()
    .trim();

  onSuccess?.();

  return (allIssueBranches ?? '')
    .split('\n')
    .filter((e) => !!e) // Remove empty entries
    .map((branch) => replacer?.(branch.trim()) ?? branch.trim()); // Apply trim and replacer
}

function createExtractRemoteIssueBranchesErrorMessage(target: ExtractIssueBranchesConfig['target']) {
  return `\n✅ No remote issue branches from ${target}(-r branches with -#issueNumber suffix). continue\n`;
}
