import { executeCommand } from '@/utils/common-utils/executeCommand';

export function getCurrentBranchMetadata() {
  const branchName = executeCommand('git rev-parse --abbrev-ref HEAD')?.toString()?.trim();

  if (branchName) {
    const issueNumber = branchName.match(/issue-(.*)/)?.[1];

    if (!issueNumber) {
      console.log('🚫 failed to get issue number. please switch to issue branch');
      return null;
    }

    return {
      branchName,
      issueNumber,
    };
  }

  return null;
}
