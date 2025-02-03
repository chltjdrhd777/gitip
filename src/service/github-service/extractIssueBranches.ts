import { ISSUE_BRANCH_TO_CLEAN_PATTERN } from '@/constants/regularExpression';
import { DefaultConfig } from '@/types';
import { executeCommand } from '@/utils/common-utils';

type Target = { type: 'local' } | { type: 'remote'; remoteAlias: string };

interface ExtractIssueBranchesConfig extends DefaultConfig {
  replacer?: (branchName: string) => string; // Optional replacer function
}

export default function extractIssueBranches(target: Target, extractIssueBranchesConfig?: ExtractIssueBranchesConfig) {
  const { onSuccess, replacer } = extractIssueBranchesConfig ?? {};
  const command = getGitBranchCommand(target);

  const allIssueBranches = executeCommand(command, {
    exitWhenError: false,
    onError: () => {
      console.error(createExtractRemoteIssueBranchesErrorMessage(target));
    },
  })
    ?.toString()
    .trim();

  const result = (allIssueBranches ?? '')
    .split('\n')
    .filter((e) => !!e) // Remove empty entries
    .map((branch) => replacer?.(branch.trim()) ?? branch.trim()); // Apply trim and replacer

  onSuccess?.(result);

  return result;
}

function getGitBranchCommand(target: Target) {
  if (target.type === 'local') {
    return `git branch | grep -E '${ISSUE_BRANCH_TO_CLEAN_PATTERN}' | sed 's/^\* //'`;
  }

  return `git ls-remote --heads ${target.remoteAlias} | grep -E '${ISSUE_BRANCH_TO_CLEAN_PATTERN}' | awk '{print $2}' | sed 's#refs/heads/##'`;
}

function createExtractRemoteIssueBranchesErrorMessage(target: Target) {
  return `\n✅ No remote issue branches from ${target.type}(-r branches with -#issueNumber suffix). continue\n`;
}
