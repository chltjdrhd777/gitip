import { DefaultConfig } from '@/types';
import { executeCommand } from '@/utils/common-utils';

interface ExtractIssueBranchesConfig extends DefaultConfig {
  target?: 'local' | 'remote';
}

export default function extractIssueBranches(
  ISSUE_BRANCH_TO_CLEAN_PATTERN: string,
  extractIssueBranchesConfig?: ExtractIssueBranchesConfig,
) {
  const { onSuccess, target } = extractIssueBranchesConfig ?? {};
  const flag = target === 'remote' ? '-r' : '';

  const allRemoteIssueBranches = executeCommand(
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

  return (allRemoteIssueBranches ?? '').split('\n').filter((e) => !!e);
}

function createExtractRemoteIssueBranchesErrorMessage(target: ExtractIssueBranchesConfig['target']) {
  return `\n✅ No remote issue branches from ${target}(-r branches with -#issueNumber suffix). continue\n`;
}
